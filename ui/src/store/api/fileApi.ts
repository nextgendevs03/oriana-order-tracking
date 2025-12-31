/**
 * File Upload API
 *
 * RTK Query endpoints for S3 file upload using presigned URLs.
 * Supports staged upload workflow: pending -> confirmed.
 */

import { baseApi } from "./baseApi";

// ============================================================================
// Types
// ============================================================================

/**
 * Individual file info for presigned URL generation
 */
export interface FileUploadInfo {
  originalFileName: string;
  mimeType: string;
  fileSize: number;
}

/**
 * Request to generate presigned upload URLs
 */
export interface GeneratePresignedUrlsRequest {
  files: FileUploadInfo[];
  poId?: string;
  entityType?: string;
  entityId?: string;
}

/**
 * Response for presigned upload URL generation
 */
export interface PresignedUploadUrlResponse {
  fileId: number;
  originalFileName: string;
  uploadUrl: string;
  s3Key: string;
  expiresIn: number;
}

/**
 * Response for batch presigned URL generation
 */
export interface GeneratePresignedUrlsResponse {
  files: PresignedUploadUrlResponse[];
}

/**
 * Request to confirm uploaded files
 */
export interface ConfirmFilesRequest {
  fileIds: number[];
  entityType: string;
  entityId: string;
  poId?: string;
}

/**
 * File upload response
 */
export interface FileUploadResponse {
  fileId: number;
  originalFileName: string;
  storedFileName: string;
  mimeType: string;
  fileSize: number;
  s3Key: string;
  status: "pending" | "confirmed" | "deleted";
  entityType?: string;
  entityId?: string;
  poId?: string;
  uploadedBy: number;
  uploaderName?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response for file confirmation
 */
export interface ConfirmFilesResponse {
  confirmedCount: number;
  files: FileUploadResponse[];
}

/**
 * Response for presigned download URL
 */
export interface PresignedDownloadUrlResponse {
  fileId: number;
  originalFileName: string;
  downloadUrl: string;
  expiresIn: number;
}

/**
 * File list response
 */
export interface FileListResponse {
  data: FileUploadResponse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Request to list entity files
 */
export interface ListEntityFilesRequest {
  entityType: string;
  entityId: string;
  status?: "pending" | "confirmed" | "deleted";
  page?: number;
  limit?: number;
}

/**
 * Response for file deletion
 */
export interface DeleteFileResponse {
  fileId: number;
  deleted: boolean;
}

// ============================================================================
// API Wrapper Response Types
// ============================================================================

interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// API Endpoints
// ============================================================================

export const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Generate presigned upload URLs
     * Creates pending file records in database
     */
    generatePresignedUrls: builder.mutation<
      GeneratePresignedUrlsResponse,
      GeneratePresignedUrlsRequest
    >({
      query: (body) => ({
        url: "/files/presigned-urls",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<GeneratePresignedUrlsResponse>) =>
        response.data,
    }),

    /**
     * Confirm uploaded files and link to entity
     */
    confirmFiles: builder.mutation<ConfirmFilesResponse, ConfirmFilesRequest>({
      query: (body) => ({
        url: "/files/confirm",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<ConfirmFilesResponse>) =>
        response.data,
      invalidatesTags: ["File"],
    }),

    /**
     * Get presigned download URL for a file
     */
    getDownloadUrl: builder.query<PresignedDownloadUrlResponse, number>({
      query: (fileId) => ({
        url: `/files/${fileId}/download-url`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<PresignedDownloadUrlResponse>) =>
        response.data,
    }),

    /**
     * Get files for a specific entity
     */
    getEntityFiles: builder.query<FileListResponse, ListEntityFilesRequest>({
      query: ({ entityType, entityId, status, page = 1, limit = 20 }) => ({
        url: `/files/entity/${entityType}/${entityId}`,
        method: "GET",
        params: { status, page, limit },
      }),
      transformResponse: (response: ApiResponse<FileUploadResponse[]>) => ({
        data: response.data,
        pagination: response.pagination,
      }),
      providesTags: (result, _error, { entityType, entityId }) =>
        result
          ? [
              ...result.data.map(({ fileId }) => ({
                type: "File" as const,
                id: fileId,
              })),
              { type: "File", id: `${entityType}-${entityId}` },
            ]
          : [{ type: "File", id: `${entityType}-${entityId}` }],
    }),

    /**
     * Get all files for a PO
     */
    getPOFiles: builder.query<
      FileListResponse,
      { poId: string; page?: number; limit?: number }
    >({
      query: ({ poId, page = 1, limit = 20 }) => ({
        url: `/files/po/${poId}`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: ApiResponse<FileUploadResponse[]>) => ({
        data: response.data,
        pagination: response.pagination,
      }),
      providesTags: (result, _error, { poId }) =>
        result
          ? [
              ...result.data.map(({ fileId }) => ({
                type: "File" as const,
                id: fileId,
              })),
              { type: "File", id: `po-${poId}` },
            ]
          : [{ type: "File", id: `po-${poId}` }],
    }),

    /**
     * Get a single file by ID
     */
    getFileById: builder.query<FileUploadResponse, number>({
      query: (fileId) => ({
        url: `/files/${fileId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<FileUploadResponse>) =>
        response.data,
      providesTags: (_result, _error, fileId) => [{ type: "File", id: fileId }],
    }),

    /**
     * Delete a file (soft delete)
     */
    deleteFile: builder.mutation<DeleteFileResponse, number>({
      query: (fileId) => ({
        url: `/files/${fileId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<DeleteFileResponse>) =>
        response.data,
      invalidatesTags: (_result, _error, fileId) => [{ type: "File", id: fileId }],
    }),
  }),
});

// ============================================================================
// Export Hooks
// ============================================================================

export const {
  useGeneratePresignedUrlsMutation,
  useConfirmFilesMutation,
  useGetDownloadUrlQuery,
  useLazyGetDownloadUrlQuery,
  useGetEntityFilesQuery,
  useGetPOFilesQuery,
  useGetFileByIdQuery,
  useDeleteFileMutation,
} = fileApi;

// ============================================================================
// Helper Functions for Direct S3 Upload
// ============================================================================

/**
 * Upload a file directly to S3 using a presigned URL
 * Returns a promise that resolves when upload is complete
 */
export const uploadFileToS3 = async (
  file: File,
  uploadUrl: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed due to network error"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload was aborted"));
    });

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
};

/**
 * Upload multiple files to S3 in parallel
 */
export const uploadFilesToS3 = async (
  files: { file: File; uploadUrl: string }[],
  onFileProgress?: (index: number, progress: number) => void,
  onOverallProgress?: (progress: number) => void
): Promise<void[]> => {
  const totalFiles = files.length;
  const fileProgresses = new Array(totalFiles).fill(0);

  const updateOverallProgress = () => {
    if (onOverallProgress) {
      const totalProgress =
        fileProgresses.reduce((sum, p) => sum + p, 0) / totalFiles;
      onOverallProgress(Math.round(totalProgress));
    }
  };

  const uploadPromises = files.map(({ file, uploadUrl }, index) =>
    uploadFileToS3(file, uploadUrl, (progress) => {
      fileProgresses[index] = progress;
      if (onFileProgress) {
        onFileProgress(index, progress);
      }
      updateOverallProgress();
    })
  );

  return Promise.all(uploadPromises);
};

