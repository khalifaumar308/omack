/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUser } from "@/contexts/useUser";
import { useGetStudentsSemesterResults, useGetCourses, useGetGradingTemplates } from "@/lib/api/queries";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResultTemplate from "@/components/ResultTemplate";
import type { StudentsSemesterResultsResponse, PopulatedDepartment, PopulatedFaculty, GradingTemplate, GradeBand, CommentBand } from "@/components/types";
import { useAdminUploadResults } from "@/lib/api/mutations";
import { toast } from "sonner";

// Types for ResultTemplate
interface Course {
	sn: number;
	code: string;
	title: string;
	credits: number;
	total: number;
	grade: string;
	gradePoint: number;
	remark: string;
}

interface StudentData {
	lastUpdated: string;
	matric: string;
	name: string;
	session: string;
	programme: string;
	semester: string;
	department: string;
	level: string;
	faculty: string;
	approvalStatus: string;
}

interface Summary {
	current: { tcu: number; tca: number; tgp: number; gpa: number; remark: string };
	previous: { ltcu: string; ltca: string; ltgp: string; lcgpa: string };
	cumulative: { tcu: number; tca: number; tgp: number; cgpa: number };
}

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
	// pagination
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
	const results = data?.data || [];
	const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false };
	const { mutate: uploadResults } = useAdminUploadResults();
	// Upload states
	const [isUploadOpen, setIsUploadOpen] = useState(false);
	const [uploadSemester, setUploadSemester] = useState('First');
	const [uploadSession, setUploadSession] = useState('2025/2026');
	const [uploadFile, setUploadFile] = useState<File | null>(null);
	const [parsedData, setParsedData] = useState<UploadData[]>([]);

	const { data: coursesData } = useGetCourses(1, 1000);
	// Fetch grading templates (inside component)
	const { data: gradingTemplatesRaw } = useGetGradingTemplates();
	const gradingTemplates: GradingTemplate[] = Array.isArray(gradingTemplatesRaw) ? gradingTemplatesRaw : [];

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
			// const expectedHeaders = ['matric no', 'score', 'grade'];
			// if (!expectedHeaders.every(h => headers.includes(h))) {
			// 	console.error('Invalid CSV headers. Expected: Matric No, Score, Grade');
			// 	return;
			// }
			const data: UploadData[] = []
			lines.slice(1).forEach((line) => {
				const values = line.split(',').map(v => v.trim());
				// index 0 is matric no, the rest are course scores
				values.slice(1).forEach((score, index) => {
					const cc = {
						//get course id from course code
						course: (coursesData?.find((c: any) => c.code === headers[index + 1]) as any)?._id,
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

	const paginatedResults = results;
	const totalItems = pagination.total;
	const totalPages = pagination.totalPages;

	// generate a compact page list for UI (windowed)


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
	// Find grading template for a department
	const getDepartmentTemplate = (departmentId: string): GradingTemplate | undefined => {
		return gradingTemplates.find(
			(tpl) => (typeof tpl.department === 'string' ? tpl.department : tpl.department?.id) === departmentId
		);
	};

	// Given a score and gradeBands, return grade and point
	const getGradeAndPoint = (score: number, gradeBands: GradeBand[]): { grade: string; point: number } => {
		for (const band of gradeBands) {
			if (score >= band.minScore && score <= band.maxScore) {
				return { grade: band.grade, point: band.point };
			}
		}
		return { grade: '', point: 0 };
	};

	// Given a point, return comment
	const getCommentForPoint = (point: number, commentBands: CommentBand[]): string => {
		for (const band of commentBands) {
			if (point >= band.minScore && point <= band.maxScore) {
				return band.comment;
			}
		}
		return '';
	};

	const formatForResultTemplate = (result: StudentsSemesterResultsResponse) => {
		const student = result.student;
		const department = student.department as unknown as PopulatedDepartment;
		const faculty = department.faculty as unknown as PopulatedFaculty;
		const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
		const rsummary = result.summary;
		// Find grading template for this department
		const template = getDepartmentTemplate((department as any)._id);
		const gradeBands = template?.gradeBands || [];
		const courses: Course[] = result.courses.map((reg, index) => {
			const score = reg.score || 0;
			// const regGrade = reg.grade;
			const { grade, point } = getGradeAndPoint(score, gradeBands);

			return {
				sn: index + 1,
				code: reg.course.code,
				title: reg.course.title,
				credits: reg.course.creditUnits,
				total: Math.trunc(score),
				grade: grade,
				gradePoint: point * reg.course.creditUnits,
				remark: grade ? (point > 0 ? 'PASSED' : 'FAILED') : 'Not Graded',
			};
		});
		const tcu = rsummary?.TCU || courses.reduce((sum, c) => sum + c.credits, 0);
		const tgp = rsummary?.TGP || courses.reduce((sum, c) => sum + c.gradePoint, 0);
		const gpa = rsummary?.GPA || (tcu > 0 ? tgp / tcu : 0);
		// Optionally, use template to determine remark (e.g., based on GPA bands)
		const remark = getCommentForPoint(gpa, template?.commentBands ?? []) || rsummary?.comment || "Not Set";
		const summary: Summary = {
			current: { tcu: rsummary?.TCU || tcu, tca: tcu, tgp: rsummary?.TGP || tgp, gpa: rsummary?.GPA || gpa, remark },
			previous: {
				ltcu: `${rsummary?.previous.TCU}` || 'Nill',
				ltca: `${rsummary?.previous.TCU}` || 'Nill',
				ltgp: `${rsummary?.previous.TGP}` || 'Nill',
				lcgpa: `${rsummary?.previous.CGPA.toFixed(2)}` || 'Nill'
			},
			cumulative: {
				tcu: rsummary?.cumulativeTCU || tcu,
				tca: rsummary?.cumulativeTCU || tcu, 
				tgp: rsummary?.cumulativeTGP || tgp,
				cgpa: rsummary?.CGPA || gpa
			},
		};
		const studentData: StudentData = {
			lastUpdated: currentDate,
			matric: student.matricNo,
			name: student.name,
			session,
			programme: department.name,
			semester,
			department: department.name,
			level: student.level.toString(),
			faculty: faculty?.name,
			approvalStatus: 'approved',
		};
		return { studentData, courses, summary };
	};

	return (
		<div className="container mx-auto p-6">
			<Card>
				<CardContent className="p-6">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">Results Management</h1>
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
								<SelectItem value="100">100 Level</SelectItem>
								<SelectItem value="200">200 Level</SelectItem>
								<SelectItem value="300">300 Level</SelectItem>
								<SelectItem value="400">400 Level</SelectItem>
								<SelectItem value="500">500 Level</SelectItem>
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
											{/* <Label htmlFor="course">Course</Label>
											<Select onValueChange={val => setSelectedCourse(val)} value={selectedCourse}>
												<SelectTrigger>
													<SelectValue placeholder="Select Course" />
												</SelectTrigger>
												<SelectContent className="w-full">
													<SelectItem value="-">--Select course--</SelectItem>
													{coursesData?.map((course) => (
														<SelectItem key={course.id} value={course.code}>
															{course.code}
														</SelectItem>
													))}
												</SelectContent>
											</Select> */}
										</div>
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
									<div>
										<Label htmlFor="file">CSV File</Label>
										<Button
											type="button"
											variant="secondary"
											className="mb-2"
											onClick={() => {
												// Generate header: matricNo,<courseCode1>,<courseCode2>,...
												const courseCodes = ['<courseCode1>', '<courseCode2>', '<courseCode3>']; // Replace with actual course codes as needed
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
									</div>
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
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Student Name</TableHead>
											<TableHead>Matric No.</TableHead>
											<TableHead>Level</TableHead>
											<TableHead>Passed</TableHead>
											<TableHead>Failed</TableHead>
											<TableHead>GPA</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody className="text-left">
										{paginatedResults.map((result: StudentsSemesterResultsResponse, id) => {
											const passed = result.courses.filter(c => c.grade && c.grade !== 'F').length;
											const failed = result.courses.filter(c => c.grade === 'F').length;
											const gpa = result.summary?.GPA;

											return (
												<TableRow key={id}>
													<TableCell className="font-medium">{result.student.name}</TableCell>
													<TableCell>{result.student.matricNo}</TableCell>
													<TableCell>{result.student.level}</TableCell>
													<TableCell>{passed}</TableCell>
													<TableCell>{failed}</TableCell>
													<TableCell>{gpa !== undefined ? gpa.toFixed(2) : 'N/A'}</TableCell>
													<TableCell>
														<PDFDownloadLink
															document={<ResultTemplate {...formatForResultTemplate(result)} />}
															fileName={`${result.student.name}-result.pdf`}
														>
															{({ loading }) => (
																<Button variant="ghost" size="sm" disabled={loading}>
																	{loading ? 'Generating...' : 'Download PDF'}
																</Button>
															)}
														</PDFDownloadLink>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>

							{/* Pagination Controls */}
							<div className="flex items-center justify-between mt-4">
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
										{(() => {
											const maxButtons = 7;
											if (totalPages <= maxButtons) {
												return Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
													<Button key={`p-${p}`} variant={p === currentPage ? 'default' : 'ghost'} size="sm" onClick={() => setCurrentPage(p)}>{p}</Button>
												));
											}
											const pages = [];
											const left = Math.max(1, currentPage - 2);
											const right = Math.min(totalPages, currentPage + 2);
											pages.push(1);
											if (left > 2) pages.push('ellipsis-left');
											for (let i = left; i <= right; i++) {
												if (i > 1 && i < totalPages) pages.push(i);
											}
											if (right < totalPages - 1) pages.push('ellipsis-right');
											if (totalPages > 1) pages.push(totalPages);
											return pages.map((p, idx) => {
												if (p === 'ellipsis-left' || p === 'ellipsis-right') {
													return <span key={p + idx} className="px-2">&hellip;</span>;
												}
												return (
													<Button key={`p-${p}`} variant={p === currentPage ? 'default' : 'ghost'} size="sm" onClick={() => setCurrentPage(Number(p))}>{p}</Button>
												);
											});
										})()}
									</div>
									<Button variant="outline" size="sm" disabled={currentPage >= Math.max(1, Math.ceil(totalItems / pageSize))} onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil(totalItems / pageSize)), p + 1))}>Next</Button>
								</div>
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default Results;