import React, { useEffect, useState } from "react";
import "../../components/form.css";
import axios from "axios";
import FormLoading from "../../components/FormLoading";

const AddTeacher = () => {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    yearLevel: "",
    subjects: "",
    classes: "",
  });

  const [loading, setLoading] = useState(false);
  const [DataError, setDataError] = useState(false);
  const [subject, setSubject] = useState([]);
  const [subjectName, setSubjectName] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classesName, setClassesName] = useState([]);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  const handleClick = (e) => {
    e.target.classList.toggle("active");
  };

  function selectMale(e) {
    setForm({ ...form, gender: e.target.dataset.gender });
    setDataError(false);
  }

  function selectYears(e) {
    setForm({
      ...form,
      yearLevel: [...new Set([...form.yearLevel, e.target.dataset.level])],
    });
    setDataError(false);
  }
  function selectSubjects(e, id) {
    setForm({
      ...form,
      subjects: [...new Set([...form.subjects, id])],
    });
    setSubjectName((prev) => [...new Set([...prev, e.target.dataset.subject])]);
    setDataError(false);
  }
  function selectClasses(e, id) {
    setForm({
      ...form,
      classes: [...new Set([...form.classes, id])],
    });
    setClassesName((prev) => [...new Set([...prev, e.target.dataset.classes])]);
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
    const fetchSubjects = async () => {
      try {
        const allSubjects = await Promise.all(
          form.yearLevel &&
            form.yearLevel.map(async (yearLevel) => {
              const response = await fetch(
                `http://localhost:8000/api/subjects?yearLevel=${yearLevel}&active=true`
              );
              if (!response.ok) {
                throw new Error(
                  `Error fetching data for year level ${yearLevel}`
                );
              }
              const data = await response.json();
              return data.data;
            })
        );
        setSubject(allSubjects.flat()); // Flatten the array if needed
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };

    fetchSubjects();
  }, [form.yearLevel]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const allSubjects = await Promise.all(
          form.yearLevel &&
            form.yearLevel.map(async (yearLevel) => {
              const response = await fetch(
                `http://localhost:8000/api/classes?yearLevel=${yearLevel}&active=true`
              );
              if (!response.ok) {
                throw new Error(
                  `Error fetching data for year level ${yearLevel}`
                );
              }
              const data = await response.json();
              return data.data;
            })
        );
        setClasses(allSubjects.flat()); // Flatten the array if needed
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };

    fetchClasses();
  }, [form.yearLevel]);
  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!form.gender) setDataError("please choose a gender");
    else if (!form.yearLevel) setDataError("please choose a year level");
    else if (!form.classes) setDataError("please choose a classes");
    else if (!form.subjects) setDataError("please choose a subject");
    else {
      try {
        const data = await axios.post(
          "http://localhost:8000/api/teachers",
          form
        );
        setForm({
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          gender: "",
          yearLevel: "",
          subjects: "",
          classes: "",
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <h1 className="title"> add teaher </h1>
          <form onSubmit={handelSubmit} className=" relative dashboard-form">
            {loading && <FormLoading />}
            <h1>please complete the form to add a teacher</h1>
            <div className="flex wrap ">
              <div className="flex flex-direction">
                <label htmlFor="firstName">first name</label>
                <input
                  onInput={handleForm}
                  value={form.firstName}
                  type="text"
                  id="firstName"
                  className="inp"
                  required
                  placeholder="please write your first name"
                />
              </div>
              <div className="flex flex-direction">
                <label htmlFor="middleName">middle name</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.middleName}
                  type="text"
                  id="middleName"
                  className="inp"
                  placeholder="please write your middle name"
                />
              </div>
              <div className="flex flex-direction">
                <label htmlFor="lastName">last name</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.lastName}
                  type="text"
                  id="lastName"
                  placeholder="please write your last name"
                  className="inp"
                />
              </div>

              <div className="flex flex-direction">
                <label>gender</label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {form.gender ? form.gender : "please selecte gander"}
                  </div>
                  <article>
                    <h2 onClick={selectMale} data-gender="Male">
                      male
                    </h2>
                    <h2 onClick={selectMale} data-gender="Female">
                      Female
                    </h2>
                  </article>
                </div>
              </div>

              <div className="flex flex-direction">
                <label htmlFor="email">email</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.email}
                  type="email"
                  id="email"
                  placeholder="please write your email"
                  className="inp"
                />
              </div>
              <div className="flex flex-direction">
                <label htmlFor="phoneNumber">phone</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.phoneNumber}
                  type="text"
                  id="phoneNumber"
                  className="inp"
                  placeholder="please write your phone number"
                />
              </div>
              <div className="flex flex-direction">
                <label>year level</label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {form.yearLevel
                      ? form.yearLevel.join(" , ")
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
                        {classesName.length > 0
                          ? classesName.join(" , ")
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
                  <div className="flex flex-direction">
                    <label>subject</label>
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {subjectName.length > 0
                          ? subjectName.join(" , ")
                          : "please select subject"}
                      </div>
                      <article>
                        {subject.map((e, i) => {
                          return (
                            <h2
                              onClick={(event) => selectSubjects(event, e._id)}
                              data-subject={e.name}
                              key={i}
                            >
                              {e.name}
                            </h2>
                          );
                        })}
                      </article>
                    </div>
                  </div>
                </>
              )}
            </div>
            {DataError && <p className="error">{DataError}</p>}
            <button className="btn">save </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddTeacher;
