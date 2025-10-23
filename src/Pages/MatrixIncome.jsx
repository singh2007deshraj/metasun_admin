import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_url, bsc_url, handleCopy } from "../config";
import { getToken, getUsers } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pagination } from "@mui/material";
import { formatText, getPrice } from "../function";
import { Link } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";

function MatrixIncome() {
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
      const response = await getUsers("matrix-income", {
        page: currentPage,
        limit,
        query,
        fromTime: fromTime ? new Date(fromTime).getTime() / 1000 : "",
        toTime: toTime ? new Date(toTime).getTime() / 1000 : "",
      });
      if (response?.success) {
        setData(response?.income);
        setTotalPages(response?.pagination?.totalPages || 1);
        setTotalDocs(response?.pagination?.totalDocs || 0);
        setIncome(response?.total || {});
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
              {Number(income?.total).toFixed(8) || 0}
            </span>
          </div>
          <div>
            <span className="text-success fw-bold">Total Final Amount:</span>{" "}
            <span className="text-dark fs-5">
              {Number(income?.finalTotal).toFixed(8) || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-4 bg-white p-4 rounded shadow-sm overflow-auto">
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            {/* <div>
            <h3 className="mb-0">Matrix Income Report</h3>
          </div> */}
            <div className="d-flex align-items-end gap-3 flex-wrap">
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
          </div>{" "}
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
                    <th>From User ID</th>
                    <th>To User ID</th>
                    {/* <th>From Level</th> */}
                    <th>From Package</th>
                    <th>To Package</th>
                    <th>BTC Price ($)</th>
                    <th>Amount (BTC)</th>
                    <th>Final Amount (BTC)</th>
                    <th>Txn Hash</th>
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
                        <td>
                          {entry?.time
                            ? new Date(entry.time * 1000).toLocaleString(
                                "en-GB",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: false,
                                }
                              )
                            : "N/A"}
                        </td>
                        <td>
                          <span className="d-inline-flex align-items-center gap-3">
                            <span>{entry?.fromUserId || "N/A"}</span>
                            <button
                              className="btn btn-sm btn-light border"
                              title="Copy"
                              onClick={() => handleCopy(entry?.fromUser || "")}
                            >
                              <MdContentCopy size={16} />
                            </button>
                          </span>
                        </td>
                        <td>
                          <span className="d-inline-flex align-items-center gap-3">
                            <span>{entry?.toUserId || "N/A"}</span>
                            <button
                              className="btn btn-sm btn-light border"
                              title="Copy"
                              onClick={() => handleCopy(entry?.toUserId || "")}
                            >
                              <MdContentCopy size={16} />
                            </button>
                          </span>
                        </td>
                        {/* <td>{entry?.fromLevel ?? "N/A"}</td> */}
                        <td>{packageName[entry?.fromLevel - 1] || "N/A"}</td>
                        <td>
                          {packageName[entry?.receiverPackageId - 1] || "N/A"}
                        </td>
                        <td>
                          {entry?.btcPrice && entry?.btcPrice !== "N/A"
                            ? (Number(entry.btcPrice) / 1e18).toFixed(2)
                            : entry?.btcPrice || "N/A"}
                        </td>
                        <td
                          title={`$${Number(
                            (price * Number(entry?.amount)) / 1e18
                          ).toFixed(4)}`}
                        >
                          BTC{" "}
                          {entry?.amount
                            ? (Number(entry.amount) / 1e18).toFixed(7)
                            : "N/A"}
                        </td>
                        <td
                          title={`$${Number(
                            (price * Number(entry?.transferedAmount)) / 1e18
                          ).toFixed(4)}`}
                        >
                          BTC{" "}
                          {entry?.transferedAmount
                            ? (Number(entry.transferedAmount) / 1e18).toFixed(7)
                            : "N/A"}
                        </td>
                        <td>
                          {entry?.transactionHash ? (
                            <Link
                              className="tx-color"
                              to={`${bsc_url}/${entry.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {formatText(entry.transactionHash)}
                            </Link>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="d-flex align-items-center justify-content-lg-between justify-content-center flex-wrap gap-3 mt-4">
              <div className="text-end text-black mt-2">
                Showing {(page - 1) * limit + 1} to{" "}
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
            </div>{" "}
          </>
        )}
      </div>
    </>
  );
}

export default MatrixIncome;
