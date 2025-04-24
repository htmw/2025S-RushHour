import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Grid,
  LinearProgress,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  Download,
  InsertDriveFile,
  UploadFile,
  Visibility,
  Close,
} from "@mui/icons-material";
import { api } from "../../store/apis";
import { useSelector } from "react-redux";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import ImageIcon from "@mui/icons-material/Image";
import TableChartIcon from "@mui/icons-material/TableChart";

const getFileIcon = (fileName) => {
  const ext = fileName.split(".").pop().toLowerCase();
  if (["png", "jpg", "jpeg", "gif"].includes(ext))
    return <ImageIcon sx={{ color: "#4caf50", fontSize: 25 }} />;
  if (ext === "pdf")
    return <PictureAsPdfIcon sx={{ color: "#f44336", fontSize: 25 }} />;
  if (["doc", "docx"].includes(ext))
    return <ArticleIcon sx={{ color: "#1976d2", fontSize: 25 }} />;
  if (["xls", "xlsx", "csv"].includes(ext))
    return <TableChartIcon sx={{ color: "#388e3c", fontSize: 25 }} />;
  return <InsertDriveFile sx={{ fontSize: 25 }} />;
};

const FileUpload = ({
  title = "Upload Files",
  fieldName = "medicalReport",
  uploadPath = "/api/medical-history/upload",
  signedUrlPath = "",
  onFilesChange,
  defaultFiles = [],
  autoUpload = true,
  inputProps = {},
}) => {
  const inputRef = useRef();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const token = useSelector((state) => state.auth?.token);

  const handleUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    if (!autoUpload) {
      const fileObjects = selectedFiles.map((file) => ({
        fileObject: file,
        fileName: file.name,
      }));
      const updated = [...files, ...fileObjects];
      setFiles(updated);
      if (onFilesChange) onFilesChange(updated);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setLoading(true);
    const uploaded = [];

    for (let file of selectedFiles) {
      const formData = new FormData();
      formData.append(fieldName, file);

      try {
        const res = await api.post(uploadPath, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        uploaded.push({ fileUrl: res.data.fileUrl, fileName: file.name });
      } catch (err) {
        console.error("Upload failed for", file.name, err);
      }
    }

    const updated = [...files, ...uploaded];
    setFiles(updated);
    if (onFilesChange) onFilesChange(updated);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const getSignedUrl = async (fileKey) => {
    try {
      const res = await api.get(signedUrlPath, {
        params: { key: fileKey },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.url;
    } catch (err) {
      console.error("Failed to fetch signed URL", err);
      return null;
    }
  };

  const handleView = async (fileKey) => {
    const signedUrl = await getSignedUrl(fileKey);
    if (signedUrl) setPreviewUrl(signedUrl);
  };

  const handleDownload = async (fileKey) => {
    const signedUrl = await getSignedUrl(fileKey);
    if (signedUrl) window.open(signedUrl, "_blank");
  };

  const openFileDialog = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length) {
      handleUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  useEffect(() => {
    if (defaultFiles?.length) {
      setFiles(defaultFiles);
    }
  }, [defaultFiles]);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        {title}
      </Typography>

      {/* Upload Box */}
      <Box
        onClick={openFileDialog}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        sx={{
          border: "2px dashed #ccc",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: "#fafafa",
          transition: "all 0.2s",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "#f0faff",
          },
        }}
      >
        <UploadFile color="primary" fontSize="large" />
        <Typography variant="body2" mt={1}>
          Drag & drop files here or <strong>click to upload</strong>
        </Typography>
        <input
          type="file"
          multiple
          hidden
          ref={inputRef}
          onChange={handleUpload}
          {...inputProps}
        />
      </Box>

      {loading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={1}
          >
            Uploading...
          </Typography>
        </Box>
      )}

      <Grid container spacing={2} mt={2}>
        {files.map((file, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              variant="outlined"
              sx={{ display: "flex", alignItems: "center", p: 2 }}
            >
              {getFileIcon(file.fileName)}
              <Box sx={{ ml: 2, flexGrow: 1 }}>
                <CardContent sx={{ py: 0 }}>
                  <Typography variant="body2" noWrap>
                    {file.fileName}
                  </Typography>
                </CardContent>
                {signedUrlPath && (
                  <CardActions sx={{ p: 0 }}>
                    <Tooltip title="View">
                      <IconButton
                        onClick={() => handleView(file.fileUrl)}
                        size="small"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton
                        onClick={() => handleDownload(file.fileUrl)}
                        size="small"
                      >
                        <Download fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewUrl}
        onClose={() => setPreviewUrl(null)}
        fullWidth
        maxWidth="md"
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 2, pt: 1 }}>
          <IconButton onClick={() => setPreviewUrl(null)}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          {previewUrl?.endsWith(".pdf") ? (
            <iframe
              src={previewUrl}
              width="100%"
              height="600px"
              title="PDF Viewer"
            />
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "600px" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FileUpload;
