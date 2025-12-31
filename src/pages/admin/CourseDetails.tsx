import { useUser } from "@/contexts/useUser";
import { useGetResultsPerCourse } from "@/lib/api/queries";
import { useAddMarksToStudents } from "@/lib/api/mutations";
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, BarChart3, Users, TrendingUp, ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { PopulatedCourseRegistration } from "@/components/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface GradeStatistics {
	grade: string;
	count: number;
	percentage: number;
	minScore?: number;
	maxScore?: number;
}

interface CourseStats {
	totalStudents: number;
	passCount: number;
	failCount: number;
	passPercentage: number;
	averageScore: number;
	highestScore: number;
	lowestScore: number;
	gradeDistribution: GradeStatistics[];
}

const GRADE_BANDS = {
	'A': { color: 'bg-emerald-100 text-emerald-800' },
	'AB': { color: 'bg-emerald-200 text-emerald-900' },
	'B': { color: 'bg-blue-100 text-blue-800' },
	'BC': { color: 'bg-blue-200 text-blue-900' },
	'C': { color: 'bg-yellow-100 text-yellow-800' },
	'D': { color: 'bg-orange-100 text-orange-800' },
	'F': { color: 'bg-red-100 text-red-800' },
};

// const getGradeFromScore = (score: number | undefined): string => {
// 	if (score === undefined || score === null) return 'N/A';
// 	if (score >= 70) return 'A';
// 	if (score >= 60) return 'B';
// 	if (score >= 50) return 'C';
// 	if (score >= 40) return 'D';
// 	return 'F';
// };

const calculateStats = (registrations: PopulatedCourseRegistration[]): CourseStats => {
	const scores = registrations
		.map(reg => reg.score)
		.filter((score): score is number => score !== undefined && score !== null);

	const grades = registrations.map(reg => reg.grade);
	const passCount = grades.filter(grade => grade !=="F").length;
	const failCount = grades.filter(grade => grade ==="F").length;

	// Grade distribution
	const gradeMap = new Map<string, number>();
	grades.forEach(grade => {
		gradeMap.set(grade || "", (gradeMap.get(grade || "") || 0) + 1);
	});
	console.log("gradeMap", gradeMap);

	const gradeDistribution: GradeStatistics[] = Object.entries(GRADE_BANDS)
		.map(([grade,]) => ({
			grade,
			count: gradeMap.get(grade) || 0,
			percentage: registrations.length > 0 ? ((gradeMap.get(grade) || 0) / registrations.length) * 100 : 0,
		}))
		.filter(item => item.count > 0 || grades.includes(item.grade));

	return {
		totalStudents: registrations.length,
		passCount,
		failCount,
		passPercentage: registrations.length > 0 ? (passCount / registrations.length) * 100 : 0,
		averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
		highestScore: scores.length > 0 ? Math.max(...scores) : 0,
		lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
		gradeDistribution,
	};
};

function LoadingSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader className="pb-3">
							<Skeleton className="h-4 w-20" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-16" />
						</CardContent>
					</Card>
				))}
			</div>
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-40" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-64 w-full" />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-40" />
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{[...Array(5)].map((_, i) => (
							<Skeleton key={i} className="h-12 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function StatCard({ icon: Icon, title, value, subtitle }: { icon: React.ComponentType<{ className?: string }>; title: string; value: string | number; subtitle?: string }) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				{subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
			</CardContent>
		</Card>
	);
}

function GradeDistributionChart({ stats }: { stats: CourseStats }) {
	const maxCount = Math.max(...stats.gradeDistribution.map(g => g.count), 1);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<BarChart3 className="h-5 w-5" />
					Grade Distribution
				</CardTitle>
				<CardDescription>Number of students per grade</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{stats.gradeDistribution.map(item => (
						<div key={item.grade}>
							<div className="flex justify-between mb-2">
								<span className="font-medium">{item.grade}</span>
								<span className="text-sm text-muted-foreground">{item.count} students ({item.percentage.toFixed(1)}%)</span>
							</div>
							<div className="w-full bg-muted rounded-full h-2 overflow-hidden">
								<div
									className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
									style={{ width: `${(item.count / maxCount) * 100}%` }}
								/>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function StudentResultsTable({ registrations }: { registrations: PopulatedCourseRegistration[] }) {
	const [sortBy, setSortBy] = useState<'name' | 'score' | 'grade'>('name');
	const [searchTerm, setSearchTerm] = useState('');

	const sortedAndFiltered = useMemo(() => {
		let results = [...registrations];

		// Filter
		if (searchTerm) {
			results = results.filter(
				reg =>
					reg.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					reg.student.matricNo.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Sort
		results.sort((a, b) => {
			switch (sortBy) {
				case 'score':
					return (b.score || 0) - (a.score || 0);
				case 'grade':
					return (b.grade || '').localeCompare(a.grade || '');
				case 'name':
				default:
					return a.student.name.localeCompare(b.student.name);
			}
		});

		return results;
	}, [registrations, sortBy, searchTerm]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Users className="h-5 w-5" />
					Student Results
				</CardTitle>
				<CardDescription>Detailed breakdown of student scores and grades</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex gap-4 flex-col sm:flex-row">
						<input
							type="text"
							placeholder="Search by name or matric no..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
						/>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as 'name' | 'score' | 'grade')}
							className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
						>
							<option value="name">Sort by Name</option>
							<option value="score">Sort by Score</option>
							<option value="grade">Sort by Grade</option>
						</select>
					</div>

					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Matric No.</TableHead>
									<TableHead>Student Name</TableHead>
									<TableHead className="text-right">Score</TableHead>
									<TableHead className="text-center">Grade</TableHead>
									<TableHead className="text-center">Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sortedAndFiltered.length > 0 ? (
									sortedAndFiltered.map((reg, id) => {
										const grade = reg.grade;
										const isPass = (reg.score || 0) >= 40;
										return (
											<TableRow key={id}>
												<TableCell className="font-mono text-sm">{reg.student.matricNo}</TableCell>
												<TableCell className="font-medium">{reg.student.name}</TableCell>
												<TableCell className="text-right font-semibold">
													{reg.score !== undefined ? `${reg.score}%` : '-'}
												</TableCell>
												<TableCell className="text-center">
													{grade !== 'N/A' && (
														<Badge className={`${GRADE_BANDS[grade as keyof typeof GRADE_BANDS]?.color || 'bg-gray-100'} font-semibold`}>
															{grade}
														</Badge>
													)}
													{grade === 'N/A' && <span className="text-muted-foreground">-</span>}
												</TableCell>
												<TableCell className="text-center">
													<Badge variant={isPass ? "default" : "destructive"}>
														{isPass ? "Pass" : "Fail"}
													</Badge>
												</TableCell>
											</TableRow>
										);
									})
								) : (
									<TableRow>
										<TableCell colSpan={5} className="text-center text-muted-foreground py-8">
											No students found
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					<div className="text-sm text-muted-foreground">
						Showing {sortedAndFiltered.length} of {registrations.length} students
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function CourseDetails() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { user } = useUser();
	const [semester, setSemester] = useState<string>(user?.school?.currentSemester || "First");
	const [session, setSession] = useState<string>(user?.school?.currentSession || "2023/2024");
	const [addMarksOpen, setAddMarksOpen] = useState(false);
	const [marksToAdd, setMarksToAdd] = useState<number>(0);
	const { data, isLoading, isError, error } = useGetResultsPerCourse(id, semester, session);

	const registrations = useMemo(
		() => (data?.regs || []) as PopulatedCourseRegistration[],
		[data?.regs]
	);
	const stats = useMemo(() => calculateStats(registrations), [registrations]);

	// Extract course info from first registration
	const courseInfo = useMemo(() => {
		if (registrations.length > 0) {
			return registrations[0].course;
		}
		return null;
	}, [registrations]);

	const addMarksMutation = useAddMarksToStudents();
	const queryClient = useQueryClient();

	const handleAddMarks = () => {
		if (!id) return;
		addMarksMutation.mutate({
			courseId: id,
			semester,
			session,
			marksToAdd
		}, {
			onSuccess: (data) => {
				setAddMarksOpen(false);
				setMarksToAdd(0);
				// Optionally, you can refetch the results here to reflect the updated scores
				toast.success(data.message ||`Successfully added ${marksToAdd} marks to students.`);
				const keys:string[] = ['courseResults', id, semester, session];
				queryClient.invalidateQueries({ queryKey: keys });
			}
		});
	};

	// Generate available sessions (current and previous 5 years)
	const currentYear = new Date().getFullYear();
	const availableSessions = Array.from({ length: 6 }, (_, i) => {
		const year = currentYear - i;
		return `${year}/${year + 1}`;
	});

	return (
		<div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
			<div className="">
				{/* Header Section */}
				<div className="mb-8">
					<button
						onClick={() => navigate(-1)}
						className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Go Back
					</button>
					<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
						<div>
							<h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Course Details & Analytics</h1>
							{courseInfo && (
								<div className="flex flex-wrap gap-4 text-slate-600">
									<span><strong>Code:</strong> {courseInfo.code}</span>
									<span><strong>Title:</strong> {courseInfo.title}</span>
									<span><strong>Credit Units:</strong> {courseInfo.creditUnits}</span>
								</div>
							)}
						</div>
						{!isLoading && registrations.length > 0 && (
							<Dialog open={addMarksOpen} onOpenChange={setAddMarksOpen}>
								<DialogTrigger asChild>
									<button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors">
										<Plus className="h-4 w-4" />
										Add Marks (High Failure Rate)
									</button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Add Marks to Students</DialogTitle>
										<DialogDescription>
											Adding {marksToAdd} marks to {registrations.filter(r => (r.score || 0) < 40).length} students who scored below 40%
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4 py-4">
										<div>
											<label className="block text-sm font-medium text-slate-700 mb-2">Marks to Add</label>
											<input
												type="number"
												min="-100"
												max="100"
												value={marksToAdd}
												onChange={(e) => setMarksToAdd(Number(e.target.value))}
												className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
												placeholder="Enter marks"
											/>
										</div>
										<div className="bg-slate-50 p-3 rounded-md text-sm text-slate-600">
											<p className="font-medium mb-2">Summary:</p>
											<ul className="space-y-1 text-xs">
												<li>• Marks to add: <strong>{marksToAdd}</strong></li>
												<li>• Affected students: <strong>{registrations.filter(r => (r.score || 0) < 40).length}</strong></li>
												<li>• Current pass rate: <strong>{stats.passPercentage.toFixed(1)}%</strong></li>
											</ul>
										</div>
										<div className="flex gap-2 justify-end">
											<button
												onClick={() => setAddMarksOpen(false)}
												className="px-4 py-2 rounded-lg border border-input hover:bg-slate-50 text-slate-700 font-medium transition-colors"
											>
												Cancel
											</button>
											<button
												onClick={handleAddMarks}
											disabled={addMarksMutation.isPending}
											className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors flex items-center gap-2"
										>
											{addMarksMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
											{addMarksMutation.isPending ? 'Adding Marks...' : 'Add Marks'}
											</button>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						)}
					</div>
				</div>

				{/* Filter Section */}
				<Card className="mb-6 border-slate-200 shadow-sm">
					<CardHeader>
						<CardTitle className="text-lg">Filters</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">Semester</label>
								<Select value={semester} onValueChange={setSemester}>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="First">First Semester</SelectItem>
										<SelectItem value="Second">Second Semester</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">Session</label>
								<Select value={session} onValueChange={setSession}>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{availableSessions.map(sess => (
											<SelectItem key={sess} value={sess}>{sess}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Error State */}
				{isError && (
					<Alert variant="destructive" className="mb-6">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error Loading Data</AlertTitle>
						<AlertDescription>
							{error instanceof Error ? error.message : 'Failed to load course results. Please try again.'}
						</AlertDescription>
					</Alert>
				)}

				{/* Loading State */}
				{isLoading ? (
					<LoadingSkeleton />
				) : registrations.length === 0 ? (
					<Alert className="mb-6">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>No Data Available</AlertTitle>
						<AlertDescription>
							No student results found for this course in the selected semester and session.
						</AlertDescription>
					</Alert>
				) : (
					<>
						{/* Statistics Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
							<StatCard
								icon={Users}
								title="Total Students"
								value={stats.totalStudents}
								subtitle="Enrolled in course"
							/>
							<StatCard
								icon={TrendingUp}
								title="Pass Rate"
								value={`${stats.passPercentage.toFixed(1)}%`}
								subtitle={`${stats.passCount} passed`}
							/>
							<StatCard
								icon={BarChart3}
								title="Average Score"
								value={`${stats.averageScore.toFixed(1)}%`}
								subtitle={`Range: ${stats.lowestScore}% - ${stats.highestScore}%`}
							/>
							<StatCard
								icon={TrendingUp}
								title="Highest Score"
								value={`${stats.highestScore}%`}
								subtitle={`Lowest: ${stats.lowestScore}%`}
							/>
						</div>

						{/* Grade Distribution Chart */}
						<div className="mb-6">
							<GradeDistributionChart stats={stats} />
						</div>

						{/* Student Results Table */}
						<StudentResultsTable registrations={registrations} />
					</>
				)}
			</div>
		</div>
	);
}

export default CourseDetails;