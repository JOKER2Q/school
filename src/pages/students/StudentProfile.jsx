import React, { useEffect, useState } from "react";
import "../../components/profile.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const StudentProfile = () => {
  const [data, setData] = useState({
    classId: "",
    email: "",
    firstName: "",
    gender: "",
    lastName: "",
    middleName: "",
    phoneNumber: "",
    street: "",
    city: "",
    yearLevel: "",
    dateOfBirth: "",
    yearRepeated: [],
    enrollmentDate: "",
    guardianContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  });

  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/students/${id}`).then((res) => {
      const data = res.data.data;
      const birthDateCount = new Date(data.dateOfBirth);
      const dateOfBirth = `${birthDateCount.getFullYear()}/${birthDateCount.getMonth()}/${birthDateCount.getDay()}`;
      const enrollmentDateCount = new Date(data.enrollmentDate);
      const enrollmentDate = `${enrollmentDateCount.getFullYear()}/${enrollmentDateCount.getMonth()}/${enrollmentDateCount.getDay()}`;

      const updateForm = {
        ...data,
        email: data.contactInfo.email,
        firstName: data.firstName,
        gender: data.gender,
        lastName: data.lastName,
        middleName: data.middleName,
        phoneNumber: data.contactInfo.phone,
        yearLevel: data.yearLevel,
        street: data.address.street,
        city: data.address.city,
        dateOfBirth: dateOfBirth,
        enrollmentDate: enrollmentDate,
        guardianContact: {
          name: data.guardianContact.name,
          phone: data.guardianContact.phone,
          relationship: data.guardianContact.relationship,
        },
        yearRepeated: data.yearRepeated,
      };
      if (data.classId) {
        updateForm.classId = data.classId.name;
      }
      setData(updateForm);
    });
  }, []);

  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <h1 className="title"> {data.firstName + " " + data.lastName} </h1>
          <div className="profile">
            <div className="image">
              <i className="photo fa-solid fa-user"></i>
              <Link to={`/update_student/${id}`} className="center gap-10">
                edit <i className="fa-regular fa-pen-to-square"></i>
              </Link>
            </div>
            <div className="info">
              <h2 className="name">
                <Link to={`/update_student/${id}`}>
                  <i className="fa-regular fa-pen-to-square"></i>
                </Link>
              </h2>

              <div className="flex">
                <h2>first name:</h2>
                <p> {data.firstName} </p>
              </div>
              <div className="flex">
                <h2>middle name:</h2>
                <p> {data.middleName} </p>
              </div>
              <div className="flex">
                <h2>last name:</h2>
                <p> {data.lastName} </p>
              </div>
              <div className="flex">
                <h2>email:</h2>
                <p className="email">{data.email}</p>
              </div>
              <div className="flex">
                <h2>phone:</h2>
                <p>{data.phoneNumber}</p>
              </div>
              <div className="flex">
                <h2>gender:</h2>
                <p> {data.gender} </p>
              </div>

              <div className="flex">
                <h2>birth date:</h2>
                <p> {data.dateOfBirth} </p>
              </div>
              <div className="flex">
                <h2>year level:</h2>
                <p>{data.yearLevel}</p>
              </div>
              <div className="flex">
                <h2>class:</h2>
                <p>{data.classId}</p>
              </div>
              <div className="flex">
                <h2>enrollmentDate:</h2>
                <p>{data.enrollmentDate}</p>
              </div>

              <div className="flex">
                <h2>city:</h2>
                <p>{data.city}</p>
              </div>
              <div className="flex">
                <h2>street:</h2>
                <p>{data.street}</p>
              </div>
              <div className="flex">
                <h2>guardian info:</h2>
                <p>
                  {data.guardianContact.relationship} :
                  {data.guardianContact.name} <br />
                  {data.guardianContact.phone}
                </p>
              </div>
              <div className="flex">
                <h2>year repeated:</h2>
                <p>
                  {data.yearRepeated
                    .map(
                      (e) =>
                        `year : ${e.yearLevel} ; repeated count : ${e.yearCount}`
                    )
                    .join(<br />)}
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
