import { useUser } from '@/contexts/useUser';
import { User, Mail, GraduationCap, Users, BookOpen, Calendar } from 'lucide-react';

function StudentDashboard() {
    const { user } = useUser();
    const stats = [
    {
      icon: BookOpen,
      label: 'Registered Courses',
      value: '...',
      color: 'bg-blue-500'
    },
    {
      icon: GraduationCap,
      label: 'Current CGPA',
      value: '...',
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
      value: '...',
      color: 'bg-orange-500'
    }
  ]

//   const recentActivities = [
   
//   ];

    const student = {
      name: user?.name || "",
      email: user?.email || "",
      matricNumber: user?.id || "",
    //   phone: user?.phone || "",
    //   department: user?.department || "",
    //   faculty: user?.faculty || "",
    //   level: user?.level || "",
    //   currentSession: user?.currentSession || "",
      profilePicture: 'https://via.placeholder.com/150',
        guardian: {
            name: '...',
            email: '...',
            phone: '...'
        },
        hodName: ''
    };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <span className="text-sm text-gray-500">Welcome back, {student.name}!</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
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
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Student Information</h2>
          <div className="flex items-center mb-6">
            <img
              src={student.profilePicture}
              alt={student.name}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="font-medium text-gray-800">{student.name}</h3>
              <p className="text-sm text-gray-600">{student.email}</p>
              <p className="text-sm text-gray-600">Matric Number: {student.matricNumber}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* <div className="flex items-center">
              <Phone size={16} className="text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Phone: {student.phone}</span>
            </div>
            <div className="flex items-center">
              <GraduationCap size={16} className="text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Department: {student.department}</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Faculty: {student.faculty}</span>
            </div>
            <div className="flex items-center">
              <BookOpen size={16} className="text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Level: {student.level}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Session: {student.currentSession}</span>
            </div> */}
          </div>
        </div>

        {/* Guardian Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Guardian Information</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <User size={16} className="text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Name: {student.guardian.name}</span>
            </div>
            <div className="flex items-center">
              <Mail size={16} className="text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Email: {student.guardian.email}</span>
            </div>
            <div className="flex items-center">
              <BookOpen size={16} className="text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Phone: {student.guardian.phone}</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-medium text-gray-800 mb-2">Head of Department</h3>
            <p className="text-sm text-gray-600">{student.hodName}</p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {/* {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'info' ? 'bg-blue-500' :
                'bg-yellow-500'
              }`} />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard