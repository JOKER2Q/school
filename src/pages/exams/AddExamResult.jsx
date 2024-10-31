import React, { useEffect, useState } from "react";
import "../../components/form.css";
import axios from "axios";
import FormLoading from "../../components/FormLoading";
import SendData from "../../components/response/SendData";

const AddExamResult = () => {
  const [form, setForm] = useState({
    classId: "",
    subjectId: "",
    yearLevel: "",
    score: "",
    exam: "",
  });

  const [loading, setLoading] = useState(false);
  const [DataError, setDataError] = useState(false);
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [response, setResponse] = useState(false);

  const [dataNames, setDataNames] = useState({
    classesName: "",
    examsName: "",
  });

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
    setDataNames({ ...dataNames, classesName: e.target.dataset.classes });
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
    setForm({ ...form, exam: "" });
    setDataNames({ ...dataNames, examsName: "" });
    if (form.classId) {
      axios
        .get(`http://localhost:8000/api/exams?classId=${form.classId}`)
        .then((res) => {
          setExams(res.data.data);
        });
    }
  }, [form.classId]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!form.yearLevel) setDataError("please choose a year level");
    else if (!form.classId) setDataError("please choose a class");
    else if (!form.subjectId) setDataError("please choose a subject");
    else {
      try {
        const data = await axios.post("http://localhost:8000/api/exams", form);

        if (data.status === 201) {
          responseFun(true);
          setForm({
            classId: "",
            subjectId: "",
            yearLevel: "",
          });
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
                    <label>exam</label>
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {dataNames.exams
                          ? dataNames.exams
                          : "please select exam"}
                      </div>
                      <article>
                        {exams.map((e, i) => {
                          return (
                            <h2
                              onClick={(event) => selectClasses(event, e._id)}
                              data-classes={e.subjectId.name}
                              key={i}
                            >
                              {e.subjectId.name}
                            </h2>
                          );
                        })}
                      </article>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-direction">
                <label htmlFor="totalMarks">score</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.score}
                  type="number"
                  id="score"
                  className="inp"
                  placeholder="exam minute total Marks"
                />
              </div>
            </div>
            {DataError && <p className="error">{DataError}</p>}
            <button className="btn">save</button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddExamResult;
