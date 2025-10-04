import { useUser } from "@/contexts/useUser";
import { useGetCourseRegistrationsForInstructor } from "@/lib/api/queries";
import { useParams } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo, useEffect } from "react";
import type { CourseRegistrationInstructorItem } from '@/components/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ChevronsUpDown, FileText, UploadCloud, DownloadCloud, Search as SearchIcon, Users, BarChart2, Star, Edit3 } from 'lucide-react';
import { useEnterResult } from "@/lib/api/mutations";
import { useAdminUploadResults } from "@/lib/api/mutations";
import { toast } from 'sonner';
import { exportCourseRegistrationsCsv } from '@/lib/api/base';
import type { AdminUploadResultsRequest } from '@/components/types';

const InstructorCourse = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortField, setSortField] = useState<'name'|'score'>('name');
  const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('asc');
	// const 

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 450);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const semester = user?.school?.currentSemester || '';
  const session = user?.school?.currentSession || '';

  // const queryKey = ["courseRegistrationsForInstructor", id, semester, session, page, limit, debouncedSearch];

  const { data, isLoading, error, isError, refetch } = useGetCourseRegistrationsForInstructor(
    id,
    semester,
    session,
    page,
    limit,
    debouncedSearch
  );

  const registrations = useMemo<CourseRegistrationInstructorItem[]>(() => (data?.data || []), [data?.data]);

  // client-side sort of the current page
  const sortedRegistrations = useMemo(() => {
    const arr = [...registrations];
    if (sortField === 'name') {
      arr.sort((a, b) => {
        const an = (a.student?.name || '').toLowerCase();
        const bn = (b.student?.name || '').toLowerCase();
        return sortOrder === 'asc' ? an.localeCompare(bn) : bn.localeCompare(an);
      });
    } else {
      arr.sort((a, b) => {
        const av = typeof a.score === 'number' ? a.score : -Infinity;
        const bv = typeof b.score === 'number' ? b.score : -Infinity;
        return sortOrder === 'asc' ? av - bv : bv - av;
      });
    }
    return arr;
  }, [registrations, sortField, sortOrder]);

  const stats = useMemo(() => {
    const total = registrations.length;
    let passCount = 0;
    let sumScore = 0;
    let scoredCount = 0;
    registrations.forEach((r) => {
      if (typeof r.score === 'number') {
        sumScore += r.score;
        scoredCount++;
      }
      if (r.grade && !['F', 'f'].includes(String(r.grade))) passCount++;
    });
    const avg = scoredCount > 0 ? +(sumScore / scoredCount).toFixed(2) : 0;
    return { total, passCount, avg };
  }, [registrations]);

  // CSV export helper (escape values, return blob URL)
  const makeCsv = (rows: Array<CourseRegistrationInstructorItem>) => {
    const headers = ['MatricNo', 'Name', 'Score', 'Grade'];
    const escape = (v: unknown) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      if (s.includes(',') || s.includes('\n') || s.includes('"')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };
    const lines = [headers.join(',')];
    rows.forEach(r => {
      const line = [
        escape(r.student?.matricNo ?? ''),
        escape(r.student?.name ?? ''),
        escape(typeof r.score === 'number' ? r.score : ''),
        escape(r.grade ?? '')
      ].join(',');
      lines.push(line);
    });
    return lines.join('\n');
  };

  const onExportCsv = () => {
    const rows = sortedRegistrations;
    if (!rows || rows.length === 0) {
      toast('No data to export');
      return;
    }
    const csvText = makeCsv(rows);
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `course-registrations-${id || 'export'}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Dialog/edit state
  const [editing, setEditing] = useState<CourseRegistrationInstructorItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editScore, setEditScore] = useState<string>('');
	const editResultMutation = useEnterResult()
  // const [isSaving, setIsSaving] = useState(false);

  const onOpenEdit = (reg: CourseRegistrationInstructorItem) => {
    setEditing(reg);
    setEditScore(reg.score !== undefined ? String(reg.score) : '');
    setEditOpen(true);
  };

  const onSaveEdit = async () => {
    if (!editing) return;
    const parsed = Number(editScore);
    if (Number.isNaN(parsed)) return alert('Invalid score');
    await editResultMutation.mutateAsync({ registrationId: editing._id, score: parsed }, {
			onSuccess: () => {
				setEditOpen(false);
				setEditing(null);
				refetch();
			}
		});
  };

  // CSV upload state
  const adminUpload = useAdminUploadResults();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<Array<Record<string, string>>>([]);

  const parseCsvText = (text: string) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = lines.slice(1).map(line => {
      // naive split (doesn't handle quoted commas) — acceptable for simple CSV
      const cols = line.split(',').map(c => c.trim());
      const obj: Record<string,string> = {};
      headers.forEach((h, i) => { obj[h] = cols[i] ?? ''; });
      return obj;
    });
    return rows;
  };

  const onSelectFile = (file?: File) => {
    setCsvError(null);
    setCsvPreview([]);
    if (!file) { setCsvFile(null); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      try {
        const rows = parseCsvText(text);
        if (rows.length === 0) {
          setCsvError('CSV contains no rows');
          return;
        }
        // validate required columns
        const first = rows[0];
        if (!('matricno' in first) || !('score' in first)) {
          setCsvError('CSV must include headers: matricNo, score (columns are case-insensitive)');
          return;
        }
        setCsvFile(file);
        setCsvPreview(rows);
      } catch {
        setCsvError('Failed to parse CSV');
      }
    };
    reader.readAsText(file);
  };

  const onUploadCsv = async () => {
    if (!csvPreview.length) return toast.error('No CSV data to upload');
    // Map rows to AdminUploadResultsRequest shape
    const results = csvPreview.map(row => {
      const matricNo = row['matricno'] ?? row['matric_no'] ?? row['matric'] ?? '';
      const scoreRaw = row['score'] ?? row['marks'] ?? '';
      const courseVal = row['course'] ?? row['courseid'] ?? id ?? '';
      const semesterVal = row['semester'] ?? user?.school?.currentSemester ?? '';
      const sessionVal = row['session'] ?? user?.school?.currentSession ?? '';
      return {
        matricNo: String(matricNo).trim(),
        score: Number(scoreRaw),
        course: String(courseVal).trim(),
        semester: String(semesterVal).trim(),
        session: String(sessionVal).trim(),
      };
    });
    const payload: AdminUploadResultsRequest = { results };
    adminUpload.mutate(payload, {
      onSuccess: () => {
        toast.success('CSV upload complete');
        setCsvFile(null);
        setCsvPreview([]);
        refetch();
      }
    });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>

          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-3"> 
                  <FileText className="size-5 text-primary" />
                  Course Registrations
                </CardTitle>
                <CardDescription className="mt-0">View and manage student registrations for this course</CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search student name or matric no"
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                      className="pl-10 w-full sm:w-72"
                    />
                  </div>
                  <Button variant="ghost" onClick={() => refetch()}><SearchIcon className="size-4"/></Button>
                </div>

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-muted/40 border rounded px-3 py-2">
                    <UploadCloud className="size-5" />
                    <input
                      className="hidden"
                      type="file"
                      accept="text/csv,application/csv,.csv"
                      onChange={(e) => onSelectFile(e.target.files ? e.target.files[0] : undefined)}
                    />
                    <span className="text-sm">Upload CSV</span>
                  </label>
                  <Button onClick={() => onUploadCsv()} disabled={!csvPreview.length || adminUpload.isPending}><span className="hidden sm:inline">Import</span> <UploadCloud className="ml-2 size-4"/></Button>
                  <Button variant="ghost" onClick={() => onExportCsv()} className="ml-2" aria-label="Export CSV"><DownloadCloud className="size-4"/></Button>
                  <Button variant="outline" onClick={async () => {
                    try {
                      const blob = await exportCourseRegistrationsCsv(id || '', semester, session, debouncedSearch);
                      if (!blob) return toast('No data returned');
                      const url = URL.createObjectURL(blob as Blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `course-registrations-${id || 'export'}.csv`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                      toast('Export started');
                    } catch (err: unknown) {
                      console.error('Export error', err);
                      let msg = 'Export failed';
                      if (err && typeof err === 'object' && 'message' in err && typeof (err as Record<string, unknown>).message === 'string') {
                        msg = (err as Record<string, unknown>).message as string;
                      }
                      toast(msg);
                    }
                  }} className="ml-2">Export All</Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>

            {/* CSV upload */}
            <div className="mt-4 bg-muted/5 border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Result CSV</div>
                    <div className="text-xs text-muted-foreground">Upload scores for multiple students (MatricNo, Score)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input className="hidden" id="csv-file-input" type="file" accept="text/csv,application/csv,.csv" onChange={(e) => onSelectFile(e.target.files ? e.target.files[0] : undefined)} />
                  <label htmlFor="csv-file-input" className="inline-flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 border bg-background">
                    <UploadCloud className="size-4" />
                    <span className="text-sm">Choose file</span>
                  </label>
                  <Button onClick={() => onUploadCsv()} disabled={!csvPreview.length || adminUpload.isPending}>{adminUpload.isPending ? 'Uploading...' : 'Upload'}</Button>
                </div>
              </div>

              <div className="mt-3">
                {csvFile && <div className="text-sm text-muted-foreground">Selected file: <span className="font-medium">{csvFile.name}</span></div>}
                {csvError && <div className="text-sm text-destructive mt-1">{csvError}</div>}
                {csvPreview.length > 0 && (
                  <div className="mt-2">
                    <div className="text-sm text-muted-foreground mb-2">Preview ({csvPreview.length} rows)</div>
                    <div className="overflow-auto max-h-40 border rounded p-2 bg-background">
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            {Object.keys(csvPreview[0]).map(h => <th key={h} className="text-left pr-3 text-xs text-muted-foreground">{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreview.slice(0, 8).map((row, i) => (
                            <tr key={i} className="border-t"><td className="py-1" colSpan={Object.keys(row).length}>{Object.values(row).join(' | ')}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
              <div className="flex items-center gap-3 bg-gradient-to-r from-white/60 to-muted/10 border p-4 rounded-lg shadow-sm">
                <div className="bg-primary/10 text-primary rounded-full p-2">
                  <Users className="size-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total students</div>
                  <div className="text-2xl font-semibold">{isLoading ? <Skeleton className="h-6 w-16" /> : stats.total}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gradient-to-r from-white/60 to-muted/10 border p-4 rounded-lg shadow-sm">
                <div className="bg-amber-50 text-amber-600 rounded-full p-2">
                  <BarChart2 className="size-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Average score</div>
                  <div className="text-2xl font-semibold">{isLoading ? <Skeleton className="h-6 w-16" /> : stats.avg}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gradient-to-r from-white/60 to-muted/10 border p-4 rounded-lg shadow-sm">
                <div className="bg-emerald-50 text-emerald-600 rounded-full p-2">
                  <Star className="size-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                  <div className="text-2xl font-semibold">{isLoading ? <Skeleton className="h-6 w-16" /> : stats.passCount}</div>
                </div>
              </div>
            </div>

            {/* content */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
              ) : isError ? (
              <div className="text-destructive">
                <div>Error loading registrations: {(error as unknown as { message?: string })?.message || 'Unknown error'}</div>
                <div className="mt-2"><Button onClick={() => refetch()}>Retry</Button></div>
              </div>
            ) : (
              <div>
                {/* Desktop table */}
                <div className="hidden md:block">
                  <Table className="overflow-hidden rounded-lg border">
                    <TableHeader>
                      <TableRow className="bg-muted/20">
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <span>Student</span>
                            <Button variant="ghost" size="sm" onClick={() => { setSortField('name'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }} aria-label="Sort by name"><ChevronsUpDown className="size-4" /></Button>
                          </div>
                        </TableHead>
                        <TableHead>Matric No</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <span>Score</span>
                            <Button variant="ghost" size="sm" onClick={() => { setSortField('score'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }} aria-label="Sort by score"><ChevronsUpDown className="size-4" /></Button>
                          </div>
                        </TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedRegistrations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">No registrations found for the current query.</TableCell>
                        </TableRow>
                      ) : (
                        sortedRegistrations.map((r) => (
                          <TableRow key={r._id} className="hover:bg-muted/10">
                            <TableCell className="font-medium">{r.student?.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{r.student?.matricNo}</TableCell>
                            <TableCell className=" font-semibold">{typeof r.score === 'number' ? r.score : '-'}</TableCell>
                            <TableCell className="text-sm">{r.grade || '-'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{r.status}</TableCell>
                            <TableCell className="text-center">
                              <Button variant="outline" size="sm" onClick={() => onOpenEdit(r)} className="flex items-center gap-2"><Edit3 className="size-4"/> Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3">
                  {sortedRegistrations.length === 0 ? (
                    <div className="bg-card p-4 rounded-lg text-center text-muted-foreground">No registrations match your search.</div>
                  ) : (
                    sortedRegistrations.map((r) => (
                      <div key={r._id} className="bg-card p-3 rounded-lg shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="font-medium">{r.student?.name}</div>
                            <div className="text-sm text-muted-foreground">{r.student?.matricNo} • Level {r.student?.level ?? '-'}</div>
                            <div className="text-sm mt-2">Grade: <span className="font-semibold">{r.grade || '-'}</span></div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-semibold">{typeof r.score === 'number' ? r.score : '-'}</div>
                            <div className="text-sm text-muted-foreground">{r.status}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end mt-3">
                          <Button variant="outline" size="sm" onClick={() => onOpenEdit(r)} className="flex items-center gap-2"><Edit3 className="size-4"/> Edit</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">Page {data?.pagination.page ?? 1} of {data?.pagination.totalPages ?? 1}</div>
                  <div className="flex gap-2">
                    <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={(data?.pagination.page ?? 1) <= 1}>Prev</Button>
                    <Button onClick={() => setPage((p) => p + 1)} disabled={!(data?.pagination.hasNext ?? false)}>Next</Button>
                  </div>
                </div>
                  {/* Edit dialog */}
                  <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) { setEditing(null); } }}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Score</DialogTitle>
                          <DialogDescription>Update student's score for this course registration.</DialogDescription>
                        </DialogHeader>
                        <div className="mt-3 space-y-3">
                          <div className="text-sm text-muted-foreground">Student</div>
                          <div className="font-medium">{editing?.student?.name} <span className="text-sm text-muted-foreground">({editing?.student?.matricNo})</span></div>
                          <div>
                            <Input value={editScore} onChange={(e) => setEditScore(e.target.value)} placeholder="Score" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => { setEditOpen(false); setEditing(null); }}>Cancel</Button>
                          <Button onClick={() => onSaveEdit()} disabled={editResultMutation.isPending}>{editResultMutation.isPending?"Saving":"Save"}</Button>
                        </DialogFooter>
                        <DialogClose />
                      </DialogContent>
                  </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorCourse;