import React from "react";
import SideBar from "./sideBar";
import { Outlet, useLocation } from "react-router-dom";

function MainLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;