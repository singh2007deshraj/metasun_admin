import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Component/Dashboard";
import Layout from "./Layout/Layout";
import Login from "./Pages/Login";
import { useSelector } from "react-redux";
import PayoutWithdrawal from "./Pages/PayoutWithdrawal";
import SalaryWithdrawal from "./Pages/SalaryWithdrawal";
import CompoundWithdrawal from "./Pages/CompoundWithdrawal";
import DepositUsdtToUser from "./Pages/DepositUsdtToUser";
import DepositUsdtReport from "./Pages/DepositUsdtReport";
import AllUsers from "./Pages/AllUsers";
import ReferralIncome from "./Pages/ReferralIncome";
import LevelIncome from "./Pages/LevelIncome";
import MatrixIncome from "./Pages/MatrixIncome";
import FlushLevel from "./Pages/FlushLevel";
import FlushMatrix from "./Pages/FlushMatrix";
import OldWithdrawal from "./Pages/OldWithdrawal";
import DownloadDb from "./Pages/DownloadDb";
import Enable2FA from "./Pages/Enable2FA";

function Approutes() {
  const admin = useSelector((state) => state?.login);
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {admin?.isLogin ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<Dashboard />} />
              <Route path="/income/referral" element={<ReferralIncome />} />
              <Route path="/income/level" element={<LevelIncome />} />
              <Route path="/income/matrix" element={<MatrixIncome />} />
              <Route path="/income/flush/level" element={<FlushLevel />} />
              <Route path="/income/flush/matrix" element={<FlushMatrix />} />
              {/*<Route path="/withdrawal/compound" element={<CompoundWithdrawal />} />
              <Route path="/deposit-usdt" element={<DepositUsdtToUser />} />*/}
              <Route path="/upgrade-package" element={<DepositUsdtReport />} />
              <Route path="/all-users" element={<AllUsers />} />
              <Route path="/old-withdrawal" element={<OldWithdrawal />} />
              <Route path="/download-db" element={<DownloadDb />} />
              <Route path="/admin/2fa-auth" element={<Enable2FA />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<Login />} />
            </>
          )}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default Approutes;
