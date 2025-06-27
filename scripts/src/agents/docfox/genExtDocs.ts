import { exec } from 'child_process';
import dedent from 'dedent';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { generateObject, generateText } from 'ai';
import { models } from '../../ai/models';
import { logUsage } from '../../ai/usage/usageLogger';
import { updateDocReport } from '../../octokit/commentReports';
import { scrapeUrl, extractLinks, analyzeLinks } from '../../utils/webScraper';
import { z } from 'zod';

const execAsync = promisify(exec);

// Interface for SDK metadata
interface SDKMetadata {
  apiName: string;
  packageName: string;
  title: string;
  description: string;
  authType: string;
  authSdk?: string;
}

/**
 * Scrape documentation from a base URL and generate documentation
 */
export async function generateExternalDocs(
  baseUrl: string,
  packageName: string,
  outputDir: string,
  extraInfo: string[] = [],
): Promise<boolean> {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(outputDir, '@ext_package.json'), 'utf8'),
    );

    fs.writeFileSync(
      path.join(outputDir, 'package-builder.json'),
      JSON.stringify(
        {
          sdkMetadata: {
            apiName: packageName,
            packageName,
            title: packageJson.name,
            description: packageJson.description,
            authType: 'none',
          },
        },
        null,
        2,
      ),
    );

    // Create docs directory
    const docsDir = path.join(outputDir, 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    const scrapedDocsDir = path.join(outputDir, 'scraped-docs');
    if (!fs.existsSync(scrapedDocsDir)) {
      fs.mkdirSync(scrapedDocsDir, { recursive: true });
    }

    // Scrape the base URL to find all links
    console.log(`🔍 Scraping base URL: ${baseUrl}`);
    const links = await extractLinks(baseUrl, outputDir);
    const filteredLinks = await analyzeLinks(links, outputDir, {
      packageDir: outputDir,
      isBaseUrl: true,
      url: baseUrl,
    });
    console.log(`📎 Found ${filteredLinks.length} links to scrape`);

    // Track environment variables
    const envKeys: Array<{
      key: string;
      displayName: string;
      description: string;
      required: boolean;
    }> = [];

    // Process each link and generate documentation
    for (const link of filteredLinks) {
      try {
        console.log(`🔍 Scraping: ${link}`);
        const content = await scrapeUrl(link);

        // Generate documentation for this content
        const { text: docs, usage } = await generateText({
          model: models.googleGeminiPro,
          system: dedent`
            You are a professional documentation generator for TypeScript SDKs. Your task is to analyze the provided content and generate comprehensive documentation.

            ## Documentation Format
            Each function documentation should follow this structure:

            \`\`\`markdown
            ## Function: \`functionName\`

            [Clear, detailed description of what the function does and its purpose]

            **Purpose:**
            [Explain the main purpose and use cases of the function]

            **Parameters:**
            [Describe each parameter in detail, including:
            - Parameter name and type (for arrays, specify element type like array<string>, array<number>, array<object>, etc.)
            - Whether it's required or optional
            - Detailed description of what the parameter represents
            - Any constraints or valid values
            - Default values if applicable
            - For each parameter type that is an object, array, or named type, provide a detailed description of its structure and purpose]

            **Return Value:**
            [Describe what the function returns, including:
            - Return type (for arrays, specify element type like array<string>, array<number>, array<object>, etc.)
            - Description of the returned value
            - Any special cases or conditions
            - Error cases if applicable
            - For return types that are objects, arrays, or named types, provide a detailed description of their structure]

            **Examples:**
            [Provide examples that demonstrate all possible functionality of the function. Include examples for:
            - Minimal usage with only required arguments
            - Full usage with all optional arguments
            - Different input types and formats
            - Edge cases and special conditions
            - Error handling scenarios
            - Return value variations]

            \`\`\`typescript
            // Example 1: Minimal usage with only required arguments
            const result1 = functionName({
              // Required string parameter - should be a valid identifier
              param1: '<identifier>',
              // Required array<string> parameter - list of valid identifiers
              param2: ['<identifier1>', '<identifier2>']
            });

            // Example 2: Full usage with all optional arguments
            const result2 = functionName({
              // Required string parameter - should be a valid identifier
              param1: '<identifier>',
              // Required array<string> parameter - list of valid identifiers
              param2: ['<identifier1>', '<identifier2>'],
              // Optional number parameter - controls behavior (default: 0)
              optionalParam1: 42,
              // Optional array<object> parameter - additional configuration
              optionalParam2: [
                { id: '<id1>', value: 1 },
                { id: '<id2>', value: 2 }
              ],
              // Optional boolean parameter - enables feature (default: false)
              optionalParam3: true
            });

            // Example 3: Different input types with optional arguments
            const result3 = functionName({
              // Required string parameter - should be a valid identifier
              param1: '<identifier>',
              // Required array<string> parameter - list of valid identifiers
              param2: ['<identifier1>', '<identifier2>'],
              // Optional array<number> parameter - list of quantities
              optionalParam1: [42, 100],
              // Optional array<boolean> parameter - list of feature flags
              optionalParam2: [true, false, true]
            });

            // Example 4: Error handling with optional arguments
            try {
              const result4 = functionName({
                // Required string parameter - should be a valid identifier
                param1: '<identifier>',
                // Required array<string> parameter - list of valid identifiers
                param2: ['<identifier1>', '<identifier2>'],
                // Invalid optional number parameter - will trigger validation error
                optionalParam1: -1
              });
            } catch (error) {
              // Handle validation error
              console.error('Invalid optional parameter:', error.message);
            }

            // Example 5: Using different combinations of optional arguments
            const result5 = functionName({
              // Required string parameter - should be a valid identifier
              param1: '<identifier>',
              // Required array<string> parameter - list of valid identifiers
              param2: ['<identifier1>', '<identifier2>'],
              // Using only some optional parameters
              optionalParam1: 42,
              optionalParam3: true
            });
            \`\`\`
            \`\`\`

            ## Type Documentation Standards
            1. Type Expansion Rules:
               - For each parameter and return type that is an object, array, or named type:
                 * Document all fields with their types
                 * For nested objects, create a new section
                 * Continue expanding until reaching primitive types
                 * Include field descriptions and constraints
                 * Document required vs optional fields
                 * Show default values if any
                 * Document ALL possible values for each field
                 * Include validation rules
                 * NEVER refer to external type documentation
                 * ALWAYS expand all types inline

            2. Object Type Documentation:
               - Create a section for each object type
               - Document all fields with their types
               - For nested objects, create a new section
               - Continue expanding until reaching primitive types
               - Include field descriptions and constraints
               - Document required vs optional fields
               - Show default values if any
               - Document ALL possible values for each field
               - Include validation rules
               - NEVER refer to external type documentation
               - ALWAYS expand all types inline

            3. Array Type Documentation:
               - Document the element type (e.g., array<string>, array<number>, array<object>)
               - For object arrays, create a section for the element type
               - Document array constraints (min/max length)
               - For nested arrays, document the structure (e.g., array<array<string>>)
               - Include validation rules for array contents
               - ALWAYS expand the element type if it's an object or named type
               - Document ALL possible values for array elements
               - NEVER refer to external type documentation
               - ALWAYS expand all types inline

            4. Recursive Type Expansion:
               - For each object field that is an object:
                 * Create a new section for the nested object
                 * Document all fields of the nested object
                 * Continue expanding nested objects
                 * Stop at primitive types
                 * Document ALL possible values for each field
                 * NEVER refer to external type documentation
               - For each array field that contains objects:
                 * Create a section for the element type (e.g., array<object>)
                 * Document all fields of the element type
                 * Expand nested objects in elements
                 * Stop at primitive types
                 * Document ALL possible values for array elements
                 * NEVER refer to external type documentation
               - For union types:
                 * Document all possible types
                 * For each object type in the union, create sections
                 * Expand nested objects in each type
                 * Document type guards if any
                 * List ALL possible values for each type in the union
                 * NEVER refer to external type documentation
               - For named types:
                 * ALWAYS expand to their base types
                 * Create sections for object types
                 * Document all fields
                 * Continue expanding until primitive types
                 * Document ALL possible values for each field
                 * NEVER refer to external type documentation

            5. Primitive Type Documentation:
               - For string types:
                 * Document all possible string values
                 * Include format requirements
                 * Show validation patterns
                 * List any enum values
               - For number types:
                 * Document valid ranges
                 * List any enum values
                 * Show precision requirements
               - For boolean types:
                 * Document when to use true/false
                 * Explain the meaning of each value
               - For enum types:
                 * List all possible enum values
                 * Explain the meaning of each value
                 * Show when to use each value

            ## Function Documentation Standards
            1. Function Overview:
               - Clear description of what the function does
               - Purpose and use cases
               - Any side effects or state changes
               - Error handling and edge cases
               - Performance considerations

            2. Parameter Documentation:
               - Document all parameters with types
               - Include required vs optional status
               - Document default values
               - Document possible values for enums
               - Expand object parameters to their base types
               - Document all nested object fields
               - Continue expanding until reaching primitive types
               - For array parameters, expand element types

            3. Return Value Documentation:
               - Describe what the function returns
               - Document the structure of returned data
               - Expand object return types to their base types
               - Document all nested object fields
               - Continue expanding until reaching primitive types
               - For array return types, expand element types

            4. Examples:
               - Provide minimal example with only required arguments
               - Provide full example with all optional arguments
               - Show different combinations of optional arguments
               - Include examples for all parameter combinations
               - Show different input types and formats
               - Demonstrate edge cases and special conditions
               - Include error handling scenarios
               - Show variations in return values
               - Use clear and descriptive comments
               - Use descriptive placeholder values that explain the expected format/type
               - Focus on demonstrating functionality rather than real-world use cases

            5. Constructor Documentation:
               - Show how to construct the SDK using configuration objects (use environment variables if suitable instead of mock data)
               - Document all available configuration options
               - Include examples of different configuration combinations
               - Explain how to handle authentication
               - Show how to set up error handling

            ## Documentation Requirements

            1. Type Documentation:
               For each type used in the SDK, generate comprehensive documentation that includes:
               - Complete type expansion until primitive types
               - ALL possible values for each field
               - Detailed descriptions and constraints
               - Validation rules and requirements
               - Examples showing valid values (if helpful)
               - For primitive types:
                 * All possible string values
                 * Valid number ranges
                 * Boolean usage cases
                 * All enum values
               - For object types:
                 * All fields and their types
                 * All possible values for each field
                 * Nested object expansion
               - For array types:
                 * Element type documentation
                 * All possible element values
                 * Array constraints
               - For union types:
                 * All possible types
                 * All possible values for each type
                 * Type guards and validation
               - IMPORTANT: NEVER refer to external type documentation. ALWAYS expand all types inline.

            2. Function Documentation:
               For each function, generate documentation that includes:
               - Clear description of purpose and functionality
               - Detailed parameter documentation
               - Return value documentation
               - Practical examples WITHOUT constructor code
               - Error handling and edge cases
               - Expanded type documentation for all parameters and return values:
                 * Create sections for all object types
                 * Expand all nested objects and arrays
                 * Document all fields and their types
                 * Continue expanding until reaching primitive types
               - Examples based on need:
                 * Provide examples only when they add value
                 * Show different parameter combinations if helpful
                 * Demonstrate different use cases
                 * Include error handling if relevant
                 * Use mock data in examples
               - IMPORTANT:
                 * NEVER leave placeholders like [Implementation Details], [Parameter Details], etc.
                 * NEVER cross-reference other documentation files
                 * Each function's documentation must be complete and self-contained
                 * If the function is not documented, it should be removed from the package

            3. Constructor Documentation:
               Generate documentation that includes:
               - Clear description of purpose and functionality
               - Detailed parameter documentation
               - Expanded type documentation
               - Usage examples showing:
                 * How to construct using configuration objects (use environment variables if suitable instead of mock data)
                 * Different configuration combinations
                 * Authentication setup
                 * Error handling setup
               - IMPORTANT:
                 * NEVER leave placeholders like [Implementation Details], [Parameter Details], etc.
                 * NEVER cross-reference other documentation files
                 * Constructor documentation must be complete and self-contained

            4. Environment Variables:
               Generate environment variables documentation that includes:
               - All required API keys and tokens
               - For OAuth2 authentication:
                 * Include the constructor configs like accessToken, refreshToken, clientId, clientSecret, etc. in the environment variables
                 * If the constructor config includes scopes, ALWAYS include a SCOPES environment variable
                 * The name of the environment variable should be based on the oauth provider name not the package name. For example, for google-oauth, the environment variable should be GOOGLE_ACCESS_TOKEN, GOOGLE_REFRESH_TOKEN, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SCOPES etc. not GOOGLE_SHEETS_ACCESS_TOKEN, GOOGLE_SHEETS_REFRESH_TOKEN, GOOGLE_SHEETS_CLIENT_ID, GOOGLE_SHEETS_CLIENT_SECRET, GOOGLE_SHEETS_SCOPES etc.
               - For each environment variable:
                 * Clear display name
                 * Detailed description
                 * Required/optional status
                 * Format and validation requirements

            5. Formatting Requirements:
               - Include code blocks for examples
               - Maintain consistent style
               - Use clear section headers
               - Include proper spacing
               - NEVER include constructor or SDK initialization code in function examples
               - Use mock data in examples
               - Follow the exact documentation format provided

            Generate documentation that is:
            - Comprehensive and detailed
            - Well-structured and easy to navigate
            - Practical with real-world examples
            - Technically accurate
            - Consistent in style and formatting
            - Follows TypeScript best practices
            - COMPLETE with no placeholders or cross-references
            - DO not use tabular format for the documentation.
          `,
          prompt: dedent`
            Generate documentation for the following content:

            ${content}

            Extra Information:
            ${extraInfo.join('\n\n')}
          `,
        });

        // Log usage
        if (usage) {
          logUsage(models.googleGeminiPro.modelId, usage);
        }

        // Save documentation
        const fileName = path.basename(link).replace(/[^a-zA-Z0-9]/g, '_');
        const filePath = path.join(docsDir, `${fileName}.md`);
        fs.writeFileSync(filePath, docs);
        console.log(`✅ Saved documentation to: ${filePath}`);

        //Save scrapedDocs
        const scrapedDocsPath = path.join(scrapedDocsDir, `${fileName}.md`);
        fs.writeFileSync(
          scrapedDocsPath,
          JSON.stringify(
            {
              url: link,
              content,
              updatedAt: new Date().toISOString(),
            },
            null,
            2,
          ),
        );
        console.log(`✅ Saved scrapedDocs to: ${scrapedDocsPath}`);

        // Extract environment variables from the content
        const result = await generateObject({
          model: models.googleGeminiPro,
          schema: z.object({
            envKeys: z.array(
              z.object({
                key: z
                  .string()
                  .describe(
                    'The key of the environment variable in all caps & underscores',
                  ),
                displayName: z
                  .string()
                  .describe('The display name of the environment variable'),
                description: z
                  .string()
                  .describe(
                    'A detailed description of the environment variable',
                  ),
                required: z
                  .boolean()
                  .describe('Whether the environment variable is required'),
              }),
            ),
          }),
          system: `Extract any environment variables or API keys needed from the content. Return them in JSON format with key, displayName, description, and required fields.`,
          prompt: content,
        });

        try {
          const extractedEnvKeys = result.object.envKeys;
          if (Array.isArray(extractedEnvKeys)) {
            envKeys.push(...extractedEnvKeys);
          }
        } catch (e) {
          console.warn('Failed to parse environment variables:', e);
        }
      } catch (error) {
        console.error(`❌ Failed to process ${link}:`, error);
      }
    }

    // Save environment variables
    if (envKeys.length > 0) {
      const envKeysPath = path.join(docsDir, 'environment-variables.md');
      const envKeysContent = dedent`
        # Environment Variables

        The following environment variables are required to use this SDK:

        ${envKeys
          .map(
            key => dedent`
        ## ${key.displayName}

        **Key:** \`${key.key}\`
        **Required:** ${key.required ? 'Yes' : 'No'}

        ${key.description}
        `,
          )
          .join('\n\n')}
      `;
      fs.writeFileSync(envKeysPath, envKeysContent);
      console.log(`✅ Saved environment variables to: ${envKeysPath}`);
    }

    // Update documentation report
    await updateDocReport(
      'generate',
      {
        status: 'success',
        details: {
          package: packageName,
          title: 'External API Documentation',
          'Generated Files': fs.readdirSync(docsDir).length,
          'Environment Variables': envKeys.length,
        },
      },
      outputDir,
    );

    // Update package-info.json with constructor info
    const packageInfoPath = path.join(outputDir, 'package-info.json');
    const packageInfo = JSON.parse(fs.readFileSync(packageInfoPath, 'utf8'));

    const safeFunctionNames = fs
      .readdirSync(docsDir)
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));

    // Add constructor info
    packageInfo.constructors = [
      {
        name: 'constructor',
        description: `Create a new ${packageInfo.title} client through which you can interact with the API`,
        auth: packageInfo.authType || 'none',
        ...(packageInfo.authType === 'apikey' && {
          apiType: 'api_key',
        }),
        ...(packageInfo.authType === 'oauth2' && {
          authSdk: packageInfo.authSdk,
        }),
        ...(packageInfo.authType === 'oauth2' &&
          packageInfo.authEndpoint && {
            authEndpoint: packageInfo.authEndpoint,
          }),
        requiredKeys: !packageInfo.authEndpoint
          ? envKeys.map(key => ({
              key: key.key,
              displayName: key.displayName,
              description: key.description,
              required: key.required,
              ...(key.key.includes('SCOPES') &&
                packageInfo.oauth2Scopes && {
                  defaultValue: packageInfo.oauth2Scopes,
                }),
            }))
          : [],
        internalKeys: packageInfo.authEndpoint
          ? envKeys.map(key => ({
              key: key.key,
              displayName: key.displayName,
              description: key.description,
              required: key.required,
              ...(key.key.includes('SCOPES') &&
                packageInfo.oauth2Scopes && {
                  defaultValue: packageInfo.oauth2Scopes,
                }),
            }))
          : [],
        functionalities: safeFunctionNames.filter(
          name => name !== 'constructor',
        ),
      },
    ];

    // Add extraInfo
    packageInfo.extraInfo = extraInfo;

    // Write updated package-info.json
    fs.writeFileSync(packageInfoPath, JSON.stringify(packageInfo, null, 2));
    console.log(`📝 Updated ${packageInfoPath}`);

    return true;
  } catch (error) {
    console.error('❌ Top-level error during documentation generation:', error);
    try {
      await updateDocReport(
        'generate',
        {
          status: 'failure',
          error: `Unhandled error: ${error instanceof Error ? error.message : String(error)}`,
        },
        outputDir,
      );
    } catch (reportError) {
      console.error(
        'Failed to update report after top-level error:',
        reportError,
      );
    }
    return false;
  }
}

if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);
    const packageName = args[0];
    const baseUrl = args[1];
    if (!baseUrl) {
      console.error('Please provide a base URL as an argument');
      process.exit(1);
    }

    const outputDir = path.join(__dirname, '../../packages', packageName);
    console.log('outputDir', outputDir);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
      const success = await generateExternalDocs(
        baseUrl,
        packageName,
        outputDir,
      );
      if (success) {
        console.log(
          `\n✅ Successfully generated documentation from ${baseUrl}`,
        );
      } else {
        console.error(`\n❌ Failed to generate documentation from ${baseUrl}`);
        process.exitCode = 1;
      }
    } catch (docError) {
      console.error(
        `\n❌ Unhandled exception during generateExternalDocs for ${baseUrl}:`,
        docError,
      );
      process.exitCode = 1;
    }
  })();
}
