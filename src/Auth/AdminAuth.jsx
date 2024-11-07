import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Context } from "../context/Context";

const AdminAuth = () => {
  const context = useContext(Context);
  const isAdmin = context && context.userDetails.isAdmin;
  const location = useLocation();
  return isAdmin ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: location }} replace to={"/dashboard/not_found"} />
  );
};

export default AdminAuth;
