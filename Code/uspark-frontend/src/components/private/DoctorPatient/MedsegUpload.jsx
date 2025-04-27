import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function MedsegUpload() {
  const [file, setFile] = useState(null);
  const [patientEmail, setPatientEmail] = useState("");
  const [previewImage, setPreviewImage] = useState(""); // for base64 preview
  const [s3Url, setS3Url] = useState(""); // for permanent S3 link
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !patientEmail) {
      toast.error("Please select a file and enter Patient Email!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientEmail', patientEmail);

      const response = await axios.post('http://localhost:5001/api/medseg/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        const { base64Image, s3Url } = response.data;
        setPreviewImage(base64Image); // ⭐️ Set base64 image for preview
        setS3Url(s3Url); // ⭐️ Set S3 URL
        toast.success('Segmentation and upload successful!');
      } else {
        toast.error(response.data.message || 'Segmentation failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during segmentation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Biomedical Image Segmentation (Using Patient Email)</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="email"
          placeholder="Enter Patient Email"
          value={patientEmail}
          onChange={(e) => setPatientEmail(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", padding: "8px", width: "300px" }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : "Segment and Upload"}
        </button>
      </form>

      {previewImage && (
        <div>
          <h3>Segmented Image Preview:</h3>
          <img
            src={previewImage}
            alt="Segmented Output"
            style={{
              maxWidth: "100%",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
            }}
          />
        </div>
      )}

      {s3Url && (
        <div style={{ marginTop: "20px" }}>
          <h4>View Full S3 Image:</h4>
          <a href={s3Url} target="_blank" rel="noopener noreferrer">
            View S3 Image
          </a>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default MedsegUpload;
