import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import AllTeachers from "./pages/teachers/AllTeachers";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="all_teachers" element={<AllTeachers />} />
      </Routes>
    </div>
  );
}

export default App;
