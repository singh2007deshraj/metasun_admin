import React, { useState } from "react";
import { getToken, login } from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLogin } from "../Redux/LoginSlice";
import { base_url } from "../config";

function Login() {
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await login(formdata.email, formdata.password);
      console.log("status :: ",res.status);
      console.log("error :: ",res.error);
      console.log("message :: ",res.message);
      if (!res.error && res.status==200) {
         dispatch(setLogin({ token: res.token, login: true }));
          toast.success(res.message);
          navigate("/dashboard");
      } else {
        toast.error(res.message);
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleOtpVerify = async () => {
  //   try {
  //     const token = getToken();
  //     const res = await fetch(base_url + "/admin" + "/admin/2fa/verify", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ otp }),
  //     });
  //     const data = await res.json();

  //     if (data.success) {
  //       toast.success("2FA Verified");
  //       dispatch(setLogin({ token, login: true }));
  //       navigate("/dashboard");
  //     } else {
  //       toast.error(data.message || "Invalid OTP");
  //     }
  //   } catch (err) {
  //     toast.error("Something went wrong during OTP verification");
  //   }
  // };

  return (
    <>
      {showOtp && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1055,
            position: "fixed",
            inset: 0,
          }}
          onClick={() => setShowOtp(false)}
        >
          <div
            className="modal-dialog modal-dialog-bottom"
            style={{
              margin: "auto",
              position: "absolute",
              // bottom: "10px",
              top: "40%",
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: "550px",
              width: "95%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content border-0 shadow rounded-4 text-center"
              style={{
                background: "#333",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                scrollbarWidth: "none",
              }}
            >
              <div className="modal-header border-0 d-flex justify-content-center align-items-center px-3">
                <h5 className="modal-title fw-bold m-0">2FA OTP</h5>
              </div>

              <div className="modal-body pb-4 pt-0 overflow-auto">
                <div>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="form-control"
                    value={otp}
                    onChange={(e)=>setOtp(e.target.value)}
                  />
                </div>
                <div className="mt-3">
                  <button className="btn btn-primary" onClick={handleOtpVerify}>Submit OTP</button>
                </div>
                <style>
                  {`
                 .modal-body::-webkit-scrollbar {
                   display: none;
                 }
                 .modal-body {
                   -ms-overflow-style: none;  
                   scrollbar-width: none;     
                 }
              `}
                </style>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="login-container">
        <div className="login-form-section">
          <div className="login-form">
            <p className="fw-bold">
              Enter your e-mail address and your password.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address.....
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formdata.email}
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password" // Added name attribute
                  value={formdata.password} // Bind value to state
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />
              </div>
              <button className="btn submit-btn w-100 text-white">
                {isLoading ? "Processing..." : "Login"}
              </button>
            </form>
          </div>
        </div>
        <div className="aside-section">
          <div className="aside-content">
            <h1 className="fs-3">Welcome to Admin Panel</h1>
            <p>Secure access to manage your platform efficiently.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
