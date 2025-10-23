"use client";

import { useEffect, useState } from "react";
import QRCodeGenerator from "./QrCodeGenerator";
import { base_url } from "../config";
import { getToken } from "../api";
import axios from "axios";
import toast from "react-hot-toast";

export default function TwoFactorEnrollment() {
  const [step, setStep] = useState("initial");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const get2FAStatus = async () => {
    try {
      const res = await axios.get(`${base_url}/admin/admin/2fa-status`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setIsEnabled(res?.data?.enabled || false);
    } catch (error) {
      console.error("Error enabling 2FA:", error);
    }
  };

  useEffect(() => {
    get2FAStatus();
  }, []);

  const handleEnable = async () => {
    try {
     setLoading(true);
      const res = await axios.get(`${base_url}/admin/admin/2fa/setup`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setQrCodeUrl(res.data.qrCodeUrl);
      setSecret(res.data.secret);
      setStep("setup");
      setIsEnabled(isCurrentlyEnabled);
    } catch (error) {
      console.error("Error enabling 2FA:", error);
    }finally{
     setLoading(false)
    }
  };

  const handleDisable = async () => {
    try {
      const res = await axios.get(
        `${base_url}/admin/admin/2fa/setup/?disable=${true}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      console.log(res, " diable res");
      toast.success("2FA Disabled");
      get2FAStatus();
      //  setQrCodeUrl(res.data.qrCodeUrl);
      //  setSecret(res.data.secret);
      //  setStep("setup");
    } catch (error) {
      console.error("Error enabling 2FA:", error);
    }
  };

  const handleVerification = async () => {
    try {
      const token = getToken();
      setLoading(true);
      const res = await fetch(base_url + "/admin" + "/admin/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: verificationCode }),
      });
      const data = await res.json();
      setLoading(false);
      setVerificationCode("");
      if (data.success) {
        get2FAStatus();
        setStep("initial");
        toast.success("2FA Verified");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Something went wrong during OTP verification");
    }
  };

  const handleCodeChange = (value) => {
    // Only allow digits and limit to 6 characters
    const cleanValue = value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(cleanValue);
    setError("");
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    // You could add a toast notification here
  };

  const formatSecret = (secret) => {
    // Format secret in groups of 4 for better readability
    return secret.match(/.{1,4}/g)?.join(" ") || secret;
  };

  if (step === "initial") {
    if (isEnabled) {
      return (
        <div className="text-center">
          <div className="mb-4">
            <div
              className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "80px", height: "80px" }}
            >
              <i
                className="bi bi-shield-check text-success"
                style={{ fontSize: "2rem" }}
              ></i>
            </div>
            <h5 className="fw-bold mb-3 text-success">
              Two-Factor Authentication Enabled
            </h5>
            <p className="text-muted mb-4">
              Your account is currently protected with two-factor
              authentication. You need your authenticator app to sign in.
            </p>
          </div>

          <div className="alert alert-success text-start">
            <h6 className="alert-heading mb-2">
              <i className="bi bi-shield-check me-2"></i>
              Your account is secure with:
            </h6>
            <ul className="mb-0 small">
              <li>Time-based one-time passwords (TOTP)</li>
              <li>Protection against unauthorized access</li>
              <li>Backup codes for account recovery</li>
            </ul>
          </div>

          <div className="alert alert-warning text-start">
            <h6 className="alert-heading mb-2">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Before disabling:
            </h6>
            <p className="mb-0 small">
              Disabling two-factor authentication will make your account less
              secure. Make sure you have alternative security measures in place.
            </p>
          </div>

          <div className="d-grid gap-2">
            <button
              className="btn btn-outline-danger"
              onClick={handleDisable}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Disabling...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-x me-2"></i>
                  Disable Two-Factor Authentication
                </>
              )}
            </button>
            {/* <button className="btn btn-secondary" onClick={() => window.history.back()}>
              <i className="bi bi-arrow-left me-2"></i>
              Back to Settings
            </button> */}
          </div>
        </div>
      );
    }

    // Original initial screen for when 2FA is not enabled
    return (
      <div className="text-center">
        <div className="mb-4">
          <div
            className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: "80px", height: "80px" }}
          >
            <i
              className="bi bi-shield-lock text-primary"
              style={{ fontSize: "2rem" }}
            ></i>
          </div>
          <h5 className="fw-bold mb-3">Secure Your Account</h5>
          <p className="text-muted mb-4">
            Add an extra layer of security to your account with two-factor
            authentication. You'll need your phone to sign in, making your
            account much more secure.
          </p>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="text-center">
              <i
                className="bi bi-phone text-primary mb-2"
                style={{ fontSize: "1.5rem" }}
              ></i>
              <h6 className="small fw-semibold">Install App</h6>
              <p className="small text-muted mb-0">
                Download an authenticator app
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <i
                className="bi bi-qr-code text-primary mb-2"
                style={{ fontSize: "1.5rem" }}
              ></i>
              <h6 className="small fw-semibold">Scan Code</h6>
              <p className="small text-muted mb-0">
                Scan the QR code we provide
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <i
                className="bi bi-shield-check text-primary mb-2"
                style={{ fontSize: "1.5rem" }}
              ></i>
              <h6 className="small fw-semibold">Verify</h6>
              <p className="small text-muted mb-0">
                Enter the code to complete setup
              </p>
            </div>
          </div>
        </div>

        <div className="alert alert-info text-start">
          <h6 className="alert-heading mb-2">
            <i className="bi bi-info-circle me-2"></i>
            Recommended Authenticator Apps:
          </h6>
          <ul className="mb-0 small">
            <li>Google Authenticator</li>
            <li>Microsoft Authenticator</li>
            <li>Authy</li>
            <li>1Password</li>
          </ul>
        </div>

        <div className="d-grid">
          <button className="btn btn-primary btn-lg" onClick={handleEnable} disabled={loading}>
            <i className="bi bi-shield-plus me-2"></i>
            {loading ? "Enabling..." : "Enable Two-Factor Authentication" }
          </button>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="text-center">
        <div className="mb-4">
          <div
            className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center"
            style={{ width: "80px", height: "80px" }}
          >
            <i
              className="bi bi-check-lg text-white"
              style={{ fontSize: "2rem" }}
            ></i>
          </div>
        </div>
        <h5 className="text-success mb-3">
          Two-Factor Authentication Enabled!
        </h5>
        <p className="text-muted mb-4">
          Your account is now protected with two-factor authentication. You'll
          need to enter a code from your authenticator app each time you sign
          in.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Continue to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      {step === "setup" && (
        <div>
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Step 1: Scan QR Code</h6>
            <p className="text-muted small mb-3">
              Use your authenticator app (Google Authenticator, Authy, etc.) to
              scan this QR code:
            </p>

            <div className="text-center mb-4">
              <div className="bg-white p-3 rounded border d-inline-block">
                <QRCodeGenerator value={qrCodeUrl} size={200} />
                {/* <img /> */}
              </div>
            </div>

            <div className="alert alert-info">
              <h6 className="alert-heading mb-2">
                <i className="bi bi-info-circle me-2"></i>
                Can't scan the QR code?
              </h6>
              <p className="mb-2 small">
                Enter this secret key manually in your authenticator app:
              </p>
              <div className="bg-light p-2 rounded font-monospace small position-relative">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-break">{formatSecret(secret)}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary ms-2"
                    onClick={copySecret}
                    title="Copy secret"
                  >
                    <i className="bi bi-clipboard"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="d-grid">
            <button
              className="btn btn-primary"
              onClick={() => setStep("verify")}
            >
              I've Added the Secret
              <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {step === "verify" && (
        <div>
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Step 2: Verify Setup</h6>
            <p className="text-muted small mb-3">
              Enter the 6-digit code from your authenticator app to complete
              setup:
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="verification-code"
              className="form-label fw-semibold"
            >
              Verification Code
            </label>
            <input
              id="verification-code"
              type="text"
              className={`form-control form-control-lg text-center font-monospace ${
                error ? "is-invalid" : ""
              }`}
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              maxLength={6}
              style={{ letterSpacing: "0.5em", fontSize: "1.5rem" }}
              disabled={loading}
            />
            <div className="form-text text-center">
              Enter the 6-digit code from your authenticator app
            </div>
          </div>

          <div className="d-grid gap-2">
            <button
              className="btn btn-success btn-lg"
              onClick={handleVerification}
              disabled={verificationCode.length !== 6 || loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Verifying...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-check me-2"></i>
                  Enable Two-Factor Authentication
                </>
              )}
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() => setStep("setup")}
              disabled={loading}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to QR Code
            </button>
          </div>

          <div className="mt-4 p-3 bg-light rounded">
            <h6 className="small fw-bold mb-2">
              <i className="bi bi-lightbulb me-2"></i>
              Troubleshooting Tips:
            </h6>
            <ul className="small text-muted mb-0">
              <li>Make sure your device's time is synchronized</li>
              <li>Try generating a new code if the current one doesn't work</li>
              <li>
                Check that you've entered the secret correctly in your app
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
