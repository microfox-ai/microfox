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
    }),
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

export type AccessProposalResponse = z.infer<
  typeof AccessProposalResponseSchema
>;

export const AccessProposalsListResponseSchema = z.object({
  accessProposals: z.array(AccessProposalResponseSchema),
  nextPageToken: z.string().optional(),
});

export type AccessProposalsListResponse = z.infer<
  typeof AccessProposalsListResponseSchema
>;

export const ResolveAccessProposalRequestSchema = z.object({
  role: z.array(z.string()).optional(),
  view: z.string().optional(),
  action: z.enum(['ACTION_UNSPECIFIED', 'ACCEPT', 'DENY']),
  sendNotification: z.boolean().optional(),
});

export type ResolveAccessProposalRequest = z.infer<
  typeof ResolveAccessProposalRequestSchema
>;

export const AppResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  objectType: z.string(),
  openUrlTemplate: z.string().optional(),
  primaryMimeTypes: z.array(z.string()).optional(),
  secondaryMimeTypes: z.array(z.string()).optional(),
  primaryFileExtensions: z.array(z.string()).optional(),
  secondaryFileExtensions: z.array(z.string()).optional(),
  icons: z
    .array(
      z.object({
        category: z.string(),
        iconUrl: z.string(),
        size: z.number(),
      }),
    )
    .optional(),
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

// Drive types
export const DriveCapabilitiesSchema = z.object({
  canAddChildren: z.boolean(),
  canComment: z.boolean(),
  canCopy: z.boolean(),
  canDeleteDrive: z.boolean(),
  canDownload: z.boolean(),
  canEdit: z.boolean(),
  canListChildren: z.boolean(),
  canManageMembers: z.boolean(),
  canReadRevisions: z.boolean(),
  canRename: z.boolean(),
  canRenameDrive: z.boolean(),
  canChangeDriveBackground: z.boolean(),
  canShare: z.boolean(),
  canChangeCopyRequiresWriterPermissionRestriction: z.boolean(),
  canChangeDomainUsersOnlyRestriction: z.boolean(),
  canChangeDriveMembersOnlyRestriction: z.boolean(),
  canChangeSharingFoldersRequiresOrganizerPermissionRestriction: z.boolean(),
  canResetDriveRestrictions: z.boolean(),
  canDeleteChildren: z.boolean(),
  canTrashChildren: z.boolean(),
});

export const DriveRestrictionsSchema = z.object({
  copyRequiresWriterPermission: z.boolean(),
  domainUsersOnly: z.boolean(),
  driveMembersOnly: z.boolean(),
  adminManagedRestrictions: z.boolean(),
  sharingFoldersRequiresOrganizerPermission: z.boolean(),
});

export const DriveResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  colorRgb: z.string().optional(),
  kind: z.string(),
  backgroundImageLink: z.string().optional(),
  capabilities: DriveCapabilitiesSchema,
  themeId: z.string().optional(),
  backgroundImageFile: z
    .object({
      id: z.string(),
      xCoordinate: z.number(),
      yCoordinate: z.number(),
      width: z.number(),
    })
    .optional(),
  createdTime: z.string(),
  hidden: z.boolean(),
  restrictions: DriveRestrictionsSchema.optional(),
  orgUnitId: z.string().optional(),
});

export type DriveResponse = z.infer<typeof DriveResponseSchema>;

export const DrivesListResponseSchema = z.object({
  kind: z.string(),
  nextPageToken: z.string().optional(),
  drives: z.array(DriveResponseSchema),
});

export type DrivesListResponse = z.infer<typeof DrivesListResponseSchema>;

export const DriveUpdateRequestSchema = z.object({
  name: z.string().optional(),
  colorRgb: z.string().optional(),
  themeId: z.string().optional(),
  backgroundImageFile: z
    .object({
      id: z.string(),
      xCoordinate: z.number(),
      yCoordinate: z.number(),
      width: z.number(),
    })
    .optional(),
  restrictions: DriveRestrictionsSchema.optional(),
});

export type DriveUpdateRequest = z.infer<typeof DriveUpdateRequestSchema>;

// Changes types
export const StartPageTokenResponseSchema = z.object({
  kind: z.string(),
  startPageToken: z.string(),
});

export type StartPageTokenResponse = z.infer<
  typeof StartPageTokenResponseSchema
>;

export const ChangeSchema = z.object({
  kind: z.string(),
  removed: z.boolean(),
  file: z.any().optional(), // File type would be defined separately
  fileId: z.string(),
  time: z.string(),
  driveId: z.string().optional(),
  type: z.string().optional(),
  teamDriveId: z.string().optional(),
  teamDrive: z.any().optional(), // TeamDrive type would be defined separately
  changeType: z.string(),
  drive: DriveResponseSchema.optional(),
});

export const ChangesListResponseSchema = z.object({
  kind: z.string(),
  newStartPageToken: z.string(),
  changes: z.array(ChangeSchema),
});

export type ChangesListResponse = z.infer<typeof ChangesListResponseSchema>;

export const ChannelSchema = z.object({
  id: z.string(),
  type: z.string(),
  address: z.string(),
  expiration: z.string().optional(),
  params: z.record(z.string()).optional(),
});

export const ChannelResponseSchema = z.object({
  kind: z.string(),
  id: z.string(),
  resourceId: z.string(),
  resourceUri: z.string(),
  token: z.string(),
  expiration: z.string(),
});

export type ChannelResponse = z.infer<typeof ChannelResponseSchema>;

// Add other type definitions here as needed for the remaining endpoints
