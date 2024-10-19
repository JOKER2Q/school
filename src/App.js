import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import AllTeachers from "./pages/teachers/AllTeachers";
import AddTeacher from "./pages/teachers/AddTeacher";
import TeacherProfile from "./pages/teachers/TeacherProfile";
import Attendence from "./pages/students/Attendence";
import AllStudents from "./pages/students/AllStudents";
import AllClasses from "./pages/classes/AllClasses";
import Login from "./pages/Login";
import Subjects from "./pages/subjects/Subjects";
import ExamSchedule from "./pages/exams/ExamsSchedule";

function App() {
  const location = useLocation();
  return (
    <div className="App">
      {/* {location.pathname !== "/" && <Navbar />} */}
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="all_teachers" element={<AllTeachers />} />
        <Route path="add_teacher" element={<AddTeacher />} />
        <Route path="teacher_profile" element={<TeacherProfile />} />
        <Route path="all_students" element={<AllStudents />} />
        <Route path="attendence" element={<Attendence />} />
        <Route path="all_classes" element={<AllClasses />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="exams_schedule" element={<ExamSchedule />} />
      </Routes>
    </div>
  );
}

export default App;
