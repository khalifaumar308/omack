'use client';

import { useCallback, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { useGetDepartments, useGetPayables } from '@/lib/api/queries';
import type { PayableFilters } from '@/types/pagination';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
// import { useToast } from '@/components/ui/use-toast';
import type { Payable, PayableFormData } from '@/types/payable';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/contexts/useUser';
import { useAddPayable, useDeletePayable, useUpdatePayable } from '@/lib/api/mutations';
import { Link } from 'react-router';

export default function PayablesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<Payable | null>(null);
  const { user } = useUser();
  //   const { toast } = useToast();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<PayableFilters>({
    page: 1,
    limit: 10,
  });

  const { data: payablesData, isLoading, error } = useGetPayables(filters);

  const createMutation = useAddPayable();

  const updateMutation = useUpdatePayable();
  const deleteMutation = useDeletePayable();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data: PayableFormData = {
        level: formData.get('level') as string,
        description: formData.get('description') as string,
        amount: Number(formData.get('amount')),
        dueDate: formData.get('dueDate') as string,
        semester: formData.get('semester') as 'First' | 'Second',
        session: formData.get('session') as string,
        partPayment: formData.get('partPayment') === 'true',
        isForAllDepartments: formData.get('isForAllDepartments') === 'true',
        department: formData.get('isForAllDepartments') === 'true' ? undefined : formData.get('department') as string,
        minPercentage: Number(formData.get('minPercentage') as string) || 0,
        linkedTo: formData.get('linkedTo') as "Results" | "Course Registration" | "ID Card" | "Others",
      };
      console.log(data, "data");
      if (selectedPayable) {
        updateMutation.mutate({ payableId: selectedPayable._id!, payableData: data }, {
          onSuccess: () => {
            setIsEditOpen(false);
            setSelectedPayable(null);
          },
        });
      } else {
        createMutation.mutate(data, {
          onSuccess: () => {
            setIsCreateOpen(false);
          },
        });
      }
    },
    [selectedPayable, createMutation, updateMutation]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm('Are you sure you want to delete this payable?')) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const handleEdit = useCallback((payable: Payable) => {
    setSelectedPayable(payable);
    setIsEditOpen(true);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
              <Skeleton className="h-10 w-[150px]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="space-y-2">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-[100px] m-2" />
                    ))}
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {Array.from({ length: 5 }).map((_, row) => (
                      <tr key={row} className="border-b transition-colors">
                        {Array.from({ length: 7 }).map((_, col) => (
                          <td key={col} className="p-4">
                            <Skeleton className="h-4 w-[100px]" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Payables
            </CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please try again later or contact support if the problem persists.
            </p>
            <Button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['payables'] })}
              variant="outline"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter payables by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Session</Label>
              <Select
                value={filters.session || ''}
                onValueChange={(value) => setFilters(prev => ({ ...prev, session: value, page: 1 }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  {user?.school?.sessions?.map((sess) => (
                    <SelectItem key={sess} value={sess}>{sess}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select
                value={filters.semester || 'all'}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  semester: value === 'all' ? undefined : value,
                  page: 1
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="First">First</SelectItem>
                  <SelectItem value="Second">Second</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select
                value={filters.level || 'all'}
                onValueChange={(value) => setFilters(prev => ({ ...prev, level: value, page: 1 }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {user?.school?.levels?.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search by description..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payables Management</CardTitle>
            <CardDescription>Manage all payables in the system</CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>Create New Payable</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Payable</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new payable
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <PayableForm levels={user?.school?.levels || [""]} sessions={user?.school?.sessions || [""]} />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.status === 'pending'}>
                    {createMutation.status === 'pending' ? (
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    ) : null}
                    {createMutation.status === 'pending' ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Linked To</TableHead>
                  <TableHead className="">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payablesData?.data.map((payable) => (
                  <TableRow key={payable._id}>
                    <TableCell>
                      <Link to={`/admin/payables/${payable._id}`} className="hover:cursor-pointer hover:underline font-bold">
                        {payable._id?.slice(0, 6).toLocaleUpperCase()}
                      </Link>
                    </TableCell>
                    <TableCell>{payable.description}</TableCell>
                    <TableCell>{payable.level}</TableCell>
                    <TableCell>₦{payable.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {format(new Date(payable.dueDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{payable.session}</TableCell>
                    <TableCell>{payable.semester}</TableCell>
                    <TableCell>
                      {payable.isForAllDepartments ? 'All Departments' : payable.department?.name}
                    </TableCell>
                    <TableCell>
                      {payable.linkedTo ? (
                        <Badge variant={(function getVariant() {
                          switch (payable.linkedTo) {
                            case 'Results':
                              return 'secondary';
                            case 'Course Registration':
                              return 'default';
                            case 'ID Card':
                              return 'outline';
                            default:
                              return 'destructive';
                          }
                        })()}>
                          {payable.linkedTo}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit({ ...payable, department: payable.department?._id || '' })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(payable._id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && payablesData?.data.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        No payables found
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {payablesData && (
            <div className="flex items-center justify-between pt-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Showing {((filters.page - 1) * filters.limit) + 1} to{' '}
                {Math.min(filters.page * filters.limit, payablesData.pagination.total)}{' '}
                of {payablesData.pagination.total} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={!payablesData.pagination.hasPrev}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={!payablesData.pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Payable</DialogTitle>
            <DialogDescription>
              Update the payable details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PayableForm payable={selectedPayable} levels={user?.school?.levels || [""]} sessions={user?.school?.sessions || [""]} />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedPayable(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.status === 'pending'}>
                {updateMutation.status === 'pending' ? (
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : null}
                {updateMutation.status === 'pending' ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PayableForm({ payable, levels, sessions }: { payable?: Payable | null; levels: string[]; sessions: string[] }) {
  const { data: departments, isLoading: isLoadingDepartments } = useGetDepartments();
  const [isForAllDepts, setIsForAllDepts] = useState(payable?.isForAllDepartments ?? false);
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="level">Level</Label>
        <Select name="level" defaultValue={payable?.level || ''}>
          <SelectTrigger>
            <SelectValue placeholder="Select Level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          defaultValue={payable?.amount}
          required
          min={0}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          defaultValue={payable?.dueDate ? new Date(payable.dueDate).toISOString().split('T')[0] : ''}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="session">Session</Label>
        <Select name="session" defaultValue={payable?.session || ''}>
          <SelectTrigger>
            <SelectValue placeholder="Select session" />
          </SelectTrigger>
          <SelectContent>
            {sessions.map((sess) => (
              <SelectItem key={sess} value={sess}>{sess}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="linkedTo">Linked To</Label>
        <Select name="linkedTo" defaultValue={payable?.linkedTo || 'Others'}>
          <SelectTrigger>
            <SelectValue placeholder="Select linked to" />
          </SelectTrigger>
          <SelectContent>
            {["Results", "Course Registration", "ID Card", "Others"].map((sess) => (
              <SelectItem key={sess} value={sess}>{sess}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Minimum Percentage </Label>
        <Input
          id="minPercentage"
          name="minPercentage"
          type="number"
          min={0}
          max={100}
          defaultValue={payable?.minPercentage || 100}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="semester">Semester</Label>
        <Select name="semester" defaultValue={payable?.semester || 'First'}>
          <SelectTrigger>
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="First">First</SelectItem>
            <SelectItem value="Second">Second</SelectItem>
            <SelectItem value="Session">All</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="partPayment">Payment Options</Label>
        <Select name="partPayment" defaultValue={String(payable?.partPayment || false)}>
          <SelectTrigger>
            <SelectValue placeholder="Allow part payment?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Allow Part Payment</SelectItem>
            <SelectItem value="false">Full Payment Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="isForAllDepartments">Department Scope</Label>
        <Select
          name="isForAllDepartments"
          value={String(isForAllDepts)}
          onValueChange={(value) => setIsForAllDepts(value === 'true')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Apply to all departments?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">All Departments</SelectItem>
            <SelectItem value="false">Specific Department</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select
          name="department"
          disabled={isForAllDepts || isLoadingDepartments}
          value={payable?.department || ''}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingDepartments ? "Loading departments..." : "Select department"} />
          </SelectTrigger>
          <SelectContent>
            {departments?.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoadingDepartments && (
          <p className="text-sm text-muted-foreground">Loading departments...</p>
        )}
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={payable?.description}
          required
        />
      </div>
    </div>
  );
}