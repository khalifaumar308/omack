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
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {instructorName}</h1>
          <p className="text-sm text-muted-foreground">{semester} Semester {session ? `· ${session}` : ''}</p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="upload-csv" className="inline-flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 border bg-background">
            <UploadCloud className="size-4" />
            <span className="text-sm">Upload Results</span>
          </label>
          <input id="upload-csv" type="file" accept="text/csv,application/csv,.csv" className="hidden" />

          <Button variant="outline" onClick={() => { window.scrollTo({ top: 9999, behavior: 'smooth' }); }}>
            <FileText className="mr-2" /> View Courses
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-sm">Courses assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <div className="text-sm text-muted-foreground">Courses you're teaching this semester</div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-sm">Total students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat().format(totalRegistrations)}</div>
            <div className="text-sm text-muted-foreground">Students registered across your courses</div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-sm">Average class size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgClassSize}</div>
            <div className="text-sm text-muted-foreground">Average students per course</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Your courses</h3>
          <div className="flex items-center gap-2">
            <Button onClick={() => refetch()}>Refresh</Button>
            <Button variant="ghost" onClick={async () => {
              try {
                // export all courses combined is not implemented server-side; export course-by-course in sequence
                for (const c of courses) {
                  await onExportCourse(c.id);
                }
              } catch (err) {
                console.error(err);
                toast('Export failed');
              }
            }}>Export All</Button>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">No assigned courses</h3>
            <p className="text-sm text-muted-foreground">You currently have no courses assigned for this semester.</p>
          </div>
        ) : (
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Credit Units</TableHead>
                  <TableHead>Registrations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell><Link to={`/instructor/courses/${c.id}`}>{c.code || c.id}</Link></TableCell>
                    <TableCell>{c.title}</TableCell>
                    <TableCell>{c.creditUnits ?? '-'}</TableCell>
                    <TableCell>{c.registrations}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => onExportCourse(c.id)}><DownloadCloud className="mr-2"/>Export</Button>
                        <Link to={`/instructor/courses/${c.id}`}><Button size="sm">View</Button></Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Mobile cards */}
        <div className="md:hidden grid grid-cols-1 gap-4 mt-4">
          {courses.map((c) => (
            <Card key={c.id} className="p-3">
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{c.code || c.id}</div>
                    <div className="text-sm text-muted-foreground">{c.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Regs</div>
                    <div className="font-semibold">{c.registrations}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={() => onExportCourse(c.id)}><DownloadCloud className="mr-2"/>Export</Button>
                  <Link to={`/instructor/courses/${c.id}`}><Button size="sm">View</Button></Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashbaord;