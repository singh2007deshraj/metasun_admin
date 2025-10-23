import React, { useState } from "react";
import axios from "axios";
import { base_url, bsc_url, handleCopy } from "../config";
import { getToken, getUsers } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pagination } from "@mui/material";
import { formatText } from "../function";
import { Link } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";

function ReferralIncome() {
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

  const fetchData = async (currentPage, query, limit, fromDate, toDate) => {
    try {
      setLoading(true);
      const response = await getUsers("all-users", {
        page: currentPage,
        limit,
        query,
        fromTime: fromTime
          ? Math.floor(new Date(fromTime).getTime() / 1000)
          : undefined,
        toTime: toTime
          ? Math.floor(new Date(toTime).getTime() / 1000)
          : undefined,
      });
      if (response?.success) {
        setData(response?.user);
        setTotalPages(response?.pagination?.totalPages || 1);
        setTotalDocs(response?.pagination?.totalDocs || 0);
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
  return (
    <div className="container-fluid mt-4 bg-white p-4 rounded shadow-sm overflow-auto">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
          {/* <div>
            <h3 className="mb-0">All User Report</h3>
          </div>{" "} */}
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
                onClick={() => fetchData(page, query, limit, fromTime, toTime)}
              >
                Filter By Date
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
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
            className="form-select "
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
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr className="text-center">
                  <th>#</th>
                  <th>Date</th>
                  <th>User ID</th>
                  <th>UserAddress</th>
                  <th>Sponsor ID</th>
                  <th>Spill ID</th>
                  <th>Current Rank</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data && data?.length === 0 ? (
                  <tr>
                    <td colSpan="19" className="text-center">
                      No records found
                    </td>
                  </tr>
                ) : (
                  data?.map((entry, index) => (
                    <tr key={index} className="text-center">
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>{new Date(entry.time * 1000).toLocaleString()}</td>
                      <td>
                        <span>{entry.userId || "N/A"}</span>
                        <button
                          className="btn btn-sm border bg-light ms-3"
                          onClick={() => handleCopy(entry.userId)}
                        >
                          <MdContentCopy size={16} />
                        </button>
                      </td>
                      <td>
                        <span>{formatText(entry.user)}</span>
                        <button
                          className="btn btn-sm border bg-light ms-3"
                          onClick={() => handleCopy(entry.user)}
                        >
                          <MdContentCopy size={16} />
                        </button>
                      </td>
                      <td>
                        <span>{entry?.sponsorId || "N/A"}</span>
                        <button
                          className="btn btn-sm border bg-light ms-3"
                          onClick={() => handleCopy(entry.sponsorId || "")}
                        >
                          <MdContentCopy size={16} />
                        </button>
                      </td>
                      <td>
                        <span>{entry?.spillId || "N/A"}</span>
                        <button
                          className="btn btn-sm border bg-light ms-3"
                          onClick={() => handleCopy(entry.spillId || "")}
                        >
                          <MdContentCopy size={16} />
                        </button>
                      </td>
                      <td>{packageName[entry.lastPackage - 1]}</td>
                      <td>
                        <Link
                          to={`https://btcmine.io/adminRoutes?userAddress=${entry?.user}`}
                          target="_blank"
                          className="text-white btn-primary"
                        >
                          Dashboard
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
          </div>
        </>
      )}
    </div>
  );
}

export default ReferralIncome;
