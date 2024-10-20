import { useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
const ExamSchedule = () => {
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8000/api/exams").then((res) => {
      const fltr = res.data.data.filter((e) => e.active);
      console.log(fltr);

      setData(fltr);
      setSearchData(fltr);
    });
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

        <td>{e.subjectId.active ? e.subjectId.name : "deleted"}</td>
        <td> {e.yearLevel} </td>
        <td> date </td>
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
            <div className="flex delete">
              <i className="fa-solid fa-trash"></i> delete
            </div>
            <div className="flex update">
              <Link className="fa-regular fa-pen-to-square"></Link>
              update
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
        ? e.subjectId.active &&
          e.subjectId.name.toLowerCase().includes(nameSearchValue)
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
              <table>
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
                <tbody>{tableData}</tbody>
              </table>
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
