import "../../components/table.css";
import { Link } from "react-router-dom";
const AllTeachers = () => {
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
  const checkOne = (e) => {
    e.target.classList.toggle("active");
  };
  const checkAll = (e) => {
    e.target.classList.toggle("active");
    const allActiveSelectors = document.querySelectorAll("td .checkbox.active");
    const allSelectors = document.querySelectorAll("td .checkbox");

    if (
      allActiveSelectors.length >= 0 &&
      allActiveSelectors.length !== allSelectors.length
    ) {
      allSelectors.forEach((e) => e.classList.add("active"));
    } else {
      allSelectors.forEach((e) => e.classList.remove("active"));
    }
  };
  window.onclick = () => {
    const activeDiv = document.querySelector(
      "div.table tbody td div.options.active-div"
    );
    console.log(activeDiv);

    activeDiv && activeDiv.classList.remove("active-div");
  };
  return (
    <main>
      <div className="container">
        <h1 className="title">all Teachers</h1>
        <div className="table">
          <div className="flex search gap-20">
            <input type="text" placeholder="search by name" />
            <input type="text" placeholder="search by class" />
            <input type="text" placeholder="search by subject" />
          </div>
          <table>
            <thead>
              <th>
                <div onClick={checkAll} className="checkbox select-all"></div>
              </th>
              <th>photo</th>
              <th>name</th>
              <th>gander</th>
              <th>class</th>
              <th>subject</th>
              <th>phone</th>
              <th></th>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div onClick={checkOne} className="checkbox "></div>
                </td>
                <td>
                  <i className="center photo fa-solid fa-user"></i>
                </td>
                <td>diyar direki</td>
                <td>male</td>
                <td>2</td>
                <td>react course</td>
                <td>0936 038 904</td>
                <td>
                  <i
                    onClick={openOptions}
                    className="options fa-solid fa-ellipsis"
                    data-index="0"
                  ></i>
                  <div className="options">
                    <div className="flex delete">
                      <i className="fa-solid fa-trash "></i> delete
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
              <tr>
                <td>
                  <div onClick={checkOne} className="checkbox"></div>
                </td>
                <td>
                  <i className="center photo fa-solid fa-user"></i>
                </td>
                <td>diyar direki</td>
                <td>male</td>
                <td>2</td>
                <td>react course</td>
                <td>0936 038 904</td>
                <td>
                  <i
                    onClick={openOptions}
                    className="options fa-solid fa-ellipsis"
                    data-index="1"
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
              <tr>
                <td>
                  <div onClick={checkOne} className="checkbox "></div>
                </td>
                <td>
                  <i className="center photo fa-solid fa-user"></i>
                </td>
                <td>diyar direki</td>
                <td>male</td>
                <td>2</td>
                <td>react course</td>
                <td>0936 038 904</td>
                <td>
                  <i
                    onClick={openOptions}
                    className="options fa-solid fa-ellipsis"
                    data-index="2"
                  ></i>
                  <div className="options">
                    <div className="flex delete">
                      <i className="fa-solid fa-trash "></i> delete
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
              <tr>
                <td>
                  <div onClick={checkOne} className="checkbox "></div>
                </td>
                <td>
                  <i className="center photo fa-solid fa-user"></i>
                </td>
                <td>diyar direki</td>
                <td>male</td>
                <td>2</td>
                <td>react course</td>
                <td>0936 038 904</td>
                <td>
                  <i
                    onClick={openOptions}
                    className="options fa-solid fa-ellipsis"
                    data-index="3"
                  ></i>
                  <div className="options">
                    <div className="flex delete">
                      <i className="fa-solid fa-trash "></i> delete
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
              <tr>
                <td>
                  <div onClick={checkOne} className="checkbox "></div>
                </td>
                <td>
                  <i className="center photo fa-solid fa-user"></i>
                </td>
                <td>diyar direki</td>
                <td>male</td>
                <td>2</td>
                <td>react course</td>
                <td>0936 038 904</td>
                <td>
                  <i
                    onClick={openOptions}
                    className="options fa-solid fa-ellipsis"
                    data-index="4"
                  ></i>
                  <div className="options">
                    <div className="flex delete">
                      <i className="fa-solid fa-trash "></i> delete
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
            </tbody>
          </table>
          <div className="pagination flex">
            <h3 className="active">1</h3>
            <h3>2</h3>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AllTeachers;
