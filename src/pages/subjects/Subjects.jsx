import { useEffect, useState } from "react";
import "../../components/table.css";
import "./subjects.css";
import { Link } from "react-router-dom";
import axios from "axios";
const Subjects = () => {
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
  const [form, setForm] = useState({
    name: "",
    code: "",
    yearLevel: "",
  });
  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/subjects?limit=${divsCount}&page=${activePage}&active=true`
      )
      .then((res) => {
        setDataLength(res.data.numberOfActiveSubjects);

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

          <td>{e.code}</td>
          <td> {e.name} </td>
          <td> {e.yearLevel} </td>
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
        ? e.name.toLowerCase().includes(nameSearchValue)
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
  const handleClick = (e) => {
    e.target.classList.toggle("active");
  };

  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <h1 className="title">all subjects</h1>
          <div className="flex align-start wrap subjects">
            <form className="dashboard-form">
              <h1> add new subject</h1>
              <label htmlFor="name"> name </label>
              <input
                value={form.name}
                onInput={(e) => setForm({ ...form, name: e.target.value })}
                required
                type="text"
                id="name"
                className="inp"
                placeholder="write a subject name"
              />
              <label htmlFor="code">code</label>
              <input
                value={form.code}
                onInput={(e) => setForm({ ...form, code: e.target.value })}
                required
                type="text"
                id="code"
                className="inp"
                placeholder="write a subject code"
              />
              <label> subject </label>
              <div className="selecte">
                <div onClick={handleClick} className="inp">
                  select a subject year
                </div>
                <article>
                  <h2>1</h2>
                  <h2>2</h2>
                </article>
              </div>
              <button className="btn"> submit </button>
            </form>
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
                      <th>code</th>
                      <th>name</th>
                      <th>year level</th>
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
      </div>
    </main>
  );
};

export default Subjects;
