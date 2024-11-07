import React, { useContext, useEffect, useState } from "react";
import "../../components/form.css";
import axios from "axios";
import FormLoading from "../../components/FormLoading";
import SendData from "../../components/response/SendData";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../context/Context";

const UpdateExamSchedule = () => {
  const context = useContext(Context);
  const token = context && context.userDetails.token;
  const params = useParams();
  const [form, setForm] = useState({
    classId: "",
    subjectId: "",
    yearLevel: "",
    date: "",
    duration: "",
    totalMarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [DataError, setDataError] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classesName, setClassesName] = useState(false);
  const [subjectsName, setSubjectsName] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/exams/${params.id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        const data = res.data.data;
        const dateObject = new Date(data.date);
        const formattedDateTime = dateObject.toISOString().slice(0, 16);

        const updatedForm = {
          ...form,
          yearLevel: data.yearLevel,
          date: formattedDateTime,
          duration: data.duration,
          totalMarks: data.totalMarks,
        };

        if (data.classId) {
          setClassesName(data.classId.name);
          updatedForm.classId = data.classId._id;
        }

        if (data.subjectId) {
          setSubjectsName(data.subjectId.name);
          updatedForm.subjectId = data.subjectId._id;
        }

        setForm(updatedForm);
      });
  }, []);

  const responseFun = (complete = false) => {
    setOverlay(true);

    complete === true
      ? setResponse(true)
      : complete === "reapeted data"
      ? setResponse(400)
      : setResponse(false);
    window.onclick = () => {
      setOverlay(false);
    };
    setTimeout(() => {
      setOverlay(false);
    }, 3000);
  };

  const handleForm = (e) => {
    const { id, value } = e.target;

    if (id.includes(".")) {
      const [parentKey, childKey] = id.split(".");
      setForm((prevForm) => ({
        ...prevForm,
        [parentKey]: {
          ...prevForm[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [id]: value,
      }));
    }
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
    setDataError(false);
  }

  function selectClasses(e, id) {
    setForm({
      ...form,
      classId: id,
    });
    setClassesName(e.target.dataset.classes);
    setDataError(false);
  }

  function selectSubjects(e, id) {
    setForm({
      ...form,
      subjectId: id,
    });
    setSubjectsName(e.target.dataset.subject);
    setDataError(false);
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
    setForm({ ...form, classId: "", subjectId: "" });
    setClassesName("");
    setSubjectsName("");
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

      axios
        .get(
          `http://localhost:8000/api/subjects?yearLevel=${form.yearLevel}&active=true`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          setSubjects(res.data.data);
        });
    }
  }, [form.yearLevel]);
  const nav = useNavigate();
  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!form.yearLevel) setDataError("please choose a year level");
    else if (!form.classId) setDataError("please choose a class");
    else if (!form.subjectId) setDataError("please choose a subject");
    else {
      try {
        const data = await axios.patch(
          `http://localhost:8000/api/exams/${params.id}`,
          form,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (data.status === 200) {
          responseFun(true);
          setForm({
            classId: "",
            subjectId: "",
            yearLevel: "",
            date: "",
            duration: "",
            totalMarks: "",
          });
          nav("/dashboard/exams_schedule");
        }
      } catch (error) {
        console.log(error);
        if (error.status === 400) responseFun("reapeted data");
        else responseFun(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main>
      <div className="dashboard-container">
        <div className="container relative">
          {overlay && <SendData data="exam" response={response} />}
          <h1 className="title"> add exam </h1>
          <form onSubmit={handelSubmit} className=" relative dashboard-form">
            {loading && <FormLoading />}
            <h1>please complete the form to add a exam</h1>
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

                  <div className="flex flex-direction">
                    <label>subject</label>
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {subjectsName ? subjectsName : "please select subject"}
                      </div>
                      <article>
                        {subjects.map((e, i) => {
                          return (
                            <h2
                              onClick={(event) => selectSubjects(event, e._id)}
                              data-subject={`${e.name}`}
                              key={i}
                            >
                              {`${e.name}`}
                            </h2>
                          );
                        })}
                      </article>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-direction">
                <label htmlFor="date">exam date</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.date}
                  type="datetime-local"
                  id="date"
                  className="inp"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="duration">duration</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.duration}
                  type="number"
                  id="duration"
                  className="inp"
                  placeholder="exam minute duration"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="totalMarks">total Marks</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.totalMarks}
                  type="number"
                  id="totalMarks"
                  className="inp"
                  placeholder="exam minute total Marks"
                />
              </div>
            </div>
            {DataError && <p className="error">{DataError}</p>}
            <button className="btn">save </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UpdateExamSchedule;
