import { useContext, useEffect, useState } from "react";
import "../../components/table.css";
import "../../components/form.css";
import axios from "axios";
import FormLoading from "./../../components/FormLoading";
import { Context } from "../../context/Context";
const TimeTable = () => {
  const context = useContext(Context);
  const token = context && context.userDetails.token;
  const isAdmin = context && context.userDetails.isAdmin;

  const date = new Date();
  const [data, setData] = useState([]);
  const [dayNumber, setDayNumber] = useState(date.getUTCDay() || 0);
  const [loading, setLoading] = useState(true);
  const [overlay, setOverlay] = useState(false);
  const [DataError, setDataError] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const language = context && context.selectedLang;
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
    classId: "",
    subjectId: "",
    dayOfWeek: daysOfWeek[dayNumber],
    yearLevel: "",
  });

  async function getData() {
    if (form.classId) {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/time-table?active=true&classId=${form.classId}&dayOfWeek=${daysOfWeek[dayNumber]}&sort=startTime`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setData(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }
  useEffect(() => {
    getData();

    setForm({ ...form, dayOfWeek: daysOfWeek[dayNumber] });
  }, [dayNumber, form.classId]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/subjects?active=true&yearLevel=${form.yearLevel}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => setSubjects(res.data.data));
  }, [form.yearLevel]);

  useEffect(() => {
    if (selectedId) {
      setSubjectName(selectedId.subjectId.name);
      setForm({
        ...form,
        startTime: selectedId.startTime,
        endTime: selectedId.endTime,
        subjectId: selectedId.subjectId._id,
      });
    }
  }, [selectedId]);

  const deleteData = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/time-table/deactivate/${id}`,
        [],
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const tableData =
    data &&
    data.map((e, i) => {
      return (
        <tr key={i}>
          <td> {e.classId.yearLevel + " : " + e.classId.name} </td>
          <td>{e.startTime}</td>
          <td> {e.endTime} </td>
          <td> {e.subjectId.name} </td>
          {isAdmin && (
            <td>
              <div className="flex gap-10">
                <i
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsUpdate(true);
                    setSelectedId(e);
                    setOverlay(true);
                  }}
                  className="update fa-regular fa-pen-to-square"
                ></i>
                <i
                  onClick={() => deleteData(e._id)}
                  className="delete fa-regular fa-trash-can"
                ></i>
              </div>
            </td>
          )}
        </tr>
      );
    });

  const increment = () => {
    setDayNumber((prev) => (prev + 1) % 7);
    setData([]);
    setLoading(true);
  };
  const decrement = () => {
    setDayNumber((prev) => (prev - 1 + 7) % 7);
    setData([]);
    setLoading(true);
  };
  window.onclick = () => {
    const overlay = document.querySelector(".overlay");
    if (overlay) {
      setOverlay(false);
      setIsUpdate(false);
      setSelectedId("");
      setSubjectName("");
      setForm({
        ...form,
        startTime: "",
        endTime: "",
        subjectId: "",
      });
      setDataError(false);
    }
  };
  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };

  const selecteSubject = (e) => {
    setForm({ ...form, subjectId: e._id });
    const activeDiv = document.querySelector(
      "form.dashboard-form .selecte .inp.active"
    );
    activeDiv && activeDiv.classList.remove("active");
    setSubjectName(e.name);
    setDataError(false);
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!form.subjectId) setDataError("please selecte subject");
    else {
      setFormLoading(true);
      try {
        if (!isUpdate) {
          await axios.post(`http://localhost:8000/api/time-table`, form, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          getData();
        } else {
          await axios.patch(
            `http://localhost:8000/api/time-table/${selectedId._id}`,
            form,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          getData();
        }

        setOverlay(false);
        setIsUpdate(false);
        setSelectedId("");
        setForm({ ...form, startTime: "", endTime: "", subjectId: "" });
      } catch (error) {
        console.log(error);
      } finally {
        setFormLoading(false);
      }
    }
  };

  const [classes, setClasses] = useState([]);
  const [classesName, setClassesName] = useState("");
  function selectClasses(e, id) {
    setForm({
      ...form,
      classId: id,
    });
    setClassesName(e.target.dataset.classes);
  }

  function selectYears(e) {
    setForm({
      ...form,
      yearLevel: e.target.dataset.level,
    });
  }
  function createYearLeve() {
    let h2 = [];
    for (let index = 1; index < 13; index++) {
      h2.push(
        <h2 key={index} onClick={selectYears} data-level={index}>
          {index}
        </h2>
      );
    }
    return h2;
  }
  useEffect(() => {
    setForm({ ...form, classId: "" });
    setClassesName("");
    if (form.yearLevel) {
      axios
        .get(
          `http://localhost:8000/api/classes?yearLevel=${form.yearLevel}&active=true`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          setClasses(res.data.data);
        });
    }
  }, [form.yearLevel]);

  return (
    <main>
      <div className="dashboard-container">
        {overlay && (
          <div className="overlay">
            <form
              onSubmit={(e) => handelSubmit(e)}
              onClick={(e) => e.stopPropagation()}
              className="dashboard-form relative"
            >
              {formLoading && <FormLoading />}
              <div className="flex flex-direction">
                <label htmlFor="subject">
                  {language.timeTable && language.timeTable.subject}
                </label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {subjectName
                      ? subjectName
                      : `${
                          language.timeTable &&
                          language.timeTable.subject_placeholder
                        }`}
                  </div>
                  <article>
                    {subjects.map((e) => {
                      return (
                        <h2 onClick={() => selecteSubject(e)} key={e._id}>
                          {e.name}
                        </h2>
                      );
                    })}
                  </article>
                </div>
                <label htmlFor="startTime">
                  {language.timeTable && language.timeTable.start_time}
                </label>
                <input
                  value={form.startTime}
                  onInput={(e) =>
                    setForm({ ...form, startTime: e.target.value })
                  }
                  required
                  type="time"
                  className="inp"
                  id="startTime"
                />
                <label htmlFor="endTime">
                  {language.timeTable && language.timeTable.end_time}
                </label>
                <input
                  value={form.endTime}
                  onInput={(e) => setForm({ ...form, endTime: e.target.value })}
                  required
                  type="time"
                  className="inp"
                  id="endTime"
                />
                {DataError && <p className="error">{DataError}</p>}
                <button className="btn">
                  {language.timeTable && language.timeTable.save_btn}
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="container">
          <form className="exam-result dashboard-form">
            <div className="flex wrap ">
              <div className="flex flex-direction">
                <label>
                  {language.timeTable && language.timeTable.year_level}
                </label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {form.yearLevel
                      ? form.yearLevel
                      : `${
                          language.timeTable &&
                          language.timeTable.year_level_placeholder
                        }`}
                  </div>
                  <article className="grid-3">{createYearLeve()}</article>
                </div>
              </div>

              {form.yearLevel && (
                <>
                  <div className="flex flex-direction">
                    <label>classes</label>
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {classesName ? classesName : "please select classes"}
                      </div>
                      <article>
                        {classes.map((e, i) => {
                          return (
                            <h2
                              onClick={(event) => selectClasses(event, e._id)}
                              data-classes={`${e.yearLevel} : ${e.name}`}
                              key={i}
                            >
                              {`${e.yearLevel} : ${e.name}`}
                            </h2>
                          );
                        })}
                      </article>
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>

          {form.classId && (
            <div className="tabel-container">
              <div className="day flex">
                <div onClick={decrement} className="flex-1">
                  {language.timeTable && language.timeTable.prev_day}
                </div>
                <div className="flex-1"> {daysOfWeek[dayNumber]} </div>
                <div onClick={increment} className="flex-1">
                  {language.timeTable && language.timeTable.next_day}
                </div>
              </div>
              <div className="table flex">
                <table
                  className={`${
                    tableData.length === 0 ? "loading" : ""
                  } time-table`}
                >
                  <thead>
                    <tr>
                      <th>{language.timeTable && language.timeTable.room}</th>
                      <th>
                        {language.timeTable && language.timeTable.period_start}
                      </th>
                      <th>
                        {language.timeTable && language.timeTable.period_end}
                      </th>
                      <th>
                        {language.timeTable && language.timeTable.subject}
                      </th>
                      {isAdmin && <th></th>}
                    </tr>
                  </thead>
                  <tbody
                    className={`${tableData.length === 0 ? "relative" : ""}`}
                  >
                    {tableData.length > 0
                      ? tableData
                      : !loading && (
                          <div className="table-loading">
                            {language.timeTable && language.timeTable.no_data}
                          </div>
                        )}
                    {loading && (
                      <div className="table-loading">
                        {language.timeTable && language.timeTable.loading}
                      </div>
                    )}
                  </tbody>
                </table>
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOverlay(true);
                    }}
                    className="btn green-btn"
                  >
                    {language.timeTable && language.timeTable.add_btn}{" "}
                    <i className="fa-solid fa-plus"></i>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default TimeTable;
