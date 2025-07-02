// scripts/src/queryDocs.ts

import { createClient } from '@supabase/supabase-js';
import { embed } from './geminiEmbed';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const TABLE = 'docs_embeddings';

async function listByPackage(pkg: string, docType?: string, limit = 10) {
  const query = supabase
    .from(TABLE)
    .select('file_path,package_name,function_name,doc_type,updated_at')
    .eq('package_name', pkg)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (docType) {
    query.eq('doc_type', docType);
  }

  const { data, error } = await query;
  if (error) throw error;

  console.log(`\n📦  Files in package "${pkg}"${docType ? ` with doc_type "${docType}"` : ''}:`);
  console.table(
    data!.map((r: any) => ({
      package_name: r.package_name,
      function_name: r.function_name,
      doc_type: r.doc_type,
      file_path: r.file_path.split('/').slice(-3).join('/'),
    }))
  );
}

async function semanticSearch(pkg: string, query: string, docType?: string, limit = 10) {
  console.log(`\n🔍 Embedding query: "${query}"…`);
  const qEmb = await embed(query);
  console.log('🧠 Query embedding obtained');

  const fnName = pkg === '*' ? 'match_docs' : 'match_docs_in_package';
  const rpcArgs: any = {
    query_embedding: qEmb,
    k: limit,
    doc_type_filter: docType || null,
  };
  if (pkg !== '*') {
    rpcArgs.pkg_name = pkg;
  }

  console.log(
    pkg === '*'
      ? `🌍 Global search${docType ? ` with doc_type "${docType}"` : ''}…`
      : `📦 Package search in "${pkg}"${docType ? ` with doc_type "${docType}"` : ''}…`
  );

  const { data, error } = await supabase.rpc(fnName, rpcArgs);
  if (error) throw error;

  console.log(
    `\n🎯 Top ${limit} ${pkg === '*' ? 'global' : 'package'} results for "${query}"${docType ? ` with doc_type "${docType}"` : ''}:`
  );
  console.table(
    (data as any[]).map(r => ({
      package_name: r.package_name,
      function_name: r.function_name,
      doc_type: r.doc_type,
      file_path: r.file_path.split('/').slice(-3).join('/'),
      similarity: r.similarity,
    }))
  );
}

export async function getPackageFunctions(
  pkg: string,
  type: 'constructor' | 'function' | 'rule' | 'all' | 'main' = 'all'
): Promise<
  {
    package: string;
    function: string;
    type: string;
    docs: string;
    file_path: string;
  }[]
> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const pkgName = pkg.startsWith('@microfox/')
    ? pkg.replace('@microfox/', '')
    : `@ext_${pkg.replace(/\//g, '#')}`;
  let packagesToSearch = [pkgName];

  // Fetch linked packages to search within them as well
  const { data: linkedData, error: linkedError } = await supabase
    .from('docs_embeddings')
    .select('linked_packages')
    .eq('package_name', pkgName)
    .limit(1);

  if (linkedError) {
    console.error(`Error fetching linked packages for ${pkg}:`, linkedError);
  } else if (
    linkedData &&
    linkedData.length > 0 &&
    linkedData[0]?.linked_packages
  ) {
    const linked = linkedData[0]?.linked_packages?.map((p: string) =>
      p.replace('@microfox/', '')
    );
    packagesToSearch.push(...linked);
  }
  const uniquePackagesToSearch = [...new Set(packagesToSearch)];
  console.log(
    `\n📚 Searching for docs in packages: ${uniquePackagesToSearch.join(', ')}`
  );

  console.log('\n🕵️  Checking doc counts per package...');
  for (const pkgName of uniquePackagesToSearch) {
    const { count, error } = await supabase
      .from('docs_embeddings')
      .select('*', { count: 'exact', head: true })
      .eq('package_name', pkgName);
    if (error) {
      console.error(`Error counting docs for ${pkgName}:`, error.message);
    } else {
      console.log(`  - ${pkgName}: ${count} doc(s)`);
    }
  }

  const query = supabase
    .from('docs_embeddings')
    .select('*')
    .in('package_name', uniquePackagesToSearch);

  if (type !== 'all') {
    query.eq('doc_type', type);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching package functions:', error);
    return [];
  }

  console.log(`\nFound ${data.length} results.`);
  console.table(
    data.map(d => ({
      package: d.package_name,
      function: d.function_name,
      type: d.doc_type,
      // docs: d.content,
      file_path: d.file_path,
    }))
  );

  return data;
}

export async function semanticFunctionSearch(
  pkg: string,
  query: string,
  type: 'constructor' | 'function' | 'rule' | 'all' | 'main' = 'all',
  limit = 10
): Promise<
  {
    package: string;
    function: string;
    type: string;
    docs: string;
    similarity: number;
    file_path: string;
  }[]
> {
  console.log(`\n🔍 Embedding query: "${query}"…`);
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const qEmb = await embed(query);
  console.log('🧠 Query embedding obtained');
  const doc_type_filter = type === 'all' ? null : type;

  if (pkg === '*') {
    console.log('🌍 Global search (all packages)…');
    const { data, error } = await supabase.rpc('match_docs', {
      query_embedding: qEmb,
      k: limit,
      doc_type_filter,
    });
    if (error) throw error;
    console.log(`\n🎯 Top ${limit} global results for "${query}":`);
    if (data) {
      console.table(
        data.map((r: any) => ({
          package: r.package_name,
          function: r.function_name,
          similarity: r.similarity,
          // docs: r.content,
          file_path: r.file_path,
        }))
      );
    }
    return data;
  } else {
    const pkgName = pkg.startsWith('@microfox/')
      ? pkg.replace('@microfox/', '')
      : `@ext_${pkg.replace(/\//g, '#')}`;
    let packagesToSearch = [pkgName];

    // Fetch linked packages to search within them as well
    const { data: linkedData, error: linkedError } = await supabase
      .from('docs_embeddings')
      .select('linked_packages')
      .eq('package_name', pkgName)
      .limit(1);

    if (linkedError) {
      console.error(`Error fetching linked packages for ${pkg}:`, linkedError);
    } else if (
      linkedData &&
      linkedData.length > 0 &&
      linkedData[0]?.linked_packages
    ) {
      const linked = linkedData[0]?.linked_packages?.map((p: string) =>
        p.replace('@microfox/', '')
      );
      packagesToSearch.push(...linked);
    }

    const uniquePackagesToSearch = [...new Set(packagesToSearch)];
    console.log(`📦 Package search in: "${uniquePackagesToSearch.join(', ')}"`);

    const { data, error } = await supabase.rpc('match_docs_in_packages', {
      query_embedding: qEmb,
      pkg_names: uniquePackagesToSearch,
      k: limit,
      doc_type_filter,
    });
    if (error) throw error;
    console.log(
      `\n🎯 Top ${limit} results for "${query}" in relevant packages:`
    );
    if (data) {
      console.table(
        data.map((r: any) => ({
          package: r.package_name,
          function: r.function_name,
          similarity: r.similarity,
          // docs: r.content,
          file_path: r.file_path,
        }))
      );
    }
    return data;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const pkg = args[0];
  const type =
    (args[1] as 'constructor' | 'function' | 'rule' | 'all' | 'main') || 'all';
  const query = args.slice(2).join(' ');

  if (!pkg) {
    console.error(
      '❌ Usage:\n' +
        ' 1) List functions:     ts-node queryDocs.ts <packageName> [docType]\n' +
        ' 2) Package search:      ts-node queryDocs.ts <packageName> [docType] "your question"\n' +
        ' 3) Global search:       ts-node queryDocs.ts "*" [docType] "your question"'
    );
    process.exit(1);
  }

  if (query) {
    await semanticFunctionSearch(pkg, query, type);
  } else if (pkg === '*') {
    console.error('❌ "*" can only be used with a query for global search.');
    process.exit(1);
  } else {
    await getPackageFunctions(pkg, type);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
