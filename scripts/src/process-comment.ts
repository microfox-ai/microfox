import { z } from 'zod';
import 'dotenv/config';
import { generateObject } from 'ai';
import { models } from './ai/models';
import dedent from 'dedent';
import { logUsage } from './ai/usage/usageLogger';

// --- Schemas ---

// Schema for data extracted from the comment by AI
const CommentDetailsSchema = z.object({
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
    .describe('Any relevant logs provided in the comment.'),
  query: z
    .string()
    .describe(
      'The core request or query extracted from the comment (e.g., "Youtube Analytics API", "Fix build error in xyz package").',
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

export type CommentDetails = z.infer<typeof CommentDetailsSchema>;

// Schema for the request object to be added to packagefox-build.json
const PackageFoxRequestSchema = z.object({
  type: CommentDetailsSchema.shape.type,
  query: CommentDetailsSchema.shape.query,
  url: CommentDetailsSchema.shape.url,
  notes: CommentDetailsSchema.shape.notes,
  logs: CommentDetailsSchema.shape.logs.optional(),
  error: CommentDetailsSchema.shape.error.optional(),
  packageName: z
    .string()
    .optional()
    .describe('Optional: Target package name if type is pkg-build or bug'),
  prNumber: z.number().optional().describe('The originating PR number'),
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
  return name
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

// --- Main Processing Function ---

async function processComment() {
  console.log('🚀 Starting comment processing...');

  const commentBody = process.env.COMMENT_BODY;
  const prNumberStr = process.env.PR_NUMBER;
  const prUrl = process.env.PR_URL;

  if (!commentBody || !prNumberStr) {
    console.error(
      '❌ Missing required environment variables: COMMENT_BODY, PR_NUMBER',
    );
    process.exit(1);
  }

  const prNumber = parseInt(prNumberStr, 10);
  if (isNaN(prNumber)) {
    console.error('❌ Invalid PR_NUMBER:', prNumberStr);
    process.exit(1);
  }

  console.log(`📄 Processing Comment on PR #${prNumber}`);

  try {
    console.log('🧠 Calling AI to parse comment details...');
    const { object: details, usage } = await generateObject({
      model: models.googleGeminiPro,
      schema: CommentDetailsSchema,
      prompt: dedent`
        Analyze the following GitHub PR comment to understand the user's request.
        Extract the required information according to the schema.

        **Comment Body:**
        ${commentBody}

        **Analysis Guidelines:**
        - Determine the primary 'type' of the request (feature, pkg-build, bug, modification).
        - If it's a 'bug', specify if it occurred at 'build' or 'runtime'. Note 'error' details and any 'logs'.
        - Extract the core 'query' being asked.
        - Generate a concise camelCase 'title' suitable for branch names.
        - Capture any essential 'notes'.
        - Identify a relevant documentation 'url' if mentioned.
        - If the type is 'pkg-build' or 'bug', try to identify the target package name from the comment.
      `,
      temperature: 0.3,
    });

    logUsage(models.googleGeminiPro.modelId, usage);
    console.log('✅ AI processing complete.');
    console.log('🔧 Extracted Details:', details);

    // --- Prepare Outputs for GitHub Actions ---

    // 1. Branch Name
    const dateStr = getFormattedDate();
    const sanitizedType = sanitizeForBranchName(details.type);
    const sanitizedTitle = sanitizeForBranchName(details.title);
    const branchName = `feat/${sanitizedType}-${sanitizedTitle}-${dateStr}`;
    console.log(`🌿 Branch Name: ${branchName}`);

    // 2. JSON Payload for packagefox-build.json
    const jsonPayload: PackageFoxRequest = {
      type: details.type,
      query: details.query,
      url: details.url,
      notes: details.notes,
      prNumber: prNumber,
      logs: details.logs,
      error: details.error,
    };
    const jsonPayloadString = JSON.stringify(jsonPayload);
    console.log(`📦 JSON Payload: ${jsonPayloadString}`);

    // 3. Commit Message
    const commitMessage = `feat: Add request for '${details.query}' from PR #${prNumber}`;
    console.log(`💬 Commit Message: ${commitMessage}`);

    // 4. PR Title
    const prTitle = `packagefox: Process '${details.query}' [PR #${prNumber}]`;
    console.log(`✨ PR Title: ${prTitle}`);

    // 5. PR Body
    const prBody = dedent`
      Automated PR created from comment on PR #${prNumber}.

      **Request Type:** ${details.type}
      **Query:** ${details.query}
      ${details.url ? `**URL:** ${details.url}` : ''}

      **Notes:**
      ${details.notes}

      ${details.error ? `**Error Details:**\n\`\`\`\n${typeof details.error === 'string' ? details.error : JSON.stringify(details.error, null, 2)}\n\`\`\`` : ''}
      ${details.logs ? `**Logs:**\n\`\`\`\n${details.logs}\n\`\`\`` : ''}

      Related to PR #${prNumber}
    `;
    console.log(`📝 PR Body:\n${prBody}`);

    // --- Set Outputs for GitHub Actions ---
    console.log(`::set-output name=branch_name::${branchName}`);
    console.log(`::set-output name=json_payload::${jsonPayloadString}`);
    console.log(`::set-output name=commit_message::${commitMessage}`);
    console.log(`::set-output name=pr_title::${prTitle}`);
    const escapedPrBody = prBody
      .replace(/%/g, '%25')
      .replace(/\n/g, '%0A')
      .replace(/\r/g, '%0D');
    console.log(`::set-output name=pr_body::${escapedPrBody}`);

    console.log('✅ Successfully set all outputs.');
  } catch (error) {
    console.error('❌ Error during comment processing:', error);
    process.exit(1);
  }
}

// --- Script Execution ---
if (require.main === module) {
  processComment().catch(error => {
    console.error('❌ Unhandled error during script execution:', error);
    process.exit(1);
  });
}

// Export for potential testing or reuse
export { processComment, CommentDetailsSchema, PackageFoxRequestSchema };
