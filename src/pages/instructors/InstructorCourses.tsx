import React from 'react';
import { useUser } from '@/contexts/useUser';
import { useGetInstructorCoursesStats } from '@/lib/api/queries';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Link } from 'react-router';

const InstructorCourses: React.FC = () => {
  const { user } = useUser();
  const { data: coursesStats, isLoading, isError, error, refetch } = useGetInstructorCoursesStats(user?.id);

  // Loading fallback: greeting skeleton + 3 stat skeletons + list skeleton
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="w-full sm:w-2/3">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="w-full sm:w-1/3 flex gap-2 justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4">
              <CardContent>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-lg border p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="mb-3">
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">Failed to load your courses</h2>
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
  const semester = coursesStats?.semester || 'Current';
  const session = coursesStats?.session || '';
  const courses = coursesStats?.courses || [];

  const totalCourses = courses.length;
  const totalRegistrations = courses.reduce((s, c) => s + (c.registrations || 0), 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Hello, {instructorName}</h1>
          <p className="text-sm text-muted-foreground">Here are your assigned courses for {semester} Semester {session ? `— ${session}` : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => refetch()}>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <CardContent>
            <div className="text-sm text-muted-foreground">Courses assigned</div>
            <div className="text-2xl font-bold">{totalCourses}</div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent>
            <div className="text-sm text-muted-foreground">Total registrations</div>
            <div className="text-2xl font-bold">{new Intl.NumberFormat().format(totalRegistrations)}</div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent>
            <div className="text-sm text-muted-foreground">Semester</div>
            <div className="text-2xl font-bold">{semester} {session ? `· ${session}` : ''}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border p-4">
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">No assigned courses found</h3>
            <p className="text-sm text-muted-foreground">You currently have no courses assigned for this semester.</p>
          </div>
        ) : (
          <div>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Credit Units</TableHead>
                    <TableHead>Registrations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className='hover:text-green-400'>
												<Link to={`/instructor/courses/${c.id}`} >{c.code || c.id}</Link>
											</TableCell>
                      <TableCell>{c.title}</TableCell>
                      <TableCell>{c.creditUnits ?? '-'}</TableCell>
                      <TableCell>{c.registrations}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {courses.map((c) => (
                <Card key={c.id} className="p-4">
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
                    <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                      <div>CU: {c.creditUnits ?? '-'}</div>
                      <div>Semester: {semester}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCourses;