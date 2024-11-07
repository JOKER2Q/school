import React, { useContext, useEffect, useState } from "react";
import "../../components/form.css";
import axios from "axios";
import FormLoading from "../../components/FormLoading";
import SendData from "../../components/response/SendData";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../context/Context";

const UpdateStudent = () => {
  const { id } = useParams();
  const context = useContext(Context);
  const token = context && context.userDetails.token;
  const nav = useNavigate();
  const [form, setForm] = useState({
    contactInfo: { email: "", phone: "" },
    address: {
      street: "",
      city: "",
    },
    guardianContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    yearLevel: "",
    dateOfBirth: "",
    enrollmentDate: "",
    classId: "",
  });

  const [loading, setLoading] = useState(false);
  const [DataError, setDataError] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classesName, setClassesName] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/students/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        const data = res.data.data;

        const dateOfBirth = new Date(data.dateOfBirth)
          .toISOString()
          .slice(0, 16);
        const enrollmentDate = new Date(data.enrollmentDate)
          .toISOString()
          .slice(0, 16);

        const updatedForm = {
          ...form,
          contactInfo: {
            email: data.contactInfo.email,
            phone: data.contactInfo.phone,
          },
          address: {
            street: data.address.street,
            city: data.address.city,
          },
          guardianContact: {
            name: data.guardianContact.name,
            phone: data.guardianContact.phone,
            relationship: data.guardianContact.relationship,
          },
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          gender: data.gender,
          yearLevel: data.yearLevel,
          dateOfBirth: dateOfBirth,
          enrollmentDate: enrollmentDate,
        };

        if (data.classId) {
          setClassesName(data.classId.name);
          updatedForm.classId = data.classId._id;
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

  function selectMale(e) {
    setForm({ ...form, gender: e.target.dataset.gender });
    setDataError(false);
  }

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
    setClassesName("");
    setForm({ ...form, classId: "" });
    form.yearLevel &&
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
  }, [form.yearLevel]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!form.gender) setDataError("please choose a gender");
    else if (!form.yearLevel) setDataError("please choose a year level");
    else if (!form.classId) setDataError("please choose a classes");
    else {
      try {
        const data = await axios.patch(
          `http://localhost:8000/api/students/${id}`,
          form,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setForm({
          contactInfo: { email: "", phone: "" },
          address: {
            street: "",
            city: "",
          },
          guardianContact: {
            name: "",
            phone: "",
            relationship: "",
          },
          firstName: "",
          middleName: "",
          lastName: "",
          gender: "",
          yearLevel: "",
          dateOfBirth: "",
          enrollmentDate: "",
          classId: "",
        });
        if (data.status === 200) {
          responseFun(true);
          nav("/dashboard/all_students");
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
          {overlay && <SendData data="student" response={response} />}
          <h1 className="title"> add student </h1>
          <form onSubmit={handelSubmit} className=" relative dashboard-form">
            {loading && <FormLoading />}
            <h1>please complete the form to add a student</h1>
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
                <label htmlFor="contactInfo.email">email</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.contactInfo.email}
                  type="email"
                  id="contactInfo.email"
                  placeholder="please write your email"
                  className="inp"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="contactInfo.phone">phone</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.contactInfo.phone}
                  type="text"
                  id="contactInfo.phone"
                  className="inp"
                  placeholder="please write your phone number"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="dateOfBirth">date of birth</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.dateOfBirth.slice(0, 10)}
                  type="date"
                  id="dateOfBirth"
                  className="inp"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="address.city">city</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.address.city}
                  type="text"
                  id="address.city"
                  className="inp"
                  placeholder="please write your city"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="address.street">street</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.address.street}
                  type="text"
                  id="address.street"
                  className="inp"
                  placeholder="please write your address"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="guardianContact.name">Guardian name</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.guardianContact.name}
                  type="text"
                  id="guardianContact.name"
                  className="inp"
                  placeholder="please write your Guardian"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="guardianContact.relationship">
                  relationship
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.guardianContact.relationship}
                  type="text"
                  id="guardianContact.relationship"
                  className="inp"
                  placeholder="ex : mother , father , bro..."
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="guardianContact.phone">Guardian phone</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.guardianContact.phone}
                  type="text"
                  id="guardianContact.phone"
                  className="inp"
                  placeholder="please write your Guardian phone"
                />
              </div>

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
                </>
              )}
              <div className="flex flex-direction">
                <label htmlFor="enrollmentDate">enrollment Date</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.enrollmentDate.slice(0, 10)}
                  type="date"
                  id="enrollmentDate"
                  className="inp"
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

export default UpdateStudent;
