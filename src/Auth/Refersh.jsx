import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../context/Context";
import { Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
import Loader from "../components/Loader";

const Refresh = () => {
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const tokenContext = context.userDetails.token;

  const cookie = new Cookies();
  const tokenValue = cookie.get("token");

  useEffect(() => {
    async function reafreshToken() {
      try {
        const data = await axios.get(
          "https://blue-elite.tech/api/users/profile",
          {
            headers: { Authorization: "Bearer " + tokenValue },
          }
        );

        context.setUserDetails({
          token: tokenValue,
          user: data.data.user.role,
          isAdmin: data.data.user.role.includes("admin"),
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
