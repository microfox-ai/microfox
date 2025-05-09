const $RefParser = require('json-schema-ref-parser');

export async function analyzeSpec(url: string) {
  const spec: any = await $RefParser.dereference(url);
  const issues = [];

  for (const path in spec.paths) {
    for (const method in spec.paths[path]) {
      const op = spec.paths[path][method];
      if (!op.description) {
        issues.push({ path, method, issue: 'Missing description' });
      }
      if (!op.operationId) {
        issues.push({ path, method, issue: 'Missing operationId' });
      }
    }
  }

  return { spec, issues };
}