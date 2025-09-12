/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUser } from "@/contexts/useUser";
import { useGetStudentsSemesterResults, useGetCourses } from "@/lib/api/queries";
import { useState, useMemo, useEffect } from "react";
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
import type { StudentsSemesterResultsResponse, PopulatedDepartment, PopulatedFaculty } from "@/components/types";
import { useAdminUploadResults } from "@/lib/api/mutations";

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
	grade: string;
}

const Results = () => {
	const { isLoading: userLoading, user } = useUser();
	const [semester, setSemester] = useState(user?.school?.currentSemester || 'First');
	const [session, setSession] = useState(user?.school?.currentSession || '2024/2025');
	const [searchTerm, setSearchTerm] = useState('');
	const [levelFilter, setLevelFilter] = useState('all');
	// pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const { data: results, isLoading, error } = useGetStudentsSemesterResults(semester, session);
	const { mutate: uploadResults } = useAdminUploadResults();
	// Upload states
	const [isUploadOpen, setIsUploadOpen] = useState(false);
	const [uploadSemester, setUploadSemester] = useState('First');
	const [uploadSession, setUploadSession] = useState('2024/2025');
	const [selectedCourse, setSelectedCourse] = useState('');
	const [uploadFile, setUploadFile] = useState<File | null>(null);
	const [parsedData, setParsedData] = useState<UploadData[]>([]);

	const { data: coursesData } = useGetCourses();

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

			const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
			const expectedHeaders = ['matric no', 'score', 'grade'];
			if (!expectedHeaders.every(h => headers.includes(h))) {
				console.error('Invalid CSV headers. Expected: Matric No, Score, Grade');
				return;
			}

			const data: UploadData[] = lines.slice(1).map((line) => {
				const values = line.split(',').map(v => v.trim());
				return {
					matricNo: values[headers.indexOf('matric no')],
					score: parseFloat(values[headers.indexOf('score')]) || 0,
					grade: values[headers.indexOf('grade')],
				};
			}).filter(row => row.matricNo && !isNaN(row.score));

			setParsedData(data);
		};
		reader.readAsText(file);
	};

	const handleUploadSubmit = () => {
		if (!selectedCourse || !uploadFile || parsedData.length === 0) {
			console.error('Missing required fields or data');
			return;
		}
		const courses = (coursesData?.find(c => c.code === selectedCourse) as any)?._id;
		const resultss = parsedData.map(item => ({
			matricNo: item.matricNo,
			score: item.score,
			grade: item.grade,
			course: courses!,
			semester: uploadSemester,
			session: uploadSession,
		}));
		uploadResults({ results: resultss });
		// TODO: Implement actual upload logic here
		setIsUploadOpen(false);
		setParsedData([]);
		setUploadFile(null);
		setSelectedCourse('');
	};

	const filteredResults = useMemo(() => {
		if (!results) return [];
		return results.filter((result) => {
			const student = result.student;
			const q = searchTerm.trim().toLowerCase();
			const matchesSearch = !q ||
				student.name.toLowerCase().includes(q) ||
				student.matricNo.toLowerCase().includes(q);
			const matchesLevel = !levelFilter || levelFilter === 'all' || student.level.toString() === levelFilter;
			return matchesSearch && matchesLevel;
		});
	}, [results, searchTerm, levelFilter]);

	// reset page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, levelFilter, semester, session, pageSize]);

	const totalItems = filteredResults.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const paginatedResults = filteredResults.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	// generate a compact page list for UI (windowed)
	const getPageList = () => {
		const maxButtons = 7;
		if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);
		const pages: number[] = [];
		const left = Math.max(1, currentPage - 2);
		const right = Math.min(totalPages, currentPage + 2);
		pages.push(1);
		if (left > 2) pages.push(-1); // ellipsis
		for (let i = left; i <= right; i++) {
			if (i > 1 && i < totalPages) pages.push(i);
		}
		if (right < totalPages - 1) pages.push(-1);
		if (totalPages > 1) pages.push(totalPages);
		return pages;
	};

	if (userLoading || isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading results</div>;

	const getGradePoints = (grade: string): number => {
		const pointsMap: Record<string, number> = {
			'A': 4,
			'AB': 3.5,
			'B': 3,
			'BC': 2.5,
			'C': 2,
			'D': 1,
			'F': 0,
			// Adjust based on your grading scale
		};
		return pointsMap[grade] || 0;
	};

	const formatForResultTemplate = (result: StudentsSemesterResultsResponse) => {
		const student = result.student;
		const department = student.department as unknown as PopulatedDepartment;
		const faculty = department.faculty as unknown as PopulatedFaculty;
		const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
		const rsummary = result.summary
		const courses: Course[] = result.courses.map((reg, index) => ({
			sn: index + 1,
			code: reg.course.code,
			title: reg.course.title,
			credits: reg.course.creditUnits,
			total: reg.score || 0,
			grade: reg.grade || '',
			gradePoint: getGradePoints(reg.grade || '') * reg.course.creditUnits,
			remark: reg.grade && getGradePoints(reg.grade) > 0 ? 'PASSED' : (reg.grade ? 'FAILED' : 'Not Graded'),
		}));
		const tcu = rsummary?.TCU || courses.reduce((sum, c) => sum + c.credits, 0);
		const tgp = courses.reduce((sum, c) => sum + c.gradePoint, 0);
		const gpa = rsummary?.GPA || (tcu > 0 ? tgp / tcu : 0);
		const remark = gpa >= 3.0 ? 'UPPER CREDIT' : gpa >= 2.5 ? 'LOWER CREDIT' : gpa >= 2 ? 'PASS' : 'FAIL';
		const summary: Summary = {
			current: { tcu, tca: tcu, tgp, gpa, remark },
			previous: { ltcu: 'NIL', ltca: 'NIL', ltgp: 'NIL', lcgpa: 'NIL' },
			cumulative: { tcu, tca: tcu, tgp, cgpa: rsummary?.CGPA || gpa },
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
								{(user?.school?.sessions ||['2023/2024', '2024/2025', '2025/2026']).map(sess => (
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
											<Label htmlFor="course">Course</Label>
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
											</Select>
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
													{(user?.school?.sessions ||['2023/2024', '2024/2025', '2025/2026']).map(sess => (
														<SelectItem key={sess} value={sess}>{sess}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
									<div>
										<Label htmlFor="file">CSV File</Label>
										<Input id="file" type="file" accept=".csv" onChange={handleFileUpload} />
									</div>
									{parsedData.length > 0 && (
										<div className="text-sm text-muted-foreground">
											Parsed {parsedData.length} rows successfully.
										</div>
									)}
								</div>
								<DialogFooter>
									<Button type="submit" onClick={handleUploadSubmit} disabled={!selectedCourse || !uploadFile || parsedData.length === 0}>
										Upload
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>

					{!filteredResults.length && (
						<div className="text-center py-8 text-muted-foreground">
							No results found for the selected filters.
						</div>
					)}

					{filteredResults.length > 0 && (
						<>
							<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Student Name</TableHead>
										<TableHead>Matric No.</TableHead>
										<TableHead>Level</TableHead>
										<TableHead>Total Courses Passed</TableHead>
										<TableHead>Courses Failed</TableHead>
										<TableHead>GPA</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody className="text-left">
									{paginatedResults.map((result: StudentsSemesterResultsResponse) => {
										const passed = result.courses.filter(c => c.grade && c.grade !== 'F').length;
										const failed = result.courses.filter(c => c.grade === 'F').length;
										const gpa = result.summary?.GPA;

										return (
											<TableRow key={result.student.id}>
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
										{getPageList().map((p, idx) => p === -1 ? (
											<span key={`el-${idx}`} className="px-2">&hellip;</span>
										) : (
											<Button key={`p-${p}`} variant={p === currentPage ? 'default' : 'ghost'} size="sm" onClick={() => setCurrentPage(p)}>{p}</Button>
										))}
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