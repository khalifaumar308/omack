/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Upload,
  BookOpen,
  AlertCircle,
  Filter,
  FileText,
  Users,
  Calendar,
  Eye,
  Edit2,
} from "lucide-react";
import type {
  IAdminCourseRegs,
  RegisterCourseRequest,
} from "@/components/types";
import {
  useGetCourseRegistrations,
  useGetCourses,
  useGetStudents,
  useGetDepartments,
} from "@/lib/api/queries";
import {
  useAdminAddBulkRegistrations,
  useAdminUpdateBulkRegStatus,
  useRegisterCourse,
} from "@/lib/api/mutations";
import SemesterCourseReg from "@/components/SemesterCourseReg";
import { useUser } from "@/contexts/useUser";
import { toast } from "sonner";

const CourseRegistrations = () => {
  const { user } = useUser();
  const semesters = ["First", "Second"];
  const sessions = user?.school?.sessions || ["2025/2026"];
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const [limit] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // default filters to 'all' so the Select components start in a neutral state
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  useEffect(() => {
    if (user?.school) {
      setSelectedSemester(user.school.currentSemester);
      setSelectedSession(user.school.currentSession);
    }
  }, [user?.school]);

  const [formData, setFormData] = useState<RegisterCourseRequest>({
    course: "",
    semester: "",
    session: "",
  });

  const [bulkFormData, setBulkFormData] = useState<{ student: string; course: string; semester: string; session: string }[] | []>([]);
  const [bulkSemester, setBulkSemester] = useState("");
  const [bulkSession, setBulkSession] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<IAdminCourseRegs | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [registrationToEdit, setRegistrationToEdit] = useState<IAdminCourseRegs | null>(null);

  // reset modal course search/page when editing a new registration
  useEffect(() => {
    if (registrationToEdit) {
      const semester = registrationToEdit.courseRegistrations?.[0]?.semester || user?.school?.currentSemester || '';
      setModalCourseSemester(semester);
      setModalCourseSearch('');
      setModalCoursePage(1);
    }
  }, [registrationToEdit, user?.school?.currentSemester]);

  // fetch registrations with current selected semester/session (use 'all' to fetch unfiltered)
  const [pageSize, setPageSize] = useState(10);
  const { data: registrationsRaw, isLoading, isError, error, refetch } = useGetCourseRegistrations(
    selectedSemester,
    selectedSession,
    currentPage,
    pageSize,
    searchTerm,
    selectedDepartment || 'all'
  );
  // registrationsRaw may be either an array (legacy) or { data, pagination }
  const registrationsData = Array.isArray(registrationsRaw) ? registrationsRaw : registrationsRaw?.data || [];
  const pagination = registrationsRaw && !Array.isArray(registrationsRaw) ? registrationsRaw.pagination : { page: currentPage, limit: pageSize, total: registrationsData.length, totalPages: 1, hasNext: false, hasPrev: false };
  const { data: courses, isLoading: isLoadingCourses } = useGetCourses(1, 1000);
  // request a larger page of courses for selects and lookups
  // keep previous data behavior is handled by react-query hook options
  const { data: students } = useGetStudents(1, 100); // Get more students for filtering
  const { data: departments } = useGetDepartments();
  // Modal (edit) specific course search/pagination
  const [modalCoursePage, setModalCoursePage] = useState<number>(1);
  const [modalCoursePageSize, setModalCoursePageSize] = useState<number>(10);
  const [modalCourseSearch, setModalCourseSearch] = useState<string>('');
  const [modalCourseSemester, setModalCourseSemester] = useState<string>(user?.school?.currentSemester || '');
  const { data: modalCoursesResponse, isLoading: isLoadingModalCourses } = useGetCourses(modalCoursePage, modalCoursePageSize, modalCourseSearch, '', modalCourseSemester || '', 'all');
  const registerCourseMutation = useRegisterCourse();
  const registerManyCourseMutation = useAdminAddBulkRegistrations();
  const updateBulkRegStatusMutation = useAdminUpdateBulkRegStatus();
  const courseRegistrations: IAdminCourseRegs[] = registrationsData || [];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<'pending' | 'approved' | 'rejected'>('approved');

  // React Query will refetch automatically when selectedSemester/selectedSession change


  useEffect(() => {
    if (registerCourseMutation.isSuccess || registerManyCourseMutation.isSuccess) {
      refetch();
      setIsDialogOpen(false);
      setIsBulkDialogOpen(false);
      resetForm();
      resetBulkForm();
    }
    if (updateBulkRegStatusMutation.isSuccess) {
      setSelectedIds([]);
      // refetch is triggered by mutation onSuccess
    }
  }, [registerCourseMutation.isSuccess, registerManyCourseMutation.isSuccess, updateBulkRegStatusMutation.isSuccess, refetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    registerCourseMutation.mutate(formData);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkFormData.length > 0) {
      registerManyCourseMutation.mutate(bulkFormData);
    } else {
      toast.error("No registrations to submit");
    }
  };

  const resetForm = () => {
    setFormData({
      course: "",
      semester: "",
      session: "",
    });
  };

  const resetBulkForm = () => {
    setBulkFormData([]);
    setSelectedFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  // console.log(students, 'students', courses, 'courses')
  // console.log(bulkFormData, 'bulk')
  const handleBulkUpload = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n').slice(1); // Skip header
      const registrations: { student: string; course: string, semester: string, session: string }[] = [];
      lines.forEach(line => {
        const [matricNo, courseCodes] = line.split(',');
        // console.log(matricNo, courseCodes, 'matricNo, courseCodes')
        //get student id and course ids from matricNo and courseCodes
        if (!matricNo || !courseCodes || !bulkSemester || !bulkSession) {
          return;
        }
        const studentId = (students?.find(student => student.matricNo === matricNo.trim()) as any)?._id;
        const courseCds = courseCodes?.trim().split(';');
        const courseIds = courses?.data?.filter((course: any) => courseCds.includes(course.code)).map((course: any) => course._id);
        if (studentId === "") {
          console.log(matricNo, 'student not found');
        }
        if (studentId && courseIds && courseIds.length > 0 && studentId !== "") {
          courseIds.forEach((courseId: string) => {
            registrations.push({ student: studentId, course: courseId, semester: bulkSemester, session: bulkSession });
          });
        }
      });

      if (registrations.length > 0) {
        // console.log(registrations, 'registrw')
        setBulkFormData(registrations);
      }
    };
    reader.readAsText(selectedFile);
    // setIsBulkDialogOpen(false);
    setSelectedFile(null);
  };
  // server-side filtering/pagination: server handles search, semester, session, student, page, limit
  const filteredRegistrations = courseRegistrations;
  // console.log(filteredRegistrations[0], 'fil')
  const startIdx = (currentPage - 1) * pageSize;
  const pagesAfterFilter = Math.max(1, Math.ceil((pagination?.total || filteredRegistrations.length) / pageSize));

  // const getGradeBadgeVariant = (grade?: string) => {
  //   if (!grade) return "secondary";
  //   if (["A", "A-", "B+"].includes(grade)) return "default";
  //   if (["B", "B-", "C+"].includes(grade)) return "secondary";
  //   return "destructive";
  // };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      ))}
    </div>
  );

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading course registrations: {error?.message}
            <Button onClick={() => refetch()} className="mt-2 w-full">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  // console.log({
  //   studentId: (registrationToEdit?.student as any)?.id || (registrationToEdit?.student as any)?._id || '',
  //   semester: registrationToEdit?.courseRegistrations?.[0]?.semester || user?.school?.currentSemester || '',
  //   session: registrationToEdit?.courseRegistrations?.[0]?.session || user?.school?.currentSession || '',
  //   courses: registrationToEdit?.courseRegistrations || [],
  //   status: (registrationToEdit as any)?.status || 'pending',
  // })
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Course Registrations</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Registration Settings Link */}
          <Button variant="outline" onClick={() => window.location.href = '/admin/registration-settings'}>
            <Calendar className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Registration Settings</span>
            <span className="sm:hidden">Settings</span>
          </Button>

          {/* Individual Registration Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Register Course</span>
                <span className="sm:hidden">Register</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Register New Course</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, course: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.data.map((course: any) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code} - {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester} Semester
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="session">Session</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, session: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Session" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions.map((session) => (
                        <SelectItem key={session} value={session}>
                          {session}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={registerCourseMutation.isPending}>
                    {registerCourseMutation.isPending ? "Registering..." : "Register"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Bulk Upload Dialog */}
          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Bulk Upload</span>
                <span className="sm:hidden">Upload</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Bulk Course Registration</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleBulkSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="bulk-semester">Semester</Label>
                  <Select onValueChange={(value) => setBulkSemester(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester} Semester
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bulk-session">Session</Label>
                  <Select onValueChange={(value) => setBulkSession(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Session" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions.map((session) => (
                        <SelectItem key={session} value={session}>
                          {session}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="csv-file">Upload CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    CSV format: matricNo, course-codes
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-2"
                    onClick={() => {
                      const csvContent = 'matricNo,course-codes\n';
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'bulk_course_registration_template.csv';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download CSV Template
                  </Button>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsBulkDialogOpen(false);
                    resetBulkForm();
                  }}>
                    Cancel
                  </Button>
                  {selectedFile ? (
                    <Button type="button" onClick={handleBulkUpload}>
                      Process CSV
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={registerManyCourseMutation.isPending || bulkFormData.length === 0}
                    >
                      {registerManyCourseMutation.isPending ? "Registering..." : "Register All"}
                    </Button>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search registrations..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8"
              />
            </div>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="all">All Semesters</SelectItem> */}
                {semesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester} Semester
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger>
                <SelectValue placeholder="All Sessions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                {sessions.map((session) => (
                  <SelectItem key={session} value={session}>
                    {session}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="All Students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {students?.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            <Select value={selectedDepartment} onValueChange={(val) => { setSelectedDepartment(val); setCurrentPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments?.map((d) => (
                  <SelectItem key={(d as any).id || (d as any)._id} value={(d as any).id || (d as any)._id}>
                    {(d as any).name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* View Registration Modal */}
      <Dialog open={viewModalOpen} onOpenChange={(open) => { if (!open) setSelectedRegistration(null); setViewModalOpen(open); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Registered Courses</DialogTitle>
          </DialogHeader>
          <div>
            {selectedRegistration ? (
              <div>
                <div className="mb-2">
                  <div className="font-semibold">{selectedRegistration.student.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedRegistration.student.matricNo}</div>
                </div>
                <div className="max-h-[56vh] sm:max-h-[64vh] overflow-scroll">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>CU</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRegistration.courseRegistrations.map((cr) => (
                        <TableRow key={cr.id}>
                          <TableCell className="font-medium">{cr.course.code}</TableCell>
                          <TableCell>{cr.course.title}</TableCell>
                          <TableCell>{cr.course.creditUnits || 0}</TableCell>
                        </TableRow>
                      ))}
                      {selectedRegistration.courseRegistrations.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-6">No courses registered</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={() => setViewModalOpen(false)}>Close</Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">Select a registration to view courses</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Edit Registration Modal (Admin) */}
      <Dialog open={editModalOpen} onOpenChange={(open) => {
        if (!open) {
          setRegistrationToEdit(null);
          refetch();
        }
        setEditModalOpen(open);
      }}>
        <DialogContent className="sm:min-w-3xl max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Student Registration</DialogTitle>
          </DialogHeader>
          <div>
            {registrationToEdit ? (
              <div>
                <div className="mb-2">
                  <div className="font-semibold">{registrationToEdit.student.name}</div>
                  <div className="text-sm text-muted-foreground">{registrationToEdit.student.matricNo}</div>
                </div>
                <div>
                  <SemesterCourseReg
                    edit={true}
                    courseReg={{
                      studentId: (registrationToEdit.student as any).id || (registrationToEdit.student as any)._id || '',
                      semester: registrationToEdit.courseRegistrations?.[0]?.semester || user?.school?.currentSemester || '',
                      session: registrationToEdit.courseRegistrations?.[0]?.session || user?.school?.currentSession || '',
                      courses: registrationToEdit.courseRegistrations || [],
                      status: (registrationToEdit as any).status || 'pending',
                    }}
                    courses={modalCoursesResponse || courses || { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }}
                    loading={isLoadingModalCourses || isLoadingCourses}
                    search={modalCourseSearch}
                    onSearch={(v) => { setModalCourseSearch(v); setModalCoursePage(1); }}
                    page={modalCoursePage}
                    setPage={setModalCoursePage}
                    pageSize={modalCoursePageSize}
                    setPageSize={setModalCoursePageSize}
                    onSuccess={() => {
                      setEditModalOpen(false);
                      setRegistrationToEdit(null);
                      refetch();
                    }}
                    semester={ registrationToEdit.courseRegistrations?.[0]?.semester || user?.school?.currentSemester || ''}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={() => setEditModalOpen(false)}>Close</Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">Select a registration to edit</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Pagination Controls */}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseRegistrations.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all semesters
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(courseRegistrations.map(r => r.student.id)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique students registered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Session</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2024/2025</div>
            <p className="text-xs text-muted-foreground">
              Academic session
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Course Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {(user?.role === 'school-admin' || user?.role === 'super-admin') && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === courseRegistrations.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(courseRegistrations.map(r => (r.student as any).id || (r.student as any)._id || ''))
                    } else {
                      setSelectedIds([])
                    }
                  }}
                  className="h-4 w-4"
                />
                <span className="text-sm text-muted-foreground">Select all</span>
              </div>
              <div className="flex items-center gap-2">
                <Select value={bulkStatus} onValueChange={(v) => setBulkStatus(v as 'pending' | 'approved' | 'rejected')}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Reject</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {
                    if (selectedIds.length === 0) { toast.error('No students selected'); return; }
                    // call mutation with selectedIds, using current filters for semester/session
                    updateBulkRegStatusMutation.mutate({ studentId: selectedIds, semester: selectedSemester === 'all' ? user?.school?.currentSemester || '' : selectedSemester, session: selectedSession === 'all' ? user?.school?.currentSession || '' : selectedSession, status: bulkStatus })
                  }}
                  disabled={updateBulkRegStatusMutation.isPending || selectedIds.length === 0}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
          {(isLoading || isLoadingCourses) ? (
            <LoadingSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><input type="checkbox" className="h-4 w-4" readOnly /></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Total Courses</TableHead>
                    <TableHead>TCU</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-left">
                  {filteredRegistrations.map((registration) => {
                    const sid = (registration.student as any).id || (registration.student as any)._id || registration.student.matricNo;
                    const totalUC = registration.courseRegistrations.reduce((total, reg) => total + (reg.course.creditUnits || 0), 0);
                    const status = registration.courseRegistrations?.[0]?.status || 'pending';
                    return (
                      <TableRow key={sid}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(sid)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedIds(prev => Array.from(new Set([...prev, sid])));
                              else setSelectedIds(prev => prev.filter(id => id !== sid));
                            }}
                            className="h-4 w-4"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div>{registration.student.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {registration.student.matricNo}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {registration.courseRegistrations.length} courses
                          </div>
                        </TableCell>
                        <TableCell>
                          {totalUC} UCs
                        </TableCell>
                        <TableCell>
                          {status === "approved" ? (
                            <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Approved</span>
                          ) : status === "pending" ? (
                            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">Pending</span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">Rejected</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRegistration(registration);
                                setViewModalOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                            {(user?.role === 'school-admin' || user?.role === 'super-admin') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setRegistrationToEdit(registration);
                                  setEditModalOpen(true);
                                }}
                              >
                                <Edit2 className="mr-2 h-4 w-4 text-green-600" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filteredRegistrations.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchTerm || selectedSemester || selectedSession
                          ? "No registrations match your filters."
                          : "No course registrations found. Add some to get started."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIdx + 1} - {Math.min(startIdx + pageSize, pagination?.total || filteredRegistrations.length)} of {pagination?.total || filteredRegistrations.length}
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(parseInt(v)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1 || !pagination?.hasPrev}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <div className="text-sm">Page {pagination?.page || currentPage} of {pagesAfterFilter}</div>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination?.hasNext || currentPage >= (pagination?.totalPages || pagesAfterFilter)}
                onClick={() => setCurrentPage((p) => Math.min((pagination?.totalPages || pagesAfterFilter), p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseRegistrations;
