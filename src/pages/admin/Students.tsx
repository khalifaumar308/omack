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
import { Plus, Search, Eye, Users, Upload } from "lucide-react";
import { Link } from "react-router";
import type { CreateStudentForm, Student } from "@/components/types";
import { useGetDepartments, useGetStudents } from "@/lib/api/queries";
import { useAddStudent, useBulkAddStudents, useUpdateStudent } from "@/lib/api/mutations";
import { useUser } from "@/contexts/useUser";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { data: departments } = useGetDepartments();
  const [formData, setFormData] = useState<CreateStudentForm>({
    name: "",
    email: "",
    password: "",
    role: "student",

    school: "",
    level: 100,
    matricNo: "",
    department: "",
  });

  const { user } = useUser();
  // fetch a large number of students once and handle pagination/filtering on client
  const { data, isLoading, isError, error, refetch } = useGetStudents(1, 10000);
  const addStudentMutation = useAddStudent();
  const updateStudentMutation = useUpdateStudent();
  // const deleteStudentMutation = useDeleteStudent();
  const bulkAddStudentMutation = useBulkAddStudents();

  const students = data || [];
  const totalStudents = students.length;
  // totalPages replaced by pagesAfterFilter after client-side filtering

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const studentData: CreateStudentForm = {
      ...formData,
      school: user?.school?.id || "",
    };
    if (editingStudent) {
      updateStudentMutation.mutate({ studentId: editingStudent.id, studentData });
    } else {
      addStudentMutation.mutate(studentData);
    }
  };

  // const handleDelete = (studentId: string) => {
  //   if (confirm("Are you sure you want to delete this student?")) {
  //     deleteStudentMutation.mutate(studentId);
  //   }
  // };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "student",
      school: "",
      level: 100,
      matricNo: "",
      department: "",
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n').slice(1); // Skip header
      const students = lines.map(line => {
        const [name, email, matricNo, department, level, password] = line.split(',');
        if(!name || !email || !matricNo || !department || !level || !password) {
          return ;
        }
        return {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          role: "student" as const,
          school: user?.school?.id || "",
          level: parseInt(level.trim()) || 100,
          matricNo: matricNo.trim(),
          department: departments?.find(dep => dep.name === department.trim())?.id || "",
        };
      }).filter(s => s?.name && s?.email && s?.matricNo);
      if (students.length > 0) {
        console.log(students);
        const final = JSON.parse(JSON.stringify(students)) as CreateStudentForm[];
        bulkAddStudentMutation.mutate(final);
      }
    };
    reader.readAsText(selectedFile);
    // setUploadDialogOpen(false);
    setSelectedFile(null);
  };

  // const openEditDialog = (student: Student) => {
  //   setEditingStudent(student);
  //   setFormData({
  //     name: student.name,
  //     email: student.email,
  //     password: "",
  //     role: "student",

  //     school: student.school,
  //     level: student.level,
  //     matricNo: student.matricNo,
  //     department: student.department,
  //   });
  //   setIsDialogOpen(true);
  // };

  const filteredStudentsAll = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment === 'all' || (student.department && student.department.id === selectedDepartment);

    const matchesLevel = selectedLevel === 'all' || (String(student.level) === selectedLevel);

    return matchesSearch && matchesDepartment && matchesLevel;
  });

  // client-side pagination after filtering
  const startIdx = (currentPage - 1) * limit;
  const filteredStudents = filteredStudentsAll.slice(startIdx, startIdx + limit);
  const pagesAfterFilter = Math.max(1, Math.ceil(filteredStudentsAll.length / limit));

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading students: {error?.message}</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setEditingStudent(null);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingStudent ? "Edit Student" : "Add New Student"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="student@example.com"
                      required
                    />
                  </div>
                  {/* <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                      placeholder="Phone number"
                    />
                  </div> */}
                  <div>
                    <Label htmlFor="matricNo">Matric Number</Label>
                    <Input
                      id="matricNo"
                      value={formData.matricNo}
                      onChange={(e) =>
                        setFormData({ ...formData, matricNo: e.target.value })
                      }
                      placeholder="Matric number"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Input
                      id="level"
                      type="number"
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: parseInt(e.target.value) })
                      }
                      placeholder="100"
                      required
                    />
                  </div>
                  {/* <div>
                    <Label htmlFor="admissionYear">Admission Year</Label>
                    <Input
                      id="admissionYear"
                      type="number"
                      value={formData.admissionYear}
                      onChange={(e) =>
                        setFormData({ ...formData, admissionYear: parseInt(e.target.value) })
                      }
                      placeholder="2023"
                      required
                    />
                  </div> */}
                  {/* <div>
                    <Label htmlFor="status">Status</Label>
                    <Input
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as "active" | "inactive" | "graduated" | "suspended" })
                      }
                      placeholder="active"
                      required
                    />
                  </div> */}
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, department: value })}>
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
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Password"
                    required={!editingStudent}
                  />
                </div>
                {/* <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                  />
                </div> */}
                {/* <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Address"
                  />
                </div> */}
                {/* <div>
                  <Label htmlFor="profilePicture">Profile Picture URL</Label>
                  <Input
                    id="profilePicture"
                    value={formData.profilePicture}
                    onChange={(e) =>
                      setFormData({ ...formData, profilePicture: e.target.value })
                    }
                    placeholder="Profile picture URL"
                  />
                </div> */}
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addStudentMutation.isPending || updateStudentMutation.isPending}>
                    {addStudentMutation.isPending || updateStudentMutation.isPending ? "Saving..." : (editingStudent ? "Update" : "Create")} Student
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
                <DialogTitle>Upload Students CSV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-file">Select CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
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
                    onClick={handleUpload}
                    disabled={!selectedFile || bulkAddStudentMutation.isPending}
                  >
                    {bulkAddStudentMutation.isPending ? "Uploading..." : "Upload"}
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
            <div>
              <CardTitle>All Students</CardTitle>
              <div className="text-sm text-muted-foreground">Total students: {totalStudents}</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8"
                />
              </div>
              <div className="flex items-center space-x-2">
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

                <Select value={selectedLevel} onValueChange={(v) => { setSelectedLevel(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="300">300</SelectItem>
                    <SelectItem value="400">400</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading students...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Matric Number</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-left">
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.matricNo}</TableCell>
                      <TableCell>{student.level}</TableCell>
                      <TableCell>
                        {student.department.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/admin/students/${student.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No students match your search." : "No students found. Add one to get started."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {pagesAfterFilter > 1 && (
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
                    {Array.from({ length: pagesAfterFilter }, (_, i) => i + 1).map((page) => (
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
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagesAfterFilter))}
                    disabled={currentPage === pagesAfterFilter}
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