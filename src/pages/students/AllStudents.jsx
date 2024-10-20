import { useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
const AllStudents = () => {
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
  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/students?limit=${divsCount}&page=${activePage}&active=true`
      )
      .then((res) => {
        setDataLength(res.data.numberOfActiveStudents);

        const fltr = res.data.data.filter((e) => e.active);
        setData(fltr);
        setSearchData(fltr);
      });
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
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((item) => item !== element)
      );
    }
  };

  const checkAll = (e) => {
    e.target.classList.toggle("active");
    const allActiveSelectors = document.querySelectorAll("td .checkbox.active");
    const allSelectors = document.querySelectorAll("td .checkbox");
    setSelectedItems([]);

    if (
      allActiveSelectors.length >= 0 &&
      allActiveSelectors.length !== allSelectors.length
    ) {
      allSelectors.forEach((e) => e.classList.add("active"));

      searchData.forEach((e) => {
        setSelectedItems((prev) => [...prev, e._id]);
      });
    } else {
      allSelectors.forEach((e) => e.classList.remove("active"));
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
        <td>
          <i className="center photo fa-solid fa-user"></i>
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

    const yearLevelSearchValue = document.querySelector(
      `input[data-type="yearLevel"]`
    ).value;

    const fltr = data.filter((e) => {
      const nameMatch = nameSearchValue
        ? e.firstName.toLowerCase().includes(nameSearchValue) ||
          e.lastName.toLowerCase().includes(nameSearchValue)
        : true;

      const subjectMatch = yearLevelSearchValue
        ? e.yearLevel == yearLevelSearchValue
        : true;

      return nameMatch && subjectMatch;
    });

    setSearchData(fltr);

    if (!nameSearchValue && !yearLevelSearchValue) {
      setSearchData(data);
    }
  };
  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <h1 className="title">all students</h1>
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
                  data-type="yearLevel"
                  onInput={handelInput}
                  type="text"
                  placeholder="search by year level"
                />
                <Link className="btn" to={"/add_student"}>
                  <i className="fa-regular fa-square-plus"></i> add student
                </Link>
              </div>
              <table>
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
                    <th>phone</th>
                    <th>gander</th>
                    <th>year Level</th>
                    <th>guardian</th>
                    <th>parents phone</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{tableData}</tbody>
              </table>
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
