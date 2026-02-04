import { Avatar, Button, Menu, Text } from "@mantine/core";
import {
  BookOpen,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Settings,
  Users,
  UserCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAdmin } from "../lib/hooks";
import { cn } from "../lib/utils";
import { useEffect } from "react";

const AdminNavLinks = [
  {
    label: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    url: "/admin/students",
    icon: GraduationCap,
  },
  {
    label: "Trainings",
    url: "/admin/trainings",
    icon: BookOpen,
  },
  {
    label: "Partners",
    url: "/admin/partners",
    icon: Users,
  },
  {
    label: "Applications",
    url: "/admin/applications",
    icon: UserCheck,
  },
  {
    label: "Blogs",
    url: "/admin/blogs",
    icon: FileText,
  },
];

export default function AdminLayout() {
  const { user, signOut } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/admin/signin");
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [user]);

  const handleLogout = () => {
    signOut();
    navigate("/admin/signin");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex-shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 min-w-0">
              <img src={logo} alt="S4S Logo" className="h-10 w-auto flex-shrink-0" />
              <div className="min-w-0">
                <Text fw={700} size="sm" className="text-gray-900 truncate">
                  Admin Panel
                </Text>
                <Text size="xs" c="dimmed" className="text-gray-500 truncate">
                  STEM for Society
                </Text>
              </div>
            </Link>
            <Button
              variant="subtle"
              size="xs"
              className="lg:hidden flex-shrink-0"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>

          {/* User Info Section */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Avatar
                size="md"
                radius="md"
                className="bg-blue-100 text-blue-700 font-semibold flex-shrink-0"
              >
                {user.user.firstName[0].toUpperCase()}
                {user.user.lastName?.[0]?.toUpperCase() ?? ""}
              </Avatar>
              <div className="flex-1 min-w-0">
                <Text size="sm" fw={600} className="text-gray-900 truncate">
                  {user.user.firstName} {user.user.lastName ?? ""}
                </Text>
                <Text size="xs" c="dimmed" className="text-gray-500 truncate">
                  Administrator
                </Text>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
            {AdminNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                location.pathname === link.url ||
                (link.url !== "/admin" &&
                  location.pathname.startsWith(link.url));

              return (
                <NavLink
                  key={link.url}
                  to={link.url}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon
                    size={18}
                    className={cn(
                      "flex-shrink-0",
                      isActive ? "text-blue-600" : "text-gray-500"
                    )}
                  />
                  <Text size="sm" fw={isActive ? 600 : 400} className="truncate">
                    {link.label}
                  </Text>
                </NavLink>
              );
            })}
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <Button
              variant="subtle"
              color="red"
              fullWidth
              leftSection={<LogOut size={18} />}
              onClick={handleLogout}
              className="justify-start"
            >
              <Text size="sm" fw={500}>
                Logout
              </Text>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="subtle"
                size="sm"
                className="lg:hidden flex-shrink-0"
                onClick={() => setSidebarOpen(true)}
              >
                <MenuIcon size={20} />
              </Button>
              <Text size="lg" fw={600} className="text-gray-900 truncate">
                {AdminNavLinks.find((link) => {
                  if (link.url === "/admin") {
                    return location.pathname === "/admin";
                  }
                  return location.pathname.startsWith(link.url);
                })?.label || "Dashboard"}
              </Text>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <button className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1.5 transition-colors">
                    <Avatar
                      size="sm"
                      radius="md"
                      className="bg-blue-100 text-blue-700 font-semibold flex-shrink-0"
                    >
                      {user.user.firstName[0].toUpperCase()}
                      {user.user.lastName?.[0]?.toUpperCase() ?? ""}
                    </Avatar>
                    <div className="hidden md:block text-left min-w-0">
                      <Text size="xs" fw={600} className="text-gray-900 truncate">
                        {user.user.firstName} {user.user.lastName ?? ""}
                      </Text>
                      <Text size="xs" c="dimmed" className="text-gray-500 truncate">
                        Admin
                      </Text>
                    </div>
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item
                    leftSection={<Settings size={16} />}
                    onClick={() => navigate("/admin")}
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<LogOut size={16} />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
