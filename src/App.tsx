import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { Toaster } from 'sonner';

import './App.css'
import Schools from "./pages/super-admin/Schools";
import Faculties from "./pages/super-admin/Faculties";
import Login from "./pages/Login";
import Dapartments from "./pages/admin/Dapartments";
import Instructors from "./pages/admin/Instructors";
import CourseRegistrations from "./pages/admin/CourseRegistrations";
import Courses from "./pages/admin/Courses";
import Students from "./pages/admin/Students";
import StudentDetail from "./pages/admin/StudentDetail";
import Dashboard from "./pages/admin/Dashboard";
import AdminFaculties from "./pages/admin/AdminFaculties";
import { UserProvider } from "./contexts/UserContext";
import Results from "./pages/admin/Results";
import StudentResults from "./pages/student/StudentResults";
import StudentCourseRegistration from "./pages/student/StudentCourseRegistration";
import GradingTemplates from "./pages/admin/GradingTemplates";
import SchoolSettings from "./pages/admin/SchoolSettings";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import WalletManagement from "./pages/student/WalletManagement";
import WalletVerify from "./pages/student/WalletVerify";
import InstructorDashbaord from "./pages/instructors/InstructorDashbaord";
import InstructorCourses from "./pages/instructors/InstructorCourses";
import InstructorCourse from "./pages/instructors/InstructorCourse";

const queryClient = new QueryClient();
function App() {

  return (
    <>
      <div className="App">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                {/* Define your routes here */}
                <Route index element={<div>Dashboard Page</div>} />
                <Route path="/super-admin/schools" element={<Schools />} />
                <Route path="/super-admin/faculties" element={<Faculties />} />
              </Route>
              {/* Admin Routes */}
              {/* <UserProvider> */}
              <Route path="/admin" element={
                <UserProvider>
                  <DashboardLayout />
                </UserProvider>
              }>
                <Route index element={<Dashboard />} />
                <Route path="/admin/departments" element={<Dapartments />} />
                <Route path="/admin/faculties" element={<AdminFaculties />} />
                <Route path="/admin/students" element={<Students />} />
                <Route path="/admin/students/:id" element={<StudentDetail />} />
                <Route path="/admin/instructors" element={<Instructors />} />
                <Route path="/admin/courses" element={<Courses />} />
                <Route path="/admin/results" element={<Results />} />
                <Route path="/admin/course-registrations" element={<CourseRegistrations />} />
                <Route path="/admin/grading-templates" element={<GradingTemplates />} />
                <Route path="/admin/settings" element={<SchoolSettings />} />
              </Route>
              {/* Student Routes */}
              <Route path="/student" element={
                <UserProvider>
                  <DashboardLayout />
                </UserProvider>
              }>
                <Route index element={<StudentDashboard />} />
                <Route path="/student/results" element={<StudentResults />} />
                <Route path="/student/settings" element={<StudentProfile />} />
                <Route path="/student/course-registration" element={<StudentCourseRegistration />} />
                <Route path="/student/wallet" element={<WalletManagement />} />
              </Route>
              {/* Student Routes */}
              <Route path="/instructor" element={
                <UserProvider>
                  <DashboardLayout />
                </UserProvider>
              }>
                <Route index element={<InstructorDashbaord />} />
                <Route path="/instructor/courses" element={<InstructorCourses />} />
                <Route path="/instructor/courses/:id" element={<InstructorCourse />} />
              </Route>
              {/* </UserProvider> */}
              <Route path="/login" element={<Login />} />
              <Route path="/wallet/verify" element={<WalletVerify />} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </QueryClientProvider>
      </div>
    </>
  )
}

export default App
