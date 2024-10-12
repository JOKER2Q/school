import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./navbar.css";
const Navbar = () => {
  return (
    <>
      <nav className="center">
        <div className="container between">
          <div className="search center">
            <input
              type="text"
              className="flex-1"
              placeholder="write somthing"
            />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <div className="setting  center">
            <div className="info center">
              <i className="center photo fa-solid fa-user"></i>
              <article>
                <h1>diyar direki</h1>
                <p> admin </p>
              </article>
            </div>
            <div className="lang center ">
              <i className="fa-solid fa-earth-americas"></i>
              <span>EN</span>
              <i className="fa-solid fa-chevron-down"></i>
            </div>
          </div>
        </div>
      </nav>

      <aside>
        <article className="between">
          <Link className="center" to={"/"}>
            <i className="fa-solid fa-graduation-cap"></i>
            <h1>school</h1>
          </Link>
          <i className="fa-solid fa-bars-staggered"></i>
        </article>

        <div className="flex-direction flex gap-20">
          <div className="links">
            <div className="center active">
              <i className="fa-solid fa-people-group"></i>
              <h1 className="flex-1">teachers</h1>
              <i className="arrow fa-solid fa-chevron-right active"></i>
            </div>
            <article>
              <NavLink to={"/a"}>all teachers</NavLink>
              <NavLink to={"b"}>all teachers</NavLink>
              <NavLink>all teachers</NavLink>
            </article>
          </div>
          <div className="links">
            <div className="center">
              <i className="fa-solid fa-children"></i>
              <h1 className="flex-1">studants</h1>
              <i className="arrow fa-solid fa-chevron-right"></i>
            </div>
          </div>

          <div className="links">
            <div className="center">
              <i className="fa-solid fa-school-flag"></i>
              <h1 className="flex-1">class</h1>
              <i className="arrow fa-solid fa-chevron-right"></i>
            </div>
          </div>

          <div className="links">
            <div className="center">
              <i className="fa-solid fa-list-check"></i>
              <h1 className="flex-1">exam</h1>
              <i className="arrow fa-solid fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
