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
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 style={{ color: 'var(--omack-text-primary)', fontSize: '2.125rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
          Welcome, {user?.name?.split(' ')[0] || 'Admin'}
        </h1>
        <p style={{ color: 'var(--omack-text-secondary)', fontSize: '0.95rem', margin: '0.5rem 0 0 0', fontWeight: 500 }}>
          Manage your school, view analytics, and access admin features.
        </p>
      </div>

      {/* School Details Card */}
      {school && (
        <div className="omack-card mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
              <h3 style={{ color: 'var(--omack-text-primary)', fontSize: '1.25rem', fontWeight: 700, margin: 0, marginBottom: '0.5rem' }}>
                {school.name}
              </h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div>
                  <span style={{ color: 'var(--omack-text-light)', fontSize: '0.9rem', fontWeight: 500 }}>Current Semester:</span>
                  <span style={{ color: 'var(--omack-text-primary)', fontSize: '0.9rem', fontWeight: 600, marginLeft: '0.5rem' }}>
                    {school.currentSemester}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--omack-text-light)', fontSize: '0.9rem', fontWeight: 500 }}>Current Session:</span>
                  <span style={{ color: 'var(--omack-text-primary)', fontSize: '0.9rem', fontWeight: 600, marginLeft: '0.5rem' }}>
                    {school.currentSession}
                  </span>
                </div>
              </div>
            </div>
            {school.logo && (
              <img 
                src={school.logo} 
                alt="School Logo" 
                className="h-20 w-20 object-contain rounded-lg shadow-md"
                style={{ background: 'var(--omack-bg-lighter)', padding: '0.5rem' }}
              />
            )}
          </div>
        </div>
      )}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="stat-card-value">{isLoading ? '...' : adminData?.studentCount || 0}</div>
          <div className="stat-card-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{isLoading ? '...' : adminData?.courseCount || 0}</div>
          <div className="stat-card-label">Active Courses</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{isLoading ? '...' : adminData?.departmentCount || 0}</div>
          <div className="stat-card-label">Departments</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{isLoading ? '...' : adminData?.facultyCount || 0}</div>
          <div className="stat-card-label">Faculties</div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="page-section">
        <h2 className="page-section-title">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            to="/admin/students" 
            className="omack-card-compact hover:shadow-md transition-all"
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div 
              className="flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #165c4b 0%, #1e9a6f 100%)' }}
            >
              👥
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--omack-text-primary)' }}>Manage Students</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--omack-text-light)' }}>View and manage all students</div>
            </div>
          </Link>

          <Link 
            to="/admin/courses" 
            className="omack-card-compact hover:shadow-md transition-all"
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div 
              className="flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #1e5a8e 0%, #3b7fb5 100%)' }}
            >
              📚
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--omack-text-primary)' }}>Manage Courses</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--omack-text-light)' }}>Add or update courses</div>
            </div>
          </Link>

          <Link 
            to="/admin/departments" 
            className="omack-card-compact hover:shadow-md transition-all"
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div 
              className="flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #00a86b 0%, #26d68a 100%)' }}
            >
              🏢
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--omack-text-primary)' }}>Departments</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--omack-text-light)' }}>View department structure</div>
            </div>
          </Link>

          <Link 
            to="/admin/faculties" 
            className="omack-card-compact hover:shadow-md transition-all"
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div 
              className="flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
            >
              🎓
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--omack-text-primary)' }}>Faculties</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--omack-text-light)' }}>Manage faculties</div>
            </div>
          </Link>

          <Link 
            to="/admin/results" 
            className="omack-card-compact hover:shadow-md transition-all"
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div 
              className="flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}
            >
              📊
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--omack-text-primary)' }}>View Results</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--omack-text-light)' }}>Manage student results</div>
            </div>
          </Link>

          <Link 
            to="/admin/grading-templates" 
            className="omack-card-compact hover:shadow-md transition-all"
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div 
              className="flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--omack-text-primary)' }}>Grading Templates</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--omack-text-light)' }}>Configure grading system</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;