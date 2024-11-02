import { useEffect, useState } from "react";
import "../../components/table.css";
import axios from "axios";
const ExamResult = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [overlay, setOverlay] = useState(false);
  async function fetchData() {
    try {
      await axios
        .get(
          "http://localhost:8000/api/exam-results/details/6718965cffb0a03a5452e664"
        )
        .then((res) => {
          setData(res.data.data);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  window.onclick = () => {
    const activeDiv = document.querySelector(
      "div.table tbody td div.options.active-div"
    );

    activeDiv && activeDiv.classList.remove("active-div");
    const overlayDiv = document.querySelector(".overlay");
    if (overlayDiv) {
      setOverlay(false);
      setSelectedItems([]);
    }
  };

  const maxResultsLength = Math.max(...data.map((e) => e.results.length));

  const deleteExam = async () => {
    try {
      console.log(selectedItems);

      const data = await axios.patch(
        `http://localhost:8000/api/exam-results/deactivate/${selectedItems}`
      );
      data && fetchData();
      console.log(data);

      setSelectedItems([]);
    } catch (error) {
      console.log(error);
    } finally {
      setOverlay(false);
    }
  };

  const tableData =
    data &&
    data.map((e, i) => {
      const totalScore = e.results.reduce((acc, score) => acc + score.score, 0);
      const totalMark = e.results.reduce(
        (acc, score) => acc + score.totalMarks,
        0
      );

      return (
        <tr key={i}>
          <td>{e._id}</td>
          {e.results.map((score, i) => (
            <td key={i}>
              {score.score + "/" + score.totalMarks}
              <i
                onClick={(event) => {
                  event.stopPropagation();
                  setOverlay(true);
                  setSelectedItems(score.examResultId);
                }}
                className="delete icon fa-regular fa-trash-can"
              ></i>
              <i className="update icon fa-regular fa-pen-to-square"></i>
            </td>
          ))}

          {/* Add empty cells if there are fewer than 3 results */}
          {Array.from({ length: maxResultsLength - e.results.length }).map(
            (_, idx) => (
              <td key={`empty-${idx}`}></td>
            )
          )}

          {/* Total score and marks */}
          <td>{`${totalScore}/${totalMark}`}</td>
        </tr>
      );
    });

  const createThExams = (length) => {
    const th = [];
    for (let index = 0; index < length; index++) {
      th.push(<th key={index}> exam {index + 1} </th>);
    }
    return th;
  };

  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          {overlay && (
            <div className="overlay">
              <div className="change-status">
                <h1>{`confirm delete exam`}</h1>
                <div className="flex gap-20">
                  <div
                    onClick={() => {
                      setOverlay(false);
                      setSelectedItems([]);
                    }}
                    className="none center"
                  >
                    <h2>cancel</h2>
                    <i className="fa-solid fa-ban"></i>
                  </div>
                  <div
                    onClick={() => {
                      deleteExam();
                    }}
                    className="false center"
                  >
                    <h2>delete</h2>
                    <i className="fa-solid fa-trash"></i>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="tabel-container">
            <div className="table">
              <table
                className={`${tableData.length === 0 ? "loading" : ""} exam`}
              >
                <thead>
                  <tr>
                    <th>subject name</th>
                    {createThExams(maxResultsLength)}
                    <th>score</th>
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExamResult;
