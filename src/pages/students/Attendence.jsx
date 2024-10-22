import React, { useEffect, useState } from "react";
import "../../components/table.css";
import axios from "axios";
const Attendence = () => {
  const [form, setForm] = useState({
    date: "",
    classId: "",
  });

  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classesName, setClassesName] = useState("");
  const [dataError, setDataError] = useState(false);

  const selecteClass = (e) => {
    setClassesName(`${e.yearLevel} : ${e.name}`);
    setForm({ ...form, classId: e._id });
    setDataError(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/classes")
      .then((res) => setClasses(res.data.data));
  }, []);

  const createClasses =
    classes &&
    classes.map((e) => {
      return (
        <h2 onClick={() => selecteClass(e)} key={e._id}>
          {`${e.yearLevel} : ${e.name}`}
        </h2>
      );
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.classId) setDataError("please choose a class");
    else {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/attendances/time-filter?startDate=${form.date}&active=true&classId=${form.classId}`
        );
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };
  const [overlay, setOverlay] = useState(false);
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  function createTH(length) {
    let th = [];
    for (let i = 0; i < length; i++) {
      th.push(<th key={i}>{i + 1}</th>);
    }

    return th;
  }
  const statusClick = () => {
    setOverlay(true);
  };
  window.onclick = () => {
    const overlay = document.querySelector(".overlay");
    overlay && setOverlay(false);
    const selectDiv = document.querySelector(
      "form.dashboard-form .selecte .inp.active"
    );
    selectDiv && selectDiv.classList.remove("active");
  };
  console.log(data);
  function completeData(e) {
    let tds = [];
    for (let index = 0; index < daysInMonth; index++) {
      tds.push(
        e.status === "Present" ? (
          <td key={index} onDoubleClick={statusClick} className="status">
            <i className="true fa-solid fa-check"></i>
          </td>
        ) : e.status === "Absent" ? (
          <td key={index} onDoubleClick={statusClick} className="status">
            <i className="false fa-solid fa-xmark"></i>
          </td>
        ) : (
          <td key={index} onDoubleClick={statusClick} className="status">
            -
          </td>
        )
      );
    }
    return tds;
  }

  const tr =
    data &&
    data.map((e) => {
      return (
        <tr key={e.id}>
          <td>{`${e.studentId.firstName} ${e.studentId.middleName} ${e.studentId.lastName}`}</td>

          {completeData(e)}
        </tr>
      );
    });

  return (
    <main>
      <div className="dashboard-container">
        {overlay && (
          <div className="overlay">
            <div className="change-status">
              <h1>
                change status for student: <span>diyar direki</span>
              </h1>
              <div className="flex gap-20">
                <div className="true center">
                  <h2>true</h2>
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="false center">
                  <h2>false</h2>
                  <i className="fa-solid fa-xmark"></i>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="container flex flex-direction gap-20">
          <h1 className="title">students attendence</h1>
          <div className="flex"></div>
          <form onSubmit={handleSubmit} className="dashboard-form">
            <div className="flex wrap">
              <div className="flex flex-direction">
                <label htmlFor="date">date</label>
                <input
                  onInput={(e) => setForm({ ...form, date: e.target.value })}
                  id="date"
                  type="month"
                  className="inp"
                  required
                />
              </div>
              <div className="flex flex-direction">
                <label>class</label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {classesName ? classesName : "please selecte a class"}
                  </div>
                  <article> {createClasses} </article>
                </div>
              </div>
            </div>
            {dataError && <p className="error"> {dataError} </p>}
            <button className="btn">search</button>
          </form>
          <div className="tabel-container">
            <div className="table">
              <h2>Attendence Sheet Of Class One: Section A, April 2019</h2>
              <table className="attendence">
                <thead>
                  <tr>
                    <th>student</th> {createTH(daysInMonth)}
                  </tr>
                </thead>
                <tbody>{tr}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Attendence;
