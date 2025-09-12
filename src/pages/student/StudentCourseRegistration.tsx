import { useState, useMemo, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useUser } from '@/contexts/useUser';
import { useGetCourses, useGetCourseRegistrations } from '@/lib/api/queries';
import { useStudentRegisterManyCourses } from '@/lib/api/mutations';
import RegistrationSlip from '@/components/RegistrationSlip';
import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

function StudentCourseRegistration() {
  const { user } = useUser();
  const semesters = ['First', 'Second'];
  const sessions = user?.school?.sessions || [new Date().getFullYear() + '/' + (new Date().getFullYear() + 1)];

  const [selectedSemester, setSelectedSemester] = useState<string>(semesters[0]);
  const [selectedSession, setSelectedSession] = useState<string>(sessions[0]);

  const { data: courses } = useGetCourses();
  const { data: registrationsData, refetch } = useGetCourseRegistrations(selectedSemester, selectedSession);
  const registerMany = useStudentRegisterManyCourses();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studentRegs = useMemo(() => ((registrationsData || []) as any[]).find((r: any) => r.student?.id === user?.id)?.courseRegistrations || [], [registrationsData, user?.id]);

  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [resultLimit, setResultLimit] = useState<number>(50);

  const availableCourses = useMemo(() => {
    // exclude already registered course ids for the student in this semester/session
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registeredIds = new Set(studentRegs.map((r: any) => r.course.id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (courses || []).filter((c: any) => !registeredIds.has(c.id));
  }, [courses, studentRegs]);

  // debounce the search term to avoid filtering on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const filteredResults = useMemo(() => {
    const q = debouncedSearch;
    if (!q) return availableCourses.slice(0, resultLimit);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (availableCourses as any[])
      .filter((c) => (c.code || '').toLowerCase().includes(q) || (c.title || '').toLowerCase().includes(q))
      .slice(0, resultLimit);
  }, [availableCourses, debouncedSearch, resultLimit]);

  const toggleCourse = (id: string) => {
    setSelectedCourseIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const handleRegister = () => {
    if (selectedCourseIds.length === 0) return;
    registerMany.mutate({ courses: selectedCourseIds, semester: selectedSemester, session: selectedSession });
  };

  // refetch registrations after successful registration
  useEffect(() => {
    if (registerMany.isSuccess) {
      refetch?.();
      setSelectedCourseIds([]);
    }
  }, [registerMany.isSuccess, refetch]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedCourses = (courses || []).filter((c: any) => selectedCourseIds.includes(c.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Course Registration</h1>
        <div className="flex gap-2">
          <Select onValueChange={(v) => setSelectedSemester(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((s) => (
                <SelectItem key={s} value={s}>{s} Semester</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(v) => setSelectedSession(v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Session" />
            </SelectTrigger>
            <SelectContent>
              {sessions.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Previous Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {studentRegs.length === 0 ? (
            <div className="text-sm text-muted-foreground">No registrations found for selected semester/session.</div>
          ) : (
            <ul className="list-disc pl-5">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {studentRegs.map((r: any) => (
                <li key={r._id} className="mb-1">
                  {r.course.code} - {r.course.title} ({r.course.creditUnits} CU)
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Input
              placeholder="Search courses by code or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredResults.length === 0 ? (
              <div className="text-sm text-muted-foreground">No courses match your search.</div>
            ) : (
              <>
                <div className="max-h-64 overflow-y-auto divide-y rounded border">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {filteredResults.map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between p-2">
                    <div>
                      <div className="font-medium">{c.code} - {c.title}</div>
                      <div className="text-sm text-muted-foreground">{c.creditUnits} CU</div>
                    </div>
                    <div>
                      {selectedCourseIds.includes(c.id) ? (
                        <Button variant="secondary" onClick={() => toggleCourse(c.id)}>Remove</Button>
                      ) : (
                        <Button onClick={() => toggleCourse(c.id)}>Add</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
                {availableCourses.length > filteredResults.length && (
                  <div className="pt-2">
                    <Button variant="ghost" onClick={() => setResultLimit((v) => v + 50)}>Show more</Button>
                  </div>
                )}
              </>
            )}

            {selectedCourseIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(courses || []).filter((c: any) => selectedCourseIds.includes(c.id)).map((c: any) => (
                  <div key={c.id} className="px-2 py-1 rounded bg-muted text-sm flex items-center gap-2">
                    <span>{c.code}</span>
                    <button className="text-xs text-red-600" onClick={() => toggleCourse(c.id)}>x</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button onClick={handleRegister} disabled={registerMany.isPending || selectedCourseIds.length === 0}>
              {registerMany.isPending ? 'Registering...' : 'Register Selected Courses'}
            </Button>

            {selectedCourses.length > 0 && (
        <PDFDownloadLink
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          document={<RegistrationSlip studentName={user?.name || ''} matric={(user as any)?.matricNo} session={selectedSession} semester={selectedSemester} courses={selectedCourses} />}
                fileName={`registration-${selectedSession}-${selectedSemester}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="outline">{loading ? 'Preparing PDF...' : 'Download Slip (Selected)'}</Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optional embedded preview */}
      {selectedCourses.length > 0 && (
        <div style={{ height: 600 }}>
            <PDFViewer width="100%" height="100%">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <RegistrationSlip studentName={user?.name || ''} matric={(user as any)?.matricNo} session={selectedSession} semester={selectedSemester} courses={selectedCourses} />
            </PDFViewer>
        </div>
      )}
    </div>
  );
}

export default StudentCourseRegistration;