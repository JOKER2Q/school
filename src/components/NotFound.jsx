import React from "react";

const NotFound = () => {
  return (
    <main>
      <div className="dashboard-container">
        <div className="container center flex-direction">
          <div className="flex gap-10">
            <img src={require("./404.png")} alt="" />
            <h1 className="error-404">ops the page not found</h1>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
