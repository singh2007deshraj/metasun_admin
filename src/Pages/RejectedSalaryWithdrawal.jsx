import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Pagination, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import toast from "react-hot-toast";
import { base_url } from "../config";
import { getToken } from "../api";
import { RemoveUnderScore } from "../function";

function RejectedSalaryWithdrawal({ url }) {
  const token = getToken();
  const [swapData, setSwapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalRecord: 0,
    limit: 10,
    ITEMS_PER_PAGE: 10,
  });

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterData, setFilterData] = useState("all");
  const [storedData, setStoredData] = useState([]);
  const [query, setQuery] = useState("");
  const getSwapData = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${base_url}/admin/${url}`,
        {
          page: pagination?.currentPage,
          limit: pagination?.limit,
          status: "rejected",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res?.data) {
        setSwapData(res?.data?.data);
        setStoredData(res?.data?.data);
        setPagination((prev) => ({
          ...prev,
          totalPages: res?.data?.totalPages,
          totalRecord: res?.data?.totalRecords,
        }));
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.response?.data?.msg ||
          "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterData === "all" && !fromDate && !toDate) {
      getSwapData();
    }
  }, [pagination.currentPage, pagination.limit]);

  const handlePageChange = (e, value) => {
    setPagination((prev) => ({ ...prev, currentPage: value }));
  };

  const tableStyles = {
    container: { background: "#fff", padding: "1rem", borderRadius: "8px" },
    tableHeader: { background: "#ff5183", color: "#fff" },
    searchInput: { border: "1px solid #ccc", borderRadius: "5px" },
  };

  const handleSearch = async (query) => {
    try {
      if (query === "") {
        getSwapData();
        return;
      }

      const res = await axios.post(
        `${base_url}/admin/${url}`,
        { query, status: "rejected", page: 1, limit: 1000 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res?.data?.success && Array.isArray(res?.data?.data)) {
        const historyData = res.data.data;
        setSwapData(historyData);
        setStoredData(historyData);
      } else {
        console.error("Unexpected response format:", res?.data);
      }
    } catch (error) {
      console.error("Error in handleSearch:", error);
    }
  };

  const handleFilterDate = async () => {
    if (fromDate && toDate) {
      setError("");
      const fromUnix = new Date(fromDate).getTime() / 1000; // Convert to Unix timestamp
      const toUnix = new Date(toDate).getTime() / 1000; // Convert to Unix timestamp

      try {
        const res = await axios.post(
          `${base_url}/admin/${url}`,
          {
            fromTimeInUnix: fromUnix,
            toTimeInUnix: toUnix,
            status: "rejected",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res?.data?.success) {
          setSwapData(res?.data?.data);
          setStoredData(res?.data?.data);
          setPagination((prev) => ({
            ...prev,
            totalPages: res?.data?.totalPages,
            totalRecord: res?.data?.totalRecords,
          }));
        }
        console.log({ res });
      } catch (error) {
        console.log({ error });
      }
    } else {
      toast.error("Please select both from and to dates.");
      //   setError("Please select both from and to dates.");
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      handleFilterDate();
    }
  }, [fromDate, toDate, pagination.currentPage, pagination.limit]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <>
      <div className="users-table mt-5">
        {error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <>
            <>
              <div className="mb-3 p-3 d-flex align-items-center justify-content-between flex-wrap bg-white rounded">
                <div className="d-flex align-items-center justify-content-sm-center flex-wrap">
                  <h2 className="text-center ">Rejected Withdrawals</h2>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by userId..."
                    onChange={(e) => setQuery(e.target.value)}
                    vallue={query}
                    style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => handleSearch(query)}
                  >
                    Search
                  </Button>
                </div>
              </div>

              <div className="mb-3 p-3 d-flex align-items-end justify-content-between flex-wrap bg-white rounded">
                <div className="d-flex align-items-end flex-wrap gap-2">
                  <div>
                    <label htmlFor="fromDate" className="me-2">
                      From:
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      onChange={(e) => setFromDate(e.target.value)}
                      value={fromDate}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        width: "fit-content",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: window.innerWidth <= 768 ? "1rem" : 0,
                    }}
                  >
                    <label htmlFor="toDate" className="me-2">
                      To:
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      onChange={(e) => setToDate(e.target.value)}
                      value={toDate}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        width: "fit-content",
                      }}
                    />
                  </div>
                  <Button
                    className="ms-2"
                    variant="outlined"
                    onClick={handleFilterDate}
                  >
                    Filter
                  </Button>
                </div>

                <div
                  style={{ marginTop: window.innerWidth <= 768 ? "1rem" : 0 }}
                >
                  <FormControl
                    variant="outlined"
                    size="small"
                    sx={{ width: "150px" }}
                  >
                    <InputLabel id="select-limit-label">
                      Select Limit
                    </InputLabel>
                    <Select
                      labelId="select-limit-label"
                      value={pagination.limit}
                      onChange={(e) =>
                        setPagination((prev) => ({
                          ...prev,
                          limit: e.target.value,
                          currentPage: 1,
                        }))
                      }
                      label="Select Limit"
                    >
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      <MenuItem value={200}>200</MenuItem>
                      <MenuItem value={300}>300</MenuItem>
                      <MenuItem value={500}>500</MenuItem>
                      <MenuItem value={1000}>1000</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div
                className="table-responsive mt-3"
                style={tableStyles.container}
              >
                <table
                  className="table table-bordered-bottom text-center"
                  style={{ width: "100%" }}
                >
                  <thead style={tableStyles.tableHeader}>
                    <tr>
                      <th>#</th>
                      <th>Time</th>
                      <th>User ID</th>
                      <th>Package</th>
                      <th>Amount</th>
                      <th>Tx.Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={10} className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : swapData?.length > 0 ? (
                      swapData?.map((user, index) => (
                        <tr key={user.userId}>
                          <td>
                            {(pagination?.currentPage - 1) * pagination?.limit +
                              index +
                              1}
                          </td>
                          <td>
                            {new Date(user?.time * 1000).toLocaleString()}
                          </td>
                          <td>{user.userId}</td>
                          <td>{RemoveUnderScore(user?.packageName)}</td>
                          <td>
                            ${Number(user?.amount / 1e18 || 0).toFixed(2)}
                          </td>
                          <td className="text-danger">{user?.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-center mt-3">
                <Stack spacing={2}>
                  <Pagination
                    count={pagination?.totalPages}
                    page={pagination?.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                  />
                </Stack>
              </div>
            </>
          </>
        )}
      </div>
    </>
  );
}

export default RejectedSalaryWithdrawal;
