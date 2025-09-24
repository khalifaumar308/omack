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
	courses: Course[];
	semester?: string;
	status?: "pending" | "approved" | "rejected";
}
const SemesterCourseReg = (Props: IProps) => {
	const { user } = useUser()
	const [semester, setSemester] = useState(Props.courseReg?.semester || Props.semester || "");
	const [courseSearch, setCourseSearch] = useState("");
	const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
	const [updateStatus, setUpdateStatus] = useState<"pending" | "approved" | "rejected">(Props.status || "pending");

	useEffect(() => {
		if (Props.courseReg) {
			const courses = Props.courseReg?.courses.map(c => c.course)
			setSelectedCourses(courses);
		}
	}, [Props.courseReg])

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
		updateRegMutation.mutate(update)
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
		<div>
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
						<Button disabled={updateRegMutation.isPending} onClick={()=> {
							if(updateStatus === Props.status) {
								toast.error("Status is unchanged")
								return
							}
							updateRegMutation.mutate({ 
								studentId: Props.courseReg?.studentId || "", 
								status: updateStatus, semester: Props.courseReg?.semester || "", 
								session: Props.courseReg?.session || ""
							})
						}} className="bg-[#155DFC]">{updateRegMutation.isPending?"Updating...":"Update"}</Button>
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
						<input
							type="text"
							className="mb-4 w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
							placeholder="Search by code or title..."
							value={courseSearch}
							onChange={e => setCourseSearch(e.target.value)}
						/>
						<div className="space-y-4 max-h-96 overflow-y-auto">
							{Props.courses?.filter(course =>
								course.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
								course.title.toLowerCase().includes(courseSearch.toLowerCase())
							).map(course => (
								<div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<h3 className="font-medium text-gray-800">{course.code}</h3>
											<p className="text-sm text-gray-600">{course.title}</p>
											<p className="text-xs text-gray-500 mt-1">
												{course.creditUnits} credits
											</p>
										</div>
										<button
											onClick={() => addCourse(course)}
											disabled={selectedCourses.some(c => c.code === course.code)}
											className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
										>
											<Plus size={16} />
										</button>
									</div>
								</div>
							))}
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