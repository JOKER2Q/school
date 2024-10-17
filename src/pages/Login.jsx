import React, { useState } from "react";
import "../components/form.css";

export const showPassword = (e) => {
  e.target.classList.toggle("fa-eye");
  const passInp = document.querySelector("form input.password");
  passInp.type === "password"
    ? (passInp.type = "text")
    : (passInp.type = "password");
};

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  return (
    <main className="center section-color">
      <form className="login">
        <div className="flex wrap">
          <div className="forms flex flex-direction">
            <h1>login</h1>
            <label htmlFor="email">email</label>
            <div className="center inp">
              <i className="fa-solid fa-envelope"></i>
              <input
                onInput={handleForm}
                value={form.email}
                className="flex-1"
                type="email"
                placeholder="write your email"
                required
                id="email"
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
