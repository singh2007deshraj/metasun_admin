import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMobileOpen } from "../Redux/LayoutSlice";

function Header() {
  const dispatch = useDispatch();
  const mobileOpen = useSelector((state) => state.layout.mobileOpen);
  const toggle = () => {
    dispatch(setMobileOpen(!mobileOpen));
  };
  return (
    <nav className="navbar navbar-top navbar-expand-lg position-sticky top-0 shadow-none">
      <div className="container-fluid py-4">
        {/* <button className="navbar-toggler" type="button" onClick={toggle}>
          <span className="navbar-toggler-icon"></span>
        </button> */}
      </div>
    </nav>
  );
}

export default Header;
