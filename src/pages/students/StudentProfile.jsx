import React, { useEffect, useState } from "react";
import "../../components/profile.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const StudentProfile = () => {
  const [data, setData] = useState({
    classId:"",
    email: "",
    firstName: "",
    gender: "",
    lastName: "",
    middleName: "",
    phoneNumber: "",
    street:"",
    city:"",
    yearLevel: [],
  });

  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/students/${id}`).then((res) => {
      const data = res.data.data;
      console.log(data);

      //   setData({
      //     classes: data.classes,
      //     email: data.email,
      //     firstName: data.firstName,
      //     gender: data.gender,
      //     lastName: data.lastName,
      //     middleName: data.middleName,
      //     phoneNumber: data.phoneNumber,
      //     subjects: data.subjects,
      //     yearLevel: data.yearLevel,
      // });
    });
  }, []);

  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <h1 className="title">diyar's profile</h1>
          <div className="profile">
            <div className="image">
              <i className="photo fa-solid fa-user"></i>
              <Link className="center gap-10">
                edit <i className="fa-regular fa-pen-to-square"></i>
              </Link>
            </div>
            <div className="info">
              <h2 className="name">
                diyar direki
                <Link>
                  <i className="fa-regular fa-pen-to-square"></i>
                </Link>
              </h2>

              <div className="flex">
                <h2>father name:</h2>
                <p>berzani</p>
              </div>
              <div className="flex">
                <h2>gender:</h2>
                <p>male</p>
              </div>
              <div className="flex">
                <h2>mother name:</h2>
                <p>sicrt</p>
              </div>
              <div className="flex">
                <h2>birth date:</h2>
                <p>2003/10/11</p>
              </div>
              <div className="flex">
                <h2>year level:</h2>
                <p>1</p>
              </div>
              <div className="flex">
                <h2>class:</h2>
                <p>room 3</p>
              </div>
              <div className="flex">
                <h2>enrollmentDate:</h2>
                <p>23</p>
              </div>
              <div className="flex">
                <h2>email:</h2>
                <p className="email">diyardireki111@gmail.com</p>
              </div>
              <div className="flex">
                <h2>phone:</h2>
                <p>+963 936 038 904</p>
              </div>

              <div className="flex">
                <h2>city:</h2>
                <p>syria qamishlo</p>
              </div>
              <div className="flex">
                <h2>street:</h2>
                <p>123 Main St</p>
              </div>
              <div className="flex">
                <h2>guardian info:</h2>
                <p>
                  Mother : Jane Doe <br /> 987-654-3210
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StudentProfile;
