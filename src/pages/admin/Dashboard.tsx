import { useUser } from "@/contexts/useUser";
import { useGetAdminDashboard } from "@/lib/api/queries";
import { Link } from "react-router";
import type { School } from "@/components/types";

function Dashboard() {
  // Fetch analytics data
  const { user } = useUser();
  const { data: adminData, isLoading } = useGetAdminDashboard();
  // Calculate totals
  console.log(adminData, 'adminD')
  // School details (from user.school)
  const school = user?.school as School | undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">Welcome {user?.name || 'to the Admin Dashboard'}</h1>
      <p className="mb-8 text-slate-500">Manage your school, view analytics, and access admin features.</p>

      {/* School Details */}
      {school && (
        <div className="mb-8 bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4 items-center justify-between border border-slate-100">
          <div>
            <div className="text-xl font-semibold text-slate-700">{school.name}</div>
            <div className="text-slate-500 text-sm mt-1">Current Semester: <span className="font-medium text-slate-700">{school.currentSemester}</span></div>
            <div className="text-slate-500 text-sm">Current Session: <span className="font-medium text-slate-700">{school.currentSession}</span></div>
          </div>
          {school.logo && (
            <img src={school.logo} alt="School Logo" className="h-14 w-14 object-contain rounded border border-slate-200 bg-slate-50" />
          )}
        </div>
      )}

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white text-slate-800 rounded-xl shadow border border-slate-100 p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-slate-700">{isLoading ? '...' : adminData?.studentCount}</div>
          <div className="mt-2 text-lg text-slate-500">Students</div>
        </div>
        <div className="bg-white text-slate-800 rounded-xl shadow border border-slate-100 p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-slate-700">{isLoading ? '...' : adminData?.courseCount}</div>
          <div className="mt-2 text-lg text-slate-500">Courses</div>
        </div>
        <div className="bg-white text-slate-800 rounded-xl shadow border border-slate-100 p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-slate-700">{isLoading ? '...' : adminData?.departmentCount}</div>
          <div className="mt-2 text-lg text-slate-500">Departments</div>
        </div>
        <div className="bg-white text-slate-800 rounded-xl shadow border border-slate-100 p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-slate-700">{isLoading ? '...' : adminData?.facultyCount}</div>
          <div className="mt-2 text-lg text-slate-500">Faculties</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <div className="font-semibold text-lg mb-2 text-slate-700">Quick Links</div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/students" className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition border border-slate-200">Manage Students</Link>
          <Link to="/admin/courses" className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition border border-slate-200">Manage Courses</Link>
          <Link to="/admin/departments" className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition border border-slate-200">Manage Departments</Link>
          <Link to="/admin/faculties" className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition border border-slate-200">Manage Faculties</Link>
          <Link to="/admin/results" className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition border border-slate-200">View Results</Link>
          <Link to="/admin/grading-templates" className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition border border-slate-200">Grading Templates</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;