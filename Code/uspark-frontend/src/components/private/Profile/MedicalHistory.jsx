/**
 * @file MedicalHistory Component
 *
 * @namespace src.components.private.profile.MedicalHistory
 * @memberof src.components.private.profile
 *
 * This component manages the patient's medical history records. It supports
 * adding, editing, and displaying past medical records along with attachments.
 * Users can view treatment details, dates, and download attached medical files.
 * It integrates with Redux for state management and dispatches create actions.
 */

import React, { useState, useEffect } from "react";
import {
    Typography,
    Paper,
    Button,
    Stack,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import { Edit, Delete, Download } from "@mui/icons-material";
import ResponsiveField from "../../../utils/components/ResponsiveField.jsx";
import FileUpload from "../../../utils/components/FileUpload.jsx";
import { createMedicalHistory } from "../../../store/actions/index.js";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import ImageIcon from '@mui/icons-material/Image';
import TableChartIcon from '@mui/icons-material/TableChart';

const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();

    if (["png", "jpg", "jpeg", "gif"].includes(ext)) {
        return <ImageIcon sx={{ color: "#4caf50" }} />;
    }

    if (ext === "pdf") {
        return <PictureAsPdfIcon sx={{ color: "#f44336" }} />;
    }

    if (["doc", "docx"].includes(ext)) {
        return <ArticleIcon sx={{ color: "#1976d2" }} />;
    }

    if (["xls", "xlsx", "csv"].includes(ext)) {
        return <TableChartIcon sx={{ color: "#388e3c" }} />;
    }

    return <InsertDriveFile />;
};


/**
 * MedicalHistory Component
 *
 * @memberof src.components.private.profile.MedicalHistory
 *
 * @returns {JSX.Element} - A complete interface for users to manage and review
 * their medical history, including details like diagnosis, treatment, and
 * supporting attachments. Includes a form dialog for creating or editing entries.
 *
 * @example
 * <MedicalHistory />
 */

const MedicalHistory = ({ }) => {
    const medicalHistories = useSelector((state) => state.medicalHistory?.histories || []);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [formData, setFormData] = useState({
        healthIssue: "",
        dateOfOccurrence: "",
        status: "",
        treatmentGiven: "",
        diagnosedBy: "",
        diagnosedAt: "",
        insuranceUsed: "",
        prescriptionDetails: "",
        notes: "",
        followUpDate: "",
        durationOfTreatment: "",
        referredBy: "",
        attachments: [],
    });

    const handleOpen = (index = null) => {
        if (index !== null) {
            setFormData({
                ...medicalHistories[index],
                attachments: medicalHistories[index].attachments.map((url) =>
                    typeof url === "string"
                        ? { fileUrl: url, fileName: url.split("/").pop() }
                        : url
                ),
            });
            setEditIndex(index);
        } else {
            setFormData({
                healthIssue: "",
                dateOfOccurrence: "",
                status: "",
                treatmentGiven: "",
                diagnosedBy: "",
                diagnosedAt: "",
                insuranceUsed: "",
                prescriptionDetails: "",
                notes: "",
                followUpDate: "",
                durationOfTreatment: "",
                referredBy: "",
                attachments: [],
            });
            setEditIndex(null);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAttachmentsChange = (files) => {
        setFormData({ ...formData, attachments: files });
    };

    const handleSave = () => {
        const payload = {
            ...formData,
            attachments: formData.attachments.map(file => file.fileUrl),
        };
        dispatch(createMedicalHistory(payload));
        setOpen(false);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom data-cy="Medical-History">
                Medical History
            </Typography>
            <Button variant="contained" color="secondary" sx={{
                mt: "10px"
            }} onClick={() => handleOpen()} data-cy="Add-Medical-History">
                Add Medical History
            </Button>

            <Table sx={{ mt: 2 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Health Issue</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Treatment</TableCell>
                        <TableCell>Attachments</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {medicalHistories.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.healthIssue}</TableCell>
                            <TableCell>{moment(item.dateOfOccurrence).format("YYYY-MM-DD")}</TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell>{item.treatmentGiven}</TableCell>
                            {/* <TableCell>
                                {item.attachments?.map((file, i) => (
                                    <Tooltip title={file.comment || "Download"} key={i}>
                                        <IconButton
                                            href={file.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download />
                                        </IconButton>
                                    </Tooltip>
                                ))}
                            </TableCell> */}
                            <TableCell>
                                <Stack direction="row" spacing={1}>
                                    {item.attachments?.map((url, i) => {
                                        const fileName = url.split("/").pop();
                                        return (
                                            <Tooltip title={fileName} key={i}>
                                                <IconButton
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {getFileIcon(fileName)}
                                                </IconButton>
                                            </Tooltip>
                                        );
                                    })}
                                </Stack>
                            </TableCell>


                            <TableCell>
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => handleOpen(index)}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{editIndex !== null ? "Edit" : "Add"} Medical History</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <ResponsiveField
                            label="Health Issue"
                            name="healthIssue"
                            required
                            value={formData.healthIssue}
                            onChange={handleChange}
                            inputProps={{ "data-cy": "medical-healthIssue" }}

                        />
                        <ResponsiveField
                            label="Date of Occurrence"
                            name="dateOfOccurrence"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            required
                            value={formData.dateOfOccurrence}
                            onChange={handleChange}
                            inputProps={{ "data-cy": "medical-dateOfOccurrence" }}

                        />
                        <ResponsiveField
                            label="Status"
                            name="status"
                            required
                            select
                            value={formData.status}
                            onChange={handleChange}
                            options={[
                                { value: "ongoing", label: "Ongoing" },
                                { value: "resolved", label: "Resolved" },
                            ]}
                            inputProps={{ "data-cy": "medical-status" }}

                        />
                        <ResponsiveField
                            label="Treatment Given"
                            name="treatmentGiven"
                            required
                            value={formData.treatmentGiven}
                            onChange={handleChange}
                            inputProps={{ "data-cy": "medical-treatmentGiven" }}

                        />
                        <ResponsiveField
                            label="Diagnosed By"
                            name="diagnosedBy"
                            value={formData.diagnosedBy}
                            onChange={handleChange}
                            inputProps={{ "data-cy": "medical-diagnosedBy" }}

                        />
                        <ResponsiveField
                            label="Diagnosed At"
                            name="diagnosedAt"
                            value={formData.diagnosedAt}
                            onChange={handleChange}
                            inputProps={{ "data-cy": "medical-diagnosedAt" }}

                        />
                        <ResponsiveField
                            label="Insurance Used"
                            name="insuranceUsed"
                            value={formData.insuranceUsed}
                            onChange={handleChange}
                            inputProps={{ "data-cy": "medical-insuranceUsed" }}

                        />
                        <ResponsiveField
                            label="Prescription Details"
                            name="prescriptionDetails"
                            value={formData.prescriptionDetails}
                            onChange={handleChange}
                            inputProps={{ "data-cy": "medical-prescriptionDetails" }}

                        />
                        <ResponsiveField
                            label="Doctor/Patient Notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            inputProps={{ "data-cy": "medical-notes" }}

                        />
                        <ResponsiveField
                            label="Follow-up Date"
                            name="followUpDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formData.followUpDate}
                            onChange={handleChange}
                            inputProps={{ "data-cy": "medical-date" }}

                        />
                        <ResponsiveField
                            label="Duration of Treatment"
                            name="durationOfTreatment"
                            value={formData.durationOfTreatment}
                            onChange={handleChange}
                            inputProps={{ "data-cy": "medical-durationOfTreatment" }}

                        />
                        <ResponsiveField
                            label="Referred By"
                            name="referredBy"
                            value={formData.referredBy}
                            onChange={handleChange}
                            inputProps={{ "data-cy": "medical-referredBy" }}

                        />
                        <FileUpload
                            title="Medical Attachments"
                            fieldName="medicalReport"
                            uploadPath="/api/medical-history/upload"
                            signedUrlPath="/api/medical-history/signed-url"
                            defaultFiles={formData.attachments} // ← this is key
                            onFilesChange={(uploaded) => setFormData({ ...formData, attachments: uploaded })}
                        />

                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="secondary" data-cy="medical-save-button">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default MedicalHistory;