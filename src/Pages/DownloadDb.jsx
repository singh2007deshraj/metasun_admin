import React, { useState } from "react";
import axios from "axios";
import { base_url } from "../config";
import { getToken } from "../api";

function DownloadDb() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadDB = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${base_url}/admin/download-db`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        responseType: "blob",
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mongodb-backup.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      console.log("Download initiated successfully");
    } catch (error) {
      let errorMessage = "Failed to download database backup";
      if (error.response) {
        errorMessage += `: ${error.response.status} - ${error.response.statusText}`;
        if (error.response.status === 401) {
          errorMessage = "Unauthorized: Invalid or expired token";
        } else if (error.response.status === 500) {
          errorMessage = "Server error: Failed to generate backup";
        }
      } else if (error.request) {
        errorMessage = "No response from server. Check your network.";
      } else {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h4 className="text-center mb-4">
          <i className="bi bi-cloud-arrow-down-fill me-2"></i>
          Download MongoDB Backup
        </h4>
        <div className="d-grid">
          <button
            onClick={downloadDB}
            disabled={isLoading}
            className="btn btn-primary btn-lg"
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Downloading...
              </>
            ) : (
              "Download Backup"
            )}
          </button>
        </div>
        {error && (
          <div className="alert alert-danger mt-4" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default DownloadDb;
