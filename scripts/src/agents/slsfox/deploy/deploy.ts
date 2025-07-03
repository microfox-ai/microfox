import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { STAGE } from './constants';
import { createClient } from '@supabase/supabase-js';
import { embed } from '../../../embeddings/geminiEmbed';
import { OpenAPIDoc } from './types';

interface FunctionMetadata {
  name: string;
  package_name: string;
  base_url: string;
  stage: string;
  type: string;
  endpoints: any[];
  metadata: {
    description?: string;
    version?: string;
    title?: string;
    docs_data?: OpenAPIDoc;
    serverless: {
      stage: string;
      output: string;
    };
  };
}

/**
 * Convert a JSON schema object to formatted markdown
 * @param {any} schema - JSON schema object
 * @param {number} indent - Indentation level
 * @returns {string} - Formatted markdown string
 */
function formatSchemaToMarkdown(schema: any, indent: number = 0): string {
  if (!schema || typeof schema !== 'object') {
    return String(schema || 'N/A');
  }

  const spaces = '  '.repeat(indent);
  let result = '';

  if (schema.type === 'object' && schema.properties) {
    result += `${spaces}**Object:**\n`;
    if (schema.description) {
      result += `${spaces}- Description: ${schema.description}\n`;
    }

    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const isRequired = schema.required?.includes(propName) ? ' *(required)*' : ' *(optional)*';
      result += `${spaces}- \`${propName}\`${isRequired}:\n`;

      if (typeof propSchema === 'object' && propSchema !== null) {
        const prop = propSchema as any;
        if (prop.description) {
          result += `${spaces}  - ${prop.description}\n`;
        }
        if (prop.type) {
          result += `${spaces}  - Type: \`${prop.type}\`\n`;
        }
        if (prop.format) {
          result += `${spaces}  - Format: \`${prop.format}\`\n`;
        }
        if (prop.enum) {
          result += `${spaces}  - Enum: ${prop.enum.map((e: any) => `\`${e}\``).join(', ')}\n`;
        }

        // Handle nested objects and arrays
        if (prop.type === 'object' && prop.properties) {
          result += formatSchemaToMarkdown(prop, indent + 2);
        } else if (prop.type === 'array' && prop.items) {
          result += `${spaces}  - Array items:\n`;
          result += formatSchemaToMarkdown(prop.items, indent + 3);
        }
      }
    }
  } else if (schema.type === 'array' && schema.items) {
    result += `${spaces}**Array:**\n`;
    if (schema.description) {
      result += `${spaces}- Description: ${schema.description}\n`;
    }
    result += `${spaces}- Items:\n`;
    result += formatSchemaToMarkdown(schema.items, indent + 1);
  } else {
    // Simple type
    if (schema.type) {
      result += `${spaces}- Type: \`${schema.type}\`\n`;
    }
    if (schema.description) {
      result += `${spaces}- Description: ${schema.description}\n`;
    }
    if (schema.format) {
      result += `${spaces}- Format: \`${schema.format}\`\n`;
    }
    if (schema.enum) {
      result += `${spaces}- Enum: ${schema.enum.map((e: any) => `\`${e}\``).join(', ')}\n`;
    }
  }

  return result;
}

/**
 * Extract base URL from serverless deployment output
 * @param {string} output - Serverless deployment output
 * @returns {string|null} - Base URL or null if not found
 */
function extractBaseUrl(output: string): string | null {
  // Extract the part before /staging
  const urlMatch = output.match(/(https:\/\/[^\/]+\.amazonaws\.com)/);
  if (urlMatch) {
    return `${urlMatch[1]}/${STAGE}`;
  }
  return null;
}

/**
 * Deploy a Serverless function
 * @param {string} packagePath - Directory of the package
 * @returns {Promise<boolean>} - Success status
 */
async function deployPackageSls(packagePath: string): Promise<boolean> {
  try {
    const slsPath = path.join(packagePath, 'sls');
    const serverlessYmlPath = path.join(slsPath, 'serverless.yml');
    if (!fs.existsSync(serverlessYmlPath)) {
      console.error(`serverless.yml not found for ${packagePath}`);
      return false;
    }

    console.log(`Deploying ${path.basename(packagePath)}`);

    // Change to function directory first
    process.chdir(slsPath);

    // Install dependencies if needed
    if (!fs.existsSync(path.join(slsPath, 'node_modules'))) {
      console.log('Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
    }

    // Build the function
    console.log('Building function...');
    execSync('npm run build', { stdio: 'inherit' });

    // Deploy using serverless framework
    console.log('Deploying with serverless framework...');
    const deployCommand = `npx serverless deploy --stage ${STAGE} --force`;
    console.log('Running command:', deployCommand);

    const output = execSync(deployCommand, { encoding: 'utf8' });
    console.log('Deployment output:', output);

    // Extract deployment information
    const packageName = path.basename(packagePath);
    console.log('packageName', packageName);
    const baseUrl = extractBaseUrl(output);

    if (baseUrl) {
      console.log(`Deployed base URL: ${baseUrl}`);
      let docsData: OpenAPIDoc = JSON.parse(fs.readFileSync(path.join(slsPath, 'openapi.json'), 'utf8'));

      const functionMetadata: FunctionMetadata = {
        name: `public-${packageName}-${STAGE}-api`,
        package_name: packageName,
        base_url: baseUrl,
        stage: STAGE.toUpperCase(),
        type: 'MIXED',
        endpoints: [],
        metadata: {
          description: docsData?.info?.description,
          version: docsData?.info?.version,
          title: docsData?.info?.title,
          docs_data: docsData,
          serverless: {
            stage: STAGE.toUpperCase(),
            output,
          },
        },
      };

      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Upsert on unique name
      const { data, error } = await supabase
        .from('public_deployments')
        .upsert(functionMetadata, { onConflict: 'name' });

      if (error) {
        console.error("error", error);
        return false;
      }

      const results = {
        success: 0,
        failed: 0,
        errors: [] as { path: string, method: string, error: any }[]
      };

      for (const [path, methods] of Object.entries(docsData.paths)) {
        console.log(`Processing path: ${path}`);
        for (const [method, op] of Object.entries(methods)) {
          try {
            console.log(`Processing method: ${method}`);
            // build doc_text
            let docText = `ENDPOINT_PATH: ${method.toUpperCase()} ${path}\n`;
            if (op.summary) docText += `SUMMARY: ${op.summary}\n`;
            if (op.description) docText += `DESCRIPTION: ${op.description}\n`;

            docText += `\nLAMBDA_FUNCTION:\n`;
            docText += `  Name: ${op.operationId || `${packageName}-${method}${path.replace(/\//g, '-')}`}\n`;
            docText += `  Path: ${path}\n`;
            docText += `  Method: ${method}\n`;
            docText += `  Description: ${op.description}\n`;
            docText += `  Summary: ${op.summary}\n`;
            docText += `  Instructions: ${op.instructions}\n`;

            if (op.requestBody?.content?.['application/json']?.schema) {
              const schema = op.requestBody.content['application/json'].schema;
              docText += `\n**REQUEST SCHEMA:**\n`;
              docText += formatSchemaToMarkdown(schema);
            }

            docText += `\n**RESPONSES:**\n`;
            for (const [status, resp] of Object.entries(op.responses)) {
              if (resp?.content?.['application/json']?.schema) {
                const schema = resp.content['application/json'].schema;
                docText += `\n**${status} Response:**\n`;
                if (resp.description) {
                  docText += `- Description: ${resp.description}\n`;
                }
                docText += formatSchemaToMarkdown(schema);
              }
            }

            // embed and upsert
            let embedding;
            try {
              embedding = await embed(docText);
              if (!embedding) {
                console.error(`Failed to generate embedding for ${method.toUpperCase()} ${path}`);
                results.failed++;
                results.errors.push({ path, method, error: 'Failed to generate embedding' });
                continue;
              }
            } catch (embedError) {
              console.error(`Embedding error for ${method.toUpperCase()} ${path}:`, embedError);
              results.failed++;
              results.errors.push({ path, method, error: embedError });
              continue;
            }

            const { data: existing, error: fetchError } = await supabase
              .from('api_embeddings')
              .select('*')
              .match({
                base_url: baseUrl,
                endpoint_path: path,
                http_method: method.toUpperCase()
              })
              .maybeSingle();

            if (fetchError) {
              console.error(`Fetch error for ${method} ${path}:`, fetchError);
              results.failed++;
              results.errors.push({ path, method, error: fetchError });
              continue;
            }

            // Create metadata with endpoint structure based on what's available
            const metadata = {
              openApiSchema: docsData,
              endpointSchema: op,
              package_name: packageName,
              function_type: "lambda",
            };

            if (existing) {
              // 2) Update existing
              const { error: updateError } = await supabase
                .from('api_embeddings')
                .update({
                  doc_text: docText,
                  embedding,
                  metadata,
                  updated_at: new Date().toISOString()
                })
                .eq('id', existing.id);

              if (updateError) {
                console.error(`Update error for ${method} ${path}:`, updateError);
                results.failed++;
                results.errors.push({ path, method, error: updateError });
              } else {
                console.log(`Updated embedding for ${method} ${path}`);
                results.success++;
              }
            } else {
              // 3) Insert new
              const { error: insertError } = await supabase
                .from('api_embeddings')
                .insert({
                  bot_project_id: null,
                  origin_client_request_id: null,
                  user_id: null,
                  base_url: baseUrl,
                  endpoint_path: path,
                  http_method: method.toUpperCase(),
                  schema_path: null,
                  doc_text: docText,
                  embedding,
                  is_public: true,
                  stage: STAGE.toUpperCase(),
                  metadata,
                });

              if (insertError) {
                console.error(`Insert error for ${method} ${path}:`, insertError);
                results.failed++;
                results.errors.push({ path, method, error: insertError });
              } else {
                console.log(`Inserted embedding for ${method} ${path}`);
                results.success++;
              }
            }
            console.log('results after', method, path, results);
          } catch (error) {
            console.error(`Error processing endpoint ${method.toUpperCase()} ${path}:`, error);
            console.log('results after', method, path, results);
            results.failed++;
            results.errors.push({ path, method, error });
          }
        }
        console.log('results after', path, results);
      }
      console.log('results', results);
      
      // Return based on overall results
      if (results.failed > 0) {
        console.log(`Deployment completed with errors: ${results.success} succeeded, ${results.failed} failed`);
        return false;
      } else {
        console.log(`All endpoints processed successfully: ${results.success} succeeded`);
        return true;
      }
    }
    return true;
  } catch (error) {
    console.error(`Error deploying sls function for package ${path.basename(packagePath)}:`, error);
    return false;
  }
}

export default deployPackageSls; 