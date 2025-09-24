/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CourseRegistrationPDF from '@/components/CourseRegistrationPDF';
import { Plus, Eye, Send, FileText, Download, Edit } from 'lucide-react';
import type { Course, StudentRegistrationsInfo } from '@/components/types';
import { useGetCourseRegistrationInfo, useGetCourses } from '@/lib/api/queries';
import { useUser } from '@/contexts/useUser';
import SemesterCourseReg from '@/components/SemesterCourseReg';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';


const StudentCourseRegistration: React.FC = () => {
  // Loading and error fallback

  const { user } = useUser()
  const [activeTab, setActiveTab] = useState<'registrations' | 'register'>('registrations');
  const [semester, setSemester] = useState(user?.school?.currentSemester || "First");
  const [toRetake, setToRetake] = useState<Course[]>([])
  const [edit, setEdit] = useState(false)
  const [courseRegEdit, setCourseRegEdit] = useState<StudentRegistrationsInfo>()
  const [openSemesterModal, setOpenSemesterModal] = useState(false)

  const { data: registrationInfo, isLoading, isError } = useGetCourseRegistrationInfo()
  //get courses
  console.log(registrationInfo, 'reg')
  const { data: courses, isLoading: courseLoading } = useGetCourses()

  // Auto-populate failed courses on component mount
  useEffect(() => {
    if (registrationInfo) {
      // Get all course attempts for the selected semester
      const allAttempts = registrationInfo
        .filter(reg => reg.semester === semester)
        .map(reg => reg.courses)
        .flat();

      // Group attempts by course code
      const grouped = allAttempts.reduce((acc, item) => {
        const code = item.course.code;
        acc[code] = acc[code] || [];
        acc[code].push(item);
        return acc;
      }, {} as Record<string, typeof allAttempts>);

      // Find courses where every attempt is "F"
      const failedCourses = Object.values(grouped)
        .filter(attempts => attempts.every(a => a.grade === "F"))
        .map(attempts => attempts[0].course); // Take one record per course

      setToRetake(failedCourses);
    }
  }, [registrationInfo, semester]);

  const stats = [
    {
      label: 'Total Registrations',
      value: registrationInfo?.length || 0,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      label: 'Pending Approvals',
      value: registrationInfo?.filter(reg => reg.status === "pending").length || 0,
      icon: Send,
      color: 'bg-yellow-500'
    },
    {
      label: 'Approved',
      value: registrationInfo?.filter(reg => reg.status === "approved").length || 0,
      icon: Eye,
      color: 'bg-green-500'
    }
  ];

  const scope = user?.school?.registrationScope || 'both';
  const semesters = scope === 'both' ? ['First', 'Second'] : [scope];
  // Loading and error fallback (after hooks)
  if (isLoading || courseLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-200 mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h2>
        <p className="text-gray-500">Please wait while we fetch your course registration data.</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="rounded-full h-16 w-16 flex items-center justify-center bg-red-100 mb-6">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-gray-500">Failed to load course registration data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{activeTab === "register" && (!edit ? "New" : "Edit")} Course Registration</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setActiveTab('registrations')
              setEdit(false)
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'registrations'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Registrations
          </button>

          {user?.school?.registrationStatus && (
            // <button
            //   onClick={() => setActiveTab('register')}
            // className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'register'
            //   ? 'bg-blue-500 text-white'
            //   : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            //   }`}
            // >
            //   Register
            // </button>
            <Dialog open={openSemesterModal} onOpenChange={setOpenSemesterModal}>
              <DialogTrigger asChild>
                <Button className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'register'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">New Course Registration</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Select Registration Semester</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="session">Semester</Label>
                  <Select onValueChange={(value) => setSemester(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setOpenSemesterModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setActiveTab("register")
                    setOpenSemesterModal(false)
                  }} >
                    Continue
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {(activeTab === 'register') && (
        !edit ? (
          <SemesterCourseReg
            edit={false}
            courses={courses!}
            toRetake={toRetake}
            semester={semester}
            status='pending'
          />
        ) : (courseRegEdit && (
          <SemesterCourseReg edit={edit} courseReg={{
            ...courseRegEdit, studentId: user?.id || "",
            session: courseRegEdit.session!,
            semester: courseRegEdit.semester!
          }} session={user?.school?.currentSession || ''}
            toRetake={toRetake} courses={courses!}
          />
        ))
      )}

      {activeTab === 'registrations' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Registrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Semester</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Session</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Total Courses</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Total Credit Units</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {registrationInfo?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">No registrations found.</td>
                  </tr>
                )}
                {registrationInfo?.map((reg, idx) => {
                  const totalCreditUnits = reg.courses.reduce((sum, c) => sum + (c.course?.creditUnits || 0), 0);
                  const pdfProps = {
                    school: {
                      name: user?.school?.name || '',
                      address: user?.school?.address || '',
                      logo: user?.school?.logo || undefined,
                    },
                    student: {
                      name: user?.name || '',
                      department: (user as any)?.department || '',
                      level: (user as any)?.level || '',
                    },
                    registration: {
                      session: reg.session,
                      semester: reg.semester,
                      approved: reg.status === "approved",
                      totalCourses: reg.courses.length,
                      totalCreditUnits,
                    },
                    courses: reg.courses.map(c => ({
                      code: c.course?.code || '',
                      title: c.course?.title || '',
                      creditUnits: c.course?.creditUnits || 0,
                    })),
                  };
                  return (
                    <tr key={idx} className="border-b">
                      <td className="py-2 px-4">{reg.semester}</td>
                      <td className="py-2 px-4">{reg.session}</td>
                      <td className="py-2 px-4">{reg.courses.length}</td>
                      <td className="py-2 px-4">{totalCreditUnits}</td>
                      <td className="py-2 px-4">
                        {reg.status === "approved" ? (
                          <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Approved</span>
                        ) : reg.status === "pending"?(
                          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">Pending</span>
                        ):(
                          <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">Rejected</span>
                        )}
                      </td>  
                      <td className="py-2 px-4 flex gap-2">
                        <PDFDownloadLink
                          document={<CourseRegistrationPDF {...pdfProps} />}
                          fileName={`registration_${reg.semester}_${reg.session}.pdf`}
                          style={{ textDecoration: 'none' }}
                        >
                          {({ loading }) => (
                            <button
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                              disabled={loading}
                            >
                              {loading ? '...' : <Download />}
                            </button>
                          )}
                        </PDFDownloadLink>
                        <button onClick={() => {
                          setCourseRegEdit(reg);
                          setEdit(true)
                          setActiveTab("register")
                        }} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                          <Edit />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {/* {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Course Registration Preview</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Student Name</p>
                  <p className="text-gray-800">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Matric Number</p>
                  <p className="text-gray-800">{student.matricNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Department</p>
                  <p className="text-gray-800">{student.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Level</p>
                  <p className="text-gray-800">{student.level}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Academic Session</p>
                  <p className="text-gray-800">{student.currentSession}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Selected Courses</p>
                <div className="space-y-2">
                  {selectedCourses.map(course => (
                    <div key={course.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">{course.code}: {course.title}</span>
                      <span className="text-sm text-gray-600">{course.credits} credits</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="font-medium text-gray-800">Total Credits: {totalCredits}</p>
                <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

const StatsCard = (stat: { color: string; icon: React.ElementType; label: string; value: string | number; }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${stat.color} text-white`}>
        <stat.icon size={24} />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
      </div>
    </div>
  </div>
);



// FileText
export default StudentCourseRegistration;