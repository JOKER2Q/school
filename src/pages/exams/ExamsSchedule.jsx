import { useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
const ExamSchedule = () => {
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overlay, setOverlay] = useState(false);

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

  const fetchData = async () => {
    try {
      const data = await axios.get(
        "http://localhost:8000/api/exams?sort=-date"
      );
      const fltr = data.data.data.filter((e) => e.active);
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
  }, []);

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
            {e.subjectId && e.subjectId.active ? e.subjectId.name : "deleted"}
          </td>
          <td> {e.yearLevel} </td>
          <td dangerouslySetInnerHTML={date(e.date)} />

          <td> {e.classId.name} </td>
          <td>{e.duration}</td>
          <td>{e.totalMarks}</td>
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
                  const allSelectors =
                    document.querySelectorAll("td .checkbox");
                  allSelectors.forEach((e) => e.classList.remove("active"));
                  setSelectedItems([e._id]);
                }}
                className="flex delete"
              >
                <i className="fa-solid fa-trash"></i> delete
              </div>
              <Link to={`/update_exam/${e._id}`} className="flex update">
                <i className="fa-regular fa-pen-to-square"></i>
                update
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
        ? e.subjectId.active &&
          e.subjectId.name.toLowerCase().includes(nameSearchValue)
        : true;

      const subjectMatch = yearLevelSearchValue
        ? e.yearLevel === +yearLevelSearchValue
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
        `http://localhost:8000/api/exams/deactivate/${selectedItems[0]}`
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
        "http://localhost:8000/api/exams/deactivate-many",
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
          <h1 className="title">Exam Schedule</h1>
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
                <Link className="btn" to={"/add_exam"}>
                  <i className="fa-regular fa-square-plus"></i> add exam
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
                    <th>subject</th>
                    <th>year level</th>
                    <th>date</th>
                    <th>room</th>
                    <th>duration</th>
                    <th>mark</th>
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
                <h3 className="active">1</h3>
                <h3>2</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExamSchedule;

export const date = (time) => {
  const fullTime = new Date(time);
  const month = fullTime.getMonth() + 1;
  const day = fullTime.getDate();
  const hours = String(fullTime.getHours()).padStart(2, "0");
  const minutes = String(fullTime.getMinutes()).padStart(2, "0");
  const style = `${month} / ${day}<br>${hours}:${minutes}`;
  return { __html: style }; // العودة بـ HTML
};
