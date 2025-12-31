/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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
import { Plus, Search, BookOpen, Upload, Edit, Trash2 } from "lucide-react";
import type { CreateCourseForm, PopulatedCourse } from "@/components/types";
import { normalizeCourse, getDepartmentName } from "@/lib/courseUtils";
import { useGetDepartments, useGetCourses } from "@/lib/api/queries";
import { useAddCourse, useUpdateCourse, useDeleteCourse, useBulkAddCourses } from "@/lib/api/mutations";
import { useUser } from "@/contexts/useUser";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingCourse, setEditingCourse] = useState<PopulatedCourse | null>(null);
  const { data: departments } = useGetDepartments();
  const { user } = useUser();

  const [formData, setFormData] = useState<CreateCourseForm>({
    code: "",
    title: "",
    department: "",
    school: "",
    instructors: [""],
    creditUnits: 0,
    semester: "First",
    level: user?.school?.levels?.[0] || "100"
  });

  const { data, isLoading, isError, error, refetch } = useGetCourses(currentPage, limit, searchTerm, selectedDepartment, selectedSemester, selectedLevel);
  const addCourseMutation = useAddCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();
  // support both array response and paginated { data, pagination }
  const coursesData = data?.data || [];
  const pagination = data?.pagination || { page: currentPage, limit, total: coursesData.length, totalPages: Math.ceil(coursesData.length / limit) };
  const courses = coursesData || [];
  const totalCourses = pagination.total || courses.length;
  const totalPages = pagination.totalPages || Math.ceil(totalCourses / limit);

  const bulkAddMutation = useBulkAddCourses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const courseData: CreateCourseForm = {
      ...formData,
      school: user?.school?.id || "",
    };
    if (editingCourse) {
      updateCourseMutation.mutate({ courseId: (editingCourse as any)._id, courseData }, {
        onSuccess: () => { setIsDialogOpen(false); setEditingCourse(null); }
      });
    } else {
      addCourseMutation.mutate(courseData, {
        onSuccess: () => { setIsDialogOpen(false); resetForm() }
      });
    }
  };

  const handleDelete = (courseId: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteCourseMutation.mutate(courseId);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      title: "",
      department: "",
      school: "",
      instructors: [""],
      creditUnits: 0,
      semester: "First",
      level: user?.school?.levels?.[0] || "100"
    } as CreateCourseForm);
  };

  const openEditDialog = (course: PopulatedCourse) => {
    setEditingCourse(course);
    const norm = normalizeCourse(course);
    setFormData({
      code: course.code,
      title: course.title,
      department: norm.departmentId,
      school: course.school.id,
      creditUnits: course.creditUnits,
      semester: course.semester,
      level: course.level,
    });
    setIsDialogOpen(true);
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading courses: {error?.message}</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setEditingCourse(null);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? "Edit Course" : "Add New Course"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      placeholder="Course code"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="creditUnits">Credit Units</Label>
                    <Input
                      id="creditUnits"
                      type="number"
                      value={formData.creditUnits}
                      onChange={(e) =>
                        setFormData({ ...formData, creditUnits: parseInt(e.target.value) || 0 })
                      }
                      placeholder="3"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Course title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments?.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {user?.school?.levels?.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={formData.semester} onValueChange={(value:"First"|"Second") => setFormData({ ...formData, semester: value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {["First", "Second"]?.map((semester) => (
                          <SelectItem key={semester} value={semester}>
                            {semester}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div className="col-span-2">
                    <Label htmlFor="instructors">Instructors (comma-separated IDs)</Label>
                    <Input
                      id="instructors"
                      value={formData.instructors}
                      onChange={(e) =>
                        setFormData({ ...formData, instructors: e.target.value })
                      }
                      placeholder="instructorId1,instructorId2"
                    />
                  </div> */}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addCourseMutation.isPending || updateCourseMutation.isPending}>
                    {addCourseMutation.isPending || updateCourseMutation.isPending ? "Saving..." : (editingCourse ? "Update" : "Create")} Course
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" type="button">
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Courses CSV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-file">Select CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setSelectedFile(file);
                    }}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setUploadDialogOpen(false);
                      setSelectedFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (!selectedFile) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const csv = event.target?.result as string;
                        const lines = csv.split('\n').slice(1); // Skip header
                        const newCourses = lines.map(line => {
                          const [code, title, department, creditUnits, level, semester] = line.split(',');
                          // const instructors = instructorsStr ? instructorsStr.split(',').map(i => i.trim()).filter(Boolean) : [];
                          return {
                            code: code?.trim(),
                            title: title?.trim(),
                            department: departments?.find(depart=>depart.name.trim()===department.trim())?.id || "",
                            school: user?.school?.id || "",
                            creditUnits: parseInt(creditUnits?.trim() || "0") || 0,
                            level: level?.trim() || (user?.school?.levels?.[0] || "100"),
                            semester: (semester?.trim() === "Second" ? "Second" : "First") as "First" | "Second",
                          };
                        }).filter(c => c.code && c.title && c.department && c.creditUnits);
                        bulkAddMutation.mutate(newCourses);
                      };
                      reader.readAsText(selectedFile);
                      // setUploadDialogOpen(false);
                      setSelectedFile(null);
                    }}
                    disabled={!selectedFile || bulkAddMutation.isPending}
                  >
                    {bulkAddMutation.isPending ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Courses</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8"
                />
              </div>
              <Select value={selectedDepartment} onValueChange={(v) => { setSelectedDepartment(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments?.map((dep) => (
                    <SelectItem key={dep.id} value={dep.id}>{dep.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSemester} onValueChange={(v) => { setSelectedSemester(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="First">First</SelectItem>
                  <SelectItem value="Second">Second</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={(v) => { setSelectedLevel(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {user?.school?.levels?.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Skeleton className="h-8 w-20" /></TableHead>
                    <TableHead><Skeleton className="h-8 w-48" /></TableHead>
                    <TableHead><Skeleton className="h-8 w-32" /></TableHead>
                    <TableHead><Skeleton className="h-8 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-8 w-40" /></TableHead>
                    <TableHead><Skeleton className="h-8 w-24" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-left">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Credit Units</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Instructors</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-left">
                  {coursesData.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        <Link to={`/admin/courses/${(course as any)._id || course.id}`} className="text-primary hover:underline">
                          {course.code}
                        </Link>
                      </TableCell>
                      <TableCell>{course.title}</TableCell>
                      <TableCell>{course.creditUnits}</TableCell>
                      <TableCell>{course.level || 'N/A'}</TableCell>
                      <TableCell>{course.semester || 'N/A'}</TableCell>
                      <TableCell>{course.instructors.length > 0 ? course.instructors.join(', ') : 'N/A'}</TableCell>
                      <TableCell>{getDepartmentName(course as any)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(course)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(course.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {coursesData.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No courses match your search." : "No courses found. Add one to get started."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}