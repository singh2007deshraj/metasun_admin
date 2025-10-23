import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Modal,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import Checkbox from "@mui/material/Checkbox";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { MdCancelPresentation } from "react-icons/md";
import toast from "react-hot-toast";
import { base_url, handleCopy } from "../config";
import { getToken, getWithdrawal } from "../api";
import AppprovedWithdrawal from "./AppprovedWithdrawal";
import { RemoveUnderScore } from "../function";
import RejectedWithdrawal from "./RejectedWithdrawal";
import RejectedSalaryWithdrawal from "./RejectedSalaryWithdrawal";

function SalaryWithdrawal() {
  const token = localStorage.getItem("adminToken");
  const [swapData, setSwapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalRecord: 0,
    limit: 10,
    ITEMS_PER_PAGE: 10,
  });
  const [activeTab, setActiveTab] = useState("pending");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterData, setFilterData] = useState("all");
  const [storedData, setStoredData] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [passKeyList, setPassKeyList] = useState([]);

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const getSalaryWithdrawal = async () => {
    try {
      setLoading(true);
      const res = await getWithdrawal("salary-requests", {
        page: pagination?.currentPage,
        limit: pagination?.limit,
        status: "pending",
      });
      if (res?.data) {
        setSwapData(res?.data);
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
      getSalaryWithdrawal();
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

  const handleSearchByUserId = async (query) => {
    try {
      if (query === "") {
        getSalaryWithdrawal();
        return;
      }
      const res = await getWithdrawal("salary-requests", {
        status: "pending",
        query,
      });
      if (res?.success) {
        setSwapData(res?.data || []);
        setStoredData(res?.data || []);
        setPagination((prev) => ({
          ...prev,
          totalPages: res?.data?.totalPages,
          totalRecord: res?.data?.totalRecords,
        }));
      }
    } catch (error) {
      console.log({ error });
    }
  };
  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    setSelectedItem(e.target.checked ? swapData?.map((swap) => swap) : []);
  };

  const handleSelectItem = (user) => {
    setSelectedItem((prev) => {
      const exists = prev.some((item) => item._id === user._id);
      if (exists) {
        return prev.filter((item) => item._id !== user._id);
      }
      return [...prev, user];
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAction = async (action, requests) => {
    try {
      const isPending = selectedItem.some((data) => data.status !== "pending");

      if (isPending) {
        toast.error("only pending users are allowed to approved!");
        return false;
      }
      setLoading1(true);
      const res = await axios.post(
        `${base_url}/admin/approve-salaries`,
        { action, requests },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        getSalaryWithdrawal();
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "failed to withdraw!");
      console.log(error);
    } finally {
      setLoading1(false);
      setOpen(false);
      setSelectedItem([]);
    }
  };

  const handleApprove = () => {
    handleAction("approved", selectedItem);
  };
  const handleReject = () => {
    handleAction("reject", selectedItem);
  };
  const handleMarkAsPaid = () => {
    handleAction("already_paid", selectedItem);
  };

  const handleFilterDate = async () => {
    if (fromDate && toDate) {
      setError("");
      const fromUnix = new Date(fromDate).getTime() / 1000; // Convert to Unix timestamp
      const toUnix = new Date(toDate).getTime() / 1000; // Convert to Unix timestamp

      try {
        const res = await getWithdrawal("salary-requests", {
          fromTimeInUnix: fromUnix,
          toTimeInUnix: toUnix,
          status: "pending",
        });
        if (res?.data?.success) {
          setSwapData(res?.data?.data);
          setStoredData(res?.data?.data);
          setPagination((prev) => ({
            ...prev,
            totalPages: res?.data?.totalPages,
            totalRecord: res?.data?.totalRecords,
          }));
        }
      } catch (error) {
        console.log({ error });
      }
    } else {
      toast.error("Please select both from and to dates.");
    }
  };

  // useEffect(() => {
  //   if (fromDate && toDate) {
  //     handleFilterDate();
  //   }
  // }, [fromDate, toDate, pagination.currentPage, pagination.limit]);

  const totalSelectedAmt = selectedItem.reduce(
    (a, c) => a + Number(c.amountUsdtAfterDeduction),
    0
  );

  if (loading) {
    return <p className="text-center mt-5 fw-bold">Loading...</p>;
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "#eee",
            p: 4,
            pt: 0,
            borderRadius: 2,
            boxShadow: 24,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="d-flex align-items-center justify-content-between py-3">
            <h2 id="parent-modal-title">Action Required</h2>
            <h1
              onClick={handleClose}
              style={{ cursor: "pointer" }}
              className="fs-4"
            >
              <MdCancelPresentation />
            </h1>
          </div>
          <p id="parent-modal-description">
            Please review the request and take appropriate action. You can
            approve, reject, or mark it as paid.
          </p>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handleReject}>
              <i className="ri-close-circle-line"></i> Reject
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApprove}
              disabled={loading1}
            >
              {loading1 ? "Loading..." : "Approve"}
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleMarkAsPaid}
            >
              Mark as Paid
            </Button>
          </Box>
        </Box>
      </Modal>

      <div className="users-table mt-5">
        {error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <>
            <div className="d-flex gap-3 mb-3 ">
              <button
                className={`btn ${
                  activeTab === "pending"
                    ? "btn-danger fw-bold shadow-sm "
                    : "btn-secondary text-dark"
                }`}
                style={{
                  background: activeTab === "pending" ? "#ff5183" : "",
                }}
                onClick={() => setActiveTab("pending")}
              >
                Pending
              </button>
              <button
                className={`btn ${
                  activeTab === "approved"
                    ? "btn-danger fw-bold shadow-sm"
                    : "btn-secondary text-dark"
                }`}
                style={{
                  background: activeTab === "approved" ? "#ff5183" : "",
                }}
                onClick={() => setActiveTab("approved")}
              >
                Approved
              </button>
              <button
                className={`btn ${
                  activeTab === "rejected"
                    ? "btn-danger fw-bold shadow-sm"
                    : "btn-secondary text-dark"
                }`}
                style={{
                  background: activeTab === "rejected" ? "#ff5183" : "",
                }}
                onClick={() => setActiveTab("rejected")}
              >
                Rejected
              </button>
            </div>

            {activeTab === "pending" ? (
              <>
                <div className="mb-3 p-3 d-flex align-items-center justify-content-between flex-wrap bg-white rounded">
                  <div className="d-flex align-items-center justify-content-sm-center flex-wrap">
                    <h2 className="text-center ">Pending Withdrawals</h2>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="text"
                      className="form-control mb-0"
                      placeholder="Search by userId..."
                      value={query}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                    />
                    <Button variant="outlined" onClick={() => handleSearchByUserId(query)}>
                      Search
                    </Button>
                  </div>
                </div>
                <div className="bg-white rounded py-3 mb-3">
                  <div className="d-flex align-items-center justify-content-between flex-wrap px-2 gap-3">
                    <Box
                      sx={{
                        padding: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        backgroundColor: "#7d727226",
                      }}
                    >
                      <Typography
                        component="div"
                        variant="body2"
                        sx={{ color: "#d32f2f", fontWeight: "500" }}
                      >
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "#d32f2f",
                            marginRight: "8px",
                          }}
                        />
                        Total Pending Amount : <strong>$0.00</strong>
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        backgroundColor: "#7d727226",
                      }}
                    >
                      <Typography
                        component="div"
                        variant="body2"
                        sx={{ color: "#388e3c", fontWeight: "500" }}
                      >
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "#388e3c",
                            marginRight: "8px",
                          }}
                        />
                        Total Selected Amount :{" "}
                        <strong>${totalSelectedAmt}</strong>
                      </Typography>
                    </Box>
                  </div>
                </div>

                <div className="mb-3 p-3 d-flex align-items-end justify-content-between flex-wrap bg-white rounded">
                  <div>
                    <Button
                      variant="outlined"
                      disabled={selectedItem.length === 0}
                      onClick={() => setOpen(true)}
                    >
                      Action
                    </Button>
                  </div>

                  <div className="d-flex align-items-end flex-wrap gap-2">
                    <div>
                      <label htmlFor="fromDate" className="me-2">
                        From:
                      </label>
                      <input
                        type="date"
                        className="form-control mb-0"
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
                        className="form-control mb-0"
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
                        <th>
                          <span>
                            <Checkbox
                              id="selectAll"
                              checked={
                                selectAll &&
                                selectedItem.length >= swapData.length
                              }
                              onChange={handleSelectAll}
                              label="Select All"
                            />
                          </span>
                          <label
                            htmlFor="selectAll"
                            className="text-sm font-medium mt-2"
                          >
                            Select All
                          </label>
                          <br />
                          {selectedItem.length} --- {swapData.length}
                        </th>
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
                          <tr key={index}>
                            <td>
                              <Checkbox
                                {...label}
                                checked={selectedItem.some(
                                  (users) => users._id === user?._id
                                )}
                                onChange={() => handleSelectItem(user)}
                              />
                            </td>
                            <td>
                              {(pagination?.currentPage - 1) *
                                pagination?.limit +
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
                            {user?.transactionHash !== null ? (
                              <td
                                onMouseOver={(e) => {
                                  e.target.style.color = "#ff5183";
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.textDecoration = "none";
                                  e.target.style.color = "#374557";
                                }}
                              >
                                <Link
                                  to={`https://bscscan.com/tx/${user.transactionhash}`}
                                  target="_blank"
                                >
                                  {user?.transactionhash?.slice(0, 5)}...
                                  {user?.transactionhash?.slice(-5)}
                                </Link>
                              </td>
                            ) : (
                              <td
                                className={`${
                                  user?.status === "approved"
                                    ? "text-success"
                                    : "text-danger"
                                } text-capitalize`}
                              >
                                {user?.status}
                              </td>
                            )}
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
            ) : activeTab === "approved" ? (
              <>
                <AppprovedWithdrawal url="salary-requests" />
              </>
            ) : (
              <>
                <RejectedSalaryWithdrawal url="salary-requests"/>
                </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SalaryWithdrawal;
