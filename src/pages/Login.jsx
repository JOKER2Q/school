import React, { useContext, useState } from "react";
import "../components/form.css";
import axios from "axios";
import { Context } from "../context/Context";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

export const showPassword = (e) => {
  e.target.classList.toggle("fa-eye");
  const passInp = document.querySelector("form input.password");
  passInp.type === "password"
    ? (passInp.type = "text")
    : (passInp.type = "password");
};

const Login = () => {
  const context = useContext(Context);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  const nav = useNavigate();
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const cookie = new Cookies();
      const getToken = await axios.post(
        "http://localhost:8000/api/users/login",
        form
      );
      const token = getToken.data.token;

      const profile = await axios.get(
        "http://localhost:8000/api/users/profile",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
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
        token: token,
        userDetails: data.profileId,
        role: data.role,
      });
      cookie.set("school-token", token);
      isTeacher && nav(`/dashboard/teacher_profile/${data.profileId}`);
      isStudent && nav(`/dashboard/student_profile/${data.profileId}`);
      isAdmin && nav(`/dashboard`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="center section-color">
      <form onSubmit={handelSubmit} className="login">
        <div className="flex wrap">
          <div className="forms flex flex-direction">
            <h1>login</h1>
            <label htmlFor="username">user name</label>
            <div className="center inp">
              <i className="fa-solid fa-user"></i>
              <input
                onInput={handleForm}
                value={form.username}
                className="flex-1"
                type="text"
                placeholder="write your username"
                required
                id="username"
              />
            </div>
            <label htmlFor="password">password</label>
            <div className="center inp">
              <i className="fa-solid fa-key"></i>
              <input
                value={form.password}
                onInput={handleForm}
                className="password flex-1"
                type="password"
                placeholder="write your password"
                required
                id="password"
              />
              <i
                onClick={showPassword}
                className="password fa-solid fa-eye-slash"
              ></i>
            </div>
            <button className="btn">submit</button>
          </div>
          <div className="image">
            <img src={require("./loginimage.jpg")} alt="" />
          </div>
        </div>
      </form>
    </main>
  );
};

export default Login;
