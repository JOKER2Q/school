import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Context } from "../context/Context";

const TeacherAuth = () => {
  const context = useContext(Context);
  const isAdmin = context && context.userDetails.isAdmin;
  const isTeacher = context && context.userDetails.isTeacher;
  const location = useLocation();
  return isAdmin || isTeacher ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: location }} replace to={"/dashboard/not_found"} />
  );
};

export default TeacherAuth;
