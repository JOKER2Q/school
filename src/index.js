import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Provider from "./context/Context";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
/*
const search = async (req, res) => {
  try {
    // Extract search parameters
    const searchText = req.params.id || "";
    const regex = new RegExp(searchText.split("").join(".*"), "i");

    // Define the base query for direct matching
    const baseQuery = {
      $or: [{ firstName: regex }, { middleName: regex }, { lastName: regex }],
    };

    // Count total documents matching the base query
    let totalResults = await Teacher.countDocuments(baseQuery);

    let features = new apiFeatures(
      Teacher.find(baseQuery)
        .populate("subjects")
        .populate("classes"),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query to get paginated results
    let results = await features.query;

    // If no results found with direct match, attempt fuzzy search
    if (results.length < 1) {
      totalResults = await Teacher.fuzzySearch(searchText).countDocuments();

      features = new apiFeatures(
        Teacher.fuzzySearch(searchText)
          .populate("subjects")
          .populate("classes"), // Adjust this to match your fuzzy search implementation
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      results = await features.query;
    }

    // Return the results with total count for pagination
    res.status(200).json({
      status: "success",
      totalResults,
      results: results.length,
      data: results,
    });
  } catch (error) {
    // Log the error for server debugging
    console.error("Error performing search:", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

*/