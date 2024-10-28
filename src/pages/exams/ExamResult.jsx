import { useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
const ExamResult = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(
        "http://localhost:8000/api/exam-results/details/6718965cffb0a03a5452e664"
      )
      .then((res) => {
        setData(res.data.data);
      });
  }, []);

  window.onclick = () => {
    const activeDiv = document.querySelector(
      "div.table tbody td div.options.active-div"
    );

    activeDiv && activeDiv.classList.remove("active-div");
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
            <td key={i}>{score.score + "/" + score.totalMarks}</td>
          ))}

          {/* Add empty cells if there are fewer than 3 results */}
          {Array.from({ length: 3 - e.results.length }).map((_, idx) => (
            <td key={`empty-${idx}`}></td>
          ))}

          {/* Total score and marks */}
          <td>{`${totalScore}/${totalMark}`}</td>
        </tr>
      );
    });

  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <div className="tabel-container">
            <div className="table">
              <table
                className={`${tableData.length === 0 ? "loading" : ""} exam`}
              >
                <thead>
                  <th>exams name</th>
                  <th>first exam</th>
                  <th>second exam</th>
                  <th>third exam </th>
                  <th>score</th>
                </thead>
                <tbody>{tableData}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExamResult;
