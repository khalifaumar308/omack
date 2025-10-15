import { useMemo, memo, useRef } from 'react';
import type { ComponentType } from 'react';
import { useUser } from '@/contexts/useUser';
import { useGetStudentSummary } from '@/lib/api/queries';
import { User, Mail, GraduationCap, Users, BookOpen, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import StudentIDCardGenerator from '@/components/StudentIDCardGenerator';
import type { StudentIDCardGeneratorHandle } from '@/components/StudentIDCardGenerator';

type Stat = {
  icon: ComponentType<{ size?: number }>;
  label: string;
  value: number | string;
  color: string;
}

const StatCard = memo(({ icon: Icon, label, value, color }: Stat) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-150">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} text-white`}>
          <Icon size={20} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
});

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="w-48 h-8">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="w-40 h-6">
          <Skeleton className="w-full h-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="ml-4 w-full">
                <Skeleton className="w-3/4 h-4 mb-2" />
                <Skeleton className="w-1/2 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-6">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="ml-4 w-full">
              <Skeleton className="w-3/4 h-4 mb-2" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-5/6 h-4" />
            <Skeleton className="w-2/3 h-4" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="mb-4">
            <Skeleton className="w-40 h-5" />
          </div>
          <div className="space-y-3">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-5/6 h-4" />
            <Skeleton className="w-2/3 h-4" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <Skeleton className="w-48 h-5 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
              <Skeleton className="w-3 h-3 rounded-full mt-2" />
              <div className="flex-1">
                <Skeleton className="w-1/2 h-4 mb-2" />
                <Skeleton className="w-full h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const { user } = useUser();
  const { data: studentSummary, isLoading, isError } = useGetStudentSummary();
  const idCardRef = useRef<StudentIDCardGeneratorHandle | null>(null);

  const stats = useMemo(() => [
    {
      icon: BookOpen,
      label: 'Registered Courses',
      value: studentSummary?.coursesCount ?? 0,
      color: 'bg-blue-500'
    },
    {
      icon: GraduationCap,
      label: 'Current CGPA',
      value: Math.round((studentSummary?.currentCgpa ?? 0) * 100) / 100 || 0,
      color: 'bg-green-500'
    },
    {
      icon: Calendar,
      label: 'Current Semester',
      value: user?.school?.currentSemester || '',
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      label: 'Total Credits',
      value: studentSummary?.totalCreditUnits ?? 0,
      color: 'bg-orange-500'
    }
  ], [studentSummary, user]);

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return (
    <div className="p-6 bg-white rounded-lg shadow-sm border text-center">
      <p className="text-red-600 font-medium">Unable to load dashboard. Please refresh or contact support.</p>
    </div>
  );

  const student = studentSummary?.student;

  return (
    <div className="space-y-6">
      {/* Hidden ID card generator for single-student download */}
      <div style={{ position: 'absolute', left: -9999, top: -9999 }} aria-hidden>
        <StudentIDCardGenerator
          ref={idCardRef}
          students={student ? [{
            name: student.name || '',
            id: student.matricNo || '',
            level: String(student.level), qrUrl: window.location.href, photoUrl: student.picture,
            department: student.department.name
          }]
            :
            []}
          school={{ name: user?.school?.name || '', logoUrl: user?.school?.logo || '' }}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Dashboard</h1>
        <span className="text-sm text-gray-500">Welcome back, <span className="font-medium text-gray-700">{student?.name}</span>!</span>
        <div className="mt-3 sm:mt-0">
          <button
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
            onClick={() => idCardRef.current?.download({
              name: student?.name || '',
              id: student?.matricNo || '',
              level: String(student?.level), qrUrl: window.location.href, photoUrl: student?.picture,
              department: student?.department.name || ""
            }, 'png')}
          >
            Download ID Card
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Student Information</h2>
          <div className="flex items-center mb-6">
            {student?.picture ? (
              <img
                src={student.picture}
                alt={student?.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mr-4">
                <span className="text-lg font-semibold text-gray-700">{(student?.name || '').split(' ').map((s: string) => s[0]).slice(0, 2).join('').toUpperCase()}</span>
              </div>
            )}

            <div>
              <h3 className="font-medium text-gray-800">{student?.name}</h3>
              <p className="text-sm text-gray-600">{student?.email}</p>
              <p className="text-sm text-gray-600">Matric Number: {student?.matricNo}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center">
              <GraduationCap size={16} className="text-gray-400 mr-3" />
              <span>Department: <span className="text-gray-800 font-medium">{typeof student?.department === 'string' ? student?.department : student?.department?.name || ''}</span></span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="text-gray-400 mr-3" />
              <span>Level: <span className="text-gray-800 font-medium">{student?.level}</span></span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="text-gray-400 mr-3" />
              <span>Session: <span className="text-gray-800 font-medium">{studentSummary?.session}</span></span>
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Guardian Information</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center">
              <User size={16} className="text-gray-400 mr-3" />
              <span>Name: <span className="text-gray-800 font-medium">{student?.guardian?.name || 'N/A'}</span></span>
            </div>
            <div className="flex items-center">
              <Mail size={16} className="text-gray-400 mr-3" />
              <span>Email: <span className="text-gray-800 font-medium">{student?.guardian?.email || 'N/A'}</span></span>
            </div>
            <div className="flex items-center">
              <BookOpen size={16} className="text-gray-400 mr-3" />
              <span>Phone: <span className="text-gray-800 font-medium">{student?.guardian?.phone || 'N/A'}</span></span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <h3 className="font-medium text-gray-800 mb-2">Head of Department</h3>
            <p className="text-sm text-gray-600">{student?.department?.name}</p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
        <div className="space-y-4 text-sm text-gray-600">
          <p className="text-gray-500">No recent activities yet.</p>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard;