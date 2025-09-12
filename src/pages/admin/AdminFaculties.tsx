import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Building } from "lucide-react";
import type { IFaculty, ICreateFacultyRequest } from "@/types";
import type { CreateFacultyForm } from "@/components/types";
import { useGetFaculties } from "@/lib/api/queries";
import { useAddFaculty, useDeleteFaculty, useUpdateFaculty } from "@/lib/api/mutations";
import { useUser } from "@/contexts/useUser";

export default function AdminFaculties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<IFaculty | null>(null);
  const [formData, setFormData] = useState<ICreateFacultyRequest>({
    name: "",
    code: "",
    description: "",
    dean: "",
  });

  const { user } = useUser();
  const { data, isLoading, isError, error, refetch } = useGetFaculties();
  const addFacultyMutation = useAddFaculty();
  const updateFacultyMutation = useUpdateFaculty();
  const deleteFacultyMutation = useDeleteFaculty();

  const faculties: IFaculty[] = data || [];

  useEffect(() => {
    if (addFacultyMutation.isSuccess || updateFacultyMutation.isSuccess || deleteFacultyMutation.isSuccess) {
      refetch();
      setIsDialogOpen(false);
      setEditingFaculty(null);
      resetForm();
    }
  }, [addFacultyMutation.isSuccess, updateFacultyMutation.isSuccess, deleteFacultyMutation.isSuccess, refetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const facultyData: CreateFacultyForm = {
      ...formData,
      school: user?.school?.id || "", // Assuming user has schoolId
    };
    if (editingFaculty) {
      updateFacultyMutation.mutate({ facultyId: editingFaculty.id, facultyData });
    } else {
      addFacultyMutation.mutate(facultyData);
    }
  };

  const handleDelete = (facultyId: string) => {
    if (confirm("Are you sure you want to delete this faculty?")) {
      deleteFacultyMutation.mutate(facultyId);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      dean: "",
    });
  };

  const openEditDialog = (faculty: IFaculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      code: faculty.code,
      description: faculty.description || "",
      dean: faculty.dean || "",
    });
    setIsDialogOpen(true);
  };

  const filteredFaculties = faculties.filter((faculty: IFaculty) =>
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (faculty.dean &&
      faculty.dean.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading faculties: {error?.message}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Faculties</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setEditingFaculty(null);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingFaculty ? "Edit Faculty" : "Add New Faculty"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Faculty Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Faculty of Science"
                  required
                />
              </div>
              <div>
                <Label htmlFor="code">Faculty Code</Label>
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
                <Label htmlFor="dean">Dean</Label>
                <Input
                  id="dean"
                  value={formData.dean}
                  onChange={(e) =>
                    setFormData({ ...formData, dean: e.target.value })
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
                  placeholder="Brief description of the faculty..."
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
                <Button type="submit" disabled={addFacultyMutation.isPending || updateFacultyMutation.isPending}>
                  {addFacultyMutation.isPending || updateFacultyMutation.isPending ? "Saving..." : (editingFaculty ? "Update" : "Create")} Faculty
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
                  <TableHead>Dean</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-left">
                {filteredFaculties.map((faculty: IFaculty) => (
                  <TableRow key={faculty.id}>
                    <TableCell className="font-medium">
                      {faculty.name}
                    </TableCell>
                    <TableCell>{faculty.code}</TableCell>
                    <TableCell>{faculty.dean || "Not assigned"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {faculty.description || "No description"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(faculty)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(faculty.id)}
                          disabled={deleteFacultyMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredFaculties.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No faculties match your search." : "No faculties found. Add one to get started."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}