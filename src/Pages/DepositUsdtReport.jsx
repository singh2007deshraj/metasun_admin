import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_url, bsc_url, handleCopy } from "../config";
import { getToken, getUsers,getDeposit } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pagination } from "@mui/material";
import { formatText, getPrice } from "../function";
import { Link } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import toast from "react-hot-toast";

function DepositUsdtReport() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [totalDocs, setTotalDocs] = useState(0);
  const [price, setPrice] = useState(0);
  const [deposit, setTotel] = useState({
    stakingUSDT: 0,
    stakingmts: 0
  });

  const fetchData = async (currentPage, query, limit, fromTime, toTime) => {
    try {
      setLoading(true);
      const response = await getDeposit("upgrade-report", {
        page: currentPage,limit,query,
        fromTime: fromTime ? Math.floor(new Date(fromTime).getTime() / 1000)
          : "",
        toTime: toTime ? Math.floor(new Date(toTime).getTime() / 1000) : "",
      });
      if (response?.success) {
        setData(response?.deposits);
        setTotalPages(response?.totalPages || 1);
        setTotalDocs(response?.totalCount || 0);
        setTotel({
          stakingUSDT:response?.stakingUSDT,
          stakingmts:response?.stakingMTS,
        });
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
    fetchData(page, "", limit, "", "");
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
            <span className="text-primary fw-bold">Total Deposit(USDT) : </span>{" "}
            <span className="text-dark fs-5">{Number(deposit?.stakingUSDT).toFixed(2) || 0}</span>
          </div>
          <div>
            <span className="text-success fw-bold">Total Deposit(MTS):</span>{" "}
            <span className="text-dark fs-5">{Number(deposit?.stakingmts).toFixed(2) || 0}</span>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-4 bg-white p-4 rounded shadow-sm">
        <div className="d-flex align-items-center justify-content-between flex-wrap mb-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
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
          <div className="alert alert-info text-center">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger">Error: {error}</div>
        ) : (
          <>
            <div className="overflow-auto">
              <table className="table table-bordered ">
                <thead className="table-dark">
                  <tr className="text-center">
                    <th>#</th>
                    <th>Date Time</th>
                    <th>User ID</th>
                    <th>User</th>
                    <th>Amount (USDT)</th>
                    <th>Amount(MTS)</th>
                    <th>Txn Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    data.map((entry, index) => (
                      <tr key={index} className="text-center">
                        <td>{(page - 1) * limit + index + 1}</td>
                        <td>{new Date(entry.createdAt).toLocaleString()}</td>
                        <td>
                          <span className="d-inline-flex align-items-center gap-3">
                            <span>{entry?.usersIdn || "N/A"}</span>
                            <button
                              className="btn btn-sm btn-light border"
                              onClick={() => handleCopy(entry.usersIdn || "N/A")}
                            >
                              <MdContentCopy size={16} />
                            </button>
                          </span>
                        </td>
                        <td>
                          <span className="d-inline-flex align-items-center gap-3">
                            <span>{formatText(entry.user)}</span>
                            <button
                              className="btn btn-sm btn-light border"
                              onClick={() => handleCopy(entry.user)}
                            >
                              <MdContentCopy size={16} />
                            </button>
                          </span>
                        </td>
                        <td>
                          <span className="d-inline-flex align-items-center gap-3">
                            <span>{entry?.depositAmt || '0'}</span>
                            </span>
                        </td>
                        <td>
                          <span className="d-inline-flex align-items-center gap-3">
                            <span>{entry?.tokenAmt || '0'}</span>
                           </span>
                        </td>
                        <td>
                          <Link
                            className="tx-color"
                            to={`${bsc_url}/${entry.txHash}`}
                            target="_blank"
                          >
                            {formatText(entry.txHash)}
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex align-items-center justify-content-lg-between justify-content-center flex-wrap gap-3 mt-4">
              <div className="text-end text-black mt-2">
                Showing {data.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
                {data.length > 0 ? (page - 1) * limit + data.length : 0} from {totalDocs}
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

export default DepositUsdtReport;
