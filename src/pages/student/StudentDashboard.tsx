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
    <div className="stat-card">
      <div className="flex items-center gap-4">
        <div 
          className="p-3 rounded-lg text-white flex-shrink-0"
          style={{ background: color }}
        >
          <Icon size={20} />
        </div>
        <div>
          <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--omack-text-light)' }}>{label}</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--omack-primary)', lineHeight: 1 }}>{value}</p>
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
      color: 'linear-gradient(135deg, #165c4b 0%, #1e9a6f 100%)'
    },
    {
      icon: Calendar,
      label: 'Current Semester',
      value: user?.school?.currentSemester || '',
      color: 'linear-gradient(135deg, #1e5a8e 0%, #3b7fb5 100%)'
    },
    {
      icon: Users,
      label: 'Total Credits',
      value: studentSummary?.totalCreditUnits ?? 0,
      color: 'linear-gradient(135deg, #00a86b 0%, #26d68a 100%)'
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ color: 'var(--omack-text-primary)', fontSize: '2.125rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            Welcome, {student?.name?.split(' ')[0]}
          </h1>
          <p style={{ color: 'var(--omack-text-secondary)', fontSize: '0.95rem', margin: '0.5rem 0 0 0' }}>
            View your academic information and recent activities
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ whiteSpace: 'nowrap', background: 'linear-gradient(135deg, #165c4b 0%, #1e9a6f 100%)' }}
          onClick={() => idCardRef.current?.download({
            name: student?.name || '',
            id: student?.matricNo || '',
            level: String(student?.level), qrUrl: window.location.href, photoUrl: student?.picture,
            department: student?.department.name || ""
          }, 'png')}
        >
          📥 Download ID Card
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            {...stat}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Information */}
        <div className="omack-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--omack-text-primary)', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid var(--omack-border-light)' }}>
            Student Information
          </h2>
          <div className="flex items-startgap-4 mb-6">
            {student?.picture ? (
              <img
                src={student.picture}
                alt={student?.name}
                className="w-16 h-16 rounded-full object-cover shadow-md flex-shrink-0"
              />
            ) : (
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-lg shadow-md"
                style={{ background: 'linear-gradient(135deg, #165c4b 0%, #1e9a6f 100%)' }}
              >
                {(student?.name || '').split(' ').map((s: string) => s[0]).slice(0, 2).join('').toUpperCase()}
              </div>
            )}

            <div>
              <h3 style={{ color: 'var(--omack-text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>{student?.name}</h3>
              <p style={{ color: 'var(--omack-text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{student?.email}</p>
              <p style={{ color: 'var(--omack-text-secondary)', fontSize: '0.9rem' }}>Matric: {student?.matricNo}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <GraduationCap size={16} style={{ color: 'var(--omack-primary)' }} />
              <span style={{ color: 'var(--omack-text-secondary)', fontSize: '0.9rem' }}>
                Department: <span style={{ color: 'var(--omack-text-primary)', fontWeight: 600 }}>{typeof student?.department === 'string' ? student?.department : student?.department?.name || ''}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Users size={16} style={{ color: 'var(--omack-primary)' }} />
              <span style={{ color: 'var(--omack-text-secondary)', fontSize: '0.9rem' }}>
                Level: <span style={{ color: 'var(--omack-text-primary)', fontWeight: 600 }}>{student?.level}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} style={{ color: 'var(--omack-primary)' }} />
              <span style={{ color: 'var(--omack-text-secondary)', fontSize: '0.9rem' }}>
                Session: <span style={{ color: 'var(--omack-text-primary)', fontWeight: 600 }}>{studentSummary?.session}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="omack-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--omack-text-primary)', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid var(--omack-border-light)' }}>
            Guardian Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User size={16} style={{ color: 'var(--omack-primary)', marginTop: '0.25rem', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--omack-text-light)', textTransform: 'uppercase', letterSpacing: '0.3px', fontWeight: 600, marginBottom: '0.25rem' }}>Name</p>
                <p style={{ color: 'var(--omack-text-primary)', fontWeight: 600 }}>{student?.guardian?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={16} style={{ color: 'var(--omack-primary)', marginTop: '0.25rem', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--omack-text-light)', textTransform: 'uppercase', letterSpacing: '0.3px', fontWeight: 600, marginBottom: '0.25rem' }}>Email</p>
                <p style={{ color: 'var(--omack-text-primary)', fontWeight: 600 }}>{student?.guardian?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen size={16} style={{ color: 'var(--omack-primary)', marginTop: '0.25rem', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--omack-text-light)', textTransform: 'uppercase', letterSpacing: '0.3px', fontWeight: 600, marginBottom: '0.25rem' }}>Phone</p>
                <p style={{ color: 'var(--omack-text-primary)', fontWeight: 600 }}>{student?.guardian?.phone || 'N/A'}</p>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid var(--omack-border-light)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--omack-text-light)', textTransform: 'uppercase', letterSpacing: '0.3px', fontWeight: 600, marginBottom: '0.5rem' }}>Head of Department</p>
              <p style={{ color: 'var(--omack-text-primary)', fontWeight: 600 }}>{student?.department?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="page-section">
        <h2 className="page-section-title">Recent Activities</h2>
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--omack-text-light)' }}>
          <p>No recent activities yet. Check back later for updates on your academic progress.</p>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard;