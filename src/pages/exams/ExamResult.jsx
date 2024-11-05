import { useEffect, useState } from "react";
import "../../components/table.css";
import "../../components/form.css";
import axios from "axios";
const ExamResult = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [form, setForm] = useState({
    yearLevel: "",
    classId: "",
    student: "",
  });
  async function fetchData() {
    setData([]);
    setLoading(true);
    try {
      if (form.student)
        await axios
          .get(`http://localhost:8000/api/exam-results/details/${form.student}`)
          .then((res) => {
            setData(res.data.data);
          });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, [form.student]);

  window.onclick = () => {
    const activeDiv = document.querySelector(
      "div.table tbody td div.options.active-div"
    );

    activeDiv && activeDiv.classList.remove("active-div");
    const overlayDiv = document.querySelector(".overlay");
    if (overlayDiv) {
      setOverlay(false);
      setSelectedItems([]);
    }
    const td = document.querySelector("td.input");
    td && td.classList.remove("input");
  };

  const maxResultsLength = Math.max(...data.map((e) => e.results.length));

  const deleteExam = async () => {
    try {
      const data = await axios.patch(
        `http://localhost:8000/api/exam-results/deactivate/${selectedItems}`
      );
      data && fetchData();

      setSelectedItems([]);
    } catch (error) {
      console.log(error);
    } finally {
      setOverlay(false);
    }
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const inpValue = parseInt(document.querySelector("td.input input").value);

      const res = await axios.patch(
        `http://localhost:8000/api/exam-results/${selectedItems}`,
        { score: inpValue }
      );

      if (res.status === 200) {
        setSelectedItems([]);
        const td = document.querySelector("td.input");
        td && td.classList.remove("input");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const tableData =
    data &&
    data.map((e, i) => {
      const totalScore = e.results.reduce((acc, score) => acc + score.score, 0);
      const totalMark = e.results.reduce(
        (acc, score) => acc + score.totalMarks,
        0
      );

      return (
        <tr key={i}>
          <td>{e._id}</td>
          {e.results.map((score, i) => (
            <td key={i}>
              <span
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (e.target.nextSibling)
                    e.target.nextSibling.nextSibling.nextSibling.click();
                }}
              >
                {score.score + "/" + score.totalMarks}
              </span>
              <form
                onSubmit={handelSubmit}
                onClick={(e) => e.stopPropagation()}
                className="div-input"
              >
                <input
                  className="update-input"
                  type="number"
                  min={0}
                  max={score.totalMarks}
                  required
                />
                <button className="fa-solid fa-arrow-right"></button>
              </form>
              <i
                onClick={(event) => {
                  event.stopPropagation();
                  setOverlay(true);
                  setSelectedItems(score.examResultId);
                }}
                className="delete icon fa-regular fa-trash-can"
              ></i>
              <i
                onClick={(event) => {
                  event.stopPropagation();
                  const td = document.querySelectorAll("td.input");
                  td.forEach((e) => {
                    e !== event.target.parentNode &&
                      e.classList.remove("input");
                  });
                  event.target.parentNode.classList.toggle("input");
                  const inp = document.querySelector("td.input input");
                  inp && (inp.value = score.score);
                  inp && inp.focus();
                  setSelectedItems(score.examResultId);
                }}
                className="update icon fa-regular fa-pen-to-square"
              ></i>
            </td>
          ))}

          {/* Add empty cells if there are fewer than 3 results */}
          {Array.from({ length: maxResultsLength - e.results.length }).map(
            (_, idx) => (
              <td key={`empty-${idx}`}></td>
            )
          )}

          {/* Total score and marks */}
          <td>{`${totalScore}/${totalMark}`}</td>
        </tr>
      );
    });

  const createThExams = (length) => {
    const th = [];
    for (let index = 0; index < length; index++) {
      th.push(<th key={index}> exam {index + 1} </th>);
    }
    return th;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };
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
  const [dataNames, setDataNames] = useState({
    classesName: "",
    studentName: "",
  });
  const [classes, setClasses] = useState([]);
  function selectClasses(e, id) {
    setForm({
      ...form,
      classId: id,
    });
    setDataNames({ ...dataNames, classesName: e.target.dataset.classes });
  }
  const [students, setStudents] = useState([]);
  function selectStudent(e, id) {
    setForm({
      ...form,
      student: id,
    });
    setDataNames({ ...dataNames, studentName: e.target.dataset.student });
  }
  useEffect(() => {
    setForm({ ...form, classId: "" });
    setDataNames({ ...dataNames, classesName: "" });
    if (form.yearLevel) {
      axios
        .get(
          `http://localhost:8000/api/classes?yearLevel=${form.yearLevel}&active=true`
        )
        .then((res) => {
          setClasses(res.data.data);
        });
    }
  }, [form.yearLevel]);

  useEffect(() => {
    if (form.classId) {
      axios
        .get(
          `http://localhost:8000/api/students?classId=${form.classId}&active=true`
        )
        .then((res) => {
          setStudents(res.data.data);
        });
    }
  }, [form.classId]);

  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          {overlay && (
            <div className="overlay">
              <div className="change-status">
                <h1>{`confirm delete exam`}</h1>
                <div className="flex gap-20">
                  <div
                    onClick={() => {
                      deleteExam();
                    }}
                    className="false center"
                  >
                    <h2>delete</h2>
                    <i className="fa-solid fa-trash"></i>
                  </div>
                  <div
                    onClick={() => {
                      setOverlay(false);
                      setSelectedItems([]);
                    }}
                    className="none center"
                  >
                    <h2>cancel</h2>
                    <i className="fa-solid fa-ban"></i>
                  </div>
                </div>
              </div>
            </div>
          )}
          <form className="exam-result dashboard-form">
            <div className="flex wrap ">
              <div className="flex flex-direction">
                <label>year level</label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {form.yearLevel
                      ? form.yearLevel
                      : "please selecte year level"}
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
                        {dataNames.classesName
                          ? dataNames.classesName
                          : "please select classes"}
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

              {form.classId && (
                <>
                  <div className="flex flex-direction">
                    <label>studen</label>
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {dataNames.studentName
                          ? dataNames.studentName
                          : "please select student"}
                      </div>
                      <article>
                        {students.map((e, i) => {
                          return (
                            <h2
                              onClick={(event) => selectStudent(event, e._id)}
                              data-student={`${e.firstName} ${e.middleName} ${e.lastName}`}
                              key={i}
                            >
                              {`${e.firstName} ${e.middleName} ${e.lastName}`}
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

          <div className="tabel-container">
            <div className="table">
              <table
                className={`${tableData.length === 0 ? "loading" : ""} exam`}
              >
                <thead>
                  <tr>
                    <th>subject name</th>
                    {createThExams(maxResultsLength)}
                    <th>score</th>
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExamResult;
