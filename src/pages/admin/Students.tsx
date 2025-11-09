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
import { Plus, Search, Eye, Users, Upload, Terminal, Edit } from "lucide-react";
import { Link } from "react-router";
import type { CreateStudentForm, Student } from "@/components/types";
import { useGetDepartments, useGetStudents } from "@/lib/api/queries";
import { useAddStudent, useBulkAddStudents, useUpdateStudent, useTransitionStudents } from "@/lib/api/mutations";
import { useUser } from "@/contexts/useUser";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StudentIDCardGenerator from "@/components/StudentIDCardGenerator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [isTransitionDialogOpen, setIsTransitionDialogOpen] = useState(false);
    const [showTransitionConfirmation, setShowTransitionConfirmation] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const { data: departments } = useGetDepartments();
    const { user } = useUser();
    const [formData, setFormData] = useState<CreateStudentForm>({
      name: "",
      email: "",
      password: "",
      role: "student",
      school: "",
      level: user?.school?.levels?.[0] || "100",
      matricNo: "",
      department: "",
    });
    const [transitionFormData, setTransitionFormData] = useState({
      fromLevel: "",
      toLevel: "",
      department: "",
    });
  
    // fetch a large number of students once and handle pagination/filtering on client
    const { data, isLoading, isError, error, refetch } = useGetStudents(1, 10000);
    const addStudentMutation = useAddStudent();
    const updateStudentMutation = useUpdateStudent();
    // const deleteStudentMutation = useDeleteStudent();
    const bulkAddStudentMutation = useBulkAddStudents();
    const transitionStudentsMutation = useTransitionStudents();
  
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
  
    const handleTransitionSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setShowTransitionConfirmation(true);
    };
  
    const confirmTransition = () => {
      transitionStudentsMutation.mutate(transitionFormData);
      setIsTransitionDialogOpen(false);
      setShowTransitionConfirmation(false);
    };
  
    // const handleDelete = (studentId: string) => {
    //   if (confirm("Are you sure you want to delete this student?")) {
    //     deleteStudentMutation.mutate(studentId);
    //   }
    // };
    // console.log(departments);
    const resetForm = () => {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
        school: "",
        level: user?.school?.levels?.[0] || "100",
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
          if (!name || !email || !matricNo || !department || !level || !password) {
            return;
          }
          return {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            role: "student" as const,
            school: user?.school?.id || "",
            level: parseInt(level.trim()) || 100,
            matricNo: matricNo.trim(),
            department: departments?.find(dep => dep.name.trim() === department.trim())?.id || "",
          };
        }).filter(s => s?.name && s?.email && s?.matricNo);
        if (students.length > 0) {
          const final = JSON.parse(JSON.stringify(students)) as CreateStudentForm[];
          bulkAddStudentMutation.mutate(final);
        }
      };
      reader.readAsText(selectedFile);
      // setUploadDialogOpen(false);
      setSelectedFile(null);
    };
  
    const openEditDialog = (student: any) => {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        password: "",
        role: "student",
        school: student.school as string,
        level: String(student.level),
        matricNo: student.matricNo,
        department: (student.department as any).id,
      });
      setIsDialogOpen(true);
    };
  
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
    console.log(filteredStudents, "filr")
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
                      <Select onValueChange={(value) => setFormData({ ...formData, level: value })} value={formData.level}>
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
                      <Label htmlFor="department">Department</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, department: value })} value={formData.department}>
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
            <Dialog open={isTransitionDialogOpen} onOpenChange={(open) => {
              setIsTransitionDialogOpen(open);
              if (!open) setShowTransitionConfirmation(false); // Reset confirmation state when main dialog closes
            }}>
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <Users className="mr-2 h-4 w-4" />
                  Transition Students
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Transition Students</DialogTitle>
                </DialogHeader>
                {showTransitionConfirmation ? (
                  <div className="space-y-4">
                    <Alert variant="destructive">
                      <Terminal className="h-4 w-4" />
                      <AlertTitle>Confirm Transition</AlertTitle>
                      <AlertDescription>
                        Are you absolutely sure you want to transition students from level {transitionFormData.fromLevel} to {transitionFormData.toLevel} in {departments?.find(d => d.id === transitionFormData.department)?.name}? This action cannot be undone and may have significant side effects on billing and course registrations.
                      </AlertDescription>
                    </Alert>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowTransitionConfirmation(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={confirmTransition}
                        disabled={transitionStudentsMutation.isPending}
                      >
                        {transitionStudentsMutation.isPending ? "Transitioning..." : "Confirm Transition"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleTransitionSubmit} className="space-y-4">
                    <Alert>
                      <Terminal className="h-4 w-4" />
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>
                        Transitioning students to a new level can have side effects on their billing and course registrations. Please ensure you have handled these manually after the transition.
                      </AlertDescription>
                    </Alert>
                    <div>
                      <Label htmlFor="fromLevel">From Level</Label>
                      <Select onValueChange={(value) => setTransitionFormData({ ...transitionFormData, fromLevel: value })}>
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
                      <Label htmlFor="toLevel">To Level</Label>
                      <Select onValueChange={(value) => setTransitionFormData({ ...transitionFormData, toLevel: value })}>
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
                      <Label htmlFor="department">Department</Label>
                      <Select onValueChange={(value) => setTransitionFormData({ ...transitionFormData, department: value })}>
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
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsTransitionDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={transitionStudentsMutation.isPending}>
                        {transitionStudentsMutation.isPending ? "Transitioning..." : "Transition"}
                      </Button>
                    </div>
                  </form>
                )}
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
                    <Button
                      type="button"
                      variant="secondary"
                      className="mb-2"
                      onClick={() => {
                        // Template: name,email,matricNo,department,level,password
                        const csvContent = 'name,email,matricNo,department,level,password\n';
                        const blob = new Blob([csvContent], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'students_upload_template.csv';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download CSV Template
                    </Button>
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
            <StudentIDCardGenerator students={students.map(s => ({
              name: s.name,
              id: s.matricNo,
              level: String(s.level),
              qrUrl: `${s.matricNo}-ID CARD`,
              photoUrl: s.picture,
              department: s.department?.name || "N/A"
            }))} school={{ name: user?.school?.name || "School", logoUrl: user?.school?.logo || "default-logo.png" }} />
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
                      {user?.school?.levels?.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
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
                      <TableHead>ID Card</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-left">
                    {filteredStudents.map((student, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.matricNo}</TableCell>
                        <TableCell>{student.level}</TableCell>
                        <TableCell>
                          {student.department.name}
                        </TableCell>
                        <TableCell>
                          <StudentIDCardGenerator
                              students={[{
                                name: student.name,
                                id: student.matricNo,
                                level: String(student.level),
                                qrUrl: `${student.matricNo}-ID CARD`, 
                                photoUrl: student.picture,
                                department: student.department?.name || "N/A"
                              }]}
                              school={{ name: user?.school?.name || "School", logoUrl: user?.school?.logo || "default-logo.png" }}
                            />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/admin/students/${(student as any)._id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(student)}>
                              <Edit className="h-4 w-4" />
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
  