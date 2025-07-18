// npx ts-node scripts/src/split-openapi.ts packages/slack/sls/openapi.json packages/slack/sls/openapi
import fs from 'fs/promises';
import path from 'path';

async function splitOpenApi(sourceFile: string, outputDir: string) {
  try {
    console.log(`Reading OpenAPI spec from ${sourceFile}`);
    const openapiStr = await fs.readFile(sourceFile, 'utf-8');
    const openapi = JSON.parse(openapiStr);

    if (!openapi.paths) {
      console.error('No paths found in the OpenAPI spec.');
      return;
    }

    console.log(`Ensuring output directory ${outputDir} exists.`);
    await fs.mkdir(outputDir, { recursive: true });

    const paths = openapi.paths;

    for (const pathKey in paths) {
      const pathObject = paths[pathKey];
      const methods = Object.keys(pathObject);

      if (methods.length === 0) {
        console.warn(`No methods found for path ${pathKey}. Skipping.`);
        continue;
      }
      
      // Assuming one method per path object which seems to be the case in your openapi.json
      const method = methods[0];
      const operation = pathObject[method];
      const operationId = operation.operationId;

      if (operationId) {
        const content = {
          [pathKey]: pathObject
        };

        const outputPath = path.join(outputDir, `${operationId}.json`);
        console.log(`Writing ${outputPath}`);
        await fs.writeFile(outputPath, JSON.stringify(pathObject, null, 2) + '\n');
      } else {
        console.warn(`No operationId found for path ${pathKey}, method ${method}. Skipping.`);
      }
    }

    console.log('Done splitting OpenAPI spec.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Main execution
if (require.main === module) {
  const [,, sourceArg, outputArg] = process.argv;

  if (!sourceArg || !outputArg) {
    console.error('Usage: ts-node scripts/src/split-openapi.ts <source-openapi.json> <output-directory>');
    process.exit(1);
  }

  const sourceFile = path.resolve(sourceArg);
  const outputDir = path.resolve(outputArg);

  splitOpenApi(sourceFile, outputDir);
} 