import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import AllTeachers from "./pages/teachers/AllTeachers";
import AddTeacher from "./pages/teachers/AddTeacher";
import TeacherProfile from "./pages/teachers/TeacherProfile";
import Attendence from "./pages/students/Attendence";
import AllStudents from "./pages/students/AllStudents";
import Classes from "./pages/classes/Classes";
import Login from "./pages/Login";
import Subjects from "./pages/subjects/Subjects";
import ExamSchedule from "./pages/exams/ExamsSchedule";
import AddStudent from "./pages/students/AddStudent";
import AddExam from "./pages/exams/AddExam";
import StudentProfile from "./pages/students/StudentProfile";
import ExamResult from "./pages/exams/ExamResult";
import TimeTable from "./pages/students/timeTable";
import AddExamResult from "./pages/exams/AddExamResult";
import UpdateTeacher from "./pages/teachers/UpdateTeacher";
import UpdateExamSchedule from "./pages/exams/UpdateExamSchedule";
import UpdateStudent from "./pages/students/UpdateStudent";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="App">
      {/* {location.pathname !== "/" && <Navbar />} */}
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="all_teachers" element={<AllTeachers />} />
        <Route path="add_teacher" element={<AddTeacher />} />
        <Route path="update_teacher/:id" element={<UpdateTeacher />} />
        <Route path="teacher_profile/:id" element={<TeacherProfile />} />
        <Route path="student_profile/:id" element={<StudentProfile />} />
        <Route path="all_students" element={<AllStudents />} />
        <Route path="add_student" element={<AddStudent />} />
        <Route path="update_student/:id" element={<UpdateStudent />} />
        <Route path="attendence" element={<Attendence />} />
        <Route path="time_table" element={<TimeTable />} />
        <Route path="classes" element={<Classes />} />
        <Route path="add_student" element={<AddStudent />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="exams_schedule" element={<ExamSchedule />} />
        <Route path="update_exam/:id" element={<UpdateExamSchedule />} />
        <Route path="add_exam" element={<AddExam />} />
        <Route path="add_exam_result" element={<AddExamResult />} />
        <Route path="exams_result" element={<ExamResult />} />
      </Routes>
    </div>
  );
}

export default App;
