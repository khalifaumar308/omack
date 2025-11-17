/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetDepartments, useGetCourses, useGetRegistrationSettings } from '@/lib/api/queries';
import { createRegistrationSetting, deleteRegistrationSetting } from '@/lib/api/base';
import { toast } from 'sonner';
import { useUser } from '@/contexts/useUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Trash2, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Course {
  id?: string;
  _id?: string;
  code: string;
  title: string;
  creditUnits: number;
  semester: string;
}

interface RegistrationSetting {
  _id: string;
  department: string;
  level: string;
  semester: 'First' | 'Second';
  session: string;
  maxCredits: number;
  coreCourses: string[];
  startDate: string;
  endDate: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const RegistrationSettings = () => {
  const { user } = useUser();
  const { data: departments } = useGetDepartments();
  const sessions = user?.school?.sessions || [user?.school?.currentSession || '2025/2026'];
	const levels = user?.school?.levels || ['100','200','300','400'];
  // Form state
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState(levels[0]);
  const [semester, setSemester] = useState<'First' | 'Second'>('First');
  const [session, setSession] = useState(sessions[0]);
  const [maxCredits, setMaxCredits] = useState<number>(18);
  const [selectedCoreCourses, setSelectedCoreCourses] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  // const [settings, setSettings] = useState<RegistrationSetting[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Course search & pagination state
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [coursePage, setCoursePage] = useState(1);
  const coursePageSize = 8;

  // Fetch courses with filters
  const { data: coursesResponse, isLoading: isLoadingCourses } = useGetCourses(
    coursePage,
    coursePageSize,
    courseSearchTerm,
    '',
    semester,
    level
  );

	const {data: settings, isLoading:isSettingsLoading, isError:isSettingsError} = useGetRegistrationSettings()

  const coursesData = useMemo(() => coursesResponse?.data || [], [coursesResponse]);
  const coursePagination = useMemo(() => (coursesResponse?.pagination as Pagination) || ({} as Pagination), [coursesResponse]);

  // Selected courses to display
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<Course[]>([]);

  useEffect(() => {
    if (departments && departments.length > 0 && !department) {
      setDepartment(departments[0]?.id || '');
    }
  }, [departments, department]);


  // Update selected course details when coreCourses change
  useEffect(() => {
    const details = selectedCoreCourses.map((courseId: string) => {
      const found = coursesData.find((c: Course) => c.id === courseId || c._id === courseId);
      return found || { id: courseId, code: 'Loading...', title: '', creditUnits: 0, semester: '' };
    });
    setSelectedCourseDetails(details);
  }, [selectedCoreCourses, coursesData]);

  const handleToggleCourse = (id: string) => {
    setSelectedCoreCourses(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  const handleRemoveSelectedCourse = (id: string) => {
    setSelectedCoreCourses(prev => prev.filter(x => x !== id));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !startDate || !endDate) {
      toast.error('Fill all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await createRegistrationSetting({ 
        department, 
        level, 
        semester, 
        session, 
        maxCredits, 
        coreCourses: selectedCoreCourses, 
        startDate, 
        endDate 
      });
      toast.success('Registration setting saved');
      setSelectedCoreCourses([]);
      setMaxCredits(18);
      setStartDate('');
      setEndDate('');
      setCourseSearchTerm('');
      setCoursePage(1);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Error saving setting');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this setting?')) return;
    try {
      await deleteRegistrationSetting(id);
      toast.success('Deleted');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Registration Settings</h1>
        <Button variant="outline" onClick={() => window.location.href = '/admin/course-registrations'}>
          Back to Course Registrations
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create/Update Setting</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Department *</Label>
                <Select onValueChange={(v)=> setDepartment(v)} value={department}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select department"/></SelectTrigger>
                  <SelectContent>
                    {departments?.map((d: any)=> (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Level *</Label>
                <Select onValueChange={(v)=> setLevel(v)} value={level}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select level"/></SelectTrigger>
                  <SelectContent>
                    {levels.map(l=> (<SelectItem key={l} value={l}>{l}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Semester *</Label>
                <Select onValueChange={(v)=> setSemester(v as 'First'|'Second')} value={semester}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select semester"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'First'}>First</SelectItem>
                    <SelectItem value={'Second'}>Second</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Session *</Label>
                <Select onValueChange={(v)=> setSession(v)} value={session}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select session"/></SelectTrigger>
                  <SelectContent>
                    {sessions.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Max Credits *</Label>
                <Input type="number" min="1" value={maxCredits} onChange={(e)=> setMaxCredits(Number(e.target.value))} />
              </div>

              <div>
                <Label className="text-sm font-medium">Registration Start Date *</Label>
                <Input type="datetime-local" value={startDate} onChange={(e)=> setStartDate(e.target.value)} />
              </div>

              <div>
                <Label className="text-sm font-medium">Registration End Date *</Label>
                <Input type="datetime-local" value={endDate} onChange={(e)=> setEndDate(e.target.value)} />
              </div>

              <div>
                <Label className="text-sm font-medium">Core Courses</Label>
                
                {/* Search and filter */}
                <div className="mb-3 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search by code or title..." 
                      value={courseSearchTerm}
                      onChange={(e) => {
                        setCourseSearchTerm(e.target.value);
                        setCoursePage(1);
                      }}
                      className="pl-8"
                    />
                  </div>
                </div>

                {/* Course list */}
                <div className="border rounded p-3 bg-gray-50 max-h-48 overflow-auto mb-3">
                  {isLoadingCourses ? (
                    <p className="text-sm text-gray-500">Loading courses...</p>
                  ) : coursesData && coursesData.length > 0 ? (
                    <div className="space-y-2">
                      {coursesData.map((c: Course) => (
                        <label key={c.id || c._id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                          <input 
                            type="checkbox" 
                            checked={selectedCoreCourses.includes(c.id || c._id || '')} 
                            onChange={() => handleToggleCourse(c.id || c._id || '')}
                          />
                          <span className="text-sm flex-1">
                            <span className="font-semibold">{c.code}</span> - {c.title}
                            <span className="text-xs text-gray-500 ml-2">({c.creditUnits} units)</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No courses found for {semester} semester, {level} level</p>
                  )}
                </div>

                {/* Pagination */}
                {coursePagination.totalPages && coursePagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-gray-600">
                      Page {coursePagination.page} of {coursePagination.totalPages}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCoursePage(p => Math.max(1, p - 1))}
                        disabled={!coursePagination.hasPrev}
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCoursePage(p => p + 1)}
                        disabled={!coursePagination.hasNext}
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Selected courses */}
                {selectedCoreCourses.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-xs font-semibold text-blue-900 mb-2">Selected Courses ({selectedCoreCourses.length})</p>
                    <div className="space-y-1 max-h-32 overflow-auto">
                      {selectedCourseDetails.map((course: Course) => (
                        <div key={course.id || course._id} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-blue-100">
                          <span>
                            <span className="font-semibold">{course.code}</span> - {course.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSelectedCourse(course.id || course._id || '')}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Setting'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Settings List Card */}
        <Card>
          <CardHeader>
            <CardTitle>Active Settings</CardTitle>
          </CardHeader>
          <CardContent>
						{isSettingsLoading && <div>Loading...</div>}
						{isSettingsError && <div>Error loading settings</div>}
            {(settings && settings.length) === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No settings configured yet</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2 max-h-96 overflow-auto">
                {settings?.map((s: RegistrationSetting) => (
                  <div key={s._id} className="border rounded p-3 space-y-1 text-sm">
                    <div className="font-medium">{s.level} Level - {s.semester} Semester</div>
                    <div className="text-gray-600">Max Credits: <span className="font-semibold">{s.maxCredits}</span></div>
                    <div className="text-gray-600">Core Courses: <span className="font-semibold">{s.coreCourses?.length || 0}</span></div>
                    <div className="text-gray-600 text-xs">
                      {new Date(s.startDate).toLocaleString()} - {new Date(s.endDate).toLocaleString()}
                    </div>
                    <div className="flex justify-end pt-1">
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(s._id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RegistrationSettings;
