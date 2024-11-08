import React, { useContext, useEffect, useState } from "react";
import "../../components/profile.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Context } from "../../context/Context";
const TeacherProfile = () => {
  const [data, setData] = useState({
    classes: [],
    email: "",
    firstName: "",
    gender: "",
    lastName: "",
    middleName: "",
    phoneNumber: "",
    subjects: [],
    yearLevel: [],
  });

  const { id } = useParams();
  const context = useContext(Context);
  const language = context && context.selectedLang;
  useEffect(() => {
    axios.get(`http://localhost:8000/api/teachers/${id}`).then((res) => {
      const data = res.data.teacher;
      setData({
        classes: data.classes,
        email: data.email,
        firstName: data.firstName,
        gender: data.gender,
        lastName: data.lastName,
        middleName: data.middleName,
        phoneNumber: data.phoneNumber,
        subjects: data.subjects,
        yearLevel: data.yearLevel,
      });
    });
  }, []);

  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <h1 className="title"> {data.firstName + " " + data.lastName} </h1>
          <div className="profile">
            <div className="image">
              <i className=" photo fa-solid fa-user"></i>
              <Link to={`/update_teacher/${id}`} className="center gap-10">
                {language.teachers && language.teachers.edit_btn}
                <i className="fa-regular fa-pen-to-square"></i>
              </Link>
            </div>
            <div className="info">
              <h2 className="name">
                <Link to={`/update_teacher/${id}`}>
                  <i className="fa-regular fa-pen-to-square"></i>
                </Link>
              </h2>

              <div className="flex">
                <h2>{language.teachers && language.teachers.first_name}:</h2>
                <p> {data.firstName} </p>
              </div>
              <div className="flex">
                <h2>{language.teachers && language.teachers.middle_name}:</h2>
                <p>{data.middleName}</p>
              </div>
              <div className="flex">
                <h2>{language.teachers && language.teachers.last_name}:</h2>
                <p> {data.lastName} </p>
              </div>
              <div className="flex">
                <h2>{language.teachers && language.teachers.gender}:</h2>
                <p>{data.gender}</p>
              </div>

              <div className="flex">
                <h2>email:</h2>
                <p className="email"> {data.email} </p>
              </div>
              <div className="flex">
                <h2>{language.teachers && language.teachers.class}:</h2>
                <p> {data.classes.join(" , ")} </p>
              </div>
              <div className="flex">
                <h2>{language.teachers && language.teachers.subject}:</h2>
                <p>{data.subjects.join(" , ")}</p>
              </div>
              <div className="flex">
                <h2>{language.teachers && language.teachers.year_level}:</h2>
                <p>{data.yearLevel.join(" , ")}</p>
              </div>

              <div className="flex">
                <h2>{language.teachers && language.teachers.phone_number}:</h2>
                <p>{data.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TeacherProfile;
