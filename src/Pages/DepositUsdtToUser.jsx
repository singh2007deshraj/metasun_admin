import axios from "axios";
import React, { useState } from "react";
import { base_url } from "../config";
import { getToken } from "../api";
import toast from "react-hot-toast";

function DepositUsdtToUser() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post(
        `${base_url}/admin/add-usdt-fund-to-user`,
        { userId, amount: Number(amount) },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (res.data.success) {
        setSuccess(res.data.message);
        toast.success(res.data.message);
      } else {
        setError(res.data.message);
      }
      setUserId("");
      setAmount("");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card mx-auto" style={{ maxWidth: "800px" }}>
        <div className="card-body">
          <h1 className="text-center mb-4">Deposit USDT</h1>

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="userId" className="form-label">
                User ID
              </label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="form-control"
                placeholder="Enter User ID"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Amount (USDT)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control"
                placeholder="Enter Amount"
                min="0"
                step="0.01"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary w-100 ${isLoading ? "disabled" : ""}`}
            >
              {isLoading ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : null}
              {isLoading ? "Processing..." : "Deposit USDT"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default DepositUsdtToUser;
