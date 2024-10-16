import React, { useState } from "react";
import "../../components/form.css";

const AddTeacher = () => {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mothersName: "",
    gender: "",
    birthDate: "",
    email: "",
    phone: "",
    address: "",
  });
  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  const handleClick = (e) => {
    e.target.classList.toggle("active");
  };

  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <h1 className="title"> add teaher </h1>
          <form className="dashboard-form">
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
                <label htmlFor="mothersName">mothers name</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.mothersName}
                  type="text"
                  id="mothersName"
                  placeholder="please write your last name"
                  className="inp"
                />
              </div>
              <div className="flex flex-direction">
                <label>gender</label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    please selecte gander
                  </div>
                  <article>
                    <h2>option 1</h2>
                  </article>
                </div>
              </div>
              <div className="flex flex-direction">
                <label htmlFor="birthDate">birth date</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.birthDate}
                  type="date"
                  id="birthDate"
                  className="inp"
                />
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
                <label htmlFor="phone">phone</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.phone}
                  type="text"
                  id="phone"
                  className="inp"
                  placeholder="please write your phone number"
                />
              </div>
              <div className="flex flex-direction">
                <label htmlFor="address">address</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.address}
                  type="text"
                  id="address"
                  className="inp"
                  placeholder="please write your address"
                />
              </div>
              <div className="flex flex-direction">
                <label>class</label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    please selecte class
                  </div>
                  <article>
                    <h2>option 1</h2>
                  </article>
                </div>
              </div>
              <div className="flex flex-direction">
                <label>subject</label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    please select subject
                  </div>
                  <article>
                    <h2>option 1</h2>
                  </article>
                </div>
              </div>
              <div className="flex flex-direction">
                <label htmlFor="photo">add photo</label>
                <input type="file" id="photo" accept="image/*" />
              </div>
            </div>
            <button className="btn">save </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddTeacher;
