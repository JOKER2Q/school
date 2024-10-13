import { Link, NavLink, useLocation } from "react-router-dom";
import "./navbar.css";
import { useContext, useEffect } from "react";
import { Context } from "../../context/Context";
const Navbar = () => {
  const context = useContext(Context);
  const location = useLocation();
  window.onclick = () => {
    const langDiv = document.querySelector(
      "nav .setting .lang + div.languages.active-div"
    );
    langDiv && langDiv.classList.remove("active-div");
  };

  const modeFun = () => {
    document.body.classList.toggle("dark");
    context.setMode(document.body.classList.contains("dark"));
  };

  const openDiv = (ele) => {
    const allDivs = document.querySelectorAll("aside > div > .links > .center");
    allDivs.forEach((e, i) => {
      +ele.target.dataset.index !== i &&
        e.parentElement.classList.remove("active");
    });
    ele.target.parentElement.classList.toggle("active");
  };

  useEffect(() => {
    const linksDiv = document.querySelectorAll("aside .links");
    const removeClass = document.querySelectorAll(
      "aside > div > .links > .center"
    );
    removeClass.forEach((e) => e.classList.remove("active"));
    linksDiv.forEach((e) => {
      e.childNodes[1].childNodes.forEach((a) => {
        if (a.classList.contains("active")) {
          e.childNodes[0].classList.add("active");
        }
      });
    });
  }, [location.pathname]);

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

      <aside>
        <article className="between">
          <Link className="center" to={"/"}>
            <i className="fa-solid fa-graduation-cap"></i>
            <h1>school</h1>
          </Link>
          <i className="fa-solid fa-bars-staggered"></i>
        </article>

        <div className="flex-direction flex gap-10">
          <div className="links">
            <div data-index="0" onClick={openDiv} className="center">
              <i className="fa-solid fa-people-group"></i>
              <h1 className="flex-1">teachers</h1>
              <i className="arrow fa-solid fa-chevron-right"></i>
            </div>
            <article>
              <NavLink to={"/all_teachers"}>all teachers</NavLink>
              <NavLink to={"b"}>all teachers</NavLink>
              <NavLink to={"/2"}>all teachers</NavLink>
            </article>
          </div>
          <div className="links">
            <div data-index="1" onClick={openDiv} className="center">
              <i className="fa-solid fa-children"></i>
              <h1 className="flex-1">studants</h1>
              <i className="arrow fa-solid fa-chevron-right"></i>
            </div>
            <article>
              <NavLink to={"/1"}>all teachers</NavLink>
              <NavLink to={"3"}>all teachers</NavLink>
              <NavLink to={"/4"}>all teachers</NavLink>
            </article>
          </div>

          <div className="links">
            <div data-index="2" onClick={openDiv} className="center">
              <i className="fa-solid fa-school-flag"></i>
              <h1 className="flex-1">class</h1>
              <i className="arrow fa-solid fa-chevron-right"></i>
            </div>
            <article>
              <NavLink to={"/5"}>all teachers</NavLink>
              <NavLink to={"6"}>all teachers</NavLink>
              <NavLink to={"/7"}>all teachers</NavLink>
            </article>
          </div>

          <div className="links">
            <div data-index="3" onClick={openDiv} className="center">
              <i className="fa-solid fa-list-check"></i>
              <h1 className="flex-1">exam</h1>
              <i className="arrow fa-solid fa-chevron-right"></i>
            </div>
            <article>
              <NavLink to={"/8"}>all teachers</NavLink>
              <NavLink to={"9"}>all teachers</NavLink>
              <NavLink to={"/g"}>all teachers</NavLink>
            </article>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
