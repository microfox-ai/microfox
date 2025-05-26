import { z } from 'zod';

export const GoogleDriveSDKOptionsSchema = z.object({
  clientId: z.string().describe('Google OAuth 2.0 client ID'),
  clientSecret: z.string().describe('Google OAuth 2.0 client secret'),
  redirectUri: z.string().url().describe('Authorized redirect URI'),
  accessToken: z.string().optional().describe('OAuth 2.0 access token'),
  refreshToken: z.string().optional().describe('OAuth 2.0 refresh token'),
  scopes: z.array(z.string()).optional().describe('OAuth 2.0 scopes'),
});

export type GoogleDriveSDKOptions = z.infer<typeof GoogleDriveSDKOptionsSchema>;

export const UserSchema = z.object({
  kind: z.string(),
  displayName: z.string(),
  photoLink: z.string().optional(),
  me: z.boolean(),
  permissionId: z.string(),
  emailAddress: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const AboutResponseSchema = z.object({
  kind: z.string(),
  storageQuota: z.object({
    limit: z.string().optional(),
    usage: z.string(),
    usageInDrive: z.string(),
    usageInDriveTrash: z.string(),
  }),
  user: UserSchema,
  maxUploadSize: z.string(),
  appInstalled: z.boolean(),
  folderColorPalette: z.array(z.string()),
  driveThemes: z.array(
    z.object({
      id: z.string(),
      backgroundImageLink: z.string(),
      colorRgb: z.string(),
    })
  ),
  canCreateDrives: z.boolean(),
  canCreateTeamDrives: z.boolean().optional(),
});

export type AboutResponse = z.infer<typeof AboutResponseSchema>;

export const RoleAndViewSchema = z.object({
  role: z.enum(['writer', 'commenter', 'reader']),
  view: z.string().optional(),
});

export type RoleAndView = z.infer<typeof RoleAndViewSchema>;

export const AccessProposalResponseSchema = z.object({
  fileId: z.string(),
  proposalId: z.string(),
  requesterEmailAddress: z.string(),
  recipientEmailAddress: z.string(),
  rolesAndViews: z.array(RoleAndViewSchema),
  requestMessage: z.string(),
  createTime: z.string(),
});

export type AccessProposalResponse = z.infer<typeof AccessProposalResponseSchema>;

export const AccessProposalsListResponseSchema = z.object({
  accessProposals: z.array(AccessProposalResponseSchema),
  nextPageToken: z.string().optional(),
});

export type AccessProposalsListResponse = z.infer<typeof AccessProposalsListResponseSchema>;

export const ResolveAccessProposalRequestSchema = z.object({
  role: z.array(z.string()).optional(),
  view: z.string().optional(),
  action: z.enum(['ACTION_UNSPECIFIED', 'ACCEPT', 'DENY']),
  sendNotification: z.boolean().optional(),
});

export type ResolveAccessProposalRequest = z.infer<typeof ResolveAccessProposalRequestSchema>;

export const AppResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  objectType: z.string(),
  openUrlTemplate: z.string().optional(),
  primaryMimeTypes: z.array(z.string()).optional(),
  secondaryMimeTypes: z.array(z.string()).optional(),
  primaryFileExtensions: z.array(z.string()).optional(),
  secondaryFileExtensions: z.array(z.string()).optional(),
  icons: z.array(
    z.object({
      category: z.string(),
      iconUrl: z.string(),
      size: z.number(),
    })
  ).optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  createInFolderTemplate: z.string().optional(),
  createUrl: z.string().optional(),
  useByDefault: z.boolean().optional(),
  installed: z.boolean(),
  authorized: z.boolean(),
  hasDriveWideScope: z.boolean(),
  productId: z.string().optional(),
});

export type AppResponse = z.infer<typeof AppResponseSchema>;

export const AppsListResponseSchema = z.object({
  kind: z.string(),
  apps: z.array(AppResponseSchema),
});

export type AppsListResponse = z.infer<typeof AppsListResponseSchema>;

// Add other type definitions here as needed for the remaining endpoints
