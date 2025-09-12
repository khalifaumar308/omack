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
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import type {
  IAdminCourseRegs,
  RegisterCourseRequest,
} from "@/components/types";
import {
  useGetCourseRegistrations,
  useGetCourses,
  useGetStudents,
} from "@/lib/api/queries";
import {
  useAdminAddBulkRegistrations,
  useRegisterCourse,
} from "@/lib/api/mutations";
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
  const [selectedSemester, setSelectedSemester] = useState<string>(user?.school?.currentSemester || "all");
  const [selectedSession, setSelectedSession] = useState<string>(user?.school?.currentSession || "all");
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  
  const [formData, setFormData] = useState<RegisterCourseRequest>({
    course: "",
    semester: "",
    session: "",
  });

  const [bulkFormData, setBulkFormData] = useState<{student:string; course:string; semester:string; session:string}[]|[]>([]);
  const [bulkSemester, setBulkSemester] = useState("");
  const [bulkSession, setBulkSession] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<IAdminCourseRegs | null>(null);

  // fetch registrations with current selected semester/session (use 'all' to fetch unfiltered)
  const { data: registrations, isLoading, isError, error, refetch } = useGetCourseRegistrations(selectedSemester || 'all', selectedSession || 'all');
  const { data: courses } = useGetCourses();
  const { data: students } = useGetStudents(1, 100); // Get more students for filtering
  const registerCourseMutation = useRegisterCourse();
  const registerManyCourseMutation = useAdminAddBulkRegistrations();

  const courseRegistrations: IAdminCourseRegs[] = registrations || [];

  // React Query will refetch automatically when selectedSemester/selectedSession change
  

  useEffect(() => {
    if (registerCourseMutation.isSuccess || registerManyCourseMutation.isSuccess) {
      refetch();
      setIsDialogOpen(false);
      setIsBulkDialogOpen(false);
      resetForm();
      resetBulkForm();
    }
  }, [registerCourseMutation.isSuccess, registerManyCourseMutation.isSuccess, refetch]);

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
      const registrations: { student: string; course: string, semester:string, session:string }[] = [];
      lines.forEach(line => {
        const [matricNo, courseCodes] = line.split(',');
        // console.log(matricNo, courseCodes, 'matricNo, courseCodes')
        //get student id and course ids from matricNo and courseCodes
        const studentId = (students?.find(student => student.matricNo === matricNo.trim()) as any)?._id;
        const courseCds = courseCodes.trim().split(';');
        const courseIds = courses?.filter(course => courseCds.includes(course.code)).map((course:any) => course._id);
        if (studentId === "") {
          console.log(matricNo, 'student not found');
        }
        if (studentId && courseIds && courseIds.length > 0 && studentId !== "") {
          courseIds.forEach(courseId => {
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

  // client-side filtering
  // Filter the grouped registrations. Note: IAdminCourseRegs groups a student with
  // an array of populated course registrations, and semester/session live on
  // each nested course registration entry. We treat a group as matching if any
  // nested registration matches the chosen semester/session.
  const filteredRegistrationsAll = courseRegistrations.filter((registration) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || registration.student.name.toLowerCase().includes(q) || registration.student.matricNo?.toLowerCase().includes(q);
    const matchesSemester = !selectedSemester || selectedSemester === "all" || registration.courseRegistrations.some((cr) => cr.semester === selectedSemester);
    const matchesSession = !selectedSession || selectedSession === "all" || registration.courseRegistrations.some((cr) => cr.session === selectedSession);
    const matchesStudent = !selectedStudent || selectedStudent === "all" || registration.student.id === selectedStudent;

    return matchesSearch && matchesStudent && matchesSemester && matchesSession;
  });

  // client-side pagination
  const [limit] = useState(10);
  const startIdx = (currentPage - 1) * limit;
  const pagesAfterFilter = Math.max(1, Math.ceil(filteredRegistrationsAll.length / limit));
  const filteredRegistrations = filteredRegistrationsAll.slice(startIdx, startIdx + limit);

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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Course Registrations</h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
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
                      {courses?.map((course) => (
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
                {/* <div>
                  <Label htmlFor="courses">Courses (select multiple)</Label>
                  <Select onValueChange={(value) => {
                    const newCourses = bulkFormData.courses.includes(value) 
                      ? bulkFormData.courses.filter(c => c !== value)
                      : [...bulkFormData.courses, value];
                    setBulkFormData({ ...bulkFormData, courses: newCourses });
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code} - {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {bulkFormData.courses.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {bulkFormData.courses.map((courseId) => {
                        const course = courses?.find(c => c.id === courseId);
                        return course ? (
                          <Badge key={courseId} variant="secondary" className="text-xs">
                            {course.code}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div> */}
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
                <SelectItem value="all">All Semesters</SelectItem>
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
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
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
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Total Courses</TableHead>
                    <TableHead>TCU</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-left">
                  {filteredRegistrations.map((registration) => (
                    <TableRow key={registration.student.matricNo}>
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
                        {registration.courseRegistrations.reduce((total, reg) => total + (reg.course.creditUnits || 0), 0)} UCs
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Approved</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRegistration(registration);
                            setViewModalOpen(true);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                      {/* <TableCell>
                        <Badge variant="secondary">
                          {registration.session}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {registration.score !== undefined ? (
                          <span className="font-medium">{registration.score}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {registration.grade ? (
                          <Badge variant={getGradeBadgeVariant(registration.grade)}>
                            {registration.grade}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell> */}
                    </TableRow>
                  ))}
                  {filteredRegistrations.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchTerm || selectedSemester || selectedSession || selectedStudent
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
          Showing {startIdx + 1} - {Math.min(startIdx + limit, filteredRegistrationsAll.length)} of {filteredRegistrationsAll.length}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <div className="text-sm">Page {currentPage} of {pagesAfterFilter}</div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= pagesAfterFilter}
            onClick={() => setCurrentPage((p) => Math.min(pagesAfterFilter, p + 1))}
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
