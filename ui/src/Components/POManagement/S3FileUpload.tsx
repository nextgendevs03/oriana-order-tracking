/**
 * S3FileUpload Component
 *
 * Enhanced file upload component that uploads files to S3 using presigned URLs.
 * Supports staged upload workflow:
 * 1. User selects files locally
 * 2. On form submit, files are uploaded to S3
 * 3. Files are confirmed and linked to an entity
 */

import React, { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { Upload, Button, Typography, Progress, Space } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileImageOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import { useToast } from "../../hooks/useToast";
import {
  useGeneratePresignedUrlsMutation,
  useConfirmFilesMutation,
  useLazyGetDownloadUrlQuery,
  uploadFileToS3,
  FileUploadInfo,
} from "../../store/api/fileApi";

const { Text } = Typography;

// ============================================================================
// Types
// ============================================================================

export interface S3FileUploadProps {
  /** Current file list */
  fileList: UploadFile[];
  /** Callback when file list changes */
  onChange: (fileList: UploadFile[]) => void;
  /** Minimum number of files required */
  minFiles?: number;
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Maximum file size in MB */
  maxSizeMB?: number;
  /** Label for the upload section */
  label?: string;
  /** Tooltip text */
  tooltip?: string;
  /** Button label */
  buttonLabel?: string;
  /** Helper text */
  helperText?: string;
  /** Accepted file types */
  acceptedTypes?: string;
  /** Show file size */
  showFileSize?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** PO ID for file organization */
  poId?: string;
  /** Entity type (dispatch, delivery, ppm, commissioning, warranty) */
  entityType?: string;
  /** Entity ID */
  entityId?: string;
}

export interface S3FileUploadRef {
  /**
   * Upload all pending files to S3 and confirm them
   * @param overrideParams - Optional parameters to override the component props (useful for CreatePO where poId is not known until after creation)
   * @returns Array of confirmed file IDs
   */
  uploadAndConfirm: (overrideParams?: { poId?: string; entityType?: string; entityId?: string }) => Promise<number[]>;
  /**
   * Check if upload is in progress
   */
  isUploading: boolean;
  /**
   * Get the list of files that have been uploaded (with fileIds)
   */
  getUploadedFileIds: () => number[];
}

interface FileUploadState {
  uid: string;
  fileId?: number;
  status: "pending" | "uploading" | "uploaded" | "confirmed" | "error";
  progress: number;
  error?: string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_ACCEPTED_TYPES =
  ".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.pdf,.xlsx,.xls,.doc,.docx";

const DEFAULT_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// ============================================================================
// Component
// ============================================================================

const S3FileUpload = forwardRef<S3FileUploadRef, S3FileUploadProps>(
  (
    {
      fileList,
      onChange,
      minFiles = 0,
      maxFiles = 10,
      maxSizeMB = 10,
      label,
      tooltip,
      buttonLabel = "Click to Upload",
      helperText = "Supported: Images (JPG, PNG, GIF, SVG), PDF, Word, Excel.",
      acceptedTypes = DEFAULT_ACCEPTED_TYPES,
      showFileSize = true,
      disabled = false,
      poId,
      entityType,
      entityId,
    },
    ref
  ) => {
    const toast = useToast();

    // RTK Query mutations
    const [generatePresignedUrls] = useGeneratePresignedUrlsMutation();
    const [confirmFiles] = useConfirmFilesMutation();
    const [getDownloadUrl] = useLazyGetDownloadUrlQuery();

    // Upload state tracking
    const [uploadStates, setUploadStates] = useState<Map<string, FileUploadState>>(
      new Map()
    );
    const [isUploading, setIsUploading] = useState(false);
    const [downloadingFileUid, setDownloadingFileUid] = useState<string | null>(null);

    // Check if minimum files requirement is met
    const isMinFilesMet = fileList.length >= minFiles;

    // Get file icon based on file extension
    const getFileIcon = (fileName: string) => {
      const ext = fileName.split(".").pop()?.toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext || "")) {
        return <FileImageOutlined style={{ color: "#52c41a" }} />;
      }
      if (ext === "pdf") {
        return <FilePdfOutlined style={{ color: "#ff4d4f" }} />;
      }
      if (["xlsx", "xls"].includes(ext || "")) {
        return <FileExcelOutlined style={{ color: "#52c41a" }} />;
      }
      if (["doc", "docx"].includes(ext || "")) {
        return <FileWordOutlined style={{ color: "#1890ff" }} />;
      }
      return <FileOutlined style={{ color: "#1890ff" }} />;
    };

    // Get status icon based on upload state
    const getStatusIcon = (state?: FileUploadState) => {
      if (!state) return null;

      switch (state.status) {
        case "uploading":
          return <LoadingOutlined style={{ color: "#1890ff" }} />;
        case "uploaded":
        case "confirmed":
          return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
        case "error":
          return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
        default:
          return null;
      }
    };

    // Handle file upload validation
    const handleBeforeUpload = (file: RcFile) => {
      if (fileList.length >= maxFiles) {
        toast.error(
          `You can only upload a maximum of ${maxFiles} file${maxFiles > 1 ? "s" : ""}`
        );
        return Upload.LIST_IGNORE;
      }

      const isValidType = DEFAULT_MIME_TYPES.includes(file.type);
      if (!isValidType) {
        toast.error("Invalid file type. Please upload images, PDF, Word, or Excel files.");
        return Upload.LIST_IGNORE;
      }

      const isWithinSize = file.size / 1024 / 1024 < maxSizeMB;
      if (!isWithinSize) {
        toast.error(`File must be smaller than ${maxSizeMB}MB`);
        return Upload.LIST_IGNORE;
      }

      // Initialize upload state for this file
      setUploadStates((prev) => {
        const newMap = new Map(prev);
        newMap.set(file.uid, {
          uid: file.uid,
          status: "pending",
          progress: 0,
        });
        return newMap;
      });

      return false; // Prevent automatic upload
    };

    // Handle file list change
    const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
      onChange(newFileList.slice(0, maxFiles));
    };

    // Handle file removal
    const handleRemoveFile = (file: UploadFile) => {
      onChange(fileList.filter((f) => f.uid !== file.uid));
      setUploadStates((prev) => {
        const newMap = new Map(prev);
        newMap.delete(file.uid);
        return newMap;
      });
    };

    // Handle file download (for existing files)
    const handleDownloadFile = async (file: UploadFile) => {
      // Extract file ID from uid (format: "existing-{fileId}")
      const fileIdMatch = file.uid.match(/^existing-(\d+)$/);
      if (!fileIdMatch) {
        toast.error("Cannot download new files before they are uploaded");
        return;
      }

      const fileId = parseInt(fileIdMatch[1], 10);
      setDownloadingFileUid(file.uid);

      try {
        const result = await getDownloadUrl(fileId).unwrap();
        // Open download URL in new tab
        window.open(result.downloadUrl, "_blank");
      } catch (error) {
        console.error("Download failed:", error);
        toast.error("Failed to download file");
      } finally {
        setDownloadingFileUid(null);
      }
    };

    // Check if file is an existing file (already uploaded)
    const isExistingFile = (file: UploadFile) => {
      return file.uid.startsWith("existing-");
    };

    // Format file size for display
    const formatFileSize = (size: number) => {
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Get list of uploaded file IDs
    const getUploadedFileIds = useCallback((): number[] => {
      const ids: number[] = [];
      uploadStates.forEach((state) => {
        if (state.fileId && (state.status === "uploaded" || state.status === "confirmed")) {
          ids.push(state.fileId);
        }
      });
      return ids;
    }, [uploadStates]);

    // Upload all pending files to S3 and confirm them
    const uploadAndConfirm = useCallback(async (overrideParams?: { poId?: string; entityType?: string; entityId?: string }): Promise<number[]> => {
      // Filter files that have originFileObj (new files to upload)
      const filesToUpload = fileList.filter((f) => f.originFileObj);

      if (filesToUpload.length === 0) {
        // Return existing file IDs if any
        return getUploadedFileIds();
      }

      // Use override params if provided, otherwise use component props
      const effectivePoId = overrideParams?.poId ?? poId;
      const effectiveEntityType = overrideParams?.entityType ?? entityType;
      const effectiveEntityId = overrideParams?.entityId ?? entityId;

      setIsUploading(true);

      try {
        // Prepare file info for presigned URL generation
        const fileInfos: FileUploadInfo[] = filesToUpload.map((f) => ({
          originalFileName: f.name,
          mimeType: f.originFileObj?.type || "application/octet-stream",
          fileSize: f.size || 0,
        }));

        // Generate presigned URLs
        const presignedResponse = await generatePresignedUrls({
          files: fileInfos,
          poId: effectivePoId,
          entityType: effectiveEntityType,
          entityId: effectiveEntityId,
        }).unwrap();

        // Validate presigned response
        if (!presignedResponse || !presignedResponse.files || !Array.isArray(presignedResponse.files)) {
          throw new Error("Invalid response from server. Please try again.");
        }

        if (presignedResponse.files.length !== filesToUpload.length) {
          throw new Error("Mismatch between uploaded files and server response.");
        }

        // Map file UIDs to presigned URL responses
        const uidToPresigned = new Map<string, (typeof presignedResponse.files)[0]>();
        filesToUpload.forEach((file, index) => {
          const presignedFile = presignedResponse.files[index];
          if (presignedFile) {
            uidToPresigned.set(file.uid, presignedFile);
          }
        });

        // Upload each file to S3
        const uploadPromises = filesToUpload.map(async (file) => {
          const presigned = uidToPresigned.get(file.uid);
          if (!presigned || !file.originFileObj) {
            throw new Error(`Missing presigned URL or file for ${file.name}`);
          }

          // Update state to uploading
          setUploadStates((prev) => {
            const newMap = new Map(prev);
            newMap.set(file.uid, {
              uid: file.uid,
              fileId: presigned.fileId,
              status: "uploading",
              progress: 0,
            });
            return newMap;
          });

          try {
            // Upload to S3
            await uploadFileToS3(
              file.originFileObj,
              presigned.uploadUrl,
              (progress) => {
                setUploadStates((prev) => {
                  const newMap = new Map(prev);
                  const state = newMap.get(file.uid);
                  if (state) {
                    newMap.set(file.uid, { ...state, progress });
                  }
                  return newMap;
                });
              }
            );

            // Update state to uploaded
            setUploadStates((prev) => {
              const newMap = new Map(prev);
              newMap.set(file.uid, {
                uid: file.uid,
                fileId: presigned.fileId,
                status: "uploaded",
                progress: 100,
              });
              return newMap;
            });

            return presigned.fileId;
          } catch (error) {
            // Update state to error
            setUploadStates((prev) => {
              const newMap = new Map(prev);
              newMap.set(file.uid, {
                uid: file.uid,
                fileId: presigned.fileId,
                status: "error",
                progress: 0,
                error: (error as Error).message,
              });
              return newMap;
            });
            throw error;
          }
        });

        // Wait for all uploads to complete
        const fileIds = await Promise.all(uploadPromises);

        // Confirm the files if entityType and entityId are provided
        if (effectiveEntityType && effectiveEntityId && fileIds.length > 0) {
          await confirmFiles({
            fileIds,
            entityType: effectiveEntityType,
            entityId: effectiveEntityId,
            poId: effectivePoId,
          }).unwrap();

          // Update states to confirmed
          setUploadStates((prev) => {
            const newMap = new Map(prev);
            newMap.forEach((state, uid) => {
              if (state.status === "uploaded") {
                newMap.set(uid, { ...state, status: "confirmed" });
              }
            });
            return newMap;
          });
        }

        toast.success(`Successfully uploaded ${fileIds.length} file(s)`);
        return fileIds;
      } catch (error) {
        toast.error(`Upload failed: ${(error as Error).message}`);
        throw error;
      } finally {
        setIsUploading(false);
      }
    }, [
      fileList,
      generatePresignedUrls,
      confirmFiles,
      poId,
      entityType,
      entityId,
      toast,
      getUploadedFileIds,
    ]);

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        uploadAndConfirm,
        isUploading,
        getUploadedFileIds,
      }),
      [uploadAndConfirm, isUploading, getUploadedFileIds]
    );

    // Compute full helper text
    const getFileLimitText = () => {
      if (minFiles > 0 && maxFiles > 1) {
        return `Upload ${minFiles}-${maxFiles} files.`;
      } else if (minFiles > 0) {
        return `Minimum ${minFiles} file${minFiles > 1 ? "s" : ""} required.`;
      }
      return "";
    };

    const fullHelperText = `${helperText}${maxSizeMB ? ` Max ${maxSizeMB}MB per file.` : ""} ${getFileLimitText()}`.trim();

    return (
      <div>
        {label && (
          <div style={{ marginBottom: 8 }}>
            <Text strong>{label}</Text>
            {tooltip && (
              <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                ({tooltip})
              </Text>
            )}
          </div>
        )}

        <Upload
          multiple
          fileList={fileList}
          beforeUpload={handleBeforeUpload}
          onChange={handleFileChange}
          onRemove={handleRemoveFile}
          accept={acceptedTypes}
          listType="text"
          disabled={disabled || isUploading}
          itemRender={(_, file) => {
            const state = uploadStates.get(file.uid);
            const isFileUploading = state?.status === "uploading";

            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  border: "1px solid #f0f0f0",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  backgroundColor:
                    state?.status === "error"
                      ? "#fff2f0"
                      : state?.status === "confirmed"
                        ? "#f6ffed"
                        : "#fafafa",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1,
                    overflow: "hidden",
                  }}
                >
                  {getFileIcon(file.name)}
                  <Text ellipsis style={{ maxWidth: "250px" }}>
                    {file.name}
                  </Text>
                  {showFileSize && file.size && (
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      ({formatFileSize(file.size)})
                    </Text>
                  )}
                  {getStatusIcon(state)}
                </div>

                <Space>
                  {isFileUploading && state?.progress !== undefined && (
                    <Progress
                      type="circle"
                      percent={state.progress}
                      size={24}
                      strokeWidth={10}
                    />
                  )}
                  {isExistingFile(file) && (
                    <Button
                      type="text"
                      size="small"
                      icon={downloadingFileUid === file.uid ? <LoadingOutlined /> : <DownloadOutlined />}
                      onClick={() => handleDownloadFile(file)}
                      disabled={disabled || isUploading || downloadingFileUid === file.uid}
                      title="Download file"
                      style={{ color: "#1890ff" }}
                    />
                  )}
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveFile(file)}
                    disabled={disabled || isUploading}
                    title="Remove file"
                  />
                </Space>
              </div>
            );
          }}
        >
          {fileList.length < maxFiles && !disabled && !isUploading && (
            <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
              {buttonLabel}
              {minFiles > 0 && maxFiles > 1
                ? ` (${minFiles}-${maxFiles} files)`
                : maxFiles > 1
                  ? ` (Max ${maxFiles} files)`
                  : ""}
            </Button>
          )}
        </Upload>

        {/* Uploading indicator */}
        {isUploading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <LoadingOutlined />
            <Text type="secondary">Uploading files to server...</Text>
          </div>
        )}

        {/* Show file count status */}
        {minFiles > 0 && !isUploading && (
          <Text
            type={isMinFilesMet ? "success" : "warning"}
            style={{ fontSize: "12px", marginTop: "4px", display: "block" }}
          >
            {fileList.length}/{minFiles} minimum files uploaded
            {isMinFilesMet ? " ✓" : ""}
          </Text>
        )}

        {helperText && !isUploading && (
          <Text
            type="secondary"
            style={{ fontSize: "12px", marginTop: "4px", display: "block" }}
          >
            {fullHelperText}
          </Text>
        )}
      </div>
    );
  }
);

S3FileUpload.displayName = "S3FileUpload";

export default S3FileUpload;

