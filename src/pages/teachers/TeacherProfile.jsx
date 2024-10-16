import React from "react";
import "../../components/profile.css";
import { Link } from "react-router-dom";
const TeacherProfile = () => {
  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <h1 class="title">diyar's profile</h1>
          <div className="profile">
            <div className="image">
              <img
                className="photo"
                src={require("./pexels-fauxels-3184416.jpg")}
                alt=""
              />
              <Link className="center gap-10">
                <i className="fa-regular fa-pen-to-square"></i> update your info{" "}
              </Link>
            </div>
            <div className="info">
              <h2 className="name">
                diyar direki
                <Link>
                  <i className="fa-regular fa-pen-to-square"></i>
                </Link>
              </h2>
              <h3 className="baio">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus
                fuga nulla ut, vitae consequuntur voluptatem perferendis! Non
                aspernatur ratione recusandae eligendi mollitia, veniam,
                officiis possimus officia, quo reiciendis eos. Ut.
              </h3>
              <div className="flex">
                <h2>father name:</h2>
                <p>berzani</p>
              </div>
              <div className="flex">
                <h2>gender:</h2>
                <p>male</p>
              </div>
              <div className="flex">
                <h2>mother name:</h2>
                <p>sicrt</p>
              </div>
              <div className="flex">
                <h2>birth date:</h2>
                <p>2003/10/11</p>
              </div>
              <div className="flex">
                <h2>email:</h2>
                <p className="email">diyardireki111@gmail.com</p>
              </div>
              <div className="flex">
                <h2>Class:</h2>
                <p>2</p>
              </div>
              <div className="flex">
                <h2>subject:</h2>
                <p>english</p>
              </div>
              <div className="flex">
                <h2>address:</h2>
                <p>syria qamishlo</p>
              </div>
              <div className="flex">
                <h2>phone:</h2>
                <p>+963 936 038 904</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TeacherProfile;
