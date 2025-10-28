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
import { useGetDepartments } from '@/lib/api/queries';
import type { PayableFilters, PaginatedResponse } from '@/types/pagination';
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
// import { useToast } from '@/components/ui/use-toast';
import type { IPopulatedPayable, Payable, PayableFormData } from '@/types/payable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPayable, deletePayable, getPayables, updatePayable } from '@/lib/api/base';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useUser } from '@/contexts/useUser';

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

  const { data: payablesData, isLoading, error } = useQuery<PaginatedResponse<IPopulatedPayable>, Error>({
    queryKey: ['payables', filters],
    queryFn: () => getPayables(filters),
    // keepPreviousData: true,
  });

  const createMutation = useMutation({
    mutationFn: createPayable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      setIsCreateOpen(false);
      toast.success('Payable created successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePayable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      setIsEditOpen(false);
      setSelectedPayable(null);
      toast.success('Payable updated successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePayable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      toast.success('Payable deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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
      };
      console.log(data, "data");
      if (selectedPayable) {
        updateMutation.mutate({ id: selectedPayable._id!, data });
      } else {
        createMutation.mutate(data);
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

  console.log(payablesData)

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
                <PayableForm />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
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
                  <TableHead>Level</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payablesData?.data.map((payable) => (
                  <TableRow key={payable._id}>
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
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit({...payable, department: payable.department?._id || ''})}
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
                    <TableCell colSpan={7} className="text-center py-8">
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
            <PayableForm payable={selectedPayable} />
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
              <Button type="submit">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PayableForm({ payable }: { payable?: Payable | null }) {
  const { data: departments, isLoading: isLoadingDepartments } = useGetDepartments();
  const [isForAllDepts, setIsForAllDepts] = useState(payable?.isForAllDepartments ?? false);
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="level">Level</Label>
        <Input
          id="level"
          name="level"
          defaultValue={payable?.level}
          required
          placeholder="e.g., 100"
        />
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
        <Input
          id="session"
          name="session"
          defaultValue={payable?.session}
          required
          placeholder="e.g., 2023/2024"
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