import { useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
const TimeTable = () => {
  const date = new Date();
  const [data, setData] = useState([]);
  const [dayNumber, setDayNumber] = useState(date.getUTCDay() || 0);
  const [loading, setLoading] = useState(true);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/time-table?active=true&classId=671383ab6ec6b9d374974c83&dayOfWeek=${daysOfWeek[dayNumber]}&sort=startTime`
        );
        setData(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [dayNumber]);

  const tableData =
    data &&
    data.map((e, i) => {
      return (
        <tr key={i}>
          <td> {e.classId.yearLevel + " : " + e.classId.name} </td>
          <td>{e.startTime}</td>
          <td> {e.endTime} </td>
          <td> {e.subjectId.name} </td>
          <td>
            <div className="flex ">
              <Link className="update fa-regular fa-pen-to-square"></Link>
            </div>
          </td>
        </tr>
      );
    });

  const increment = () => {
    setDayNumber((prev) => (prev + 1) % 7);
    setData([]);
    setLoading(true);
  };
  const decrement = () => {
    setDayNumber((prev) => (prev - 1 + 7) % 7);
    setData([]);
    setLoading(true);
  };

  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <div className="tabel-container">
            <div className="day flex">
              <div onClick={decrement} className="flex-1">
                prev
              </div>
              <div className="flex-1"> {daysOfWeek[dayNumber]} </div>
              <div onClick={increment} className="flex-1">
                next
              </div>
            </div>
            <div className="table">
              <table
                className={`${
                  tableData.length === 0 ? "loading" : ""
                } time-table`}
              >
                <thead>
                  <tr>
                    <th>room</th>
                    <th>period start</th>
                    <th>period end</th>
                    <th>subject</th>
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TimeTable;
