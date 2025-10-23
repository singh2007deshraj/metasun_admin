import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaUserShield } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { getDashboardData } from "../api";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [deductedAmt, setDeductedAmt] = useState({
    pkgAmt: 0,
    refAmt: 0,
    levAmt: 0,
    matAmt: 0,
  });

  const getDashData = async () => {
    try {
      setLoading(true);
      const [res, res1] = await Promise.all([
        getDashboardData("dashboard"),
        getDashboardData("get-deducted-amt"),
      ]);

      if (res?.success) {
        setData(res.data);
      }
      if (res1?.success) {
        setDeductedAmt((pre) => ({
          ...pre,
          pkgAmt: res1?.data?.pkgAmt,
          refAmt: res1?.data?.refAmt,
          levAmt: res1?.data?.levAmt,
          matAmt: res1?.data?.matAmt,
        }));
      }
    } catch (error) {
      toast.error("Failed to fetch dashboard data!");
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashData();
  }, []);

  const dashboardData = [
    {
      icon: <FaUserShield />,
      name: "Total User",
      value: data?.totalUser || 0,
      link: "/all_users",
      title: "View all users",
    },
    {
      icon: <FaUserShield />,
      name: "Total Deposit (BTC)",
      value:
        Number(data?.totalDeposits?.finalDeposits / 1e18 || 0).toFixed(8) || 0,
    },
    {
      icon: <FaUserShield />,
      name: "Referral Income",
      value:
        Number(data?.referralIncome?.finalIncome / 1e18 || 0).toFixed(8) || 0,
    },
    {
      icon: <FaUserShield />,
      name: "Level Income (BTC)",
      value: Number(data?.levelIncome?.finalIncome / 1e18 || 0).toFixed(8) || 0,
    },
    {
      icon: <FaUserShield />,
      name: "Matrix Income (BTC)",
      value:
        Number(data?.matrixIncome?.finalIncome / 1e18 || 0).toFixed(8) || 0,
    },
    {
      icon: <FaUserShield />,
      name: "Flushed Out Income (BTC)",
      value: Number(data?.flushIncome?.finalIncome / 1e18 || 0).toFixed(8) || 0,
    },
    {
      icon: <FaUserShield />,
      name: "Total Withdrawal (BTC)",
      value: Number(data?.withdrawals?.finalIncome || 0).toFixed(8) || 0,
    },
    {
      icon: <FaUserShield />,
      name: "Package Deduction Amt (0.1%)",
      value: Number(deductedAmt?.pkgAmt).toFixed(8),
    },
    {
      icon: <FaUserShield />,
      name: "Referral Deduction Amt (10%)",
      value: Number(deductedAmt?.refAmt).toFixed(8),
    },
    {
      icon: <FaUserShield />,
      name: "Level Deduction Amt (10%)",
      value: Number(deductedAmt?.levAmt).toFixed(8),
    },
    {
      icon: <FaUserShield />,
      name: "Matrix Deduction Amt (10%)",
      value: Number(deductedAmt?.matAmt).toFixed(8),
    },
  ];

  if (loading) {
    return (
      <div className="alert alert-info text-center text-center">Loading...</div>
    );
  }
  return (
    <div className="my-2">
      <div className="d-flex flex-wrap align-items-center justify-content-start gap-2 mb-3 mt-3">
        <div>
          <h1 className="fs-2 text-dark">Welcome</h1>
        </div>
      </div>
      <div className="g-4 row mb-5">
        {dashboardData?.map((user, index) => (
          <div key={index} className="col-lg-4 col-md-4 col-sm-6">
            <div className="d-flex align-items-center justify-content-between rounded px-3 py-3 user-cards bg-white">
              <div
                className="d-flex p-2 rounded dash-icon fs-2"
                style={{ color: "#fff", background: "#ed3949" }}
              >
                {user.icon}
              </div>
              <div>
                {user.link ? (
                  <Tooltip title={user?.title} placement="top">
                    <Link to={user.link}>
                      <div className="text-end">
                        <h4 style={{ color: "#000" }}>{user.value}</h4>
                        <span style={{ color: "#374557", fontWeight: "600" }}>
                          {user.name}
                        </span>
                      </div>
                    </Link>
                  </Tooltip>
                ) : (
                  <div className="text-end">
                    <h4 style={{ color: "#000" }}>{user.value}</h4>
                    <span style={{ color: "#374557", fontWeight: "600" }}>
                      {user.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
