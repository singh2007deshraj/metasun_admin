import React, { useState } from "react";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import { useSelector } from "react-redux";
import { useLayoutEffect } from "react";

function Layout({ children }) {
  const admin = useSelector((state) => state?.login);
  const [isLogin, setIsLogin] = useState(false);

  const style = {
    mainComponent: {
      margin: isLogin ? "auto" : "0",
      padding: isLogin ? "" : "0",
      width: isLogin ? "calc(100% - 240px)" : "100%",
    },
  };

  useLayoutEffect(() => {
    if (admin?.isLogin) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [admin?.isLogin]);

  // console.log({isLogin})
  return (
    <div className="container-fluid">
      <div className="row position-sticky top-0 d-none d-lg-block d-md-block z-1">
        {isLogin && (
          <div className="col-12 p-0 layout-header" style={{position:"relative",top:"-25px"}}>
            <Header />
          </div>
        )}
      </div>
      <div className="row">
        {isLogin && (
          <div className=" layout-sidebar">
            <Sidebar />
          </div>
        )}
        <div style={style.mainComponent} className="main-components">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
