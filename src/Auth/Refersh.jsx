import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../context/Context";
import { Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
import Loader from "../components/Loader";
import "../components/loader.css";
const Refresh = () => {
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const tokenContext = context.userDetails.token;

  const cookie = new Cookies();
  const tokenValue = cookie.get("school-token");

  useEffect(() => {
    async function reafreshToken() {
      try {
        const profile = await axios.get(
          "http://localhost:8000/api/users/profile",
          {
            headers: { Authorization: "Bearer " + tokenValue },
          }
        );

        const data = profile.data.user;
        const isAdmin = data.role.includes("Admin");
        const isTeacher = data.role.includes("Teacher");
        const isStudent = data.role.includes("Student");
        context.setUserDetails({
          isAdmin: isAdmin,
          isTeacher: isTeacher,
          isStudent: isStudent,
          token: tokenValue,
          userDetails: data.profileId,
          role: data.role,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    !tokenContext ? reafreshToken() : setLoading(false);
  }, []);
  return loading ? <Loader /> : <Outlet />;
};

export default Refresh;
