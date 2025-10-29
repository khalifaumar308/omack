import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/useUser";
import { useGetStudent } from "@/lib/api/queries";
import { uploadFile } from "@/lib/api/base";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpdateStudent } from "@/lib/api/mutations";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const MAX_IMAGE_SIZE = 400 * 1024; // 400 KB

const StudentProfile: React.FC = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { data: student, isLoading, isError } = useGetStudent(user?.id || "");

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    homeAddress: "",
    dateOfBirth: "",
    guardianName: "",
    guardianEmail: "",
    guardianPhone: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const updateStudentMutation = useUpdateStudent();

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => uploadFile(formData),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Image upload failed');
    },
    onSuccess: () => {},
  });

  useEffect(() => {
    if (student) {
      setFormState({
        name: student.name || "",
        email: student.email || "",
        phone: (student.phone as string) || "",
        homeAddress: (student.homeAddress as string) || "",
        dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().slice(0, 10) : "",
        guardianName: (student.guardian?.name as string) || '',
        guardianEmail: (student.guardian?.email as string) || '',
        guardianPhone: (student.guardian?.phone as string) || '',
      });
      setImagePreview((student.picture as string) || null);
    }
  }, [student]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image is too large. Max size is 400 KB');
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleChange = (k: string, v: string) => {
    setFormState(prev => ({ ...prev, [k]: v }));
  };

  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!student) return;
    setSaving(true);
    try {
      let photoUrl = (student.picture as string) || undefined;
      if (imageFile) {
        setUploadingImage(true);
        const fd = new FormData();
        fd.append('file', imageFile);
        // optionally include folder or filename
        fd.append('folder', `students/${student.id}`);
        const res = await uploadMutation.mutateAsync(fd);
        photoUrl = (res.url || res.secure_url || photoUrl) as string;
        setUploadingImage(false);
      }

      // Prepare update payload with allowed fields only
      const payload: Record<string, unknown> = {
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        homeAddress: formState.homeAddress,
        dateOfBirth: formState.dateOfBirth || undefined,
        guardian: {
          name: formState.guardianName,
          email: formState.guardianEmail,
          phone: formState.guardianPhone,
        }
      };
      if (photoUrl) payload.picture = photoUrl;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateStudentMutation.mutateAsync({ studentId: (student as any)._id, studentData: payload });
      // toast.success('Profile updated');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['student', student.id] });
    } catch (err) {
      const e = err as unknown as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to update profile');
    } finally {
      setUploadingImage(false);
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-slate-200 rounded w-1/3" />
              <div className="h-24 w-24 bg-slate-200 rounded-full" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-10 bg-slate-200 rounded" />
                <div className="h-10 bg-slate-200 rounded" />
                <div className="h-10 bg-slate-200 rounded" />
                <div className="h-10 bg-slate-200 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return <div className="container mx-auto p-4">Error loading profile</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/3 flex flex-col items-center">
              <div className="w-36 h-36 rounded-full overflow-hidden border shadow-sm mb-2 bg-muted flex items-center justify-center relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-muted-foreground">No Photo</div>
                )}
                {uploadingImage && <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white">Uploading...</div>}
                {(!uploadingImage && uploadMutation.isSuccess) && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">Uploaded</Badge>
                  </div>
                )}
              </div>

              <label className="cursor-pointer text-sm text-primary underline">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                {imageFile ? 'Change Photo' : 'Upload Photo'}
              </label>
              <div className="text-xs text-muted-foreground mt-2">Max size: 400 KB. JPG/PNG/GIF</div>
            </div>

            <div className="w-full sm:w-2/3">
              <h2 className="text-xl font-semibold mb-2">Student Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1">Name</Label>
                  <Input value={formState.name} onChange={(e) => handleChange('name', e.target.value)} />
                </div>

                <div>
                  <Label className="mb-1">Matric No.</Label>
                  <div className="p-2 border rounded bg-muted text-sm">{student?.matricNo}</div>
                </div>

                <div>
                  <Label className="mb-1">Department</Label>
                  <div className="p-2 border rounded bg-muted text-sm">{typeof student?.department === 'string' ? student?.department : student?.department?.name}</div>
                </div>

                <div>
                  <Label className="mb-1">School</Label>
                  <div className="p-2 border rounded bg-muted text-sm">{typeof student?.school === 'string' ? '' : student?.school?.name || ''}</div>
                </div>

                <div>
                  <Label className="mb-1">Email</Label>
                  <Input value={formState.email} onChange={(e) => handleChange('email', e.target.value)} />
                </div>

                <div>
                  <Label className="mb-1">Phone</Label>
                  <Input value={formState.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                </div>

                <div className="sm:col-span-2">
                  <Label className="mb-1">Address</Label>
                  <Input value={formState.homeAddress} onChange={(e) => handleChange('homeAddress', e.target.value)} />
                </div>

                <div>
                  <Label className="mb-1">Date of Birth</Label>
                  <Input type="date" value={formState.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} />
                </div>

                {/* Guardian Info */}
                <div>
                  <Label className="mb-1">Guardian Name</Label>
                  <Input value={formState.guardianName} onChange={(e) => handleChange('guardianName', e.target.value)} />
                </div>

                <div>
                  <Label className="mb-1">Guardian Email</Label>
                  <Input value={formState.guardianEmail} onChange={(e) => handleChange('guardianEmail', e.target.value)} />
                </div>

                <div>
                  <Label className="mb-1">Guardian Phone</Label>
                  <Input value={formState.guardianPhone} onChange={(e) => handleChange('guardianPhone', e.target.value)} />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button onClick={handleSubmit} disabled={saving || uploadingImage}>
                  {saving || uploadingImage ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => {
                  // reset to fetched student values
                  if (student) {
                    setFormState({
                      name: student.name || '',
                      email: student.email || '',
                      phone: (student.phone as string) || '',
                      homeAddress: (student.homeAddress as string) || '',
                      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().slice(0,10) : '',
                      guardianName: (student.guardian?.name as string) || '',
                      guardianEmail: (student.guardian?.email as string) || '',
                      guardianPhone: (student.guardian?.phone as string) || ''
                    });
                    setImagePreview((student.picture as string) || null);
                    setImageFile(null);
                  }
                }}>Reset</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;