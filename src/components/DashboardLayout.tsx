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
  GraduationCap,
  Home,
  Settings,
  Users,
  FileText,
  Award,
  Building,
  Radio,
  Search,
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
    { title: "Settings", icon: Settings, url: "/student/settings" },
  ]

  //instructor routes
  const instructorRoutes: SidebarItem[] = [
    { title: "Dashboard", icon: Home, url: "/instructor/" },
    { title: "Courses", icon: BookOpen, url: "/instructor/courses" },
    { title: "Settings", icon: Settings, url: "/instructor/settings" },
  ]

  const filteredSidebarItems = user?.role === 'school-admin' ? adminRoutes : (user?.role==='student'?studentRoutes:(user?.role==='instructor'?instructorRoutes:getFilteredSidebarItems()));

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                SKOOL_MS
              </h2>
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
                          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.title}
                          </SidebarGroupLabel>
                          <SidebarMenu className="ml-4">
                            {item.items?.map((subItem) => (
                              <SidebarMenuItem key={subItem.url}>
                                <SidebarMenuButton
                                  asChild
                                  isActive={location.pathname === subItem.url}
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
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
            <div className="flex items-center h-16 px-3 md:px-6">
              <div className="flex items-center gap-3 flex-shrink-0">
                <SidebarTrigger className="-ml-1" />
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <div className="hidden sm:flex flex-col leading-tight">
                    <div className="text-sm font-semibold text-slate-800">SKOOL_MS</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{user?.school?.name}</div>
                  </div>
                </div>
              </div>

              {/* center - responsive search (min-w-0 allows truncation) */}
              <div className="flex-1 px-2 min-w-0">
                <div className="flex items-center bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 w-full max-w-2xl mx-auto">
                  <Search className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
                  <input
                    className="w-full bg-transparent text-sm focus:outline-none min-w-0 truncate"
                    placeholder="Search courses, students, pages..."
                    aria-label="Global search"
                  />
                </div>
              </div>

              <div className="ml-3 flex items-center gap-3 flex-shrink-0">
                <div className="hidden sm:flex flex-col text-right mr-2 max-w-[140px] min-w-0">
                  <span className="text-sm font-medium text-slate-700 truncate">{user?.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user?.role}</span>
                </div>
                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-medium flex-shrink-0">{((user?.name || '') as string).split(' ').map(n=>n?.[0]).slice(0,2).join('') || 'U'}</div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-1">
                  Logout
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            {/* <UserProvider> */}
            <Outlet />
            {/* </UserProvider> */}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
