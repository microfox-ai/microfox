// scripts/src/embeddings/embedDocs.ts

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { embed } from './geminiEmbed';

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

interface ReadmeInfo {
  path: string;
  type: string;
  extension: string;
  functionality: string;
  description: string;
}

function getGithubUrl(relativePath: string): string {
  return `${GITHUB_BASE_URL}${relativePath.replace(/\\/g, '/')}`;
}

function walkDocs() {
  const results: Array<{
    packageName: string;
    functionName: string | null;
    docType: string;
    filePath: string;
    githubUrl: string;
    fullPath: string;
    mtime: Date;
    content: string;
  }> = [];

  if (!fs.existsSync(PACKAGES_DIR)) {
    console.warn(`⚠️  packages/ directory not found at ${PACKAGES_DIR}`);
    return results;
  }

  for (const pkg of fs.readdirSync(PACKAGES_DIR)) {
    const pkgDir = path.join(PACKAGES_DIR, pkg);
    const docsDir = path.join(pkgDir, 'docs');
    const packageInfoPath = path.join(pkgDir, 'package-info.json');

    // Main README
    const mainReadmePath = path.join(pkgDir, 'README.md');
    if (fs.existsSync(mainReadmePath)) {
      const mtime = getGitLastModified(mainReadmePath);
      const relativePath = path.relative(PACKAGES_DIR, mainReadmePath);
      results.push({
        packageName: pkg,
        functionName: null,
        docType: 'main',
        filePath: relativePath,
        githubUrl: getGithubUrl(relativePath),
        fullPath: mainReadmePath,
        mtime,
        content: fs.readFileSync(mainReadmePath, 'utf-8'),
      });
    }

    // package-info and sub-docs
    if (fs.existsSync(packageInfoPath)) {
      const packageInfo: PackageInfo = JSON.parse(
        fs.readFileSync(packageInfoPath, 'utf-8'),
      );

      if (fs.existsSync(docsDir) && readmeMap) {
        for (const file of fs
          .readdirSync(docsDir)
          .filter(f => f.endsWith('.md') && !f.endsWith('/README.md'))) {
          const fullPath = path.join(docsDir, file);
          const functionName = file.replace(/\.md$/, '');
          const readmeInfo = readmeMap.get(functionName);
          if (!readmeInfo) continue;

          const mtime = getGitLastModified(fullPath);
          const relativePath = path.relative(PACKAGES_DIR, fullPath);
          const githubUrl = readmeInfo.path || getGithubUrl(relativePath);

          results.push({
            packageName: pkg,
            functionName,
            docType: readmeInfo.type,
            filePath: relativePath,
            githubUrl,
            fullPath,
            mtime,
            content: fs.readFileSync(fullPath, 'utf-8'),
          });
        }
      }
    }
  }

  return results;
}

async function main() {
  console.log('⏳ Fetching existing docs from DB…');
  const existing = await getExistingDocs();
  const existingMap = new Map(existing.map(r => [r.file_path, r]));

  console.log('⏳ Scanning filesystem…');
  const localDocs = walkDocs();
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
      upserts.push({
        package_name: doc.packageName,
        function_name: doc.functionName,
        doc_type: doc.docType,
        file_path: doc.githubUrl,
        content: doc.content,
        embedding,
        updated_at: new Date().toISOString(),
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
