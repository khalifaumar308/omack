// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Plus,
//   Search,
//   Edit,
//   Trash2,
//   School as SchoolIcon,
//   ChevronDown,
//   AlertTriangle,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// // import { toast } from "sonner";

// import type {
//   ISchool,
//   ICreateSchoolRequest,
// } from "@/types";
// import { useGetSchools } from "@/lib/api/queries";

// export default function Schools() {

//   // Create a safe toast wrapper

//   //   const [schools, setSchools] = useState<ISchool[]>([]);
//   //   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingSchool, setEditingSchool] = useState<ISchool | null>(null);
//   const [logoPreview, setLogoPreview] = useState<string>("");
//   const [signaturePreview, setSignaturePreview] = useState<string>("");
//   const [page, setPage] = useState(1);
//   const [formData, setFormData] = useState<ICreateSchoolRequest>({
//     name: "",
//     address: "",
//     email: "",
//     logo: "",
//     registrarSignature: "",
//   });

//   const { data, isLoading, isError, error, refetch } = useGetSchools(page, 10);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const errorMessage = isError ? ((error as any)?.response?.data?.message ?? (error as Error)?.message ?? "An unexpected error occurred.") : undefined;
//   console.log(data, 'schools')
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // // Validate required fields
//     // if (!formData.name.trim()) {
//     //   safeToast({
//     //     title: "Validation Error",
//     //     description: "School name is required",
//     //     variant: "destructive",
//     //   });
//     //   return;
//     // }

//     // if (!formData.email.trim()) {
//     //   safeToast({
//     //     title: "Validation Error",
//     //     description: "Email address is required",
//     //     variant: "destructive",
//     //   });
//     //   return;
//     // }

//     // if (!formData.address.trim()) {
//     //   safeToast({
//     //     title: "Validation Error",
//     //     description: "Address is required",
//     //     variant: "destructive",
//     //   });
//     //   return;
//     // }

//     // try {
//     //   const url = editingSchool
//     //     ? `/api/schools/${editingSchool.id}`
//     //     : "/api/schools";
//     //   const method = editingSchool ? "PUT" : "POST";

//     //   const response = await fetch(url, {
//     //     method,
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify(formData),
//     //   });

//     //   if (!response.ok) {
//     //     throw new Error(`HTTP error! status: ${response.status}`);
//     //   }

//     //   const data = (await response.json()) as ApiResponse<School>;
//     //   if (data.success) {
//     //     await fetchSchools();
//     //     setIsDialogOpen(false);
//     //     setEditingSchool(null);
//     //     resetForm();

//     //     safeToast({
//     //       title: "Success",
//     //       description: editingSchool
//     //         ? "School updated successfully"
//     //         : "School created successfully",
//     //     });
//     //   } else {
//     //     throw new Error(data.message || "Failed to save school");
//     //   }
//     // } catch (error) {
//     //   console.error("Error saving school:", error);

//     //   let errorMessage = "Failed to save school";

//     //   if (error instanceof Error) {
//     //     errorMessage = error.message;
//     //   } else if (typeof error === "string") {
//     //     errorMessage = error;
//     //   } else if (error && typeof error === "object" && "message" in error) {
//     //     errorMessage = String(error.message);
//     //   }

//     //   safeToast({
//     //     title: "Error",
//     //     description: errorMessage,
//     //     variant: "destructive",
//     //   });
//     // }
//   };

//   const handleDelete = async (schoolId: string) => {
//     console.log(schoolId)
//     // if (confirm("Are you sure you want to delete this school?")) {
//     //   try {
//     //     const response = await fetch(`/api/schools/${schoolId}`, {
//     //       method: "DELETE",
//     //     });

//     //     if (!response.ok) {
//     //       throw new Error(`HTTP error! status: ${response.status}`);
//     //     }

//     //     const data = (await response.json()) as ApiResponse;
//     //     if (data.success) {
//     //       await fetchSchools();
//     //       safeToast({
//     //         title: "Success",
//     //         description: "School deleted successfully",
//     //       });
//     //     } else {
//     //       throw new Error(data.message || "Failed to delete school");
//     //     }
//     //   } catch (error) {
//     //     console.error("Error deleting school:", error);

//     //     let errorMessage = "Failed to delete school";

//     //     if (error instanceof Error) {
//     //       errorMessage = error.message;
//     //     } else if (typeof error === "string") {
//     //       errorMessage = error;
//     //     } else if (error && typeof error === "object" && "message" in error) {
//     //       errorMessage = String(error.message);
//     //     }

//     //     safeToast({
//     //       title: "Error",
//     //       description: errorMessage,
//     //       variant: "destructive",
//     //     });
//     //   }
//     // }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       address: "",
//       email: "",
//       logo: "",
//       registrarSignature: "",
//     });
//     setLogoPreview("");
//     setSignaturePreview("");
//   };

//   const openEditDialog = (school: ISchool) => {
//     setEditingSchool(school);
//     setFormData({
//       name: school.name,
//       address: school.address,
//       email: school.email,
//       logo: school.logo || "",
//       registrarSignature: school.registrarSignature || "",
//     });
//     setLogoPreview(school.logo || "");
//     setSignaturePreview(school.registrarSignature || "");
//     setIsDialogOpen(true);
//   };

//   //   const updateSchoolStatus = async (
//   //     schoolId: string,
//   //     newStatus: boolean,
//   //   ) => {
//   //     console.log(schoolId, newStatus)
//   //     // try {
//   //     //   const response = await fetch(`/api/schools/${schoolId}/status`, {
//   //     //     method: "PATCH",
//   //     //     headers: { "Content-Type": "application/json" },
//   //     //     body: JSON.stringify({ status: newStatus }),
//   //     //   });

//   //     //   if (response.ok) {
//   //     //     const result = await response.json();
//   //     //     if (result.success) {
//   //     //       await fetchSchools();
//   //     //       safeToast({
//   //     //         title: "Status Updated",
//   //     //         description: `School status changed to ${newStatus}`,
//   //     //       });
//   //     //     } else {
//   //     //       throw new Error(result.message || "Failed to update status");
//   //     //     }
//   //     //   } else {
//   //     //     throw new Error(`HTTP error! status: ${response.status}`);
//   //     //   }
//   //     // } catch (error) {
//   //     //   console.error("Error updating school status:", error);
//   //     //   safeToast({
//   //     //     title: "Error",
//   //     //     description: "Failed to update school status",
//   //     //     variant: "destructive",
//   //     //   });
//   //     // }
//   //   };

//   const handleStatusChange = (school: ISchool, newStatus: boolean) => {
//     console.log(school, newStatus)
//     // const statusText = newStatus === "active" ? "activate" : "deactivate";

//     // if (confirm(`Are you sure you want to ${statusText} ${school.name}?`)) {
//     //   updateSchoolStatus(school.id, newStatus);
//     // }
//   };

//   const getStatusBadge = (status: ISchool["active"]) => {
//     const variants = {
//       active: "bg-green-100 text-green-800",
//       inactive: "bg-gray-100 text-gray-800",
//     };
//     return <Badge className={status ? variants.active : variants.inactive}>{status}</Badge>;
//   };

//   const handleFileUpload = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     type: "logo" | "signature",
//   ) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith("image/")) {
//         alert("Please select an image file");
//         return;
//       }

//       // Validate file size (max 2MB)
//       if (file.size > 2 * 1024 * 1024) {
//         alert("File size must be less than 2MB");
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const base64String = e.target?.result as string;
//         if (type === "logo") {
//           setFormData({ ...formData, logo: base64String });
//           setLogoPreview(base64String);
//         } else {
//           setFormData({ ...formData, registrarSignature: base64String });
//           setSignaturePreview(base64String);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const filteredSchools = data?.data?.data?.filter(
//     (school) =>
//       school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       school.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       school.email.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <SchoolIcon className="h-8 w-8 text-primary" />
//           <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
//         </div>
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button
//               onClick={() => {
//                 resetForm();
//                 setEditingSchool(null);
//               }}
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               Add School
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>
//                 {editingSchool ? "Edit School" : "Add New School"}
//               </DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="col-span-2">
//                   <Label htmlFor="name">School Name</Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e.target.value })
//                     }
//                     placeholder="e.g., University of Excellence"
//                     required
//                   />
//                 </div>
//                 <div className="col-span-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                     placeholder="e.g., info@university.edu"
//                     required
//                   />
//                 </div>
//                 <div className="col-span-2">
//                   <Label htmlFor="address">Address</Label>
//                   <Textarea
//                     id="address"
//                     value={formData.address}
//                     onChange={(e) =>
//                       setFormData({ ...formData, address: e.target.value })
//                     }
//                     placeholder="Full school address..."
//                     rows={3}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Logo Upload */}
//               <div>
//                 <Label>School Logo</Label>
//                 <div className="mt-2 space-y-4">
//                   <div className="flex items-center space-x-4">
//                     <div className="flex-1">
//                       <Input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleFileUpload(e, "logo")}
//                         className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
//                       />
//                     </div>
//                     {logoPreview && (
//                       <div className="w-16 h-16 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
//                         <img
//                           src={logoPreview}
//                           alt="Logo preview"
//                           className="max-w-full max-h-full object-contain"
//                         />
//                       </div>
//                     )}
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     Upload school logo (PNG, JPG, max 2MB)
//                   </p>
//                 </div>
//               </div>

//               {/* Registrar Signature Upload */}
//               <div>
//                 <Label>Registrar Signature</Label>
//                 <div className="mt-2 space-y-4">
//                   <div className="flex items-center space-x-4">
//                     <div className="flex-1">
//                       <Input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleFileUpload(e, "signature")}
//                         className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
//                       />
//                     </div>
//                     {signaturePreview && (
//                       <div className="w-24 h-12 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
//                         <img
//                           src={signaturePreview}
//                           alt="Signature preview"
//                           className="max-w-full max-h-full object-contain"
//                         />
//                       </div>
//                     )}
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     Upload registrar signature (PNG, JPG, max 2MB)
//                   </p>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setIsDialogOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit">
//                   {editingSchool ? "Update" : "Create"} School
//                 </Button>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>All Schools</CardTitle>
//           <div className="relative w-full max-w-sm">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search schools..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-8"
//             />
//           </div>
//         </CardHeader>
//         <CardContent>
//           {isLoading && (
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <Card key={i} className="hover:shadow-md transition-shadow">
//                   <CardContent className="p-6">
//                     <div className="space-y-4">
//                       <div className="flex items-center space-x-3">
//                         <Skeleton className="w-12 h-12 rounded-md" />
//                         <div className="flex-1">
//                           <div className="flex items-center justify-between">
//                             <Skeleton className="h-4 w-2/3" />
//                             <Skeleton className="h-5 w-16" />
//                           </div>
//                           <Skeleton className="h-3 w-1/2 mt-2" />
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <Skeleton className="h-3 w-full" />
//                         <Skeleton className="h-3 w-5/6" />
//                       </div>
//                       <div className="flex justify-end space-x-2 pt-2">
//                         <Skeleton className="h-8 w-8" />
//                         <Skeleton className="h-8 w-20" />
//                         <Skeleton className="h-8 w-8" />
//                       </div>
//                       <Skeleton className="h-3 w-1/3" />
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {isError && (
//             <div className="flex flex-col items-center justify-center py-10 text-center">
//               <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
//               <h3 className="font-semibold">Failed to load schools</h3>
//               <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
//               <Button onClick={() => refetch()} variant="outline">Retry</Button>
//             </div>
//           )}

//           {!isLoading && !isError && (
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               {filteredSchools?.map((school) => (
//                 <Card
//                   key={school.id}
//                   className="hover:shadow-md transition-shadow"
//                 >
//                   <CardContent className="p-6">
//                     <div className="space-y-4">
//                       {/* School Logo */}
//                       <div className="flex items-center space-x-3">
//                         {school.logo ? (
//                           <img
//                             src={school.logo}
//                             alt={`${school.name} logo`}
//                             className="w-12 h-12 object-contain rounded-md border"
//                           />
//                         ) : (
//                           <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
//                             <SchoolIcon className="h-6 w-6 text-gray-400" />
//                           </div>
//                         )}
//                         <div className="flex-1">
//                           <div className="flex items-center justify-between">
//                             <h3 className="font-semibold text-lg">
//                               {school.name}
//                             </h3>
//                             {getStatusBadge(school.active)}
//                           </div>
//                           <p className="text-sm text-muted-foreground">
//                             {school.email}
//                           </p>
//                         </div>
//                       </div>

//                       {/* School Details */}
//                       <div className="space-y-2">
//                         <div>
//                           <Label className="text-xs font-medium text-muted-foreground">
//                             Address
//                           </Label>
//                           <p className="text-sm">{school.address}</p>
//                         </div>

//                         {/* Registrar Signature */}
//                         {school.registrarSignature && (
//                           <div>
//                             <Label className="text-xs font-medium text-muted-foreground">
//                               Registrar Signature
//                             </Label>
//                             <div className="mt-1">
//                               <img
//                                 src={school.registrarSignature}
//                                 alt="Registrar signature"
//                                 className="h-8 object-contain border rounded"
//                               />
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       {/* Actions */}
//                       <div className="flex justify-end space-x-2 pt-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => openEditDialog(school)}
//                         >
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="outline" size="sm">
//                               Status <ChevronDown className="h-4 w-4 ml-1" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent>
//                             {(!school.active) && (
//                               <DropdownMenuItem
//                                 onClick={() =>
//                                   handleStatusChange(school, !!school.active)
//                                 }
//                                 className="text-green-600"
//                               >
//                                 Activate
//                               </DropdownMenuItem>
//                             )}
//                             {(school.active) && (
//                               <DropdownMenuItem
//                                 onClick={() =>
//                                   handleStatusChange(school, !!school.active)
//                                 }
//                                 className="text-gray-600"
//                               >
//                                 Deactivate
//                               </DropdownMenuItem>
//                             )}
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleDelete(school.id)}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>

//                       {/* Metadata */}
//                       <div className="text-xs text-muted-foreground pt-2 border-t">
//                         Created:{" "}
//                         {new Date(school.createdAt).toLocaleDateString()}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {filteredSchools?.length === 0 && !isLoading && !isError && (
//             <div className="text-center py-8 text-muted-foreground">
//               No schools found. Create your first school to get started.
//             </div>
//           )}
//           <div className="flex gap-2 mt-4">
//             <button onClick={() => setPage((old) => Math.max(old - 1, 1))} disabled={page === 1}>
//               Previous
//             </button>

//             <span>
//               Page {data?.data?.page} of {data?.data?.totalPages}
//             </span>

//             <button
//               onClick={() => setPage((old) => (old < data?.data?.totalPages ? old + 1 : old))}
//               disabled={page === data?.data?.totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

const Schools = () => {
  return (
    <div>Schools</div>
  )
}

export default Schools