import { useContext, useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../../context/Context";
const AllStudents = () => {
  const context = useContext(Context);
  const language = context && context.selectedLang;
  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [overlay, setOverlay] = useState(false);
  const [form, setForm] = useState("");
  const [gender, setGender] = useState(false);
  const [search, setSearch] = useState(false);
  const [yearLevel, setYearLevel] = useState(false);
  const divsCount = 10;

  window.addEventListener("click", () => {
    const overlayDiv = document.querySelector(".overlay");
    if (overlayDiv) {
      setOverlay(false);
      if (selectedItems.length <= 1) {
        setSelectedItems([]);
      }
      const allSelectors = document.querySelectorAll("td .checkbox");
      allSelectors.forEach((e) => e.classList.remove("active"));
    }
    const selectDiv = document.querySelector(".selecte .inp.active");
    selectDiv && selectDiv.classList.remove("active");
  });

  function updateData(e) {
    setSearchData([]);
    setSelectedItems([]);
    setLoading(true);
    const check = document.querySelector("th .checkbox.active");
    check && check.classList.remove("active");
    const pages = document.querySelectorAll("div.table .pagination h3");
    pages.forEach((e) => e.classList.remove("active"));
    e.target.classList.add("active");
    setActivePage(+e.target.dataset.page);
  }
  const createPags = (dataCount, dataLength) => {
    const pages = Math.ceil(dataLength / dataCount);
    let h3Pages = [];
    for (let i = 0; i < pages; i++) {
      h3Pages.push(
        <h3
          onClick={updateData}
          data-page={i + 1}
          key={i}
          className={`${i === 0 ? "active" : ""}`}
        >
          {i + 1}
        </h3>
      );
    }

    return h3Pages;
  };

  const getSearchData = async () => {
    let URL = `http://localhost:8000/api/students/search/${form}?page=${activePage}&limit=${divsCount}&active=true`;
    if (yearLevel) URL += `&yearLevel=${yearLevel}`;
    if (gender) URL += `&gender=${gender}`;
    try {
      const data = await axios.get(URL);

      setDataLength(data.data.totalResults);
      setSearchData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    let URL = `http://localhost:8000/api/students?limit=${divsCount}&page=${activePage}&active=true`;
    if (yearLevel) URL += `&yearLevel=${yearLevel}`;
    if (gender) URL += `&gender=${gender}`;
    try {
      const data = await axios.get(URL);
      const fltr = data.data.data.filter((e) => e.active);

      setDataLength(data.data.numberOfActiveStudents);

      setSearchData(fltr);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) getSearchData();
    else fetchData();
  }, [activePage, yearLevel, gender, search]);

  const openOptions = (e) => {
    e.stopPropagation();
    const div = document.querySelectorAll("div.table tbody td div.options");
    div.forEach((ele, i) => {
      if (+e.target.dataset.index !== i) {
        ele.classList.remove("active-div");
      }
    });
    div[e.target.dataset.index].classList.toggle("active-div");
  };
  const checkOne = (e, element) => {
    e.target.classList.toggle("active");
    if (e.target.classList.contains("active")) {
      setSelectedItems((prevSelected) => [...prevSelected, element]);
      const allActiveSelectors = document.querySelectorAll(
        "td .checkbox.active"
      );
      const allSelectors = document.querySelectorAll("td .checkbox");
      if (allSelectors.length === allActiveSelectors.length)
        document.querySelector("th .checkbox").classList.add("active");
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((item) => item !== element)
      );
      document.querySelector("th .checkbox").classList.remove("active");
    }
  };

  const checkAll = (e) => {
    const allActiveSelectors = document.querySelectorAll("td .checkbox.active");
    const allSelectors = document.querySelectorAll("td .checkbox");
    setSelectedItems([]);

    if (
      allActiveSelectors.length >= 0 &&
      allActiveSelectors.length !== allSelectors.length
    ) {
      allSelectors.forEach((e) => e.classList.add("active"));
      e.target.classList.add("active");
      searchData.forEach((e) => {
        setSelectedItems((prev) => [...prev, e._id]);
      });
    } else {
      allSelectors.forEach((e) => e.classList.remove("active"));
      e.target.classList.remove("active");
      setSelectedItems([]);
    }
  };
  window.onclick = () => {
    const activeDiv = document.querySelector(
      "div.table tbody td div.options.active-div"
    );

    activeDiv && activeDiv.classList.remove("active-div");
  };

  const tableData = searchData.map((e, i) => {
    return (
      <tr key={e._id}>
        <td>
          <div
            onClick={(target) => checkOne(target, e._id)}
            className="checkbox"
          ></div>
        </td>

        <td>{`${e.firstName} ${e.lastName}`}</td>
        <td> {e.contactInfo.phone} </td>
        <td> {e.gender} </td>
        <td>{e.yearLevel}</td>
        <td>{e.guardianContact.name}</td>
        <td> {e.guardianContact.phone}</td>
        <td>
          <i
            onClick={openOptions}
            className="options fa-solid fa-ellipsis"
            data-index={i}
          ></i>
          <div className="options has-visit">
            <div
              onClick={(event) => {
                event.stopPropagation();
                setOverlay(true);
                const allSelectors = document.querySelectorAll("td .checkbox");
                allSelectors.forEach((e) => e.classList.remove("active"));
                setSelectedItems([e._id]);
              }}
              className="flex delete"
            >
              <i className="fa-solid fa-trash"></i>{" "}
              {language.students && language.students.delete}
            </div>
            <Link to={`/update_student/${e._id}`} className="flex update">
              <i className="fa-regular fa-pen-to-square"></i>
              {language.students && language.students.update}
            </Link>
            <Link to={`/student_profile/${e._id}`} className="flex visit">
              <i className="fa-solid fa-circle-user"></i>{" "}
              {language.students && language.students.visit}
            </Link>
          </div>
        </td>
      </tr>
    );
  });

  const deleteOne = async () => {
    try {
      const data = await axios.patch(
        `http://localhost:8000/api/students/deactivate/${selectedItems[0]}`
      );
      data && fetchData();

      setSelectedItems([]);
    } catch (error) {
      console.log(error);
    } finally {
      setOverlay(false);
    }
  };

  const deleteAll = async () => {
    try {
      const data = await axios.patch(
        "http://localhost:8000/api/students/deleteStudents",
        {
          ids: selectedItems,
        }
      );
      data && fetchData();
      selectedItems.length = 0;
    } catch (error) {
      console.log(error);
    } finally {
      setOverlay(false);
    }
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };
  const selectYears = (e) => {
    setYearLevel(parseInt(e.target.dataset.level));
  };
  const selectGender = (e) => {
    if (e.target.dataset.gender !== "0") setGender(e.target.dataset.gender);
    else setGender(false);
  };
  function createYearLeve() {
    let h2 = [];
    for (let index = 1; index < 13; index++) {
      h2.push(
        <h2 onClick={selectYears} key={index} data-level={index}>
          {index}
        </h2>
      );
    }
    return h2;
  }
  return (
    <main>
      <div className="dashboard-container">
        {overlay && (
          <div className="overlay">
            <div className="change-status">
              <h1>{`${language.students && language.students.confirm_delete}(${
                selectedItems.length
              })`}</h1>
              <div className="flex gap-20">
                <div
                  onClick={() => {
                    if (selectedItems.length === 1) deleteOne();
                    else deleteAll();
                  }}
                  className="false center"
                >
                  <h2>{language.students && language.students.delete}</h2>
                  <i className="fa-solid fa-trash"></i>
                </div>
                <div
                  onClick={() => {
                    setOverlay(false);
                    if (selectedItems.length === 1) setSelectedItems([]);
                  }}
                  className="none center"
                >
                  <h2>{language.students && language.students.cancel_btn}</h2>
                  <i className="fa-solid fa-ban"></i>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="container">
          <h1 className="title">
            {language.students && language.students.all_students}
          </h1>
          <div className="tabel-container">
            <div className="table">
              <form onSubmit={handelSubmit} className="flex search gap-20">
                <input
                  onInput={(e) => {
                    setForm(e.target.value);
                    if (!e.target.value) setSearch(false);
                  }}
                  value={form}
                  required
                  type="text"
                  placeholder={
                    language.students && language.students.search_by_name
                  }
                />
                <div className="flex flex-direction">
                  <div className="selecte">
                    <div onClick={handleClick} className="inp">
                      {yearLevel
                        ? `${
                            language.students && language.students.year_level
                          }: ` + yearLevel
                        : `${
                            language.students && language.students.year_level
                          }: ${
                            language.students && language.students.all_years
                          }`}
                    </div>
                    <article className="grid-3">
                      <h2 data-level={false} onClick={selectYears}>
                        {language.students && language.students.all_years}
                      </h2>
                      {createYearLeve()}
                    </article>
                  </div>
                </div>
                <div className="flex flex-direction">
                  <div className="selecte">
                    <div onClick={handleClick} className="inp">
                      {gender
                        ? `${
                            language.students && language.students.gender
                          } : ` + gender
                        : `${language.students && language.students.gender}: ${
                            language.students && language.students.both_genders
                          }`}
                    </div>
                    <article>
                      <h2 onClick={selectGender} data-gender={0}>
                        {language.students && language.students.both_genders}
                      </h2>
                      <h2 onClick={selectGender} data-gender="Male">
                        {language.students && language.students.male}
                      </h2>
                      <h2 onClick={selectGender} data-gender="Female">
                        {language.students && language.students.female}
                      </h2>
                    </article>
                  </div>
                </div>

                <button className="btn fa-solid fa-magnifying-glass"></button>
                <Link className="btn" to={"/add_student"}>
                  <i className="fa-regular fa-square-plus"></i>{" "}
                  {language.students && language.students.add_student}
                </Link>
              </form>
              <table className={`${tableData.length === 0 ? "loading" : ""}`}>
                <thead>
                  <tr>
                    <th>
                      <div
                        onClick={checkAll}
                        className="checkbox select-all"
                      ></div>
                    </th>
                    <th>{language.students && language.students.name}</th>
                    <th>{language.students && language.students.phone}</th>
                    <th>{language.students && language.students.gender}</th>
                    <th>{language.students && language.students.year_level}</th>
                    <th>
                      {language.students && language.students.guardian} :{" "}
                    </th>
                    <th>
                      {language.students && language.students.guardian_phone}
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody
                  className={`${tableData.length === 0 ? "relative" : ""}`}
                >
                  {tableData.length > 0
                    ? tableData
                    : !loading && (
                        <div className="table-loading">
                          {language.students && language.students.no_data}
                        </div>
                      )}
                  {loading && (
                    <div className="table-loading">
                      {language.students && language.students.loading}
                    </div>
                  )}
                </tbody>
              </table>
              {selectedItems.length > 1 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setOverlay(true);
                  }}
                  className="delete-all"
                >
                  <i className="fa-solid fa-trash"></i>
                  {language.students && language.students.delete_all_btn}(
                  {selectedItems.length})
                </div>
              )}
              <div className="pagination flex">
                {createPags(divsCount, dataLength)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AllStudents;
