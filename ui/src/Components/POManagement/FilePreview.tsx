/**
 * FilePreview Component
 *
 * Displays uploaded files as clickable icons with file type indicators.
 * Clicking on a file opens it in a new tab using a presigned download URL.
 */

import React, { useState } from "react";
import { Tooltip, Spin, Typography, message } from "antd";
import {
  FileOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileImageOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useLazyGetDownloadUrlQuery } from "../../store/api/fileApi";

const { Text } = Typography;

// ============================================================================
// Types
// ============================================================================

export interface FilePreviewItem {
  fileId: number;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
}

export interface FilePreviewProps {
  /** Array of files to display */
  files: FilePreviewItem[];
  /** Layout direction */
  direction?: "horizontal" | "vertical";
  /** Show file names below icons */
  showFileNames?: boolean;
  /** Maximum number of files to show (rest shown as +N) */
  maxVisible?: number;
  /** Icon size */
  iconSize?: number;
  /** Gap between items */
  gap?: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get file icon based on MIME type
 */
const getFileIcon = (
  mimeType: string,
  size: number = 24
): React.ReactElement => {
  const style = { fontSize: size };

  if (mimeType.startsWith("image/")) {
    return <FileImageOutlined style={{ ...style, color: "#52c41a" }} />;
  }
  if (mimeType === "application/pdf") {
    return <FilePdfOutlined style={{ ...style, color: "#ff4d4f" }} />;
  }
  if (
    mimeType === "application/vnd.ms-excel" ||
    mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return <FileExcelOutlined style={{ ...style, color: "#52c41a" }} />;
  }
  if (
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return <FileWordOutlined style={{ ...style, color: "#1890ff" }} />;
  }
  return <FileOutlined style={{ ...style, color: "#8c8c8c" }} />;
};

/**
 * Get file type label from MIME type
 */
const getFileTypeLabel = (mimeType: string): string => {
  if (mimeType.startsWith("image/")) {
    return "Image";
  }
  if (mimeType === "application/pdf") {
    return "PDF";
  }
  if (
    mimeType === "application/vnd.ms-excel" ||
    mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return "Excel";
  }
  if (
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "Word";
  }
  return "Document";
};

/**
 * Format file size for display
 */
const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

// ============================================================================
// File Icon Component
// ============================================================================

interface FileIconProps {
  file: FilePreviewItem;
  showFileName?: boolean;
  iconSize?: number;
}

const FileIcon: React.FC<FileIconProps> = ({
  file,
  showFileName = false,
  iconSize = 24,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [getDownloadUrl] = useLazyGetDownloadUrlQuery();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const result = await getDownloadUrl(file.fileId).unwrap();
      // Open in new tab
      window.open(result.downloadUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      message.error("Failed to get download link");
      console.error("Download URL error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tooltipContent = (
    <div style={{ maxWidth: 200 }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{file.originalFileName}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
        <div>{getFileTypeLabel(file.mimeType)}</div>
        <div>{formatFileSize(file.fileSize)}</div>
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 11,
          color: "rgba(255,255,255,0.65)",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <EyeOutlined /> Click to view
      </div>
    </div>
  );

  return (
    <Tooltip title={tooltipContent} placement="top">
      <div
        onClick={handleClick}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          padding: "8px",
          borderRadius: "6px",
          transition: "all 0.2s ease",
          backgroundColor: isLoading ? "#f5f5f5" : "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f5f5f5";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isLoading ? "#f5f5f5" : "transparent";
        }}
      >
        {isLoading ? (
          <Spin size="small" />
        ) : (
          <>
            <div
              style={{
                width: iconSize + 16,
                height: iconSize + 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
                border: "1px solid #f0f0f0",
              }}
            >
              {getFileIcon(file.mimeType, iconSize)}
            </div>
            {showFileName && (
              <Text
                ellipsis
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  maxWidth: iconSize + 24,
                  textAlign: "center",
                }}
              >
                {file.originalFileName}
              </Text>
            )}
          </>
        )}
      </div>
    </Tooltip>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const FilePreview: React.FC<FilePreviewProps> = ({
  files,
  direction = "horizontal",
  showFileNames = false,
  maxVisible = 5,
  iconSize = 24,
  gap = 8,
}) => {
  const [showAll, setShowAll] = useState(false);

  if (!files || files.length === 0) {
    return (
      <Text type="secondary" style={{ fontSize: 12 }}>
        No files uploaded
      </Text>
    );
  }

  const visibleFiles = showAll ? files : files.slice(0, maxVisible);
  const hiddenCount = files.length - maxVisible;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction === "horizontal" ? "row" : "column",
        flexWrap: direction === "horizontal" ? "wrap" : "nowrap",
        gap,
        alignItems: direction === "horizontal" ? "flex-start" : "stretch",
      }}
    >
      {visibleFiles.map((file) => (
        <FileIcon
          key={file.fileId}
          file={file}
          showFileName={showFileNames}
          iconSize={iconSize}
        />
      ))}

      {hiddenCount > 0 && !showAll && (
        <Tooltip title={`Show ${hiddenCount} more file${hiddenCount > 1 ? "s" : ""}`}>
          <div
            onClick={() => setShowAll(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: iconSize + 16,
              height: iconSize + 16,
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              color: "#666",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e6e6e6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
            }}
          >
            +{hiddenCount}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

// ============================================================================
// Download Button Component (Alternative)
// ============================================================================

export interface FileDownloadButtonProps {
  file: FilePreviewItem;
  showIcon?: boolean;
  showLabel?: boolean;
}

export const FileDownloadButton: React.FC<FileDownloadButtonProps> = ({
  file,
  showIcon = true,
  showLabel = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [getDownloadUrl] = useLazyGetDownloadUrlQuery();

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const result = await getDownloadUrl(file.fileId).unwrap();
      window.open(result.downloadUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      message.error("Failed to get download link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip title={file.originalFileName}>
      <span
        onClick={handleDownload}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          cursor: "pointer",
          color: "#1890ff",
          padding: "2px 6px",
          borderRadius: 4,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f0f8ff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        {isLoading ? (
          <Spin size="small" />
        ) : (
          <>
            {showIcon && getFileIcon(file.mimeType, 16)}
            {showLabel && (
              <Text
                ellipsis
                style={{
                  maxWidth: 120,
                  fontSize: 12,
                  color: "#1890ff",
                }}
              >
                {file.originalFileName}
              </Text>
            )}
            <DownloadOutlined style={{ fontSize: 12 }} />
          </>
        )}
      </span>
    </Tooltip>
  );
};

export default FilePreview;

