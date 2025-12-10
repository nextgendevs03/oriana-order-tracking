import React from "react";
import { Upload, Button, Typography, message } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import type { UploadFile, RcFile } from "antd/es/upload/interface";

const { Text } = Typography;

export interface FileUploadProps {
  fileList: UploadFile[];
  onChange: (fileList: UploadFile[]) => void;
  minFiles?: number;
  maxFiles?: number;
  maxSizeMB?: number;
  label?: string;
  tooltip?: string;
  buttonLabel?: string;
  helperText?: string;
  acceptedTypes?: string;
  showFileSize?: boolean;
  disabled?: boolean;
}

// Default accepted file types
const DEFAULT_ACCEPTED_TYPES =
  ".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.pdf,.xlsx,.xls,.doc,.docx";

// Default accepted MIME types for validation
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

const FileUpload: React.FC<FileUploadProps> = ({
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
}) => {
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

  // Handle file upload validation
  const handleBeforeUpload = (file: RcFile) => {
    // Check file count
    if (fileList.length >= maxFiles) {
      message.error(`You can only upload a maximum of ${maxFiles} file${maxFiles > 1 ? "s" : ""}`);
      return Upload.LIST_IGNORE;
    }

    // Validate file type
    const isValidType = DEFAULT_MIME_TYPES.includes(file.type);
    if (!isValidType) {
      message.error("Invalid file type. Please upload images, PDF, Word, or Excel files.");
      return Upload.LIST_IGNORE;
    }

    // Check file size
    const isWithinSize = file.size / 1024 / 1024 < maxSizeMB;
    if (!isWithinSize) {
      message.error(`File must be smaller than ${maxSizeMB}MB`);
      return Upload.LIST_IGNORE;
    }

    return false; // Prevent automatic upload
  };

  // Handle file list change
  const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    onChange(newFileList.slice(0, maxFiles));
  };

  // Handle file removal
  const handleRemoveFile = (file: UploadFile) => {
    onChange(fileList.filter((f) => f.uid !== file.uid));
  };

  // Format file size for display
  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Compute full helper text with min/max files and size info
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
        disabled={disabled}
        itemRender={(_, file) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              border: "1px solid #f0f0f0",
              borderRadius: "6px",
              marginBottom: "8px",
              backgroundColor: "#fafafa",
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
              <Text ellipsis style={{ maxWidth: "300px" }}>
                {file.name}
              </Text>
              {showFileSize && file.size && (
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  ({formatFileSize(file.size)})
                </Text>
              )}
            </div>
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveFile(file)}
              disabled={disabled}
            />
          </div>
        )}
      >
        {fileList.length < maxFiles && !disabled && (
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
      {/* Show file count status */}
      {minFiles > 0 && (
        <Text
          type={isMinFilesMet ? "success" : "warning"}
          style={{ fontSize: "12px", marginTop: "4px", display: "block" }}
        >
          {fileList.length}/{minFiles} minimum files uploaded
          {isMinFilesMet ? " ✓" : ""}
        </Text>
      )}
      {helperText && (
        <Text type="secondary" style={{ fontSize: "12px", marginTop: "4px", display: "block" }}>
          {fullHelperText}
        </Text>
      )}
    </div>
  );
};

export default FileUpload;

