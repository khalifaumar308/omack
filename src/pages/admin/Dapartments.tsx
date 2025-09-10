import type { CreateDepartmentForm, Department, PopulatedDepartment } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/useUser";
import { useAddDepartment, useUpdateDepartment, useDeleteDepartment } from "@/lib/api/mutations";
import { useGetDepartments, useGetFaculties } from "@/lib/api/queries";
import { Building, Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const Dapartments = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDapartment, setEditingDapartment] = useState<Department | null>(null);
    const [formData, setFormData] = useState<CreateDepartmentForm>({
        name: "",
        code: "",
        description: "",
        hod: "",
        faculty: "",
    });

    const { user } = useUser();
    const { data, isLoading, isError, error, refetch } = useGetDepartments();
    const { data: facultiesData } = useGetFaculties();
    const addDepartmentMutation = useAddDepartment();
    const updateDepartmentMutation = useUpdateDepartment();
    const deleteDepartmentMutation = useDeleteDepartment();

    const departments: PopulatedDepartment[] = data || [];

    useEffect(() => {
        if (addDepartmentMutation.isSuccess || updateDepartmentMutation.isSuccess || deleteDepartmentMutation.isSuccess) {
            refetch();
            setIsDialogOpen(false);
            setEditingDapartment(null);
            //   resetForm();
        }
    }, [addDepartmentMutation.isSuccess, updateDepartmentMutation.isSuccess, deleteDepartmentMutation.isSuccess, refetch]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const departmentData: CreateDepartmentForm = {
            ...formData,
            school: user?.school || "", // Assuming user has schoolId
        };
        if (editingDapartment) {
            updateDepartmentMutation.mutate({ departmentId: editingDapartment.id, departmentData });
        } else {
            addDepartmentMutation.mutate(departmentData);
        }
    };

    const handleDelete = (departmentId: string) => {
        if (confirm("Are you sure you want to delete this department?")) {
            deleteDepartmentMutation.mutate(departmentId);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            code: "",
            description: "",
            hod: "",
            faculty: "",
        });
    };

    const openEditDialog = (department: Department) => {
        setEditingDapartment(department);
        setFormData({
            name: department.name,
            code: department.code,
            description: department.description || "",
            hod: department.hod || "",
            faculty: department.faculty || "",
        });
        setIsDialogOpen(true);
    };

    const filteredDepartments = departments.filter((department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (department.hod &&
            department.hod.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (department.faculty &&
            department.faculty.name.toLowerCase().includes(searchTerm.toLowerCase())),
    );
    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-2">Error loading departments: {error?.message}</p>
                    <Button onClick={() => refetch()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Building className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                resetForm();
                                setEditingDapartment(null);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Faculty
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editingDapartment ? "Edit Department" : "Add New Department"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Department Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="e.g., Department of Science"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="code">Department Code</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) =>
                                        setFormData({ ...formData, code: e.target.value })
                                    }
                                    placeholder="e.g., FOS"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="faculty">Faculty</Label>
                                <Select onValueChange={val=>setFormData({...formData, faculty:val})}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Faculty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {facultiesData&&(facultiesData.map(faculty=>(
                                            <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>
                                        )))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="dean">Dean</Label>
                                <Input
                                    id="dean"
                                    value={formData.hod}
                                    onChange={(e) =>
                                        setFormData({ ...formData, hod: e.target.value })
                                    }
                                    placeholder="e.g., Prof. John Smith"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Brief description of the Department..."
                                    rows={3}
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
                                <Button type="submit" disabled={addDepartmentMutation.isPending || updateDepartmentMutation.isPending}>
                                    {addDepartmentMutation.isPending || updateDepartmentMutation.isPending ? "Saving..." : (editingDapartment ? "Update" : "Create")} Department
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Faculties</CardTitle>
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search faculties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-4">Loading faculties...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>HOD</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Faculty</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-left">
                                {filteredDepartments.map((faculty) => (
                                    <TableRow key={faculty.id}>
                                        <TableCell className="font-medium">
                                            {faculty.name}
                                        </TableCell>
                                        <TableCell>{faculty.code}</TableCell>
                                        <TableCell>{faculty.hod?.name || "Not assigned"}</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {faculty.description || "No description"}
                                        </TableCell>
                                        <TableCell>{faculty.faculty.name || "Not assigned"}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditDialog({
                                                        name: faculty.name,
                                                        code: faculty.code,
                                                        description: faculty.description,
                                                        school: faculty.school?.id,
                                                        faculty: faculty.faculty?.id,
                                                        id: faculty.id,
                                                        createdAt: faculty.createdAt,
                                                        updatedAt: faculty.updatedAt
                                                    })}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(faculty.id)}
                                                    disabled={deleteDepartmentMutation.isPending}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredDepartments.length === 0 && !isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            {searchTerm ? "No faculties match your search." : "No departments found. Add one to get started."}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Dapartments