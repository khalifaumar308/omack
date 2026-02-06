import React from 'react';
import { useUser } from '@/contexts/useUser';
import { useGetInstructorCoursesStats } from '@/lib/api/queries';
import { exportCourseRegistrationsCsv } from '@/lib/api/base';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Link } from 'react-router';
import { DownloadCloud, UploadCloud, FileText } from 'lucide-react';
import { toast } from 'sonner';

const InstructorDashbaord: React.FC = () => {
  const { user } = useUser();
  const { data: coursesStats, isLoading, isError, error, refetch } = useGetInstructorCoursesStats(user?.id);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="p-4"><CardContent><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-8 w-full" /></CardContent></Card>
          <Card className="p-4"><CardContent><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-8 w-full" /></CardContent></Card>
          <Card className="p-4"><CardContent><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-8 w-full" /></CardContent></Card>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <Skeleton className="h-8 w-full mb-3" />
          <Skeleton className="h-8 w-full mb-3" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">Failed to load dashboard</h2>
            <p className="text-sm text-muted-foreground mb-4">{(error && typeof error === 'object' && 'message' in error) ? (error as { message?: string }).message : 'An unexpected error occurred.'}</p>
            <div className="flex gap-2">
              <Button onClick={() => refetch()}>Retry</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>Reload app</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const instructorName = coursesStats?.instructor?.name || user?.name || 'Instructor';
  const semester = coursesStats?.semester || user?.school?.currentSemester || '';
  const session = coursesStats?.session || user?.school?.currentSession || '';
  const courses = coursesStats?.courses || [];

  const totalCourses = courses.length;
  const totalRegistrations = courses.reduce((s, c) => s + (c.registrations || 0), 0);
  const avgClassSize = totalCourses > 0 ? Math.round(totalRegistrations / totalCourses) : 0;

  const onExportCourse = async (courseId: string) => {
    try {
      const blob = await exportCourseRegistrationsCsv(courseId, semester, session);
      if (!blob) return toast('No data returned');
      const url = URL.createObjectURL(blob as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `course-registrations-${courseId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast('Export started');
    } catch (err: unknown) {
      console.error('Export error', err);
      let msg = 'Export failed';
      if (err && typeof err === 'object' && 'message' in err && typeof (err as Record<string, unknown>).message === 'string') {
        msg = (err as Record<string, unknown>).message as string;
      }
      toast(msg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 style={{ color: 'var(--omack-text-primary)', fontSize: '2.125rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            Welcome, {instructorName}
          </h1>
          <p style={{ color: 'var(--omack-text-secondary)', fontSize: '0.95rem', margin: '0.5rem 0 0 0' }}>
            {semester} Semester {session ? `· ${session}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="upload-csv" className="btn-secondary inline-flex">
            <UploadCloud className="size-4 mr-2" />
            <span className="text-sm">Upload Results</span>
          </label>
          <input id="upload-csv" type="file" accept="text/csv,application/csv,.csv" className="hidden" />

          <Button 
            onClick={() => { window.scrollTo({ top: 9999, behavior: 'smooth' }); }}
            style={{
              background: 'linear-gradient(135deg, #165c4b 0%, #1e9a6f 100%)',
              color: 'white',
              fontWeight: 600
            }}
          >
            <FileText className="mr-2 h-4 w-4" /> View Courses
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: 'var(--omack-primary)' }}>{totalCourses}</div>
          <div className="stat-card-label">Courses Assigned</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-value" style={{ color: 'var(--omack-primary)' }}>{new Intl.NumberFormat().format(totalRegistrations)}</div>
          <div className="stat-card-label">Total Students</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-value" style={{ color: 'var(--omack-primary)' }}>{avgClassSize}</div>
          <div className="stat-card-label">Average Class Size</div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="page-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="page-section-title" style={{ margin: 0 }}>Your Courses</h2>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => refetch()}
              style={{ 
                background: 'linear-gradient(135deg, #165c4b 0%, #1e9a6f 100%)',
                color: 'white',
                fontWeight: 600
              }}
            >
              Refresh
            </Button>
            <Button 
              onClick={async () => {
                try {
                  for (const c of courses) {
                    await onExportCourse(c.id);
                  }
                } catch (err) {
                  console.error(err);
                  toast('Export failed');
                }
              }}
              style={{ 
                background: 'var(--omack-bg-lighter)',
                color: 'var(--omack-primary)',
                border: '1.5px solid var(--omack-primary)',
                fontWeight: 600
              }}
            >
              Export All
            </Button>
          </div>
        </div>

        {courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--omack-text-light)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--omack-text-primary)', marginBottom: '0.5rem' }}>No assigned courses</h3>
            <p>You currently have no courses assigned for this semester.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="omack-table w-full">
                <thead>
                  <tr style={{ background: 'linear-gradient(90deg, var(--omack-primary) 0%, var(--omack-primary-light) 100%)' }}>
                    <th style={{ padding: 'var(--omack-spacing-lg)' }}>Course Code</th>
                    <th style={{ padding: 'var(--omack-spacing-lg)' }}>Course Title</th>
                    <th style={{ padding: 'var(--omack-spacing-lg)', textAlign: 'center' }}>Credit Units</th>
                    <th style={{ padding: 'var(--omack-spacing-lg)', textAlign: 'center' }}>Registrations</th>
                    <th style={{ padding: 'var(--omack-spacing-lg)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c, idx) => (
                    <tr key={c.id} style={{ backgroundColor: idx % 2 === 0 ? 'var(--omack-bg-white)' : 'var(--omack-bg-lighter)' }}>
                      <td style={{ padding: 'var(--omack-spacing-lg)', borderBottom: '1px solid var(--omack-border-light)', fontWeight: 600, color: 'var(--omack-primary)' }}>
                        <Link to={`/instructor/courses/${c.id}`} style={{ textDecoration: 'none', color: 'var(--omack-primary)' }}>
                          {c.code || c.id}
                        </Link>
                      </td>
                      <td style={{ padding: 'var(--omack-spacing-lg)', borderBottom: '1px solid var(--omack-border-light)', color: 'var(--omack-text-primary)' }}>
                        {c.title}
                      </td>
                      <td style={{ padding: 'var(--omack-spacing-lg)', borderBottom: '1px solid var(--omack-border-light)', textAlign: 'center', color: 'var(--omack-text-secondary)' }}>
                        {c.creditUnits ?? '-'}
                      </td>
                      <td style={{ padding: 'var(--omack-spacing-lg)', borderBottom: '1px solid var(--omack-border-light)', textAlign: 'center', fontWeight: 600, color: 'var(--omack-text-primary)' }}>
                        {c.registrations}
                      </td>
                      <td style={{ padding: 'var(--omack-spacing-lg)', borderBottom: '1px solid var(--omack-border-light)', textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => onExportCourse(c.id)}
                            style={{ 
                              background: 'var(--omack-bg-lighter)',
                              color: 'var(--omack-primary)',
                              border: '1.5px solid var(--omack-border)',
                              fontWeight: 600,
                              fontSize: '0.875rem'
                            }}
                          >
                            <DownloadCloud className="mr-1 h-4 w-4" />Export
                          </Button>
                          <Link to={`/instructor/courses/${c.id}`}>
                            <Button 
                              size="sm"
                              style={{ 
                                background: 'linear-gradient(135deg, #165c4b 0%, #1e9a6f 100%)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                              }}
                            >
                              View
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4 mt-4">
              {courses.map((c) => (
                <div key={c.id} className="omack-card-compact">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Link 
                        to={`/instructor/courses/${c.id}`}
                        style={{ textDecoration: 'none', color: 'var(--omack-primary)', fontWeight: 600 }}
                      >
                        {c.code || c.id}
                      </Link>
                      <div style={{ fontSize: '0.9rem', color: 'var(--omack-text-secondary)', marginTop: '0.25rem' }}>
                        {c.title}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--omack-text-light)', textTransform: 'uppercase', letterSpacing: '0.3px', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Registrations
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--omack-primary)' }}>
                        {c.registrations}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-4" style={{ borderTop: '1px solid var(--omack-border-light)' }}>
                    <Button 
                      size="sm" 
                      onClick={() => onExportCourse(c.id)}
                      style={{ 
                        background: 'var(--omack-bg-lighter)',
                        color: 'var(--omack-primary)',
                        border: '1.5px solid var(--omack-border)',
                        fontWeight: 600
                      }}
                    >
                      <DownloadCloud className="mr-1 h-4 w-4" />Export
                    </Button>
                    <Link to={`/instructor/courses/${c.id}`}>
                      <Button 
                        size="sm"
                        style={{ 
                          background: 'linear-gradient(135deg, #165c4b 0%, #1e9a6f 100%)',
                          color: 'white',
                          fontWeight: 600
                        }}
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InstructorDashbaord;