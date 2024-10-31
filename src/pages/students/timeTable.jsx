import { useEffect, useState } from "react";
import "../../components/table.css";
import "../../components/form.css";
import axios from "axios";
import FormLoading from "./../../components/FormLoading";
const TimeTable = () => {
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
    classId: "671383ab6ec6b9d374974c83",
    subjectId: "",
    dayOfWeek: daysOfWeek[dayNumber],
    yearLevel: "1",
  });

  async function getData() {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/time-table?active=true&classId=671383ab6ec6b9d374974c83&dayOfWeek=${daysOfWeek[dayNumber]}&sort=startTime`
      );
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getData();
    setForm({ ...form, dayOfWeek: daysOfWeek[dayNumber] });
  }, [dayNumber]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/subjects?active=true&yearLevel=1`)
      .then((res) => setSubjects(res.data.data));
  }, []);

  useEffect(() => {
    if (selectedId) {
      setSubjectName(selectedId.subjectId.name);
      setForm({
        startTime: selectedId.startTime,
        endTime: selectedId.endTime,
        classId: selectedId.classId._id,
        subjectId: selectedId.subjectId._id,
        dayOfWeek: selectedId.dayOfWeek,
        yearLevel: selectedId.yearLevel,
      });
    }
  }, [selectedId]);

  const deleteData = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/time-table/deactivate/${id}`
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
    overlay && setOverlay(false);
    setIsUpdate(false);
    setSelectedId("");
    setForm({
      startTime: "",
      endTime: "",
      classId: "671383ab6ec6b9d374974c83",
      subjectId: "",
      dayOfWeek: daysOfWeek[dayNumber],
      yearLevel: "1",
    });
    setSubjectName("");
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
          await axios.post(`http://localhost:8000/api/time-table`, form);
        } else {
          await axios.patch(
            `http://localhost:8000/api/time-table/${selectedId._id}`,
            form
          );
        }
        setOverlay(false);
        setIsUpdate(false);
        selectedId("");
        setSubjectName("");
        getData();
        setForm({
          startTime: "",
          endTime: "",
          classId: "671383ab6ec6b9d374974c83",
          subjectId: "",
          dayOfWeek: daysOfWeek[dayNumber],
          yearLevel: "1",
        });
      } catch (error) {
        console.log(error);
      } finally {
        setFormLoading(false);
      }
    }
  };

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
                <label htmlFor="subject">subject</label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {subjectName ? subjectName : "please selecte gander"}
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
                <label htmlFor="startTime">start time</label>
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
                <label htmlFor="endTime">end time</label>
                <input
                  value={form.endTime}
                  onInput={(e) => setForm({ ...form, endTime: e.target.value })}
                  required
                  type="time"
                  className="inp"
                  id="endTime"
                />
                {DataError && <p className="error">{DataError}</p>}
                <button className="btn">save</button>
              </div>
            </form>
          </div>
        )}
        <div className="container">
          <div className="tabel-container">
            <div className="day flex">
              <div onClick={decrement} className="flex-1">
                prev day
              </div>
              <div className="flex-1"> {daysOfWeek[dayNumber]} </div>
              <div onClick={increment} className="flex-1">
                next day
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
                    <th>room</th>
                    <th>period start</th>
                    <th>period end</th>
                    <th>subject</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody
                  className={`${tableData.length === 0 ? "relative" : ""}`}
                >
                  {tableData.length > 0
                    ? tableData
                    : !loading && (
                        <div className="table-loading">no data to show</div>
                      )}
                  {loading && <div className="table-loading">loading</div>}
                </tbody>
              </table>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOverlay(true);
                }}
                className="btn green-btn"
              >
                add new lesson <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TimeTable;
