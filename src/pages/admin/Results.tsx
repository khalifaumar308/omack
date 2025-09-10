import { useUser } from "@/contexts/useUser";
import { useGetStudentsSemesterResults } from "@/lib/api/queries";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResultTemplate from "@/components/ResultTemplate";
import type { StudentsSemesterResultsResponse, PopulatedDepartment, PopulatedFaculty } from "@/components/types";

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

const Results = () => {
	const { isLoading: userLoading } = useUser();
	
	const [semester, setSemester] = useState('First');
	const [session, setSession] = useState('2024/2025');
	const [searchTerm, setSearchTerm] = useState('');
	const [levelFilter, setLevelFilter] = useState('');
	
	const { data: results, isLoading, error } = useGetStudentsSemesterResults(semester, session);

	const filteredResults = useMemo(() => {
		if (!results) return [];
		return results.filter((result) => {
			const student = result.student;
			const matchesSearch = !searchTerm ||
				student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				student.matricNo.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesLevel = !levelFilter || student.level.toString() === levelFilter.replace('all', '');
			return matchesSearch && matchesLevel;
		});
	}, [results, searchTerm, levelFilter]);

	if (userLoading || isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading results</div>;

	const getGradePoints = (grade: string): number => {
		const pointsMap: Record<string, number> = {
			'A': 5,
			'B': 4,
			'C': 3,
			'D': 2,
			'E': 1,
			'F': 0,
			'BC': 3.5,
			'AB': 4.5,
			// Adjust based on your grading scale
		};
		return pointsMap[grade] || 0;
	};

	const formatForResultTemplate = (result: StudentsSemesterResultsResponse) => {
		const student = result.student;
		const department = student.department as unknown as PopulatedDepartment;
		const faculty = department.faculty as unknown as PopulatedFaculty;
		const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
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
		const tcu = courses.reduce((sum, c) => sum + c.credits, 0);
		const tgp = courses.reduce((sum, c) => sum + c.gradePoint, 0);
		const gpa = tcu > 0 ? tgp / tcu : 0;
		const remark = gpa >= 4.5 ? 'DISTINCTION' : gpa >= 3.5 ? 'VERY GOOD' : gpa >= 2.5 ? 'GOOD' : gpa >= 1.5 ? 'PASS' : 'FAIL';
		const summary: Summary = {
			current: { tcu, tca: tcu, tgp, gpa, remark },
			previous: { ltcu: 'NIL', ltca: 'NIL', ltgp: 'NIL', lcgpa: 'NIL' },
			cumulative: { tcu, tca: tcu, tgp, cgpa: gpa },
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
			faculty: faculty.name,
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
								<SelectItem value="2023/2024">2023/2024</SelectItem>
								<SelectItem value="2024/2025">2024/2025</SelectItem>
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
						<Button variant="outline" onClick={() => alert('Upload Results from CSV - Coming Soon!')}>
							Upload Results from CSV
						</Button>
					</div>

					{!filteredResults.length && (
						<div className="text-center py-8 text-muted-foreground">
							No results found for the selected filters.
						</div>
					)}

					{filteredResults.length > 0 && (
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
								<TableBody>
									{filteredResults.map((result: StudentsSemesterResultsResponse) => {
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
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default Results;