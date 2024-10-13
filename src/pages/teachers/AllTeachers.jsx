import React from "react";
import "../../components/table.css";
const AllTeachers = () => {
  return (
    <main>
      <div className="container">
        <h1 className="title">all Teachers</h1>
        <div className="table">
          <div className="flex search gap-10">
            <input type="text" placeholder="search by name" />
            <input type="text" placeholder="search by class" />
            <input type="text" placeholder="search by subject" />
          </div>
          <table>
            <thead>
              <th>
                <input type="checkbox" name="" id="" />
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
                  <input type="checkbox" name="" id="" />
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
                  <i className="options fa-solid fa-ellipsis"></i>
                  <div className="options">
                    <div className="flex delete">
                      <i className="fa-solid fa-trash "></i> delete
                    </div>
                    <div className="flex delete">
                      <i className="fa-regular fa-pen-to-square"></i> update
                    </div>
                    <div className="flex delete">
                      <i className="fa-solid fa-circle-user"></i> visit
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AllTeachers;
