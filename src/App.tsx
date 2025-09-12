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
                </Route>
                {/* Student Routes */}
                <Route path="/student" element={
                  <UserProvider>
                    <DashboardLayout />
                  </UserProvider>
                }>
                  <Route index element={<div>Student Dashboard</div>} />
                  <Route path="/student/results" element={<StudentResults />} />
                  <Route path="/student/course-registration" element={<StudentCourseRegistration />} />
                </Route>
              {/* </UserProvider> */}
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </QueryClientProvider>
      </div>
    </>
  )
}

export default App
