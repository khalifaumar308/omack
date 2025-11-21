/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetDepartments, useGetCourses, useGetRegistrationSettings } from '@/lib/api/queries';
import { createRegistrationSetting, deleteRegistrationSetting, updateRegistrationSetting } from '@/lib/api/base';
import { toast } from 'sonner';
import { useUser } from '@/contexts/useUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Trash2, Search, ChevronLeft, ChevronRight, X, Edit2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Course, PopulatedRegistrationSetting } from '@/types/index';

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
  const [selectedCoreCourses, setSelectedCoreCourses] = useState<Course[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Course search & pagination state
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [coursePage, setCoursePage] = useState(1);
  const coursePageSize = 8;

  // Settings list state
  // const [settingsPagination, setSettingsPagination] = useState<Pagination | null>(null);
  const [settingsPage, setSettingsPage] = useState(1);
  const [settingsFilterDept, setSettingsFilterDept] = useState('');
  const [settingsFilterLevel, setSettingsFilterLevel] = useState('');
  const [settingsFilterSemester, setSettingsFilterSemester] = useState('');

	const {data: registrationSettingsData, isLoading: isLoadingRegistrationSettings, refetch } = useGetRegistrationSettings(settingsPage, settingsFilterDept, settingsFilterLevel,settingsFilterSemester,session);

  // Fetch courses with filters
  const { data: coursesResponse, isLoading: isLoadingCourses } = useGetCourses(
    coursePage,
    coursePageSize,
    courseSearchTerm,
    '',
    semester,
    level
  );

	const settingsPagination = useMemo(() => registrationSettingsData?.pagination, [registrationSettingsData]);

  const coursesData = useMemo(() => coursesResponse?.data || [], [coursesResponse]);
  const coursePagination = useMemo(() => (coursesResponse?.pagination as Pagination) || ({} as Pagination), [coursesResponse]);

  useEffect(() => {
    if (departments && departments.length > 0 && !department) {
      setDepartment(departments[0]?.id || '');
    }
  }, [departments, department]);



  const handleToggleCourse = (id: string) => {
    const exists = selectedCoreCourses.find(c => c.id === id || c._id === id);
		if (exists) {
			setSelectedCoreCourses(prev => prev.filter(c => (c.id || c._id) !== id));
		} else { 
			const courseToAdd = coursesData.find(c => (c as any)._id === id);
			console.log(coursesData, "cd")
			console.log(courseToAdd, 'courseToAdd', id)
			if (courseToAdd) {
				setSelectedCoreCourses(prev => [...prev, courseToAdd]);
			}
		}
  }

  const handleRemoveSelectedCourse = (id: string) => {
    setSelectedCoreCourses(prev => prev.filter(c => (c.id || c._id) !== id));
  }

  const handleEditSetting = (setting: PopulatedRegistrationSetting) => {
    setEditingId(setting._id);
    setDepartment(setting.department._id);
    setLevel(setting.level);
    setSemester(setting.semester);
    setSession(setting.session);
    setMaxCredits(setting.maxCredits);
    setSelectedCoreCourses(setting.coreCourses);
    
    const startStr = new Date(setting.startDate).toISOString();
    const endStr = new Date(setting.endDate).toISOString();
    setStartDate(startStr);
    setEndDate(endStr);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleResetForm = () => {
    setEditingId(null);
    setDepartment(departments?.[0]?.id || '');
    setLevel(levels[0]);
    setSemester('First');
    setSession(sessions[0]);
    setMaxCredits(18);
    setSelectedCoreCourses([]);
    setStartDate('');
    setEndDate('');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !startDate || !endDate) {
      toast.error('Fill all required fields');
      return;
    }

    try {
      setIsLoading(true);
      
      if (editingId) {
        // Update existing setting
        await updateRegistrationSetting(editingId, {
          maxCredits,
          coreCourses: selectedCoreCourses.map(c=> (c._id || c.id) ||""),
          startDate,
          endDate
        });
        toast.success('Registration setting updated');
        refetch();
      } else {
        // Create new setting
        await createRegistrationSetting({ 
          department, 
          level, 
          semester, 
          session, 
          maxCredits, 
          coreCourses: selectedCoreCourses.map(c=> (c._id || c.id) ||""), 
          startDate, 
          endDate 
        });
        toast.success('Registration setting saved');
        refetch();
      }

      handleResetForm();
      setSettingsPage(1);
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
            <CardTitle>{editingId ? 'Edit Setting' : 'Create/Update Setting'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Department *</Label>
                <Select onValueChange={(v)=> setDepartment(v)} value={department}>
                  <SelectTrigger className="w-full" disabled={!!editingId}><SelectValue placeholder="Select department"/></SelectTrigger>
                  <SelectContent>
                    {departments?.map((d: any)=> (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Level *</Label>
                <Select onValueChange={(v)=> setLevel(v)} value={level} disabled={!!editingId}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select level"/></SelectTrigger>
                  <SelectContent>
                    {levels.map(l=> (<SelectItem key={l} value={l}>{l}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Semester *</Label>
                <Select onValueChange={(v)=> setSemester(v as 'First'|'Second')} value={semester} disabled={!!editingId}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select semester"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'First'}>First</SelectItem>
                    <SelectItem value={'Second'}>Second</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Session *</Label>
                <Select onValueChange={(v)=> setSession(v)} value={session} disabled={!!editingId}>
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
                            checked={selectedCoreCourses.map(cc=>cc._id).includes(c.id || c._id || '')} 
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
                      {selectedCoreCourses.map((course: Course) => (
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

              <div className="flex justify-end gap-2 pt-2">
                {editingId && (
                  <Button type="button" variant="outline" onClick={handleResetForm} disabled={isLoading}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : (editingId ? 'Update' : 'Save')} Setting</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Settings List Card */}
        <Card>
          <CardHeader>
            <CardTitle>Active Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="space-y-3 pb-4 border-b">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className='col-span-1'>
                  <Label className="text-xs">Filter by Department</Label>
                  <Select value={settingsFilterDept || ""} onValueChange={(v) => { setSettingsFilterDept(v); setSettingsPage(1); }}>
                    <SelectTrigger className="w-full text-sm"><SelectValue placeholder="All Departments"/></SelectTrigger>
                    <SelectContent>
                      {departments?.map((d: any) => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='col-span-1'>
                  <Label className="text-xs">Filter by Level</Label>
                  <Select value={settingsFilterLevel || ""} onValueChange={(v) => { setSettingsFilterLevel(v); setSettingsPage(1); }}>
                    <SelectTrigger className="w-full text-sm"><SelectValue placeholder="All Levels"/></SelectTrigger>
                    <SelectContent>
                      {levels.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='col-span-1'>
                  <Label className="text-xs">Filter by Semester</Label>
                  <Select value={settingsFilterSemester || ""} onValueChange={(v) => { setSettingsFilterSemester(v); setSettingsPage(1); }}>
                    <SelectTrigger className="w-full text-sm"><SelectValue placeholder="All Semesters"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="First">First</SelectItem>
                      <SelectItem value="Second">Second</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {isLoadingRegistrationSettings && <div className="text-center text-sm text-gray-500">Loading...</div>}

            {registrationSettingsData?.data.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No settings found</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2 max-h-96 overflow-auto">
                {registrationSettingsData?.data.map((s) => (
                  <div key={s._id} className="border rounded p-3 space-y-2 text-sm bg-gray-50 hover:bg-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{s.level} Level - {s.semester} Semester</div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleEditSetting(s)}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(s._id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-gray-600 text-xs space-y-1">
                      <div>Max Credits: <span className="font-semibold">{s.maxCredits}</span></div>
                      <div>Core Courses: <span className="font-semibold">{s.coreCourses?.length || 0}</span></div>
                      <div>
                        {new Date(s.startDate).toLocaleString()} - {new Date(s.endDate).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {settingsPagination && settingsPagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-xs text-gray-600">
                  Page {settingsPagination.page} of {settingsPagination.totalPages}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSettingsPage(p => Math.max(1, p - 1))}
                    disabled={!settingsPagination.hasPrev}
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSettingsPage(p => p + 1)}
                    disabled={!settingsPagination.hasNext}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RegistrationSettings;

