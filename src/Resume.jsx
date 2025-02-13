import React, { useState } from "react";
import axios from "axios";

const Resume = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post("http://localhost:3000/upload", formData);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to process resume. Please try again.");
    } finally {
      setLoading(false);
      setFile(null);
      document.getElementById("fileInput").value = "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <div style={{ width: "100%", maxWidth: "600px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", backgroundColor: "#fff", borderRadius: "8px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>ATS Resume Checker</h1>

        <input
          id="fileInput"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ width: "100%", marginBottom: "16px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />

        <button
          onClick={handleSubmit}
          style={{ width: "100%", backgroundColor: "#007BFF", color: "white", padding: "10px", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer" }}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Upload and Check ATS Score"}
        </button>

        {error && <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>{error}</p>}

        {result && (
          <div style={{ marginTop: "20px", backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#333" }}>Results</h2>
            <p><strong>Domain:</strong> {result.domain}</p>
            <p><strong>ATS Score:</strong> {result.atsScore}%</p>

            <div style={{ marginTop: "10px" }}>
              <h3 style={{ fontWeight: "600" }}>Suggestions:</h3>
              <ul style={{ paddingLeft: "20px", marginTop: "8px", color: "#555" }}>
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;