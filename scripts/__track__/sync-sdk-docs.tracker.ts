import { defineTracker } from '@microfox/tracker';
import fs from 'fs-extra';
import path from 'path';

// --- Type Definitions ---
interface PackageConfig {
    name: string;
    categories: string[];
    'auto-update': boolean;
}

type DocsConfig = PackageConfig[];

interface NavGroup {
    group: string;
    pages: (string | NavGroup)[];
}

interface DocsJson {
    navigation: {
        tabs: {
            tab: string;
            groups: NavGroup[];
        }[];
    };
    [key: string]: any;
}

export async function getProjectRoot(startPath: string = process.cwd()): Promise<string | null> {
    let currentPath = startPath;
    let count = 0
    while (true) {
      const microfoxRootPath = path.join(currentPath, 'microfox-root');
      if (fs.existsSync(microfoxRootPath)) {
        return currentPath;
      }
  
      const parentPath = path.dirname(currentPath);
      if (parentPath === currentPath || count > 10) {
        // Reached the root of the file system
        return null;
      }
      currentPath = parentPath;
    }
  } 

export default defineTracker({
    // This tracker should run when the central documentation config file is changed.
    targets: ['**/docs-config.json'],
    github: {
        name: 'Sync Micro SDKs Documentation',
        on: {
            push: {
                branches: ['main'],
            },
        },
        commit: {
            enabled: true,
            message: 'docs: Sync Micro SDKs documentation',
            patEnvName: 'ORG_PAT',
        },
    },
},
async (ctx) => {
    ctx.log.info('Starting Micro SDKs documentation sync...');
    ctx.log.info('root dir: ' + await getProjectRoot());
    const projectRoot = await getProjectRoot();
    ctx.log.info('projectRoot: ' + projectRoot);
    if (!projectRoot) {
        ctx.log.error('Project root not found');
        return;
    }
    const configPath = path.join(projectRoot, "scripts", "__track__", "docs-config.json");
    const docsJsonPath = path.join(projectRoot, "docs", "docs.json");

    // --- 1. Read Configurations ---
    const config: DocsConfig = await fs.readJson(configPath);
    const docsJson: DocsJson = await fs.readJson(docsJsonPath);

    // --- 2. Process packages and build the new navigation structure ---
    const categoryMap = new Map<string, NavGroup[]>();

    for (const pkg of config) {
        const pkgDocsPath = `micro-sdks/${pkg.name}`;
        let packageNavGroup: NavGroup | undefined;

        if (pkg['auto-update']) {
            ctx.log.info(`Processing auto package: ${pkg.name}`);
            
            const packageSourcePath = path.join(projectRoot, 'packages', pkg.name);
            const packageDocsDestPath = path.join(projectRoot, 'docs', pkgDocsPath);
            const packageInfoPath = path.join(packageSourcePath, 'package-info.json');
            const mainDocPath = path.join(packageSourcePath, 'docs', 'main.md');
            let packageInfo = { title: pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1), description: '' };

            if (await fs.pathExists(packageInfoPath)) {
                packageInfo = await fs.readJson(packageInfoPath);
            }

            if (await fs.pathExists(mainDocPath)) {
                const mainDocContent = await fs.readFile(mainDocPath, 'utf-8');
                const indexContent = `---
title: '${packageInfo.title}'
description: '${packageInfo.description}'
---

${mainDocContent}`;
                await fs.outputFile(path.join(packageDocsDestPath, 'index.mdx'), indexContent);
            }

            // b) Sync API reference (constructors and functions)
            const apiRefBasePath = path.join(packageDocsDestPath);
            const constructorsSourcePath = path.join(packageSourcePath, 'docs', 'constructors');
            const functionsSourcePath = path.join(packageSourcePath, 'docs', 'functions');
            const constructorPages: string[] = [];
            const functionPages: string[] = [];

            const syncApiFiles = async (sourceDir: string, destSubDir: 'constructors' | 'functions', pageList: string[]) => {
                if (!(await fs.pathExists(sourceDir))) return;
                
                const destDir = path.join(apiRefBasePath, destSubDir);
                await fs.emptyDir(destDir); // FIX: Clean the specific subdirectory, not the parent.

                const files = await fs.readdir(sourceDir);
                for (const file of files.filter(f => f.endsWith('.md'))) {
                    const sourceFilePath = path.join(sourceDir, file);
                    const destFileName = file.replace(/\.md$/, '.mdx');
                    const destFilePath = path.join(destDir, destFileName);
                    const content = await fs.readFile(sourceFilePath, 'utf-8');
                    const title = path.basename(file, '.md');
                    const mdxContent = `---
title: '${title}'
description: 'API reference for ${title}'
---

${content}`;
                    await fs.outputFile(destFilePath, mdxContent);
                    pageList.push(`${pkgDocsPath}/${destSubDir}/${destFileName.replace(/\.mdx$/, '')}`);
                }
            };

            await syncApiFiles(constructorsSourcePath, 'constructors', constructorPages);
            await syncApiFiles(functionsSourcePath, 'functions', functionPages);

            // c) Build the navigation structure for this package
            packageNavGroup = {
                group: packageInfo.title || pkg.name,
                pages: [`${pkgDocsPath}/index`, `${pkgDocsPath}/getting-started`, `${pkgDocsPath}/foundation`]
            };
            
            const apiReferencePages: NavGroup[] = [];
            if (constructorPages.length > 0) {
                apiReferencePages.push({
                    group: 'Constructors',
                    pages: constructorPages.sort()
                });
            }
            if (functionPages.length > 0) {
                apiReferencePages.push({
                    group: 'Functions',
                    pages: functionPages.sort()
                });
            }

            if (apiReferencePages.length > 0) {
                packageNavGroup.pages.push({
                    group: 'API Reference',
                    pages: apiReferencePages
                });
            }
        } else {
            ctx.log.info(`Finding manual package: ${pkg.name}`);
            const sdkTab = docsJson.navigation.tabs.find(t => t.tab === 'Micro SDKs');
            let foundPackageGroup: NavGroup | undefined;

            // Recursively search for a nav group that contains the package's index page
            const hasIndexPage = (pages: (string | NavGroup)[]): boolean => {
                return pages.some(p => {
                    if (typeof p === 'string') return p === `micro-sdks/${pkg.name}/index`;
                    if (typeof p === 'object' && p.pages) return hasIndexPage(p.pages);
                    return false;
                });
            };

            if (sdkTab) {
                for (const categoryGroup of sdkTab.groups) {
                    const found = (categoryGroup.pages || []).find(p =>
                        typeof p === 'object' && hasIndexPage(p.pages)
                    );
                    if (found) {
                        foundPackageGroup = found as NavGroup;
                        break;
                    }
                }
            }
            packageNavGroup = foundPackageGroup;
        }

        if (!packageNavGroup) {
            ctx.log.warn(`Could not find or create a navigation group for package: ${pkg.name}. Skipping.`);
            continue;
        }
        
        for (const categoryName of pkg.categories) {
            if (!categoryMap.has(categoryName)) {
                categoryMap.set(categoryName, []);
            }
            categoryMap.get(categoryName)!.push(packageNavGroup);
        }
    }
    
    // --- 3. Build the final navigation structure ---
    const newSdkGroups: NavGroup[] = [];
    const overviewGroup = docsJson.navigation.tabs.find(t => t.tab === 'Micro SDKs')?.groups.find(g => g.group === 'Overview');
    if (overviewGroup) newSdkGroups.push(overviewGroup);

    const sortedCategories = Array.from(categoryMap.keys()).sort();
    for(const categoryName of sortedCategories) {
        newSdkGroups.push({
            group: categoryName,
            pages: categoryMap.get(categoryName)!
        });
    }

    // --- 4. Update docs.json ---
    const sdkTabIndex = docsJson.navigation.tabs.findIndex(tab => tab.tab === 'Micro SDKs');
    if (sdkTabIndex !== -1) {
        docsJson.navigation.tabs[sdkTabIndex].groups = newSdkGroups;
        await fs.writeJson(docsJsonPath, docsJson, { spaces: 2 });
        ctx.log.info('Successfully updated docs.json with the new structure.');
    } else {
        ctx.log.error('Could not find the "Micro SDKs" tab in docs.json.');
    }

    ctx.log.info('Micro SDKs documentation sync finished.');
});
