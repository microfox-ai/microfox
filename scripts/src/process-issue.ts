import { z } from 'zod';
import 'dotenv/config';
import { generateObject } from 'ai';
import { models } from './ai/models'; // Assuming you have a models setup like in genPackage.ts
import dedent from 'dedent';
import { logUsage } from './ai/usage/usageLogger'; // Assuming usage logging is desired

// --- Schemas ---

// Schema for data extracted from the issue by AI
const IssueDetailsSchema = z.object({
  type: z
    .enum([
      'pkg-create',
      'pkg-create-oauth',
      'pkg-build',
      'bug',
      'modification',
      'genExt',
      'genExtDocs',
      'genDocs',
    ])
    .describe(
      'The type of request: new packages with pkg-create, test package working with pkg-build, bug fix, modification to existing functionality, generate extension, generate extension docs, or generate docs.',
    ),
  occurredAt: z
    .enum(['build', 'runtime', 'undefined'])
    .optional()
    .describe(
      'Where the issue occurred (build time, runtime, or not applicable). Primarily relevant for "bug" type.',
    ),
  notes: z
    .string()
    .describe('A concise summary or notes about the request or issue.'),
  error: z
    .union([z.object({}), z.string()])
    .optional()
    .describe(
      'Details of the error if the type is "bug". Can be a string or a structured object.',
    ),
  logs: z
    .string()
    .optional()
    .describe('Any relevant logs provided in the issue body.'),
  query: z
    .string()
    .describe(
      'The core request or query extracted from the issue title/body (e.g., "Youtube Analytics API", "Fix build error in xyz package").',
    ),
  title: z
    .string()
    .describe(
      'A short, descriptive title in camelCase, suitable for code identifiers (e.g., "youtubeAnalytics", "fixXyzBuild").',
    ),
  url: z
    .string()
    .optional()
    .describe(
      'A relevant documentation or reference URL if provided or inferable.',
    ),
});

export type IssueDetails = z.infer<typeof IssueDetailsSchema>;

// Schema for the request object to be added to packagefox-build.json
const PackageFoxRequestSchema = z.object({
  type: IssueDetailsSchema.shape.type,
  query: IssueDetailsSchema.shape.query,
  url: IssueDetailsSchema.shape.url,
  notes: IssueDetailsSchema.shape.notes,
  logs: IssueDetailsSchema.shape.logs.optional(),
  error: IssueDetailsSchema.shape.error.optional(),
  // Add other fields if needed based on type, e.g., error details for 'bug'
  packageName: z
    .string()
    .optional()
    .describe('Optional: Target package name if type is pkg-build or bug'),
  issueNumber: z.number().optional().describe('The originating issue number'),
});

export type PackageFoxRequest = z.infer<typeof PackageFoxRequestSchema>;

// --- Helper Functions ---

function getFormattedDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}

function sanitizeForBranchName(name: string): string {
  // Remove special characters, replace spaces with '-', keep camelCase, lowercase
  return name
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

// --- Main Processing Function ---

async function processIssue() {
  console.log('🚀 Starting issue processing...');

  const issueTitle = process.env.ISSUE_TITLE;
  const issueBody = process.env.ISSUE_BODY;
  const issueUrl = process.env.ISSUE_URL;
  const issueNumberStr = process.env.ISSUE_NUMBER;

  if (!issueTitle || !issueBody || !issueNumberStr) {
    console.error(
      '❌ Missing required environment variables: ISSUE_TITLE, ISSUE_BODY, ISSUE_NUMBER',
    );
    process.exit(1);
  }

  const issueNumber = parseInt(issueNumberStr, 10);
  if (isNaN(issueNumber)) {
    console.error('❌ Invalid ISSUE_NUMBER:', issueNumberStr);
    process.exit(1);
  }

  console.log(`📄 Processing Issue #${issueNumber}: ${issueTitle}`);

  try {
    console.log('🧠 Calling AI to parse issue details...');
    const { object: details, usage } = await generateObject({
      model: models.googleGeminiPro, // Or another suitable model
      schema: IssueDetailsSchema,
      prompt: dedent`
        Analyze the following GitHub issue title and body to understand the user's request.
        Extract the required information according to the schema.

        **Issue Title:** ${issueTitle}

        **Issue Body:**
        ${issueBody}

        **Analysis Guidelines:**
        - Determine the primary 'type' of the request (feature, pkg-build, bug, modification).
        - If it's a 'bug', specify if it occurred at 'build' or 'runtime'. Note 'error' details and any 'logs'.
        - Extract the core 'query' being asked.
        - Generate a concise camelCase 'title' suitable for branch names.
        - Capture any essential 'notes'.
        - Identify a relevant documentation 'url' if mentioned.
        - If the type is 'pkg-build' or 'bug', try to identify the target package name from the title or body.
      `,
      temperature: 0.3, // Lower temperature for more predictable extraction
    });

    logUsage(models.googleGeminiPro.modelId, usage); // Log usage if setup
    console.log('✅ AI processing complete.');
    console.log('🔧 Extracted Details:', details);

    // --- Prepare Outputs for GitHub Actions ---

    // 1. Branch Name
    const dateStr = getFormattedDate();
    // Sanitize parts before joining
    const sanitizedType = sanitizeForBranchName(details.type);
    const sanitizedTitle = sanitizeForBranchName(details.title);
    const branchName = `feat/${sanitizedType}-${sanitizedTitle}-${dateStr}`;
    console.log(`🌿 Branch Name: ${branchName}`);

    // 2. JSON Payload for packagefox-build.json
    const jsonPayload: PackageFoxRequest = {
      type: details.type,
      query: details.query, // Use AI extracted query
      url: details.url,
      notes: details.notes,
      issueNumber: issueNumber,
      logs: details.logs,
      error: details.error,
    };
    // Add packageName if relevant and found (implement logic if needed)
    // if ((details.type === 'pkg-build' || details.type === 'bug') && details.packageName) {
    //    jsonPayload.packageName = details.packageName;
    // }
    const jsonPayloadString = JSON.stringify(jsonPayload);
    console.log(`📦 JSON Payload: ${jsonPayloadString}`);

    // 3. Commit Message
    const commitMessage = `feat: Add request for '${details.query}' from #${issueNumber}`;
    console.log(`💬 Commit Message: ${commitMessage}`);

    // 4. PR Title
    const prTitle = `packagefox: Process '${details.query}' [Issue #${issueNumber}]`;
    console.log(`✨ PR Title: ${prTitle}`);

    // 5. PR Body
    const prBody = dedent`
      Automated PR created from issue #${issueNumber}.

      **Request Type:** ${details.type}
      **Query:** ${details.query}
      ${details.url ? `**URL:** ${details.url}` : ''}

      **Notes:**
      ${details.notes}

      ${details.error ? `**Error Details:**\n\`\`\`\n${typeof details.error === 'string' ? details.error : JSON.stringify(details.error, null, 2)}\n\`\`\`` : ''}
      ${details.logs ? `**Logs:**\n\`\`\`\n${details.logs}\n\`\`\`` : ''}

      Closes #${issueNumber}
    `;
    // Escape PR body for multiline output if necessary, but create-pull-request action usually handles it
    console.log(`📝 PR Body:\n${prBody}`);

    // --- Set Outputs for GitHub Actions ---
    // Use console.log with the specific ::set-output format
    console.log(`::set-output name=branch_name::${branchName}`);
    console.log(`::set-output name=json_payload::${jsonPayloadString}`);
    console.log(`::set-output name=commit_message::${commitMessage}`);
    console.log(`::set-output name=pr_title::${prTitle}`);
    // For potentially multiline content like pr_body, using environment files is safer,
    // but create-pull-request action often handles direct multiline input well.
    // If issues arise, switch to GITHUB_OUTPUT environment file method.
    // Here, we'll try direct output first, ensuring newlines are preserved.
    // We need to escape '%' -> '%25', '\n' -> '%0A', '\r' -> '%0D' for set-output
    const escapedPrBody = prBody
      .replace(/%/g, '%25')
      .replace(/\n/g, '%0A')
      .replace(/\r/g, '%0D');
    console.log(`::set-output name=pr_body::${escapedPrBody}`);

    console.log('✅ Successfully set all outputs.');
  } catch (error) {
    console.error('❌ Error during issue processing:', error);
    // Optionally, set outputs indicating failure?
    process.exit(1);
  }
}

// --- Script Execution ---
if (require.main === module) {
  processIssue().catch(error => {
    console.error('❌ Unhandled error during script execution:', error);
    process.exit(1);
  });
}

// Export for potential testing or reuse
export { processIssue, IssueDetailsSchema, PackageFoxRequestSchema };
