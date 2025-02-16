import React, { useState } from "react";
import axios from "axios";

const ResumeUploader = ({ setExtractedText }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await axios.post("http://localhost:5000/upload/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
console.log("Response:", response.data.structuredData.certifications);
      setExtractedText(response.data.structuredData);
      alert("Resume uploaded and parsed successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
};

export default ResumeUploader;
