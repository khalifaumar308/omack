import React, { useMemo, useState, useEffect } from 'react';
import { useGetInstructors, useGetDepartments, useGetCourses } from '@/lib/api/queries';
import { useUser } from '@/contexts/useUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/base';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash, Edit, Plus, X } from 'lucide-react';
import type { PopulatedDepartment, PopulatedInstructor, Course, Instructor } from '@/components/types';

const Instructors: React.FC = () => {
  const getDeptName = (department: unknown) => {
    if (!department) return '—';
    if (typeof department === 'string') return department;
    if (typeof department === 'object' && department !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (department as any).name || '—';
    }
    return '—';
  };

  const getErrorMessage = (err: unknown) => {
    if (!err) return 'An error occurred';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = err as any;
    return e?.response?.data?.message || e?.message || 'An error occurred';
  };
  const { data: instructors = [], isLoading, isError } = useGetInstructors();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteInstructor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor deleted');
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err) || 'Failed to delete instructor');
    }
  });

  // delete confirmation state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Instructor | PopulatedInstructor | null>(null);

  const [openCreate, setOpenCreate] = useState(false);

  // form state for creating instructor
  const { user } = useUser();
  const { data: departmentsRaw = [] } = useGetDepartments();
  const departments = (departmentsRaw as unknown as PopulatedDepartment[]) || [];
  const [form, setForm] = useState({ name: '', email: '', password: '', rank: '', specialization: '', department: '' });
  const [isCreating, setIsCreating] = useState(false);
  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.createInstructor(payload as unknown as import('@/components/types').CreateInstructorForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor created');
      setOpenCreate(false);
      setForm({ name: '', email: '', password: '', rank: '', specialization: '', department: '' });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    }
  });

  const list = instructors;
  const stats = useMemo(() => ({
    total: list.length,
  }), [list]);

  // --- Edit / Assign courses dialog state ---
  const [openEdit, setOpenEdit] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | PopulatedInstructor | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<{code:string; id:string}[]>([]);
  const [coursePage, setCoursePage] = useState(1);
  const courseLimit = 20;
  const [courseSearch, setCourseSearch] = useState('');
  const deptVal = editingInstructor?.department;
  const departmentParam = typeof deptVal === 'string' ? deptVal : (deptVal ? (deptVal as unknown as { id?: string }).id ?? '' : '');
  const { data: coursesData, isLoading: isLoadingCourses } = useGetCourses(coursePage, courseLimit, courseSearch, departmentParam);
  // Parse coursesData into a stable Course[] for reuse (supports several server shapes)
  const parsedCourses: Course[] = (() => {
    const payload = coursesData as unknown;
    if (Array.isArray(payload)) return payload as Course[];
    if (payload && typeof payload === 'object') {
      const obj = payload as { data?: Course[]; courses?: Course[] };
      return obj.data ?? obj.courses ?? [];
    }
    return [];
  })();

  // const getCourseLabel = (id: string) => {
  //   const found = parsedCourses.find((x) => x.id === id || ((x as unknown as Record<string, unknown>)['_id'] as string) === id);
  //   if (!found) return id;
  //   return found.code ? `${found.code} — ${found.title}` : found.title || id;
  // };

  useEffect(() => {
    if (!openEdit) {
      // reset when dialog closed
      setEditingInstructor(null);
      setSelectedCourses([]);
      setCoursePage(1);
      setCourseSearch('');
    }
  }, [openEdit]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-64 h-8"><Skeleton className="w-full h-full" /></div>
          <div className="w-40 h-6"><Skeleton className="w-full h-full" /></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4">
              <CardContent>
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-3/4 h-4 mb-2" />
                    <Skeleton className="w-1/2 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent>
            <p className="text-red-600">Failed to load instructors. Please refresh.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Instructors</h1>
          <p className="text-sm text-gray-500">Manage instructors — add, edit or remove instructors.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600 mr-4">Total: <span className="font-medium">{stats.total}</span></div>
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2"><Plus /> New Instructor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Instructor</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                <Label>Email</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                <Label>Password</Label>
                <Input value={form.password} type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Strong password" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <Label>Rank</Label>
                    <Input value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} placeholder="Dr., Prof., Mr., Mrs." />
                  </div>
                  <div>
                    <Label>Specialization</Label>
                    <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="Field of specialization" />
                  </div>
                </div>
                <Label>Department</Label>
                {departments.length > 0 ? (
                  <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full rounded-md border px-3 py-2">
                    <option value="">Select department</option>
                      {departments.map((d: PopulatedDepartment) => (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        <option key={(d as any).id ?? (d as any)._id} value={(d as any).id ?? (d as any)._id}>{(d as any).name}</option>
                      ))}
                  </select>
                ) : (
                  <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Department id" />
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancel</Button>
                  <Button disabled={isCreating} onClick={() => {
                    // basic validation
                    if (!form.name || !form.email || !form.password || !form.department) {
                      toast.error('Please fill all required fields (name, email, password, department)');
                      return;
                    }
                    const payload = {
                      name: form.name,
                      email: form.email,
                      password: form.password,
                      rank: form.rank,
                      specialization: form.specialization,
                      department: form.department,
                      school: typeof user?.school === 'string' ? user?.school : ((user?.school as unknown as { id?: string; _id?: string })?.id || (user?.school as unknown as { id?: string; _id?: string })?._id)
                    };
                    setIsCreating(true);
                    createMutation.mutate(payload, {
                      onSettled: () => setIsCreating(false)
                    });
                  }}>{isCreating ? 'Saving...' : 'Save'}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{i.name}</TableCell>
                  <TableCell>{i.email}</TableCell>
                  <TableCell>{getDeptName(i.department)}</TableCell>
                  <TableCell>{i.courses?.map(c=>c.code).join(", ")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" onClick={() => {
                        // open edit / assign courses dialog
                        setEditingInstructor(i);
                        // preselect existing courses (accept array of ids or Course objects)
                        const existing = i.courses?.map((c) => ({code:c.code, id:c.id})) || [];
                        setSelectedCourses(existing.filter(Boolean));
                        setOpenEdit(true);
                      }}><Edit /></Button>
                      <Button variant="ghost" onClick={() => { setDeleteTarget(i); setConfirmDeleteOpen(true); }}><Trash className="text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden grid grid-cols-1 gap-4">
          {list.map(i => (
            <Card key={i.id} className="p-4">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{i.name}</div>
                    <div className="text-sm text-gray-600">{i.email}</div>
                    <div className="text-sm text-gray-600">{getDeptName(i.department)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button variant="ghost" onClick={() => {/* edit handler */}}><Edit /></Button>
                      <Button variant="ghost" onClick={() => { setDeleteTarget(i); setConfirmDeleteOpen(true); }}><Trash className="text-red-600" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Edit / Assign Courses Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Courses to Instructor</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-gray-700">Instructor: <span className="font-medium">{editingInstructor?.name}</span></div>
            <Label>Search courses</Label>
            <Input value={courseSearch} onChange={(e) => { setCourseSearch(e.target.value); setCoursePage(1); }} placeholder="Search by code or title" />

            <div className="max-h-64 overflow-auto border rounded-md p-2">
              {isLoadingCourses ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {
                    parsedCourses.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No courses found.</div>
                    ) : (
                      parsedCourses.map((c: Course, idx) => {
                        const rawId = ((c as unknown) as Record<string, unknown>)['_id'] as string | undefined;
                        const cid = c.id ?? rawId ?? `__unknown_${coursePage}_${idx}`;
                        const label = c.code ? `${c.code} — ${c.title}` : (c.title || cid);
                        const checked = selectedCourses.map(cc=>cc.id).includes(cid);
                        return (
                          <div key={cid} className="flex items-center justify-between gap-2">
                            <label className="flex items-center gap-2 w-full">
                              <input type="checkbox" checked={checked} onChange={(e) => {
                                if (e.target.checked) setSelectedCourses(prev => Array.from(new Set([...prev, {code:c.code, id:cid}])));
                                else setSelectedCourses(prev => prev.filter(x => x.id !== cid));
                              }} />
                              <span className="text-sm">{label}</span>
                            </label>
                          </div>
                        );
                      })
                    )
                  }
                </div>
              )}
            </div>

            {/* Selected courses preview */}
            <div>
              <Label>Selected courses</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCourses.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No courses selected</div>
                ) : (
                  selectedCourses.map((course) => (
                    // add ability to remove course from selection
                    <div key={course.id} className="flex items-center gap-1">
                      <span className="px-2 py-1 rounded-md bg-gray-100 text-sm text-gray-800 border">{course.code}</span>
                      <Button className='text-red-600' variant="outline" size="icon" onClick={() => {
                        setSelectedCourses(prev => prev.filter(c => c.id !== course.id));
                      }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" disabled={coursePage <= 1} onClick={() => setCoursePage(p => Math.max(1, p - 1))}>Prev</Button>
                <div className="text-sm text-gray-600">Page {coursePage}</div>
                <Button variant="outline" onClick={() => setCoursePage(p => p + 1)}>Next</Button>
              </div>
              <div className="text-sm text-gray-600">Selected: <span className="font-medium">{selectedCourses.length}</span></div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
                  <Button onClick={async () => {
                if (!editingInstructor) return;
                try {
                  // Both Instructor and PopulatedInstructor extend BaseEntity so `id` should exist
                  console.log(selectedCourses, editingInstructor)
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  await api.updateInstructor((editingInstructor as any)._id || (editingInstructor as any).id, { courses: [...(editingInstructor.courses as any),...selectedCourses.map(c => c.id)] });
                  queryClient.invalidateQueries({ queryKey: ['instructors'] });
                  toast.success('Courses assigned successfully');
                  setOpenEdit(false);
                } catch (err) { 
                  toast.error(getErrorMessage(err));
                }
              }}>{'Save assignments'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Delete confirmation dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm delete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.</div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
              <Button disabled={deleteMutation.isPending} className="bg-red-600 text-white" onClick={async () => {
                if (!deleteTarget) return;
                try {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  await deleteMutation.mutateAsync((deleteTarget as any)._id);
                } catch (error) {
                  toast.error(getErrorMessage(error));
                } finally {
                  setConfirmDeleteOpen(false);
                  setDeleteTarget(null);
                }
              }}>{deleteMutation.isPending?"Deleting...":"Delete"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Instructors;