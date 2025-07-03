import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { PackageInfo } from '../types';
import { embed } from '../embeddings/geminiEmbed';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PACKAGES_DIR = path.resolve(process.cwd(), '..', 'packages');
const PACKAGE_INFO_TABLE = 'package_infos';
const GITHUB_BASE_URL =
  'https://github.com/microfox-ai/microfox/blob/main/packages/';

function getGitLastModified(fullPath: string): Date {
  try {
    const out = execSync(
      `git log -1 --format=%ct -- "${path.relative(process.cwd(), fullPath)}"`,
      { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'ignore'] },
    )
      .toString()
      .trim();
    const sec = Number(out);
    if (!isNaN(sec)) {
      return new Date(sec * 1000);
    }
  } catch {
    console.warn(
      `Error getting git timestamp for ${fullPath}, falling back to FS mtime`,
    );
  }
  return fs.statSync(fullPath).mtime;
}

async function getExistingPackages() {
  const { data, error } = await supabase
    .from(PACKAGE_INFO_TABLE)
    .select('id,package_name,file_path,updated_at');
  if (error) throw error;
  return data as Array<{
    id: string;
    package_name: string;
    file_path: string;
    updated_at: string;
  }>;
}

function getGithubUrl(relativePath: string): string {
  return `${GITHUB_BASE_URL}${relativePath.replace(/\\/g, '/')}`;
}

function walkPackageInfoFiles() {
  const results: Array<{
    packageName: string;
    filePath: string;
    githubUrl: string;
    fullPath: string;
    mtime: Date;
    content: PackageInfo;
    rawContent: any;
    rawManifest: any;
  }> = [];

  if (!fs.existsSync(PACKAGES_DIR)) {
    console.warn(`⚠️  packages/ directory not found at ${PACKAGES_DIR}`);
    return results;
  }

  for (const pkg of fs.readdirSync(PACKAGES_DIR)) {
    const pkgDir = path.join(PACKAGES_DIR, pkg);
    const packageInfoPath = path.join(pkgDir, 'package-info.json');
    const packagePath = path.join(pkgDir, 'package.json');

    if (fs.existsSync(packageInfoPath) && fs.statSync(pkgDir).isDirectory()) {
      try {
        const rawContent = JSON.parse(
          fs.readFileSync(packageInfoPath, 'utf-8'),
        );
        const rawManifest = fs.existsSync(packagePath) ? JSON.parse(fs.readFileSync(packagePath, 'utf-8')) : null

        const mtime = getGitLastModified(packageInfoPath);
        const relativePath = path.relative(PACKAGES_DIR, packageInfoPath);
        const githubUrl = getGithubUrl(relativePath);

        results.push({
          packageName: rawContent.name,
          filePath: relativePath,
          githubUrl,
          fullPath: packageInfoPath,
          mtime,
          content: rawContent,
          rawContent,
          rawManifest,
        });
      } catch (error) {
        console.error(`❌ Error processing ${packageInfoPath}:`, error);
        // Continue processing other files
      }
    }
  }

  return results;
}

async function processPackage(pkg: {
  content: PackageInfo;
  fullPath: string;
}) {
  const packageInfo = pkg.content;

  // Process scopes.json
  const pkgDir = path.dirname(pkg.fullPath);
  const scopesPath = path.join(pkgDir, 'scopes.json');
  if (fs.existsSync(scopesPath)) {
    try {
      const scopes = JSON.parse(fs.readFileSync(scopesPath, 'utf-8'));
      packageInfo.oauth2Scopes = Array.isArray(scopes)
        ? scopes.map(s => (typeof s === 'object' ? s.name : s)).filter(Boolean)
        : [];

      if (packageInfo.constructors) {
        for (const constructor of packageInfo.constructors) {
          if (constructor.internalKeys) {
            for (const key of constructor.internalKeys) {
              if (key.key.toUpperCase().includes('SCOPES')) {
                key.defaultValue = packageInfo.oauth2Scopes;
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(`Error processing scopes.json for ${packageInfo.name}`, e);
    }
  }

  // Create and save embedding
  try {
    let textToEmbed = `Title: ${packageInfo.title}\nDescription: ${packageInfo.description}\n\n`;
    
    if (packageInfo.constructors) {
      const allFunctionalities = packageInfo.constructors.flatMap(c => c.functionalities || []);
      if (allFunctionalities.length > 0) {
        textToEmbed += `Functionalities: ${allFunctionalities.join(', ')}\n\n`;
      }
    }
    
    (packageInfo as any).embedding = await embed(textToEmbed);
    console.log(`✨ Generated embedding for ${packageInfo.name}`);
  } catch(e) {
    console.error(`Error generating embedding for ${packageInfo.name}`, e);
  }
}

async function main() {
  console.log('⏳ Fetching existing package info from DB…');
  const existing = await getExistingPackages();
  const existingMap = new Map(existing.map(r => [r.file_path, r]));

  console.log('⏳ Scanning filesystem for package-info.json files…');
  const localPackages = walkPackageInfoFiles();
  const localPaths = new Set(localPackages.map(d => d.githubUrl));

  // 1) Delete removed packages
  const toDelete = existing.filter(r => !localPaths.has(r.file_path));
  if (toDelete.length) {
    console.log(`🗑 Deleting ${toDelete.length} removed packages…`);
    for (const { id } of toDelete) {
      await supabase.from(PACKAGE_INFO_TABLE).delete().eq('id', id);
    }
  }

  // 2) Upsert new & updated packages
  const upserts: any[] = [];
  for (const pkg of localPackages) {
    const dbRow = existingMap.get(pkg.githubUrl);
    const isNew = !dbRow;
    const isStale = dbRow && new Date(dbRow.updated_at) < pkg.mtime;

    if (isNew || isStale) {
      console.log(`${isNew ? '✨ New' : '♻️ Updated'} → ${pkg.content.name}`);

      await processPackage(pkg);

      upserts.push({
        package_name: pkg.content.name,
        package_title: pkg.content.title,
        package_path: pkg.content.path,
        platform_type: pkg.content.platformType || 'communication',
        auth_type: pkg.content.authType || null,
        auth_endpoint: pkg.content.authEndpoint || null,
        webhook_endpoint: pkg.content.webhookEndpoint || null,
        oauth2_scopes: pkg.content.oauth2Scopes || null,
        description: pkg.content.description,
        dependencies: pkg.content.dependencies || null,
        added_dependencies: pkg.content.addedDependencies || null,
        status: pkg.content.status,
        documentation: pkg.content.documentation,
        icon: pkg.content.icon,
        constructors: pkg.content.constructors,
        key_instructions: pkg.content.keyInstructions || null,
        extra_info: pkg.content.extraInfo,
        raw_content: pkg.rawContent,
        raw_manifest: pkg.rawManifest,
        file_path: pkg.githubUrl,
        github_url: pkg.githubUrl,
        updated_at: new Date().toISOString(),
        embedding: (pkg.content as any).embedding || null,
      });
    }
  }

  if (upserts.length) {
    const { error } = await supabase
      .from(PACKAGE_INFO_TABLE)
      .upsert(upserts, { onConflict: 'package_name' });
    if (error) throw error;
    console.log(`✅ Upserted ${upserts.length} packages.`);
  } else {
    console.log('✅ No new or changed packages to upsert.');
  }

  console.log('🎉 Done!');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
