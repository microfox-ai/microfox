// scripts/src/embeddings/embedDocs.ts

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { embed } from './geminiEmbed';
import { PackageInfo } from '../types';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PACKAGES_DIR = path.resolve(process.cwd(), '..', 'packages');
const DOCS_TABLE = 'docs_embeddings';
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

async function getExistingDocs() {
  const { data, error } = await supabase
    .from(DOCS_TABLE)
    .select('id,file_path,updated_at');
  if (error) throw error;
  return data as Array<{ id: string; file_path: string; updated_at: string }>;
}

function getGithubUrl(relativePath: string): string {
  return `${GITHUB_BASE_URL}${relativePath.replace(/\\/g, '/')}`;
}

async function walkDocs() {
  const results: Array<{
    packageName: string;
    functionName: string | null;
    docType: string;
    filePath: string;
    githubUrl: string;
    fullPath: string;
    mtime: Date;
    content: string;
    linkedPackages: string[];
  }> = [];

  if (!fs.existsSync(PACKAGES_DIR)) {
    console.warn(`⚠️  packages/ directory not found at ${PACKAGES_DIR}`);
    return results;
  }

  for (const pkg of fs.readdirSync(PACKAGES_DIR)) {
    const pkgDir = path.join(PACKAGES_DIR, pkg);
    const docsDir = path.join(pkgDir, 'docs');

    // Query DB for packages that have this package as a dependency.
    const dependencyIdentifier = `@microfox/${pkg}`;
    const { data: linkedPackagesData, error } = await supabase
      .from('package_infos')
      .select('package_name')
      .contains('added_dependencies', [dependencyIdentifier]);

    if (error) {
      console.error(`Error fetching linked packages for ${pkg}:`, error);
    }
    const linkedPackages = linkedPackagesData
      ? linkedPackagesData.map(p => p.package_name)
      : [];

    // Constructors
    const constructorsDir = path.join(docsDir, 'constructors');
    if (fs.existsSync(constructorsDir)) {
      const constructorFiles = fs.readdirSync(constructorsDir);
      for (const file of constructorFiles) {
        if (file.endsWith('.md')) {
          const name = path.basename(file, '.md');
          const fullPath = path.join(constructorsDir, file);
          const mtime = getGitLastModified(fullPath);
          const relativePath = path.relative(PACKAGES_DIR, fullPath);
          results.push({
            packageName: pkg,
            functionName: name,
            docType: 'constructor',
            filePath: relativePath,
            githubUrl: getGithubUrl(relativePath),
            fullPath,
            mtime,
            content: fs.readFileSync(fullPath, 'utf-8'),
            linkedPackages: [...linkedPackages, dependencyIdentifier],
          });
        }
      }
    }

    // Functions
    const functionsDir = path.join(docsDir, 'functions');
    if (fs.existsSync(functionsDir)) {
      const functionFiles = fs.readdirSync(functionsDir);
      for (const file of functionFiles) {
        if (file.endsWith('.md')) {
          const name = path.basename(file, '.md');
          const fullPath = path.join(functionsDir, file);
          const mtime = getGitLastModified(fullPath);
          const relativePath = path.relative(PACKAGES_DIR, fullPath);
          results.push({
            packageName: pkg,
            functionName: name,
            docType: 'function',
            filePath: relativePath,
            githubUrl: getGithubUrl(relativePath),
            fullPath,
            mtime,
            content: fs.readFileSync(fullPath, 'utf-8'),
            linkedPackages: [...linkedPackages, dependencyIdentifier],
          });
        }
      }

      // Rules
      const rulesDir = path.join(docsDir, 'rules');
      if (fs.existsSync(rulesDir)) {
        const ruleFiles = fs.readdirSync(rulesDir);
        for (const file of ruleFiles) {
          if (file.endsWith('.md')) {
            const name = path.basename(file, '.md');
            const fullPath = path.join(rulesDir, file);
            const mtime = getGitLastModified(fullPath);
            const relativePath = path.relative(PACKAGES_DIR, fullPath);
            results.push({
              packageName: pkg,
              functionName: name,
              docType: 'rule',
              filePath: relativePath,
              githubUrl: getGithubUrl(relativePath),
              fullPath,
              mtime,
              content: fs.readFileSync(fullPath, 'utf-8'),
              linkedPackages: [...linkedPackages, dependencyIdentifier],
            });
          }
        }
      }

      // Main
      const mainFile = path.join(docsDir, 'main.md');
      if (fs.existsSync(mainFile)) {
        const mtime = getGitLastModified(mainFile);
        const relativePath = path.relative(PACKAGES_DIR, mainFile);
        results.push({
          packageName: pkg,
          functionName: 'main',
          docType: 'main',
          filePath: relativePath,
          githubUrl: getGithubUrl(relativePath),
          fullPath: mainFile,
          mtime,
          content: fs.readFileSync(mainFile, 'utf-8'),
          linkedPackages: [...linkedPackages, dependencyIdentifier],
        });
      }
    }
  }

  return results;
}

async function main() {
  console.log('⏳ Fetching existing docs from DB…');
  const existing = await getExistingDocs();
  const existingMap = new Map(existing.map(r => [r.file_path, r]));

  console.log('⏳ Scanning filesystem and querying for linked packages…');
  const localDocs = await walkDocs();
  const localPaths = new Set(localDocs.map(d => d.githubUrl));

  // 1) Delete removed
  const toDelete = existing.filter(r => !localPaths.has(r.file_path));
  if (toDelete.length) {
    console.log(`🗑 Deleting ${toDelete.length} removed docs…`);
    for (const { id } of toDelete) {
      await supabase.from(DOCS_TABLE).delete().eq('id', id);
    }
  }

  // 2) Upsert new & updated
  const upserts: any[] = [];
  for (const doc of localDocs) {
    const dbRow = existingMap.get(doc.githubUrl);
    const isNew = !dbRow;
    const isStale = dbRow && new Date(dbRow.updated_at) < doc.mtime;
    if (isNew || isStale) {
      console.log(`${isNew ? '✨ New' : '♻️ Updated'} → ${doc.githubUrl}`);
      const embedding = await embed(doc.content);
      const docPriority = doc.content.split('\n')[0].match(/<priority: ([^,>]+)/)?.[1] || 'medium';
      upserts.push({
        package_name: doc.packageName,
        function_name: doc.functionName,
        doc_type: doc.docType,
        file_path: doc.githubUrl,
        content: doc.content,
        doc_priority: docPriority,
        embedding,
        updated_at: new Date().toISOString(),
        linked_packages: doc.linkedPackages,
      });
    }
  }

  if (upserts.length) {
    const { error } = await supabase
      .from(DOCS_TABLE)
      .upsert(upserts, { onConflict: 'file_path' });
    if (error) throw error;
    console.log(`✅ Upserted ${upserts.length} docs.`);
  } else {
    console.log('✅ No new or changed docs to upsert.');
  }

  console.log('🎉 Done!');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
