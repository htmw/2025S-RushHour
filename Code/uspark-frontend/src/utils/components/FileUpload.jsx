import React, { useEffect, useRef, useState } from "react";
import {
    Typography,
    Box,
    IconButton,
    Tooltip,
    Card,
    CardContent,
    CardActions,
    Avatar,
    Grid,
    CircularProgress,
    LinearProgress,
} from "@mui/material";
import { Download, InsertDriveFile, UploadFile, Visibility } from "@mui/icons-material";
import { api } from "../../store/apis";
import { useSelector } from "react-redux";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import ImageIcon from '@mui/icons-material/Image';
import TableChartIcon from '@mui/icons-material/TableChart';


const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();

    if (["png", "jpg", "jpeg", "gif"].includes(ext)) {
        return <ImageIcon sx={{ color: "#4caf50", fontSize: 25 }} />; // Green for images
    }

    if (ext === "pdf") {
        return <PictureAsPdfIcon sx={{ color: "#f44336", fontSize: 25 }} />; // Red for PDFs
    }

    if (["doc", "docx"].includes(ext)) {
        return <ArticleIcon sx={{ color: "#1976d2", fontSize: 25 }} />; // Blue for Word docs
    }

    if (["xls", "xlsx", "csv"].includes(ext)) {
        return <TableChartIcon sx={{ color: "#388e3c", fontSize: 25 }} />; // Green for Excel
    }

    return <InsertDriveFile sx={{ fontSize: 25 }} />;
};


const FileUpload = ({
    title = "Upload Files",
    fieldName = "medicalReport",
    uploadPath = "/api/medical-history/upload",
    signedUrlPath = "",
    onFilesChange,
    defaultFiles = [],

}) => {
    const inputRef = useRef();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth?.token);

    const handleUpload = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        const uploaded = [];

        setLoading(true);

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const formData = new FormData();
            formData.append(fieldName, file);

            try {
                const res = await api.post(uploadPath, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });

                uploaded.push({
                    fileUrl: res.data.fileUrl,
                    fileName: file.name,
                });
            } catch (err) {
                console.error("Upload failed for", file.name, err);
            }
        }

        const updated = [...files, ...uploaded];
        setFiles(updated);
        onFilesChange(updated);
        setLoading(false);

        if (inputRef.current) inputRef.current.value = "";
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
        if (signedUrl) window.open(signedUrl, "_blank");
    };

    const handleDownload = async (fileKey, fileName) => {
        const signedUrl = await getSignedUrl(fileKey);
        if (signedUrl) {
            const link = document.createElement("a");
            link.href = signedUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
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

            {/* Upload Area */}
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
                <input type="file" multiple hidden ref={inputRef} onChange={handleUpload} data-cy="medical-file-upload"
                />
            </Box>

            {/* Progress */}
            {loading && (
                <Box sx={{ mt: 2 }}>
                    <LinearProgress />
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Uploading...
                    </Typography>
                </Box>
            )}

            {/* File Preview */}
            <Grid container spacing={2} mt={2}>
                {files.map((file, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined" sx={{ display: "flex", alignItems: "center", p: 2 }}>
                            {getFileIcon(file.fileName)}
                            <Box sx={{ ml: 2, flexGrow: 1 }}>
                                <CardContent sx={{ py: 0 }}>
                                    <Typography variant="body2" noWrap>
                                        {file.fileName}
                                    </Typography>
                                </CardContent>
                                {
                                    signedUrlPath && <CardActions sx={{ p: 0 }}>
                                        <Tooltip title="View">
                                            <IconButton onClick={() => handleView(file.fileUrl)} size="small">
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Download">
                                            <IconButton
                                                onClick={() => handleDownload(file.fileUrl, file.fileName)}
                                                size="small"
                                            >
                                                <Download fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </CardActions>
                                }

                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default FileUpload;
