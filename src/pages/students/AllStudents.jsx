import { useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
const AllStudents = () => {
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [overlay, setOverlay] = useState(false);
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
  });

  function updateData(e) {
    setData([]);
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
  const fetchData = async () => {
    try {
      const data = await axios.get(
        `http://localhost:8000/api/students?limit=${divsCount}&page=${activePage}&active=true`
      );
      const fltr = data.data.data.filter((e) => e.active);

      setDataLength(data.data.numberOfActiveStudents);

      setData(fltr);
      setSearchData(fltr);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
              <i className="fa-solid fa-trash"></i> delete
            </div>
            <Link to={`/update_student/${e._id}`} className="flex update">
              <i className="fa-regular fa-pen-to-square"></i>
              update
            </Link>
            <Link to={`/student_profile/${e._id}`} className="flex visit">
              <i className="fa-solid fa-circle-user"></i> visit
            </Link>
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
  return (
    <main>
      <div className="dashboard-container">
        {overlay && (
          <div className="overlay">
            <div className="change-status">
              <h1>{`confirm delete (${selectedItems.length}) students`}</h1>
              <div className="flex gap-20">
                <div
                  onClick={() => {
                    if (selectedItems.length === 1) deleteOne();
                    else deleteAll();
                  }}
                  className="false center"
                >
                  <h2>delete</h2>
                  <i className="fa-solid fa-trash"></i>
                </div>
                <div
                  onClick={() => {
                    setOverlay(false);
                    if (selectedItems.length === 1) setSelectedItems([]);
                  }}
                  className="none center"
                >
                  <h2>cancel</h2>
                  <i className="fa-solid fa-ban"></i>
                </div>
              </div>
            </div>
          </div>
        )}
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
                    <th>phone</th>
                    <th>gander</th>
                    <th>year Level</th>
                    <th>guardian</th>
                    <th>parents phone</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody
                  className={`${tableData.length === 0 ? "relative" : ""}`}
                >
                  {tableData.length > 0
                    ? tableData
                    : !loading && (
                        <div className="table-loading">no data to show</div>
                      )}
                  {loading && <div className="table-loading">loading</div>}
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

export default AllStudents;
