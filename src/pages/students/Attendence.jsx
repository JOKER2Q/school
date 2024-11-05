import React, { useEffect, useState } from "react";
import "../../components/table.css";
import axios from "axios";

const Attendence = () => {
  const [form, setForm] = useState({
    date: "",
    classId: "",
  });

  const [data, setData] = useState([]); // Holds students data
  const [classes, setClasses] = useState([]); // Holds class options
  const [classesName, setClassesName] = useState(""); // Selected class name
  const [dataError, setDataError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]); // Holds attendance data for each student
  const [selectedStudent, setSelectedStudent] = useState({
    student: "",
    day: "",
    update: false,
    id: "",
  });
  const selecteClass = (e) => {
    setClassesName(`${e.yearLevel} : ${e.name}`);
    setForm({ ...form, classId: e._id });
    setDataError(false);
  };

  // Fetch classes
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

    if (!form.classId) {
      setDataError("please choose a class");
    } else {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/students?classId=${form.classId}&active=true&fields=_id,firstName,lastName,middleName`
        );

        setData(response.data.data);
        fetchAttendanceData(response.data.data); // Fetch attendance after getting students
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Function to fetch attendance data for all students
  const fetchAttendanceData = async (students) => {
    const attendanceArray = []; // Array to hold attendance records for all students

    try {
      await Promise.all(
        students.map(async (student) => {
          const response = await axios.get(
            `http://localhost:8000/api/attendances/time-filter?month=${form.date}&active=true&studentId=${student._id}`
          );
          attendanceArray.push({
            studentId: student._id,
            studentName: `${student.firstName} ${student.middleName} ${student.lastName}`,
            attendance: response.data, // Assuming response.data contains an array of attendance records for the student
          });
        })
      );
      setAttendance(attendanceArray); // Set the attendance array in state
    } catch (error) {
      console.error("Error fetching attendance", error);
    } finally {
      setLoading(false);
    }
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

  const statusClick = (e, student, index, id) => {
    setSelectedStudent({
      student,
      day: index,
      update: e.target.classList.contains("status-check"),
      id: id,
    });
    setOverlay(true);
  };

  const trueCheck = async () => {
    try {
      if (selectedStudent.update) {
        await axios.patch(
          `http://localhost:8000/api/attendances/${selectedStudent.id}`,
          {
            status: "Present",
          }
        );
      } else {
        await axios.post(`http://localhost:8000/api/attendances`, {
          studentId: selectedStudent.student.studentId,
          classId: form.classId,
          date: `${form.date}-${selectedStudent.day}`,
          status: "Present",
        });
      }
      fetchAttendanceData(data); // Fetch updated attendance data
    } catch (error) {
      console.log(error);
    }
  };

  const falseCheck = async () => {
    try {
      if (selectedStudent.update) {
        await axios.patch(
          `http://localhost:8000/api/attendances/${selectedStudent.id}`,
          {
            status: "Absent",
          }
        );
      } else {
        await axios.post(`http://localhost:8000/api/attendances`, {
          studentId: selectedStudent.student.studentId,
          classId: form.classId,
          date: `${form.date}-${selectedStudent.day}`,
          status: "Absent",
        });
      }
      fetchAttendanceData(data); // Fetch updated attendance data
    } catch (error) {
      console.log(error);
    }
  };
  const noneCheck = async () => {
    try {
      if (selectedStudent.update) {
        await axios.patch(
          `http://localhost:8000/api/attendances/deactivate/${selectedStudent.id}`,
          {
            active: "false",
          }
        );
      }
      fetchAttendanceData(data); // Fetch updated attendance data
    } catch (error) {
      console.log(error);
    }
  };

  window.onclick = () => {
    const overlay = document.querySelector(".overlay");
    overlay && setOverlay(false);
    const selectDiv = document.querySelector(
      "form.dashboard-form .selecte .inp.active"
    );
    selectDiv && selectDiv.classList.remove("active");
  };

  const complteteData = (studen) => {
    let td = [];

    for (let index = 1; index <= daysInMonth; index++) {
      const attendanceEntry = studen?.attendance?.data.find((entry) => {
        const date = new Date(entry.date);

        return date.getUTCDate() === index;
      });

      if (attendanceEntry) {
        td.push(
          <td
            onDoubleClick={(e) =>
              statusClick(e, studen, index, attendanceEntry._id)
            }
            className="status status-check"
            key={index}
          >
            {attendanceEntry.status === "Present" ? (
              <i className="true fa-solid fa-check"></i>
            ) : (
              <i className="false fa-solid fa-xmark"></i>
            )}
          </td>
        );
      } else {
        td.push(
          <td
            onDoubleClick={(e) =>
              statusClick(e, studen, index, studen.studentId)
            }
            className="status"
            key={index}
          >
            -
          </td>
        );
      }
    }

    return td;
  };

  const tr =
    attendance &&
    attendance.map((student, i) => (
      <tr key={student.studentId}>
        <td>{student.studentName}</td>
        {complteteData(student, i)}
      </tr>
    ));

  function handleClick(e) {
    e.stopPropagation();
    e.target.classList.toggle("active");
  }

  return (
    <main>
      <div className="dashboard-container">
        {overlay && (
          <div className="overlay">
            <div className="change-status">
              <h1>
                change status for student:
                <span>{`${selectedStudent.student.studentName} `}</span>
                in day: {selectedStudent.day}
              </h1>
              <div className="flex gap-20">
                <div onClick={trueCheck} className="true center">
                  <h2>Present</h2>
                  <i className="fa-solid fa-check"></i>
                </div>
                <div onClick={falseCheck} className="false center">
                  <h2>false</h2>
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <div onClick={noneCheck} className="none center">
                  <h2>None</h2>
                  <i className="fa-solid fa-ban"></i>
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

          {data.length > 0 && (
            <div className="tabel-container">
              <div className="table">
                <h2>
                  Attendence Sheet Of Class {classesName}: Section A,
                  {form.date}
                </h2>
                <table
                  className={`${data.length === 0 ? "loading" : ""}attendence`}
                >
                  <thead>
                    <tr>
                      <th>student</th> {createTH(daysInMonth)}
                    </tr>
                  </thead>
                  <tbody className={`${tr.length === 0 ? "relative" : ""}`}>
                    {tr.length > 0
                      ? tr
                      : !loading && (
                          <div className="table-loading">no data to show</div>
                        )}
                    {loading && <div className="table-loading">loading</div>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Attendence;
