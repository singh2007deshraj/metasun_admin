import React from "react";
import TwoFactorEnrollment from "../Component/TwoFactorEnrollment";

export default function TwoFactorAuth() {
  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white text-center py-3">
                <h4 className="mb-0">
                  <i className="bi bi-shield-lock me-2"></i>
                  Enable Two-Factor Authentication
                </h4>
              </div>
              <div className="card-body p-4">
                <TwoFactorEnrollment />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
