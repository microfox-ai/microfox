import { z } from 'zod';
import {
  googleOAuthManager,
  GoogleOAuthOptions,
  Tokens,
} from '@microfox/google';

// Google Drive API base URL
const DRIVE_API_BASE_URL = 'https://www.googleapis.com/drive/v3';

// Drive SDK options schema using Zod for runtime validation
export const DriveSDKOptionsSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  scopes: z.array(z.string()).optional(),
});

export type DriveSDKOptions = z.infer<typeof DriveSDKOptionsSchema>;

// Define file resource schema
export const DriveFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string(),
  size: z.string().optional(),
  createdTime: z.string().optional(),
  modifiedTime: z.string().optional(),
  webViewLink: z.string().optional(),
  iconLink: z.string().optional(),
  thumbnailLink: z.string().optional(),
  parents: z.array(z.string()).optional(),
  webContentLink: z.string().optional(),
});

export type DriveFile = z.infer<typeof DriveFileSchema>;

// Custom error class for Drive SDK authentication issues
export class DriveAuthError extends Error {
  tokenStatus: Tokens;

  constructor(message: string, tokenStatus: Tokens) {
    super(message);
    this.name = 'DriveAuthError';
    this.tokenStatus = tokenStatus;
  }
}

/**
 * Creates a Drive SDK instance with token validation and refresh capabilities
 */
export const createDriveSDKWithTokens = async (options: DriveSDKOptions) => {
  // Validate options with Zod
  const parsedOptions = DriveSDKOptionsSchema.parse(options);

  // Default Google OAuth scopes for Drive if not provided
  const DEFAULT_DRIVE_SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.install',
  ];

  // Create Google OAuth options with scopes (use custom scopes if provided)
  const googleOAuthOptions: GoogleOAuthOptions = {
    accessToken: parsedOptions.accessToken,
    refreshToken: parsedOptions.refreshToken,
    clientId: parsedOptions.clientId,
    clientSecret: parsedOptions.clientSecret,
    scopes: parsedOptions.scopes || DEFAULT_DRIVE_SCOPES,
  };

  // Validate and refresh tokens if needed
  const tokenStatus = await googleOAuthManager(googleOAuthOptions);

  if (!tokenStatus.isValid) {
    throw new DriveAuthError(
      tokenStatus.errorMessage || 'Token validation failed',
      tokenStatus,
    );
  }

  // We now have a valid token, so we can create the Drive SDK
  const accessToken = tokenStatus.accessToken;

  // Helper to make authorized requests to the Drive API
  const makeRequest = async (
    endpoint: string,
    method: string = 'GET',
    body?: any,
    contentType: string = 'application/json',
    params: Record<string, string> = {},
  ) => {
    // Build URL with query parameters
    const url = new URL(`${DRIVE_API_BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // Set up request options
    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    // Add body if provided
    if (body) {
      if (body instanceof FormData) {
        // If body is FormData, don't set Content-Type, browser will set it with boundary
        options.body = body;
      } else {
        options.headers = {
          ...options.headers,
          'Content-Type': contentType,
        };
        options.body =
          contentType === 'application/json' ? JSON.stringify(body) : body;
      }
    }

    // Make the request
    const response = await fetch(url.toString(), options);

    // Handle errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `API request failed: ${response.statusText}`,
      );
    }

    // Return JSON response for non-blob requests
    if (contentType !== 'blob') {
      return await response.json();
    }

    // Return blob for blob requests
    return await response.blob();
  };

  // Define the createFile function first
  const createFile = async (options: {
    name: string;
    mimeType?: string;
    content?: string | Blob | ArrayBuffer;
    parents?: string[];
    fields?: string;
  }) => {
    const {
      name,
      mimeType = 'application/json',
      content,
      parents,
      fields,
    } = options;

    const metadata = {
      name,
      mimeType,
      ...(parents && { parents }),
    };

    let response;

    if (!content) {
      // Simple metadata-only upload (for creating empty files or folders)
      response = await makeRequest('/files', 'POST', metadata);
    } else {
      // Convert metadata to JSON string
      const metadataStr = JSON.stringify(metadata);

      // Create the multipart body manually following Google's API requirements
      // See: https://developers.google.com/drive/api/guides/manage-uploads#multipart
      const boundary =
        '----WebKitFormBoundary' + Math.random().toString(16).substring(2);

      let requestBody;

      if (typeof content === 'string') {
        const blob = new Blob([content], { type: mimeType });
        requestBody = createMultipartBody(boundary, metadataStr, blob);
      } else if (content instanceof Blob) {
        requestBody = createMultipartBody(boundary, metadataStr, content);
      } else if (content instanceof ArrayBuffer) {
        const blob = new Blob([content], { type: mimeType });
        requestBody = createMultipartBody(boundary, metadataStr, blob);
      } else {
        throw new Error('Unsupported content type');
      }

      // Use multipart upload endpoint with correct Content-Type header
      const params: Record<string, string> = { uploadType: 'multipart' };
      if (fields) {
        params.fields = fields;
      }

      // Make the request with the correct Content-Type header
      const url = new URL(`${DRIVE_API_BASE_URL}/files`);
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `API request failed: ${response.statusText}`,
        );
      }

      // Parse the response
      const responseData = await response.json();
      return DriveFileSchema.parse(responseData);
    }

    return DriveFileSchema.parse(response);
  };

  // Define the listFiles function
  const listFiles = async (
    options: {
      pageSize?: number;
      query?: string;
      fields?: string;
      orderBy?: string;
      pageToken?: string;
    } = {},
  ) => {
    const {
      pageSize = 100,
      query = '',
      fields = 'id,name,mimeType,size,createdTime,modifiedTime,webViewLink,webContentLink,iconLink,thumbnailLink,parents',
      orderBy = 'folder,name',
      pageToken,
    } = options;

    // Ensure we don't have nested fields structure and only include what's needed
    // The fields parameter should be prefixed with "files(" and suffixed with ")"
    // Only if it's not already formatted that way
    const formattedFields = fields.includes('files(')
      ? fields
      : `nextPageToken,files(${fields})`;

    const params: Record<string, string> = {
      pageSize: pageSize.toString(),
      fields: formattedFields,
      orderBy,
    };

    if (query) {
      params.q = query;
    }

    if (pageToken) {
      params.pageToken = pageToken;
    }

    return makeRequest('/files', 'GET', undefined, 'application/json', params);
  };

  // Return the Drive SDK object with methods
  return {
    /**
     * Returns token status information
     */
    getTokenStatus: () => tokenStatus,

    /**
     * Lists files and folders in Google Drive with optional filtering
     */
    listFiles,

    /**
     * Gets metadata for a single file
     */
    getFile: async (fileId: string, fields?: string) => {
      const params: Record<string, string> = {};

      if (fields) {
        params.fields = fields;
      }

      const data = await makeRequest(
        `/files/${fileId}`,
        'GET',
        undefined,
        'application/json',
        params,
      );
      return DriveFileSchema.parse(data);
    },

    /**
     * Downloads a file from Google Drive
     */
    downloadFile: async (fileId: string) => {
      return makeRequest(
        `/files/${fileId}?alt=media`,
        'GET',
        undefined,
        'blob',
      );
    },

    /**
     * Creates a new file or folder in Google Drive
     */
    createFile,

    /**
     * Updates an existing file in Google Drive
     */
    updateFile: async (
      fileId: string,
      options: {
        name?: string;
        mimeType?: string;
        content?: string | Blob | ArrayBuffer;
        addParents?: string[];
        removeParents?: string[];
        fields?: string;
      },
    ) => {
      const { name, mimeType, content, addParents, removeParents, fields } =
        options;

      const metadata: Record<string, any> = {};
      if (name) metadata.name = name;
      if (mimeType) metadata.mimeType = mimeType;

      const params: Record<string, string> = {};
      if (addParents) params.addParents = addParents.join(',');
      if (removeParents) params.removeParents = removeParents.join(',');
      if (fields) params.fields = fields;

      let response;

      if (!content) {
        // Metadata-only update
        response = await makeRequest(
          `/files/${fileId}`,
          'PATCH',
          metadata,
          'application/json',
          params,
        );
      } else {
        // Multipart upload for updating content and metadata
        const formData = new FormData();

        // Add metadata part
        const metadataBlob = new Blob([JSON.stringify(metadata)], {
          type: 'application/json',
        });
        formData.append('metadata', metadataBlob);

        // Add content part
        if (typeof content === 'string') {
          formData.append(
            'file',
            new Blob([content], {
              type: mimeType || 'application/octet-stream',
            }),
          );
        } else if (content instanceof Blob) {
          formData.append('file', content);
        } else if (content instanceof ArrayBuffer) {
          formData.append(
            'file',
            new Blob([content], {
              type: mimeType || 'application/octet-stream',
            }),
          );
        }

        // Use multipart upload endpoint
        params.uploadType = 'multipart';

        response = await makeRequest(
          `/files/${fileId}`,
          'PATCH',
          formData,
          'multipart/form-data',
          params,
        );
      }

      return DriveFileSchema.parse(response);
    },

    /**
     * Deletes a file or folder from Google Drive
     */
    deleteFile: async (fileId: string) => {
      await makeRequest(`/files/${fileId}`, 'DELETE');
      return true;
    },

    /**
     * Creates a folder in Google Drive
     */
    createFolder: async (options: {
      name: string;
      parents?: string[];
      fields?: string;
    }) => {
      return createFile({
        ...options,
        mimeType: 'application/vnd.google-apps.folder',
      });
    },

    /**
     * Copies a file in Google Drive
     */
    copyFile: async (
      fileId: string,
      options?: {
        name?: string;
        parents?: string[];
        fields?: string;
      },
    ) => {
      const { name, parents, fields } = options || {};

      const metadata: Record<string, any> = {};
      if (name) metadata.name = name;
      if (parents) metadata.parents = parents;

      const params: Record<string, string> = {};
      if (fields) params.fields = fields;

      const response = await makeRequest(
        `/files/${fileId}/copy`,
        'POST',
        metadata,
        'application/json',
        params,
      );
      return DriveFileSchema.parse(response);
    },

    /**
     * Searches for files in Google Drive using a query
     */
    searchFiles: async (
      query: string,
      options?: {
        pageSize?: number;
        fields?: string;
        orderBy?: string;
        pageToken?: string;
      },
    ) => {
      return listFiles({
        ...options,
        query,
      });
    },

    /**
     * Lists all permissions for a file
     */
    listPermissions: async (
      fileId: string,
      options?: {
        fields?: string;
        pageToken?: string;
      },
    ) => {
      const { fields, pageToken } = options || {};

      const params: Record<string, string> = {};
      if (fields) params.fields = fields;
      if (pageToken) params.pageToken = pageToken;

      return makeRequest(
        `/files/${fileId}/permissions`,
        'GET',
        undefined,
        'application/json',
        params,
      );
    },

    /**
     * Creates a new permission for a file
     */
    createPermission: async (
      fileId: string,
      options: {
        role: string;
        type: string;
        emailAddress?: string;
        domain?: string;
        allowFileDiscovery?: boolean;
        sendNotificationEmail?: boolean;
        emailMessage?: string;
        transferOwnership?: boolean;
        moveToNewOwnersRoot?: boolean;
        fields?: string;
      },
    ) => {
      const {
        role,
        type,
        emailAddress,
        domain,
        allowFileDiscovery,
        sendNotificationEmail,
        emailMessage,
        transferOwnership,
        moveToNewOwnersRoot,
        fields,
      } = options;

      const metadata: Record<string, any> = { role, type };
      if (emailAddress) metadata.emailAddress = emailAddress;
      if (domain) metadata.domain = domain;
      if (allowFileDiscovery !== undefined)
        metadata.allowFileDiscovery = allowFileDiscovery;

      const params: Record<string, string> = {};
      if (sendNotificationEmail !== undefined)
        params.sendNotificationEmail = sendNotificationEmail.toString();
      if (emailMessage) params.emailMessage = emailMessage;
      if (transferOwnership !== undefined)
        params.transferOwnership = transferOwnership.toString();
      if (moveToNewOwnersRoot !== undefined)
        params.moveToNewOwnersRoot = moveToNewOwnersRoot.toString();
      if (fields) params.fields = fields;

      return makeRequest(
        `/files/${fileId}/permissions`,
        'POST',
        metadata,
        'application/json',
        params,
      );
    },

    /**
     * Deletes a permission from a file
     */
    deletePermission: async (fileId: string, permissionId: string) => {
      await makeRequest(
        `/files/${fileId}/permissions/${permissionId}`,
        'DELETE',
      );
      return true;
    },

    /**
     * Creates a comment on a file
     */
    createComment: async (
      fileId: string,
      content: string,
      options?: {
        fields?: string;
        quotedText?: string;
      },
    ) => {
      const { fields, quotedText } = options || {};

      const metadata: Record<string, any> = { content };
      if (quotedText) metadata.quotedText = quotedText;

      const params: Record<string, string> = {};
      if (fields) params.fields = fields;

      return makeRequest(
        `/files/${fileId}/comments`,
        'POST',
        metadata,
        'application/json',
        params,
      );
    },

    /**
     * Lists comments on a file
     */
    listComments: async (
      fileId: string,
      options?: {
        pageSize?: number;
        fields?: string;
        pageToken?: string;
        startModifiedTime?: string;
        includeDeleted?: boolean;
      },
    ) => {
      const { pageSize, fields, pageToken, startModifiedTime, includeDeleted } =
        options || {};

      const params: Record<string, string> = {};
      if (pageSize) params.pageSize = pageSize.toString();
      if (fields) params.fields = fields;
      if (pageToken) params.pageToken = pageToken;
      if (startModifiedTime) params.startModifiedTime = startModifiedTime;
      if (includeDeleted !== undefined)
        params.includeDeleted = includeDeleted.toString();

      return makeRequest(
        `/files/${fileId}/comments`,
        'GET',
        undefined,
        'application/json',
        params,
      );
    },

    /**
     * Gets a specific comment on a file
     */
    getComment: async (
      fileId: string,
      commentId: string,
      options?: { fields?: string; includeDeleted?: boolean },
    ) => {
      const { fields, includeDeleted } = options || {};

      const params: Record<string, string> = {};
      if (fields) params.fields = fields;
      if (includeDeleted !== undefined)
        params.includeDeleted = includeDeleted.toString();

      return makeRequest(
        `/files/${fileId}/comments/${commentId}`,
        'GET',
        undefined,
        'application/json',
        params,
      );
    },

    /**
     * Lists revisions of a file
     */
    listRevisions: async (
      fileId: string,
      options?: {
        pageSize?: number;
        fields?: string;
        pageToken?: string;
      },
    ) => {
      const { pageSize, fields, pageToken } = options || {};

      const params: Record<string, string> = {};
      if (pageSize) params.pageSize = pageSize.toString();
      if (fields) params.fields = fields;
      if (pageToken) params.pageToken = pageToken;

      return makeRequest(
        `/files/${fileId}/revisions`,
        'GET',
        undefined,
        'application/json',
        params,
      );
    },

    /**
     * Gets user info for the authenticated user
     */
    getUserInfo: async () => {
      return makeRequest('/about', 'GET', undefined, 'application/json', {
        fields: 'user',
      });
    },
  };
};

/**
 * Creates a Drive SDK instance from access token and optional refresh token
 */
export const createDriveSDK = (
  accessToken: string,
  refreshToken?: string,
  clientId?: string,
  clientSecret?: string,
  scopes?: string[],
) => {
  return createDriveSDKWithTokens({
    accessToken,
    refreshToken,
    clientId,
    clientSecret,
    scopes,
  });
};

export default createDriveSDK;

/**
 * Creates a multipart request body for file upload
 * @param boundary The boundary string for separating parts
 * @param metadata The file metadata as JSON string
 * @param file The file content as Blob
 * @returns A Blob containing the multipart request body
 */
function createMultipartBody(
  boundary: string,
  metadata: string,
  file: Blob,
): Blob {
  const metadataPart =
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    metadata +
    '\r\n';

  const fileContentType = file.type || 'application/octet-stream';

  const filePart =
    `--${boundary}\r\n` + `Content-Type: ${fileContentType}\r\n\r\n`;

  const endBoundary = `\r\n--${boundary}--\r\n`;

  // Create separate blobs and combine them to ensure correct formatting
  const metadataPartBlob = new Blob([metadataPart], { type: 'text/plain' });
  const filePartBlob = new Blob([filePart], { type: 'text/plain' });
  const endBoundaryBlob = new Blob([endBoundary], { type: 'text/plain' });

  // Return the combined multipart body
  return new Blob([metadataPartBlob, filePartBlob, file, endBoundaryBlob], {
    type: `multipart/related; boundary=${boundary}`,
  });
}
