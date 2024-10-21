import React from "react";
import errorImg from "./error.png";
import completeImg from "./complete.png";
import "./overlay.css";
const SendData = (props) => {
  return (
    <div className="center response">
      <img
        src={props.response === true ? completeImg : errorImg}
        alt=""
        loading="lazy"
      />
      <h1>
        {props.response === true
          ? "send successfully"
          : props.response === 400
          ? "the user has been already taken"
          : "network error"}
      </h1>
    </div>
  );
};

export default SendData;
