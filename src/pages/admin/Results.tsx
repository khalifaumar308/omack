/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUser } from "@/contexts/useUser";
import { useGetStudentsSemesterResults, useGetGradingTemplates, useGetCoursesId } from "@/lib/api/queries";
import { useGetDepartments } from '@/lib/api/queries';
import React, { useState, useEffect, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import ResultRow from "./ResultRow";
import { FixedSizeList as List } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { useIsMobile } from '@/hooks/use-mobile';
import type { GradingTemplate } from "@/components/types";
import { useAdminUploadResults } from "@/lib/api/mutations";
import { toast } from "sonner";

// Types for ResultTemplate

interface UploadData {
	matricNo: string;
	score: number;
	course: string;
	semester: string;
	session: string;
}

const Results = () => {
	const { isLoading: userLoading, user } = useUser();
	const [semester, setSemester] = useState(user?.school?.currentSemester || 'First');
	const [session, setSession] = useState(user?.school?.currentSession || '2025/2026');
	const [searchTerm, setSearchTerm] = useState('');
	const [levelFilter, setLevelFilter] = useState('all');
	const [courseCodes, setCourseCodes] = useState<string[]>([]);
	const [courseCodesToFetch, setCourseCodesToFetch] = useState<string[]>([]);
	const { data: courseIds, isLoading: courseIdsLoading, isError: courseIdsError } = useGetCoursesId(courseCodesToFetch);
	console.log(user?.school, "school");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [serverSearch, setServerSearch] = useState('');
	const [serverLevel, setServerLevel] = useState('all');

	const { data, isLoading, error } = useGetStudentsSemesterResults(
		semester,
		session,
		currentPage,
		pageSize,
		serverSearch,
		serverLevel
	);
	const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false };
	const { mutate: uploadResults } = useAdminUploadResults();
	// Upload states
	const [isUploadOpen, setIsUploadOpen] = useState(false);
	const [uploadSemester, setUploadSemester] = useState('First');
	const [uploadSession, setUploadSession] = useState('2025/2026');
	const [uploadFile, setUploadFile] = useState<File | null>(null);
	const [parsedData, setParsedData] = useState<UploadData[]>([]);

	const { data: gradingTemplatesRaw } = useGetGradingTemplates();
	const gradingTemplates: GradingTemplate[] = Array.isArray(gradingTemplatesRaw) ? gradingTemplatesRaw : [];

	const { data: departmentsRaw } = useGetDepartments();
	const departments: any[] = Array.isArray(departmentsRaw) ? departmentsRaw : [];
	const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
	const [exportLoading, setExportLoading] = useState(false);
	const [exportLevel, setExportLevel] = useState<string>(levelFilter);

	// Mobile detection hook (must be called unconditionally)
	const isMobile = useIsMobile();

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setUploadFile(file);
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result as string;
			const lines = text.split('\n').filter(line => line.trim());
			if (lines.length < 2) {
				console.error('Invalid CSV: No data rows');
				return;
			}

			const headers = lines[0].split(',').map(h => h.trim());
			const data: UploadData[] = []
			lines.slice(1).forEach((line) => {
				const values = line.split(',').map(v => v.trim());
				// index 0 is matric no, the rest are course scores
				values.slice(1).forEach((score, index) => {
					const cc = {
						//get course id from courseIds
						course: (courseIds?.find((c) => c.code === headers[index + 1]))?.id || "",
						// course: headers[index + 1],
						score: parseFloat(score) || 0,
						matricNo: values[0],
						semester: uploadSemester,
						session: uploadSession,
					}
					if (cc.course && cc.matricNo && !isNaN(cc.score)) {
						data.push(cc);
					}
				});
			});
			setParsedData(data);
		};
		reader.readAsText(file);
	};

	const handleUploadSubmit = () => {
		if (!uploadFile || parsedData.length === 0) {
			console.error('Missing required fields or data');
			return;
		}
		uploadResults({ results: parsedData }, {
			onSuccess: () => {
				// Optionally show a success message or refresh data
				toast.success('Upload successful!');
				setIsUploadOpen(false);
				setParsedData([]);
				setUploadFile(null);
			},
			onError: (err) => {
				console.error('Upload failed:', err);
				toast.error(`Upload failed. ${err.message || 'Please try again.'}`);
			},
		});
	};

	// Debounce search and level filter for server-side
	useEffect(() => {
		const handler = setTimeout(() => {
			setServerSearch(searchTerm);
			setServerLevel(levelFilter);
			setCurrentPage(1);
		}, 400);
		return () => clearTimeout(handler);
	}, [searchTerm, levelFilter, semester, session, pageSize]);

	const paginatedResults = useMemo(() => data?.data || [], [data]);
	const totalItems = pagination.total;
	const totalPages = pagination.totalPages;

	const pageButtons = useMemo(() => {
		const maxButtons = 7;
		if (totalPages <= maxButtons) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}
		const pages: (number | 'ellipsis-left' | 'ellipsis-right')[] = [];
		const left = Math.max(1, currentPage - 2);
		const right = Math.min(totalPages, currentPage + 2);
		pages.push(1);
		if (left > 2) pages.push('ellipsis-left');
		for (let i = left; i <= right; i++) {
			if (i > 1 && i < totalPages) pages.push(i);
		}
		if (right < totalPages - 1) pages.push('ellipsis-right');
		if (totalPages > 1) pages.push(totalPages);
		return pages;
	}, [totalPages, currentPage]);


	if (userLoading || isLoading) return (
		<div className="container mx-auto p-6">
			<Card>
				<CardContent className="p-6">
					<div className="flex flex-col gap-6 animate-pulse">
						<div className="h-8 w-1/3 bg-slate-200 rounded mb-4" />
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="h-10 bg-slate-100 rounded" />
							))}
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-[600px] w-full text-sm">
								<thead>
									<tr className="bg-slate-100">
										{[...Array(7)].map((_, i) => (
											<th key={i} className="py-2 px-2 text-left text-slate-700">
												<div className="h-4 w-20 bg-slate-200 rounded" />
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{[...Array(6)].map((_, i) => (
										<tr key={i} className="border-b border-slate-100">
											{[...Array(7)].map((_, j) => (
												<td key={j} className="py-2 px-2">
													<div className="h-4 w-24 bg-slate-100 rounded" />
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
	if (error) return <div>Error loading results</div>;
	// ResultRow is extracted to ./ResultRow and react-window is used for virtualization

	return (
		<div className="container mx-auto p-4 sm:p-6">
			<Card>
				<CardContent className="p-4 sm:p-6">
					<div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
						<h1 className="text-2xl sm:text-3xl font-bold">Results Management</h1>
						<div className="text-sm text-muted-foreground">{totalItems} records • Page {currentPage} of {totalPages}</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
						<Select value={semester} onValueChange={setSemester}>
							<SelectTrigger>
								<SelectValue placeholder="Select semester" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="First">First Semester</SelectItem>
								<SelectItem value="Second">Second Semester</SelectItem>
							</SelectContent>
						</Select>

						<Select value={session} onValueChange={setSession}>
							<SelectTrigger>
								<SelectValue placeholder="Select session" />
							</SelectTrigger>
							<SelectContent>
								{(user?.school?.sessions || ['2023/2024', '2024/2025', '2025/2026']).map(sess => (
									<SelectItem key={sess} value={sess}>{sess}</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={levelFilter} onValueChange={setLevelFilter}>
							<SelectTrigger>
								<SelectValue placeholder="Filter by level" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Levels</SelectItem>
								{user?.school?.levels?.map((level) => (
									<SelectItem key={level} value={level}>{level}</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Input
							placeholder="Search by name or matric no."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="max-w-sm"
						/>
					</div>

					<div className="flex gap-2 mb-6">
						{/* Export controls */}
						<div className="flex items-center gap-2">
							<Select value={selectedDepartment || ''} onValueChange={(v) => setSelectedDepartment(v || null)}>
								<SelectTrigger>
									<SelectValue placeholder="Select department" />
								</SelectTrigger>
								<SelectContent>
									{departments.map((d: any) => (
										<SelectItem key={d.id || d._id} value={d.id || d._id}>{d.name}</SelectItem>
									))}
								</SelectContent>
							</Select>
							{/* Export level selector (allows All or specific level) */}
							<Select value={exportLevel || 'all'} onValueChange={(v) => setExportLevel(v)}>
								<SelectTrigger>
									<SelectValue placeholder="Select level" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Levels</SelectItem>
									{user?.school?.levels?.map((level: any) => (
										<SelectItem key={level} value={level}>{level}</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button onClick={async () => {
								if (!selectedDepartment) { toast.error('Select a department first'); return; }
								setExportLoading(true);
								try {
									const lvl = exportLevel || 'all';
									const url = `/api/exports?departmentId=${selectedDepartment}&level=${encodeURIComponent(lvl)}&semester=${encodeURIComponent(semester)}&session=${encodeURIComponent(session)}`;
									const res = await fetch(url, { credentials: 'include' });
									if (!res.ok) {
										const json = await res.json().catch(() => ({}));
										throw new Error(json.error || 'Export failed');
									}
									const blob = await res.blob();
									const a = document.createElement('a');
									const downloadUrl = URL.createObjectURL(blob);
									a.href = downloadUrl;
									a.download = `results-${selectedDepartment}-${lvl}-${session}-${semester}.xlsx`;
									document.body.appendChild(a);
									a.click();
									document.body.removeChild(a);
									URL.revokeObjectURL(downloadUrl);
									toast.success('Export started');
								} catch (err: any) {
									console.error(err);
									toast.error(err.message || 'Export failed');
								} finally {
									setExportLoading(false);
								}
							}} disabled={exportLoading}>
								{exportLoading ? 'Exporting...' : 'Export Excel'}
							</Button>
						</div>
						<Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
							<DialogTrigger asChild>
								<Button variant="outline">Upload Results from CSV</Button>
							</DialogTrigger>
							<DialogContent className="max-w-2xl">
								<DialogHeader>
									<DialogTitle>Upload Results CSV</DialogTitle>
									<DialogDescription>
										Select course, semester, session and upload CSV with headers: Matric No, Score, Grade
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4">
									<div className="flex flex-col gap-4">

										<div>
											<Label htmlFor="semester">Semester</Label>
											<Select value={uploadSemester} onValueChange={setUploadSemester}>
												<SelectTrigger>
													<SelectValue placeholder="Select semester" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="First">First Semester</SelectItem>
													<SelectItem value="Second">Second Semester</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div>
											<Label htmlFor="session">Session</Label>
											<Select value={uploadSession} onValueChange={val => setUploadSession(val)}>
												<SelectTrigger>
													<SelectValue placeholder="Select session" />
												</SelectTrigger>
												<SelectContent>
													{(user?.school?.sessions || ['2023/2024', '2024/2025', '2025/2026']).map(sess => (
														<SelectItem key={sess} value={sess}>{sess}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
									<div className="mb-4 flex flex-col gap-2">
										<Label htmlFor="courseCodes">Course Codes Separated by Comma</Label>
										<div className="flex gap-2">
											<Input
												id="courseCodes"
												type="text"
												placeholder="Enter course code and press Enter"
												value={courseCodes.join(', ')}
												onChange={(e) => {
													const codes = e.target.value.split(',').map(c => c.trim().toUpperCase()).filter(c => c);
													setCourseCodes(codes);
												}}
											/>
											<Button
												variant="destructive"
												onClick={() => {
													setCourseCodes([]);
													setCourseCodesToFetch([]);
													setParsedData([]);
													setUploadFile(null);
												}}
											>
												Clear
											</Button>
											<Button
												onClick={() => {
													// Trigger fetch of course IDs
													setCourseCodesToFetch(courseCodes);
												}}
												disabled={courseCodes.length === 0 || courseIdsLoading}
											>
												{courseIdsLoading ? 'Fetching...' : 'Fetch Courses'}
											</Button>
										</div>
									</div>
									<p className="text-red-500">{courseIdsError && "Fail to Get Course IDs"}</p>
									{courseIds && (
										<div>
											<Label htmlFor="file">CSV File</Label>
											<Button
												type="button"
												variant="secondary"
												className="mb-2"
												onClick={() => {
													// Generate header: matricNo,<courseCode1>,<courseCode2>,...
													const courseCodes = courseIds.map(c => c.code);
													const header = ['matricNo', ...courseCodes].join(',') + '\n';
													const blob = new Blob([header], { type: 'text/csv' });
													const url = URL.createObjectURL(blob);
													const a = document.createElement('a');
													a.href = url;
													a.download = 'results_upload_template.csv';
													document.body.appendChild(a);
													a.click();
													document.body.removeChild(a);
													URL.revokeObjectURL(url);
												}}
											>
												Download CSV Template
											</Button>
											<Input id="file" type="file" accept=".csv" onChange={handleFileUpload} />
										</div>)}
									{parsedData.length > 0 && (
										<div className="text-sm text-muted-foreground">
											Parsed {parsedData.length} rows successfully.
										</div>
									)}
								</div>
								<DialogFooter>
									<Button type="submit" onClick={handleUploadSubmit} disabled={!uploadFile || parsedData.length === 0}>
										Upload
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>

					{totalItems === 0 && (
						<div className="text-center py-8 text-muted-foreground">
							No results found for the selected filters.
						</div>
					)}

					{totalItems > 0 && (
						<>
							{isMobile ? (
								<div className="grid grid-cols-1">
									{paginatedResults.map((result) => (
										<ResultRow key={result.student.matricNo} result={result} gradingTemplates={gradingTemplates} session={session} semester={semester} school={user!.school!} variant="card" />
									))}
								</div>
							) : (
								<div className="overflow-x-auto">
									<div className="w-full">
										<div className="grid grid-cols-9 gap-2 border-b py-2 px-2 font-medium bg-slate-100">
											<div className="col-span-2">Student Name</div>
											<div className="col-span-2">Matric No.</div>
											<div className="col-span-1">Level</div>
											<div className="col-span-1">Passed</div>
											<div className="col-span-1">Failed</div>
											<div className="col-span-1">GPA</div>
											<div className="col-span-1">Actions</div>
										</div>
										<div>
											<List
											height={Math.min(400, pageSize * 56)}
											itemCount={paginatedResults.length}
											itemSize={56}
											width="100%"
										>
											{({ index, style }: ListChildComponentProps) => {
												const result = paginatedResults[index];
												return (
													<ResultRow
														key={result.student.matricNo}
														result={result}
														gradingTemplates={gradingTemplates}
														session={session}
														semester={semester}
														style={style}
														school={user!.school!}
													/>
												);
											}}
											</List>
										</div>
									</div>
								</div>
							)}

							{/* Pagination Controls (responsive) */}
							<div className="mt-4">
								{!isMobile ? (
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="text-sm text-muted-foreground">Rows per page:</span>
											<Select value={String(pageSize)} onValueChange={(v) => setPageSize(parseInt(v))}>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="5">5</SelectItem>
													<SelectItem value="10">10</SelectItem>
													<SelectItem value="25">25</SelectItem>
													<SelectItem value="50">50</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="flex items-center gap-2">
											<Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Previous</Button>
											<div className="flex items-center gap-1">
												{/* Windowed pagination with ellipsis */}
												{pageButtons.map((p, idx) => {
													if (p === 'ellipsis-left' || p === 'ellipsis-right') {
														return <span key={String(p) + idx} className="px-2">&hellip;</span>;
													}
													return (
														<Button key={`p-${p}`} variant={p === currentPage ? 'default' : 'ghost'} size="sm" onClick={() => setCurrentPage(Number(p))}>{p}</Button>
													);
												})}
											</div>
											<Button variant="outline" size="sm" disabled={currentPage >= Math.max(1, Math.ceil(totalItems / pageSize))} onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil(totalItems / pageSize)), p + 1))}>Next</Button>
										</div>
									</div>
								) : (
									<div className="flex items-center justify-between gap-2 flex-wrap">
										<div className="flex items-center gap-2">
											<Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Prev</Button>
											<div className="text-sm text-muted-foreground">Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span></div>
											<Button variant="outline" size="sm" disabled={currentPage >= Math.max(1, Math.ceil(totalItems / pageSize))} onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil(totalItems / pageSize)), p + 1))}>Next</Button>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-sm text-muted-foreground">Rows:</span>
											<Select value={String(pageSize)} onValueChange={(v) => setPageSize(parseInt(v))}>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="5">5</SelectItem>
													<SelectItem value="10">10</SelectItem>
													<SelectItem value="25">25</SelectItem>
													<SelectItem value="50">50</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
								)}
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default Results;