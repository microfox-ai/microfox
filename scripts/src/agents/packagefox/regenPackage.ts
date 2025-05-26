import path from 'path';
import fs from 'fs/promises';
import { getProjectRoot } from '../../utils/getProjectRoot';
import { analyzeLinks, extractContentFromUrls } from '../../utils/webScraper';
import { generateCodeFiles, summarizeGenPackageContent } from './genPackage';
import { generateDocs } from '../docfox/genDocs';
import { cleanupFoxRequests } from '../metafox/cleanupFoxRequests';
import { fixBuildIssues } from './fixBuildIssues';
import { generateObject } from 'ai';
import { models } from '../../ai/models';
import { z } from 'zod';

const getPackageBuilderConfig = async (packageDir: string) => {
  // Read package-builder.json
  const packageBuilderPath = path.join(packageDir, 'package-builder.json');

  try {
    const packageBuilderContent = await fs.readFile(
      packageBuilderPath,
      'utf-8',
    );
    const packageBuilderConfig = JSON.parse(packageBuilderContent);

    return packageBuilderConfig;
  } catch (error) {
    console.error(
      `Error reading package-builder.json from ${packageBuilderPath}:`,
      error,
    );
    throw error;
  }
};

export async function regenPackage(
  packageName: string,
  filteredLinksFull: boolean = true,
) {
  const packageDir = path.join(
    getProjectRoot(),
    'packages',
    packageName.replace('@microfox/', ''),
  );

  const packageBuilderConfig = await getPackageBuilderConfig(packageDir);

  const { sdkMetadata, filteredLinks, allLinks } = packageBuilderConfig;

  let usefulLinks = [];
  if (!filteredLinksFull) {
    usefulLinks = await analyzeLinks(allLinks, sdkMetadata.inputArgs.query, {
      isBaseUrl: sdkMetadata.inputArgs.isBaseUrl,
      url: sdkMetadata.inputArgs.url,
      packageDir: packageDir,
    });
    console.log(`🔍 Found ${usefulLinks.length} useful links`);
  } else {
    const { object } = await generateObject({
      model: models.googleGeminiPro,
      schema: z.object({
        links: z.array(z.string()),
      }),
      system: `
        You are a helpful assistant that analyzes links and determines which links are correct & not duplicates
        `,
      prompt: `
       Instructions:
        - Remove all the i18n / different language versions of the links

        Given the following links:
        ${filteredLinks.map((link: string, i: number) => `${i + 1}. ${link}`).join('\n')}

        Return all the links that are correct & not duplicates.
        `,
    });
    usefulLinks = object.links;
    console.log(`🔍 Found ${usefulLinks.length} useful links`);
  }

  const scrapedContents = await extractContentFromUrls(usefulLinks, {
    packageDir,
    baseUrl: sdkMetadata.inputArgs.url,
  });
  // Combine all scraped content into a single document
  const combinedContent = scrapedContents
    .map(content => `## Content from: ${content.url}\n\n${content.content}`)
    .join('\n\n---\n\n');

  // Generate a single summary from all the combined content
  const docsSummary = await summarizeGenPackageContent(
    combinedContent,
    sdkMetadata.inputArgs.query,
    {
      packageDir,
    },
  );
  // Generate code files using AI
  const {
    finalSetupInfo,
    generatedFileContentsMap,
    usage,
    requiredFiles,
    combinedCode,
  } = await generateCodeFiles(sdkMetadata, docsSummary, packageDir);

  // --- End Process Tool Results ---

  // Generate documentation using the combined code and setup info
  await generateDocs(
    combinedCode,
    {
      apiName: sdkMetadata.apiName,
      packageName: sdkMetadata.packageName,
      title: sdkMetadata.title,
      description: sdkMetadata.description,
      authType: finalSetupInfo.authType,
      authSdk: finalSetupInfo.authSdk,
    },
    packageDir,
    [finalSetupInfo.setupInfo],
  );

  // Clean up build request log
  await cleanupFoxRequests('pkg-recreate', {
    url: sdkMetadata.inputArgs.url,
  });

  return {
    packageName,
    packageDir,
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const packageName = args[0] || '';
  let full = args[1] || '';

  if (!packageName) {
    console.error('❌ Error: Package name argument is required');
    console.log('Usage: node regenPackage.js "packageName" [full]');
    process.exit(1);
  }

  if (!full) {
    full = 'full';
  }

  regenPackage(packageName, full == 'full')
    .then(result => {
      if (result) {
        console.log(`✅ SDK generation complete for ${result.packageName}`);
        console.log(`📂 Package location: ${result.packageDir}`);
        return fixBuildIssues(result.packageName);
      } else {
        console.log('⚠️ SDK generation completed with warnings or failed.');
        process.exit(1);
      }
    })
    .then(() => {
      console.log(`✅ Build fixing process initiated.`);
      console.log(`✅ All steps completed.`);
    })
    .catch(error => {
      console.error('❌ Fatal error during SDK generation or build fixing.');
      process.exit(1);
    });
}
