import { useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
import SendData from "../../components/response/SendData";
import FormLoading from "../../components/FormLoading";
const Classes = () => {
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [classesCount, setClassesCount] = useState(0);
  const [dataLength, setDataLength] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(false);
  const divsCount = 10;
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

  const fetchData = () => {
    axios
      .get(
        `http://localhost:8000/api/classes?limit=${divsCount}&page=${activePage}&active=true`
      )
      .then((res) => {
        setDataLength(res.data.numberOfActiveClasses);

        const fltr = res.data.data.filter((e) => e.active);
        setData(fltr);
        setSearchData(fltr);
      })
      .finally(() => {
        setLoading(false);
      });
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
    const selecteDiv = document.querySelector(
      "form.dashboard-form .selecte .inp.active"
    );
    selecteDiv && selecteDiv.classList.remove("active");
  };
  useEffect(() => {
    // Fetch student count for each class
    const fetchClassesCount = async () => {
      const counts = {};
      for (let e of searchData) {
        try {
          const res = await axios.get(
            `http://localhost:8000/api/students/count-students?classId=${e._id}`
          );
          counts[e._id] = res.data.numberOfDocuments;
        } catch (error) {
          console.error(`Error fetching data for class ${e._id}`, error);
          counts[e._id] = 0; // Default to 0 on error
        }
      }
      setClassesCount(counts);
    };

    fetchClassesCount();
  }, [searchData]);

  const tableData = searchData.map((e, i) => {
    return (
      <tr key={e._id}>
        <td>
          <div
            onClick={(target) => checkOne(target, e._id)}
            className="checkbox"
          ></div>
        </td>
        <td>{e.yearLevel}</td>
        <td> {e.name} </td>

        <td> {classesCount[e._id] >= 0 ? classesCount[e._id] : "..."} </td>
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
            <Link onClick={() => setSelectedId(e._id)} className="flex update">
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
        ? e.name.toLowerCase().includes(nameSearchValue)
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
  const [form, setForm] = useState({
    name: "",
    yearLevel: "",
  });

  useEffect(() => {
    if (selectedId) {
      axios
        .get(`http://localhost:8000/api/classes/${selectedId}`)
        .then((res) => {
          const data = res.data.data;
          setForm({
            name: data.name,
            yearLevel: data.yearLevel,
          });
        });
    }
  }, [selectedId]);

  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };
  const [DataError, setDataError] = useState(false);

  function selectYears(e) {
    setForm({
      ...form,
      yearLevel: e.target.dataset.level,
    });
    setDataError(false);
  }

  function createYearLeve() {
    let h2 = [];
    for (let index = 1; index < 13; index++) {
      h2.push(
        <h2 key={index} onClick={selectYears} data-level={index}>
          {index}
        </h2>
      );
    }
    return h2;
  }
  const [formLoading, setFormLoading] = useState(false);
  const [dataOverlay, setDataOverlay] = useState(false);
  const [response, setResponse] = useState(false);

  const responseFun = (complete = false) => {
    setDataOverlay(true);

    complete === true
      ? setResponse(true)
      : complete === "reapeted data"
      ? setResponse(400)
      : setResponse(false);
    window.onclick = () => {
      setDataOverlay(false);
    };
    setTimeout(() => {
      setDataOverlay(false);
    }, 3000);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!form.yearLevel) setDataError("please select a year");
    else {
      try {
        if (!selectedId) {
          const data = await axios.post(
            "http://localhost:8000/api/classes",
            form
          );

          if (data.status === 201) {
            responseFun(true);
          }
        } else {
          await axios.patch(
            `http://localhost:8000/api/classes/${selectedId}`,
            form
          );
        }
        fetchData();
        setForm({
          name: "",
          yearLevel: "",
        });
      } catch (error) {
        console.log(error);
        if (error.status === 400) responseFun("reapeted data");
        else responseFun(false);
      } finally {
        setFormLoading(false);
      }
    }
  };
  const deleteOne = async () => {
    try {
      const data = await axios.patch(
        `http://localhost:8000/api/classes/deactivate/${selectedItems[0]}`
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
        "http://localhost:8000/api/classes/deactivateMany",
        {
          Ids: selectedItems,
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
        <div className="container ">
          {dataOverlay && <SendData response={response} data="class" />}
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
          <h1 className="title">classes</h1>
          <div className="flex align-start wrap subjects">
            <form onSubmit={handelSubmit} className="dashboard-form ">
              {formLoading && <FormLoading />}
              <h1> add new class</h1>
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

              <label> year Level </label>
              <div className="selecte">
                <div onClick={handleClick} className="inp">
                  {form.yearLevel ? form.yearLevel : "select year level"}
                </div>
                <article className="grid-3">{createYearLeve()}</article>
              </div>
              {DataError && <p className="error">{DataError}</p>}
              <button className="btn">{selectedId ? "save" : "create"}</button>
            </form>
            <div className="tabel-container">
              <div className="table">
                <h2>all classes</h2>
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
                <table className={`${tableData.length === 0 ? "loading" : ""}`}>
                  <thead>
                    <tr>
                      <th>
                        <div
                          onClick={checkAll}
                          className="checkbox select-all"
                        ></div>
                      </th>
                      <th>year Level</th>
                      <th>name</th>
                      <th>students count</th>
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
      </div>
    </main>
  );
};

export default Classes;
