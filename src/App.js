import { Route, Routes, useLocation } from "react-router-dom";
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
import NotFound from "./components/NotFound";
import Dashboard from "./pages/Dashboard";
import Auth from "./Auth/Auth";
import Refresh from "./Auth/Refersh";
import AdminAuth from "./Auth/AdminAuth";
import TeacherAuth from "./Auth/TeacherAuth";

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Login />} />

        <Route element={<Refresh />}>
          <Route element={<Auth />}>
            <Route path="dashboard" element={<Dashboard />}>
              <Route path="*" element={<NotFound />} />

              <Route element={<AdminAuth />}>
                <Route path="add_teacher" element={<AddTeacher />} />
                <Route path="add_student" element={<AddStudent />} />
                <Route path="add_exam_result" element={<AddExamResult />} />
                <Route path="add_exam" element={<AddExam />} />
                <Route path="update_teacher/:id" element={<UpdateTeacher />} />
                <Route path="update_student/:id" element={<UpdateStudent />} />
                <Route
                  path="update_exam/:id"
                  element={<UpdateExamSchedule />}
                />
              </Route>

              <Route element={<TeacherAuth />}>
                <Route path="all_teachers" element={<AllTeachers />} />
                <Route
                  path="teacher_profile/:id"
                  element={<TeacherProfile />}
                />
                <Route path="all_students" element={<AllStudents />} />
                <Route path="attendence" element={<Attendence />} />
              </Route>

              <Route path="student_profile/:id" element={<StudentProfile />} />
              <Route path="time_table" element={<TimeTable />} />
              <Route path="classes" element={<Classes />} />
              <Route path="subjects" element={<Subjects />} />
              <Route path="exams_schedule" element={<ExamSchedule />} />
              <Route path="exams_result" element={<ExamResult />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
