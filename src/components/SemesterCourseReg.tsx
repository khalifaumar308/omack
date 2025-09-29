/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { Course, StudentRegistrationsInfo } from "./types";
import { toast } from "sonner";
import { Plus, Send, Trash2 } from "lucide-react";
import { useUser } from "@/contexts/useUser";
import { useStudentRegisterManyCourses, useUpdateStudentSemesterReg } from "@/lib/api/mutations";
import { Button } from "./ui/button";

interface TCourseReg extends StudentRegistrationsInfo {
	studentId: string;
}

interface IProps {
	edit: boolean;
	courseReg?: TCourseReg;
	session?: string;
	toRetake?: Course[];
	courses: Course[] | { data: Course[]; pagination?: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean } };
	semester?: string;
	status?: "pending" | "approved" | "rejected";
	onSuccess?: () => void;
}
const SemesterCourseReg = (Props: IProps) => {
	// console.log("PProps", Props, 'props in sem reg')
	const { user } = useUser()
	const [semester, setSemester] = useState(Props.courseReg?.semester || Props.semester || "");
	const [courseSearch, setCourseSearch] = useState("");
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
	const [updateStatus, setUpdateStatus] = useState<"pending" | "approved" | "rejected">(Props.status || "pending");

	// Derived courses array and pagination
	const coursesArray: Course[] = Array.isArray(Props.courses) ? Props.courses : (Props.courses?.data || []);
	const pagination = !Array.isArray(Props.courses) ? Props.courses?.pagination : undefined;

	useEffect(() => {
		if (Props.courseReg) {
			const courses = Props.courseReg?.courses.map(c => c.course)
			setSelectedCourses(courses);
		}
	}, [Props.courseReg])

	// When server-driven pagination is available and refetch provided, call it on page/search/pageSize change

	const updateRegMutation = useUpdateStudentSemesterReg()
	const submitRegistrationMutation = useStudentRegisterManyCourses()

	const updateRegistration = () => {
		const courses = [...selectedCourses].map(c => (c as any)._id as string)
		const update = {
			semester: Props.courseReg?.semester || "",
			session: Props.courseReg?.session || "",
			studentId: Props.courseReg?.studentId || "",
			newCourseIds: courses, status: updateStatus
		}
		updateRegMutation.mutate(update, {
			onSuccess: () => {
				toast.success('Registration updated');
				if (Props.onSuccess) {
					Props.onSuccess();
				}
			},
			onError: (error: any) => {
				toast.error(error?.response?.data?.message || 'Update failed. Please try again.');
			}
		})
	}

	const submitRegistration = () => {
		if (selectedCourses.length === 0) {
			toast.error('Please select at least one course to register');
			return;
		}
		const toRetake = Props.toRetake || []
		const courses = [...selectedCourses, ...toRetake].map(c => (c as any)._id as string)
		//submit registration
		const reg = {
			semester: Props.semester || semester, courses, session: user?.school?.currentSession || ''
		}
		submitRegistrationMutation.mutate(reg, {
			onError: (error: any) => {
				toast.error(error?.response?.data?.message || 'Registration failed. Please try again.');
			}
		});
	};

	const addCourse = (course: Course) => {
		// if (selectedCourses.length >= 8) {
		//   toast.warning('You cannot register for more than 8 courses');
		//   return;
		// }
		// Prevent duplicate selection
		if (selectedCourses.some(c => c.code === course.code)) {
			toast.warning('You have already selected this course.');
			return;
		}
		setSelectedCourses([...selectedCourses, course]);
	};

	const removeCourse = (courseCode: string) => {
		setSelectedCourses(selectedCourses.filter(course => course.code !== courseCode));
	};

	const totalCredits = selectedCourses.reduce((sum, course) => sum + course.creditUnits, 0);
	return (
		<div className="relative">
			{(updateRegMutation.isPending || submitRegistrationMutation.isPending) && (
				<div className="absolute inset-0 bg-white/70 z-50 flex flex-col items-center justify-center">
					<svg className="animate-spin h-12 w-12 text-blue-500 mb-4" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
					</svg>
					<div className="text-sm font-medium text-gray-700">{updateRegMutation.isPending ? 'Updating registration...' : 'Submitting registration...'}</div>
				</div>
			)}
			<div >
				{/* Semester & Session Selection */}
				<div className="lg:col-span-2 flex flex-wrap gap-4 mb-4 items-center">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
						<select
							value={semester}
							onChange={e => setSemester(e.target.value)}
							className="px-3 py-2 border rounded w-40 focus:outline-none focus:ring focus:border-blue-300"
						>
							{Props.edit ? (
								<option value={Props.courseReg?.semester}>{Props.courseReg?.semester || ''}</option>
							) : (
								<>
									<option value={Props.semester}>{Props.semester}</option>
								</>
							)}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
						<p className="px-3 py-2 border rounded w-40 focus:outline-none focus:ring focus:border-blue-300">{Props.courseReg?.session || user?.school?.currentSession}</p>
					</div>
				</div>
				{(Props.edit && user?.role === "school-admin") && (
					<div className="flex gap-2 mb-4 items-center">
						<label className="text-sm font-medium text-gray-700 mb-1">Update Status</label>
						<select
							value={updateStatus}
							onChange={e => setUpdateStatus(e.target.value as "pending" | "approved" | "rejected")}
							className="px-3 py-2 border rounded w-40 focus:outline-none focus:ring focus:border-blue-300"
						>
							<option value="pending">Pending</option>
							<option value="approved">Approved</option>
							<option value="rejected">Rejected</option>
						</select>
						<Button disabled={updateRegMutation.isPending} onClick={() => {
							if (updateStatus === Props.status) {
								toast.error("Status is unchanged")
								return
							}
							updateRegMutation.mutate({
								studentId: Props.courseReg?.studentId || "",
								status: updateStatus, semester: Props.courseReg?.semester || "",
								session: Props.courseReg?.session || ""
							}, {
								onSuccess: () => {
									toast.success('Registration updated');
									if (Props.onSuccess) {
										Props.onSuccess();
									}
								},
								onError: (error: any) => {
									toast.error(error?.response?.data?.message || 'Update failed. Please try again.');
								}
							})
						}} className="bg-[#155DFC]">{updateRegMutation.isPending ? "Updating..." : "Update"}</Button>
					</div>
				)}
				{/* Failed Courses Notice */}
				{((Props.toRetake?.length ?? 0) > 0 && !Props.edit) && (
					<div className="lg:col-span-2 bg-red-50 border border-red-200 rounded-lg p-4">
						<h3 className="font-medium text-red-800 mb-2">Failed Courses - Automatic Registration</h3>
						<p className="text-sm text-red-700 mb-3">
							The following failed courses have been automatically added to your registration:
						</p>
						<div className="space-y-2">
							{Props.toRetake?.map((course, index) => (
								<div key={index} className="flex justify-between items-center text-sm">
									<span className="text-red-800">{course.code} - {course.title}</span>
									<span className="text-red-600">Previous Grade: F</span>
								</div>
							))}
						</div>
					</div>
				)}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Available Courses */}
					<div className="bg-white p-6 rounded-lg shadow-sm border">
						<h2 className="text-lg font-semibold text-gray-800 mb-4">Available Courses</h2>
						<div className="flex gap-2 mb-4 items-center">
							<input
								type="text"
								className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
								placeholder="Search by code or title..."
								value={courseSearch}
								onChange={e => { setCourseSearch(e.target.value); setPage(1); }}
							/>
							<select value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value)); setPage(1); }} className="px-3 py-2 border rounded">
								<option value={5}>5</option>
								<option value={10}>10</option>
								<option value={20}>20</option>
							</select>
						</div>

						<div className="space-y-4 max-h-96 overflow-y-auto">
							{coursesArray
								.filter(course => {
									if (!courseSearch) return true;
									return course.code.toLowerCase().includes(courseSearch.toLowerCase()) || course.title.toLowerCase().includes(courseSearch.toLowerCase())
								})
								.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
								.map(course => (
									<div key={(course as any).id || (course as any)._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
										<div className="flex items-center justify-between">
											<div className="flex-1">
												<h3 className="font-medium text-gray-800">{(course as any).code}</h3>
												<p className="text-sm text-gray-600">{(course as any).title}</p>
												<p className="text-xs text-gray-500 mt-1">
													{(course as any).creditUnits} credits
												</p>
											</div>
											<button
												onClick={() => addCourse(course)}
												disabled={selectedCourses.some(c => c.code === (course as any).code)}
												className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
											>
												<Plus size={16} />
											</button>
										</div>
									</div>
								))}
						</div>

						{/* Pagination controls (use server pagination if provided) */}
						<div className="mt-3 flex items-center justify-between">
							<div className="text-sm text-gray-600">{pagination ? `Showing page ${pagination.page} of ${pagination.totalPages}` : `Showing ${(page - 1) * pageSize + 1}-${Math.min((page) * pageSize, coursesArray.length)} of ${coursesArray.length}`}</div>
							<div className="flex items-center space-x-2">
								<Button type="button" variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pagination ? !pagination.hasPrev : page === 1}>Prev</Button>
								<div className="text-sm text-gray-700">{pagination ? pagination.page : page}</div>
								<Button type="button" variant="outline" size="sm" onClick={() => {
									if (pagination) {
										if (!pagination.hasNext) return;
										setPage(p => p + 1);
									} else {
										setPage(p => p + 1);
									}
								}} disabled={pagination ? !pagination.hasNext : (page * pageSize >= coursesArray.length)}>Next</Button>
							</div>
						</div>
					</div>

					{/* Selected Courses */}
					<div className="bg-white p-6 rounded-lg shadow-sm border">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold text-gray-800">Selected Courses</h2>
							<span className="text-sm text-gray-600">
								Total Credits: {totalCredits}/24
							</span>
						</div>

						<div className="space-y-4 max-h-96 overflow-y-auto">
							{selectedCourses.length === 0 ? (
								<p className="text-gray-500 text-center py-8">No courses selected</p>
							) : (
								selectedCourses.map(course => (
									<div key={course.id} className="border rounded-lg p-4">
										<div className="flex items-center justify-between">
											<div className="flex-1">
												<h3 className="font-medium text-gray-800">{course.code}</h3>
												<p className="text-sm text-gray-600">{course.title}</p>
												<p className="text-xs text-gray-500 mt-1">
													{course.creditUnits} credits
												</p>
											</div>
											<button
												onClick={() => removeCourse(course.code)}
												className="ml-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>
								))
							)}
						</div>

						{selectedCourses.length > 0 && (
							<div className="mt-6 pt-4 border-t space-y-3">
								<div className="flex space-x-2">

									<button
										onClick={Props.edit ? updateRegistration : submitRegistration}
										className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-600 transition-colors"
									>
										<Send size={16} />
										{Props.edit ? (
											<span>Submit{updateRegMutation.isPending && 'ing...'}</span>
										) : (
											<span>Submit{submitRegistrationMutation.isPending && 'ing...'}</span>
										)}
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default SemesterCourseReg