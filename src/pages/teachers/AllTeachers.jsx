import { useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
const AllTeachers = () => {
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8000/api/teachers/details").then((res) => {
      setData(res.data.data);
      setSearchData(res.data.data);
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
    const nameSearchValue = document.querySelector(
      `input[data-type="name"]`
    ).value;

    const classSearchValue = document.querySelector(
      `input[data-type="class"]`
    ).value;
    const subjectSearchValue = document.querySelector(
      `input[data-type="subject"]`
    ).value;

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
                    <th>gander</th>
                    <th>class</th>
                    <th>subject</th>
                    <th>phone</th>
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

export default AllTeachers;
