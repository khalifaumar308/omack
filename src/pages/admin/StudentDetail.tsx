import { useGetStudent } from "@/lib/api/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users,  MapPin, User, GraduationCap } from "lucide-react";
import { useParams, Link } from "react-router";
import { Badge } from "@/components/ui/badge";

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: student, isLoading, isError, error } = useGetStudent(id || "");

  if (isLoading) {
    return <div className="text-center py-4">Loading student details...</div>;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading student: {error?.message}</p>
          <Button asChild>
            <Link to="/admin/students">Back to Students</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Student not found.</p>
        <Button asChild className="mt-2">
          <Link to="/admin/students">Back to Students</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Student Details</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/students">Back to Students</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-6 w-6" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Full Name</span>
              <span className="text-lg font-semibold">{student.name}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Matric Number</span>
              <span className="text-lg font-semibold">{student.matricNo}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Email</span>
              <span className="text-lg">{student.email}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Phone</span>
              <span className="text-lg">{student.phoneNumber || "Not provided"}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Date of Birth</span>
              <span className="text-lg">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "Not provided"}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
            </div>
          </div>
          {student.address && (
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm font-medium text-muted-foreground">Address</span>
                <p className="text-lg">{student.address}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span>Academic Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Level</span>
              <span className="text-lg font-semibold">{student.currentLevel}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Department</span>
              <span className="text-lg">{student.department?.name || "Not assigned"}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Faculty</span>
              <span className="text-lg">{student.faculty?.name || "Not assigned"}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">School</span>
              <span className="text-lg">{student.school?.name || "Not assigned"}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Admission Year</span>
              <span className="text-lg font-semibold">{student.admissionYear}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {student.profilePicture && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-6 w-6" />
              <span>Profile Picture</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={student.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}