import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_url, bsc_url, handleCopy } from "../config";
import { getToken, getUsers } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pagination } from "@mui/material";
import { formatText, getPrice } from "../function";
import { Link } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";

function OldWithdrawal() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [totalDocs, setTotalDocs] = useState(0);
  const [price, setPrice] = useState(0);
  const [income, setIncome] = useState({
    total: 0,
    finalTotal: 0,
  });

  const fetchData = async (currentPage, query, limit, fromTime, toTime) => {
    try {
      setLoading(true);
      const response = await getUsers("old-withdrawal", {
        page: currentPage,
        limit,
        query,
        fromTime: fromTime ? new Date(fromTime).getTime() / 1000 : "",
        toTime: toTime ? new Date(toTime).getTime() / 1000 : "",
      });
      if (response?.success) {
        setError("");
        setData(response?.data);
        setTotalPages(response?.pagination?.totalPages || 1);
        setTotalDocs(response?.pagination?.totalDocs);
        setIncome(response.total || {});
        setError("");
      } else {
        setError("Failed to fetch data.");
      }
    } catch (error) {
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData(page, "", limit);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const packageName = [
    "Miner",
    "Manager",
    "Mentor",
    "Silver",
    "Gold",
    "Prime",
    "Premium",
    "Diamond Club",
    "Bitcoin Club",
  ];

  const handleSearch = (query) => {
    fetchData(page, query, limit);
  };
  const limitsArr = [10, 20, 50, 100, 500];

  useEffect(() => {
    const btcPrice = async () => {
      const res = await getPrice();
      setPrice(Number(res));
    };
    btcPrice();
  }, []);

  return (
    <>
      <div className="container-fluid mt-4 bg-light p-4 rounded shadow-sm">
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <div className="mb-2 mb-md-0">
            <span className="text-primary fw-bold">Total Amount:</span>{" "}
            <span className="text-dark fs-5">
              {Number(income?.total || 0).toFixed(8) || 0}
            </span>
          </div>
          <div className="mb-2 mb-md-0">
            <span className="text-warning fw-bold">Total Admin Charge:</span>{" "}
            <span className="text-dark fs-5">
              {Number(income?.adminCharge || 0).toFixed(8) || 0}
            </span>
          </div>
          <div>
            <span className="text-success fw-bold">Total Final Amount:</span>{" "}
            <span className="text-dark fs-5">
              {Number(income?.finalTotal || 0).toFixed(8) || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-4 bg-white p-4 rounded shadow-sm overflow-auto">
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            {/* <div>
            <h3 className="mb-0">Level Income Report</h3>
          </div> */}
            <div className="d-flex align-items-end justify-content-start gap-3 flex-wrap">
              <div>
                <label htmlFor="fromDate">From Date</label>
                <input
                  type="date"
                  name="time"
                  id="time"
                  value={fromTime}
                  onChange={(e) => {
                    setFromTime(e.target.value);
                  }}
                  className="form-control"
                />
              </div>
              <div>
                <label htmlFor="toDate">To Date</label>
                <input
                  type="date"
                  name="time"
                  id="time"
                  value={toTime}
                  onChange={(e) => {
                    setToTime(e.target.value);
                  }}
                  className="form-control"
                />
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!fromTime || !toTime) {
                      toast.error("Please select both From and To dates.");
                      return;
                    }
                    fetchData(page, query, limit, fromTime, toTime);
                  }}
                >
                  Filter By Date
                </button>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control"
                style={{ minWidth: 220 }}
                placeholder="Search by User Address..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
              />
              <button
                className="btn btn-primary"
                onClick={() => handleSearch(query)}
              >
                Search
              </button>
            </div>
            <select
              name="limit"
              id="limit"
              className="form-select ms-2"
              style={{ width: 100 }}
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
                fetchData(1, "", e.target.value);
              }}
            >
              {limitsArr.map((l) => (
                <option key={l} value={l}>
                  {l} / page
                </option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <div className="alert alert-info text-center text-center">
            Loading...
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">Error: {error}</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-dark">
                  <tr className="text-center">
                    <th>#</th>
                    <th>Time</th>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Amount</th>
                    <th>Admin Charge</th>
                    <th>Net Amount</th>
                    <th>Txn Id</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length === 0 || !data ? (
                    <tr>
                      <td colSpan="10" className="text-center text-muted">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    data.map((entry, index) => (
                      <tr key={index} className="text-center">
                        <td>{(page - 1) * limit + index + 1}</td>
                        <td>{entry.create_date}</td>
                        <td>{entry?.id}</td>
                        <td>
                          <span className="d-inline-flex align-items-center gap-3">
                            <span>{entry?.userid || "N/A"}</span>
                            <button
                              className="btn btn-sm btn-light border"
                              title="Copy"
                              onClick={() => handleCopy(entry?.userid)}
                            >
                              <MdContentCopy size={16} />
                            </button>
                          </span>
                        </td>
                        <td
                          title={`$${Number(
                            price * Number(entry?.amount)
                          ).toFixed(4)}`}
                        >
                          BTC {entry?.amount ?? "-"}
                        </td>
                        <td
                          title={`$${Number(
                            price * Number(entry?.admin_charge)
                          ).toFixed(4)}`}
                        >
                          BTC {entry?.admin_charge}
                        </td>
                        <td
                          title={`$${Number(
                            price * Number(entry?.net_amount)
                          ).toFixed(4)}`}
                        >
                          BTC{" "}
                          {entry?.net_amount
                            ? Number(entry.net_amount).toFixed(7)
                            : "-"}
                        </td>
                        <td>{entry.transaction_id}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="d-flex align-items-center justify-content-lg-between justify-content-center flex-wrap gap-3 mt-4">
              <div className="text-end text-black mt-2">
                Showing {(page - 1) * limit + totalDocs ? 1 : 0} to{" "}
                {Math.min(page * limit, totalDocs)} from {totalDocs}
              </div>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                siblingCount={1}
                boundaryCount={1}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default OldWithdrawal;
