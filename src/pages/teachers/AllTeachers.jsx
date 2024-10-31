import { useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
const AllTeachers = () => {
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const divsCount = 10;

  function updateData(e) {
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
  const fetchData = async () => {
    const data = await axios.get(
      `http://localhost:8000/api/teachers/details?limit=${divsCount}&page=${activePage}&active=true`
    );
    const fltr = data.data.data.filter((e) => e.active);

    setDataLength(data.data.numberOfActiveTeachers);

    setData(fltr);
    setSearchData(fltr);
  };
  useEffect(() => {
    fetchData();
  }, [activePage]);

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

  const tableData =
    searchData &&
    searchData.map((e, i) => {
      return (
        <tr key={e._id}>
          <td>
            <div
              onClick={(target) => checkOne(target, e._id)}
              className="checkbox"
            ></div>
          </td>
          <td>
            <i className="center photo fa-solid fa-user"></i>
          </td>
          <td>{`${e.firstName} ${e.lastName}`}</td>
          <td> {e.gender} </td>
          <td>
            {e.classes.map((el) => {
              return `${el.yearLevel}:${el.name},`;
            })}
          </td>
          <td>
            {e.subjects.map((el) => {
              return `${el.name},`;
            })}
          </td>
          <td> {e.phoneNumber} </td>
          <td>
            <i
              onClick={openOptions}
              className="options fa-solid fa-ellipsis"
              data-index={i}
            ></i>
            <div className="options">
              <div className="flex delete">
                <i className="fa-solid fa-trash"></i> delete
              </div>
              <div className="flex update">
                <Link className="fa-regular fa-pen-to-square"></Link>
                update
              </div>
              <div className="flex visit">
                <Link className="fa-solid fa-circle-user"></Link> visit
              </div>
            </div>
          </td>
        </tr>
      );
    });
  const handelInput = () => {
    const nameSearchValue = document
      .querySelector(`input[data-type="name"]`)
      .value.toLowerCase();

    const classSearchValue = document
      .querySelector(`input[data-type="class"]`)
      .value.toLowerCase();
    const subjectSearchValue = document
      .querySelector(`input[data-type="subject"]`)
      .value.toLowerCase();

    const fltr = data.filter((e) => {
      const nameMatch = nameSearchValue
        ? e.firstName.toLowerCase().includes(nameSearchValue) ||
          e.lastName.toLowerCase().includes(nameSearchValue)
        : true;

      const classMatch = classSearchValue
        ? e.classes.some((cls) =>
            cls.name.toLowerCase().includes(classSearchValue)
          )
        : true;

      const subjectMatch = subjectSearchValue
        ? e.subjects.some((subject) =>
            subject.name.toLowerCase().includes(subjectSearchValue)
          )
        : true;

      return nameMatch && classMatch && subjectMatch;
    });

    setSearchData(fltr);

    if (!nameSearchValue && !classSearchValue && !subjectSearchValue) {
      setSearchData(data);
    }
  };
  const deleteAll = async () => {
    try {
      const data = await axios.patch(
        "http://localhost:8000/api/teachers/deleteTeachers",
        {
          teacherIds: selectedItems,
        }
      );
      data && fetchData();

      selectedItems.length = 0;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <h1 className="title">all Teachers</h1>
          <div className="tabel-container">
            <div className="table">
              <div className="flex search gap-20">
                <input
                  data-type="name"
                  onInput={handelInput}
                  type="text"
                  placeholder="search by name"
                />
                <input
                  data-type="class"
                  onInput={handelInput}
                  type="text"
                  placeholder="search by class"
                />
                <input
                  data-type="subject"
                  onInput={handelInput}
                  type="text"
                  placeholder="search by subject"
                />
                <Link className="btn" to={"/add_teacher"}>
                  <i className="fa-regular fa-square-plus"></i> add teacher
                </Link>
              </div>

              <table className={`${tableData.length === 0 ? "loading" : ""}`}>
                <thead>
                  <tr>
                    <th>
                      <div
                        onClick={checkAll}
                        className="checkbox select-all"
                      ></div>
                    </th>
                    <th>photo</th>
                    <th>name</th>
                    <th>gander</th>
                    <th>class</th>
                    <th>subject</th>
                    <th>phone</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody
                  className={`${tableData.length === 0 ? "relative" : ""}`}
                >
                  {tableData.length > 0 ? (
                    tableData
                  ) : (
                    <div className="table-loading">loading...</div>
                  )}
                </tbody>
              </table>
              {selectedItems.length > 1 && (
                <div onClick={deleteAll} className="delete-all">
                  <i className="fa-solid fa-trash"></i>delete all (
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

export default AllTeachers;
