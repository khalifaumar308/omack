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
} from "lucide-react";
import { Link, useLocation, Outlet } from "react-router";
// import { UserProvider } from "@/contexts/UserContext";
import { useUser } from "@/contexts/useUser";
import { userLogout } from "@/lib/api/base";
import { Button } from "@/components/ui/button";


// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

export function DashboardLayout() {
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

  const getFilteredSidebarItems = () => {
    if (!user) return []; // Loading or error, show nothing
    const role = user.role;
    const allItems = [
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

    const adminRoutes = [
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

  const filteredSidebarItems = user?.role === 'school-admin' ? adminRoutes : (user?.role==='student'?[]:getFilteredSidebarItems());

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
                            {item.items.map((subItem) => (
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
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
            <div className="flex items-center align-middle gap-2">
              <SidebarTrigger className="-ml-1" />
              <p className="hidden md:flex text-sm font-bold">{user?.school?.name}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm font-medium">{user?.name}</span>
              <Button className="bg-red-500 text-white" variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
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
