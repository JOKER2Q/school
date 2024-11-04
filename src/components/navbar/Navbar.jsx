import { Link, NavLink, useLocation } from "react-router-dom";
import "./navbar.css";
import { useContext, useEffect } from "react";
import { Context } from "../../context/Context";
const Navbar = () => {
  const context = useContext(Context);
  const location = useLocation();
  const isClosed = JSON.parse(localStorage.getItem("isClosed")) || false;

  window.addEventListener("click", () => {
    const langDiv = document.querySelector(
      "nav .setting .lang + div.languages.active-div"
    );
    langDiv && langDiv.classList.remove("active-div");
    const linksDiv = document.querySelector(
      "aside.closed > div > .links.active"
    );
    if (linksDiv) {
      linksDiv.classList.remove("active");
      document.querySelector("main").classList.remove("div-open");
    }
    const inpDiv = document.querySelector(
      "form.dashboard-form .selecte .inp.active"
    );
    inpDiv && inpDiv.classList.remove("active");
  });

  const modeFun = () => {
    document.body.classList.toggle("dark");
    context.setMode(document.body.classList.contains("dark"));
  };

  const openDiv = (ele) => {
    ele.stopPropagation();
    const allDivs = document.querySelectorAll("aside > div > .links > .center");
    allDivs.forEach((e, i) => {
      +ele.target.dataset.index !== i &&
        e.parentElement.classList.remove("active");
    });
    ele.target.parentElement.classList.toggle("active");
    if (document.querySelector("aside.closed")) {
      const main = document.querySelector("main");
      main && main.classList.toggle("div-open");
    }
  };

  useEffect(() => {
    const linksDiv = document.querySelectorAll("aside .links");
    const removeClass = document.querySelectorAll(
      "aside > div > .links > div.center"
    );
    removeClass && removeClass.forEach((e) => e.classList.remove("active"));
    linksDiv &&
      linksDiv.forEach((e) => {
        e.childNodes[1].childNodes.forEach((a) => {
          if (a.classList.contains("active")) {
            e.childNodes[0].classList.add("active");
          }
        });
      });
    const nav = document.querySelector("nav.closed");
    const container = document.querySelector(".dashboard-container");
    nav && container && container.classList.add("closed");
    const activeArticle = document.querySelector("aside > div > .links.active");
    activeArticle && activeArticle.classList.remove("active");
  }, [location.pathname]);

  const closeAside = () => {
    const nav = document.querySelector("nav");
    const aside = document.querySelector("aside");
    const container = document.querySelector(".dashboard-container");
    nav && nav.classList.toggle("closed");
    localStorage.setItem("isClosed", nav.classList.contains("closed"));
    aside && aside.classList.toggle("closed");
    container && container.classList.toggle("closed");
  };

  return (
    <>
      <nav className={`${!isClosed === false ? "closed" : ""} center`}>
        <div className="container between">
          <div className="search center">
            <input
              type="text"
              className="flex-1"
              placeholder="write something"
            />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <div className="setting  center">
            <Link to={"teacher_profile"} className="info center">
              <i className="center photo fa-solid fa-user"></i>
              <article>
                <h4>diyar direki</h4>
                <p> admin </p>
              </article>
            </Link>
            <i
              onClick={modeFun}
              className="fa-solid fa-moon fa-regular mode"
            ></i>
            <article className="relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  document
                    .querySelector("nav .setting .lang + div.languages")
                    .classList.toggle("active-div");
                }}
                className="lang center "
              >
                <i className="fa-solid fa-earth-americas"></i>
                <span>EN</span>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
              <div className="languages">
                <h2 data-lang="AR">عربي</h2>
                <h2 className="active" data-lang="EN">
                  english
                </h2>
              </div>
            </article>
          </div>
        </div>
      </nav>

      <aside className={`${!isClosed === false ? "closed" : ""}`}>
        <article className="between">
          <Link className="center" to={"/"}>
            <i className="fa-solid fa-graduation-cap"></i>
            <h1>school</h1>
          </Link>
          <i onClick={closeAside} className="fa-solid fa-bars-staggered"></i>
        </article>

        <div className="flex-direction flex gap-10">
          <div className="links">
            <div data-index="0" onClick={openDiv} className="center">
              <i className="fa-solid fa-people-group"></i>
              <h1 className="flex-1">teachers</h1>
              <i className="arrow fa-solid fa-chevron-right"></i>
            </div>
            <article>
              <NavLink to={"all_teachers"}>all teachers</NavLink>
              <NavLink to={"add_teacher"}>add teacher</NavLink>
            </article>
          </div>
          <div className="links">
            <div data-index="1" onClick={openDiv} className="center">
              <i className="fa-solid fa-children"></i>
              <h1 className="flex-1">studants</h1>
              <i className="arrow fa-solid fa-chevron-right"></i>
            </div>
            <article>
              <NavLink to={"all_students"}>all studants</NavLink>
              <NavLink to={"add_student"}>add studant</NavLink>
            </article>
          </div>

          <div className="links">
            <div data-index="2" onClick={openDiv} className="center">
              <i className="fa-solid fa-list-check"></i>
              <h1 className="flex-1">exam</h1>
              <i className="arrow fa-solid fa-chevron-right"></i>
            </div>
            <article>
              <NavLink to={"exams_schedule"}>exams schedule</NavLink>
              <NavLink to={"add_exam"}>add exam</NavLink>
              <NavLink to={"exams_result"}>exams result</NavLink>
              <NavLink to={"add_exam_result"}>add exams result</NavLink>
            </article>
          </div>

          <div className="links">
            <div data-index="3" onClick={openDiv} className="center">
              <i className="fa-regular fa-calendar-days"></i>
              <h1 className="flex-1">activitys</h1>
              <i className="arrow fa-solid fa-chevron-right"></i>
            </div>
            <article>
              <NavLink to={"attendence"}>attendence</NavLink>
              <NavLink to={"time_table"}>time table</NavLink>
            </article>
          </div>
          <NavLink to={"subjects"} className="w-100 justify-start center">
            <i className="fa-solid fa-pen-nib"></i>
            <h1>subjects</h1>
          </NavLink>
          <NavLink to={"classes"} className="w-100 justify-start center">
            <i className="fa-solid fa-school-flag"></i>
            <h1>calsses</h1>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
