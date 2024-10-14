import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import AllTeachers from "./pages/teachers/AllTeachers";
import AddTeacher from "./pages/teachers/AddTeacher";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="all_teachers" element={<AllTeachers />} />
        <Route path="add_teacher" element={<AddTeacher />} />
      </Routes>
    </div>
  );
}

export default App;
