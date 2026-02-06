import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Home,
  Settings,
  Users,
  FileText,
  Award,
  Building,
  Radio,
  Search,
  Wallet,
} from "lucide-react";
import { Link, useLocation, Outlet } from "react-router";
import { useUser } from "@/contexts/useUser";
import { userLogout } from "@/lib/api/base";
import { Button } from "@/components/ui/button";

export function DashboardLayout() {
  // Sidebar item type definition
  type SidebarItem = {
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    url?: string;
    items?: { title: string; url: string }[];
  };

  const location = useLocation();
  const { user, isLoading } = useUser();
  if (!isLoading && !user) {
    //navigate to login
    window.location.href = '/login';
    return null; // or a loading spinner
  }
  // console.log(user, 'user')

  const handleLogout = async () => {
    try {
      await userLogout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/login';
    }
  };

  const getFilteredSidebarItems = (): SidebarItem[] => {
    if (!user) return []; // Loading or error, show nothing
    const role = user.role;
    const allItems: SidebarItem[] = [
      {
        title: "Dashboard",
        icon: Home,
        url: "/",
      },
      {
        title: "User Management",
        icon: Users,
        items: [
          ...(role === "super-admin" ? [{ title: "Schools", url: "/super-admin/schools" }] : []),
          { title: "Students", url: "/students" },
          { title: "Instructors", url: "/instructors" },
          ...(role === "school-admin" || role === "super-admin" ? [{ title: "Student Transition", url: "/student-transition" }] : []),
        ].filter(Boolean),
      },
      {
        title: "Academic Structure",
        icon: Building,
        items: [
          ...(role === "super-admin" ? [{ title: "Faculties", url: "/super-admin/faculties" }] : []),
          ...(role === "school-admin" || role === "super-admin" ? [{ title: "Departments", url: "/super-admin/departments" }, { title: "Levels", url: "/super-admin/levels" }] : []),
        ].filter(Boolean),
      },
      {
        title: "Course Management",
        icon: BookOpen,
        items: [
          { title: "Courses", url: "/courses" },
          ...(role === "school-admin" || role === "super-admin" ? [{ title: "Course Registration", url: "/course-registration" }, { title: "Admin Registration", url: "/admin-course-registration" }, { title: "Registration Approvals", url: "/registration-approvals" }] : []),
        ].filter(Boolean),
      },
      {
        title: "Results & Grading",
        icon: Award,
        items: [
          ...(role === "school-admin" || role === "super-admin" || role === "instructor" ? [{ title: "Result Management", url: "/results" }, { title: "Grading Templates", url: "/grading-template" }, { title: "Grade Templates", url: "/grade-templates" }] : []),
          ...(role === "student" ? [{ title: "Result Checker", url: "/result-checker" }] : []),
        ].filter(Boolean),
      },
      {
        title: "Attendance Management",
        icon: Radio,
        items: [
          ...(role === "school-admin" || role === "super-admin" || role === "instructor" ? [{ title: "Attendance Records", url: "/attendance" }] : []),
          ...(role === "school-admin" || role === "super-admin" ? [{ title: "Device Management", url: "/device-management" }] : []),
        ].filter(Boolean),
      },
      {
        title: "Reports & Analytics",
        icon: FileText,
        url: "/analytics",
      },
      {
        title: "Settings",
        icon: Settings,
        items: [{ title: "Profile Settings", url: "/profile-settings" }],
      },
    ];

    // Filter out empty groups
    return allItems.filter(item =>
      !item.items || item.items.length > 0
    );
  };

  const adminRoutes: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: Home,
      url: "/admin/",
    },
    {
      title: "User Management",
      icon: Users,
      items: [
        { title: "Students", url: "/admin/students" },
        { title: "Instructors", url: "/admin/instructors" },
        { title: "Course Registrations", url: "/admin/course-registrations" },
        { title: "Results", url: "/admin/results" },
        { title: "Applicants", url: "/admin/applicants" },
      ]
    },
    {
      title: "Finance",
      icon: Wallet,
      items: [
        { title: "Payables", url: "/admin/payables" },
      ]
    },
    {
      title: "Academic Structure", icon: Building, items: [
        { title: "Faculties", url: "/admin/faculties" },
        { title: "Departments", url: "/admin/departments" },
        { title: "Courses", url: "/admin/courses" },
        { title: "Grading Templates", url: "/admin/grading-templates" },
        { title: "School Settings", url: "/admin/settings" },
      ]
    },
  ]
  // const menuItems = [
  //   { id: 'dashboard', icon: Home, label: 'Dashboard' },
  //   { id: 'course-registration', icon: BookOpen, label: 'Course Registration' },
  //   { id: 'application-slip', icon: FileText, label: 'Application Slip' },
  //   { id: 'result-checker', icon: FileText, label: 'Result Checker' },
  //   { id: 'result-analysis', icon: BookOpen, label: 'Result Analysis' },
  //   { id: 'student-manual', icon: Book, label: 'Student Manual' },
  //   { id: 'payment', icon: CreditCard, label: 'Payment' },
  //   { id: 'department-change', icon: ArrowRightLeft, label: 'Department Change' },
  //   { id: 'account-settings', icon: Settings, label: 'Account Settings' },
  // ];
  const studentRoutes: SidebarItem[] = [
    { title: "Dashboard", icon: Home, url: "/student/" },
    { title: "Course Registration", icon: BookOpen, url: "/student/course-registration" },
    { title: "Results", icon: FileText, url: "/student/results" },
    { title: "Wallet", icon: Wallet, url: "/student/wallet" },
    { title: "Settings", icon: Settings, url: "/student/settings" },
  ]

  //instructor routes
  const instructorRoutes: SidebarItem[] = [
    { title: "Dashboard", icon: Home, url: "/instructor/" },
    { title: "Courses", icon: BookOpen, url: "/instructor/courses" },
    { title: "Settings", icon: Settings, url: "/instructor/settings" },
  ]

  const filteredSidebarItems = user?.role === 'school-admin' ? adminRoutes : (user?.role === 'student' ? studentRoutes : (user?.role === 'instructor' ? instructorRoutes : getFilteredSidebarItems()));

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full" style={{ backgroundColor: 'var(--omack-bg-lighter)' }}>
        <Sidebar className="sidebar-container">
          <SidebarHeader style={{ background: 'linear-gradient(135deg, #165c4b 0%, #1e9a6f 100%)', borderBottom: '2px solid rgba(0,0,0,0.1)' }} className="p-4">
            <div className="flex items-center gap-3">
              <div 
                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                style={{ background: 'rgba(0,0,0,0.2)' }}
              >
                O'
              </div>
              <div>
                <h2 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                  O'Mark Portal
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', margin: 0, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 500 }}>
                  School of Health
                </p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredSidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {item.items ? (
                        <>
                          <SidebarGroupLabel className="sidebar-group-label">
                            <item.icon className="mr-2 h-3.5 w-3.5" />
                            {item.title}
                          </SidebarGroupLabel>
                          <SidebarMenu className="ml-2">
                            {item.items?.map((subItem) => (
                              <SidebarMenuItem key={subItem.url}>
                                <SidebarMenuButton
                                  asChild
                                  isActive={location.pathname === subItem.url}
                                  className={location.pathname === subItem.url ? 'active' : ''}
                                  style={location.pathname === subItem.url ? { 
                                    backgroundColor: 'var(--omack-primary-light)', 
                                    color: 'white',
                                    borderLeft: '4px solid var(--omack-accent)',
                                    fontWeight: 600
                                  } : {
                                    color: 'var(--omack-text-primary)',
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  <Link to={subItem.url}>{subItem.title}</Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === item.url}
                          className={location.pathname === item.url ? 'active' : 'sidebar-menu-item'}
                          style={location.pathname === item.url ? { 
                            backgroundColor: 'var(--omack-primary-light)', 
                            color: 'white',
                            fontWeight: 600,
                            borderLeft: '4px solid var(--omack-accent)'
                          } : {
                            color: 'var(--omack-text-primary)',
                            margin: '0.25rem 0.5rem',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 1rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Link to={item.url!}>
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col">
          <header 
            className="sticky top-0 z-40 backdrop-blur-sm shadow-sm border-b"
            style={{ 
              background: 'var(--omack-bg-white)',
              borderColor: 'var(--omack-border-light)'
            }}
          >
            <div className="flex items-center h-16 px-3 md:px-6 gap-3">
              <SidebarTrigger className="-ml-1" style={{ color: 'var(--omack-text-primary)' }} />
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #165c4b 0%, #1e9a6f 100%)' }}
                >
                  O'
                </div>
                <div className="hidden sm:flex flex-col leading-tight">
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--omack-text-primary)' }}>O'Mark</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--omack-text-light)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Portal</div>
                </div>
              </div>

              {/* Separator */}
              <div style={{ height: '24px', width: '1px', background: 'var(--omack-border-light)', margin: '0 0.5rem' }} />

              {/* center - responsive search */}
              <div className="flex-1 px-2 min-w-0 hidden md:block">
                <div 
                  className="flex items-center rounded-lg px-3 py-2 w-full max-w-2xl mx-auto border"
                  style={{ 
                    background: 'var(--omack-bg-lighter)',
                    borderColor: 'var(--omack-border-light)'
                  }}
                >
                  <Search className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--omack-text-light)', marginRight: '0.5rem' }} />
                  <input
                    className="flex-1 bg-transparent text-sm focus:outline-none min-w-0"
                    placeholder="Search..."
                    style={{ color: 'var(--omack-text-primary)' }}
                    aria-label="Global search"
                  />
                </div>
              </div>

              <div className="ml-3 flex items-center gap-3 flex-shrink-0">
                <div className="hidden sm:flex flex-col text-right mr-2 max-w-[140px] min-w-0">
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--omack-text-primary)' }} className="truncate">{user?.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--omack-text-light)', textTransform: 'uppercase', letterSpacing: '0.3px' }} className="truncate">{user?.role}</span>
                </div>
                <div 
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #165c4b 0%, #1e9a6f 100%)' }}
                >
                  {((user?.name || '') as string).split(' ').map(n => n?.[0]).slice(0, 2).join('') || 'U'}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout} 
                  className="ml-1"
                  style={{ 
                    color: 'var(--omack-primary)',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
