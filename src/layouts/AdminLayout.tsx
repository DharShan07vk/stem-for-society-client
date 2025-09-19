import { Outlet, useNavigate } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";
import { useAdmin } from "../lib/hooks";
import { useEffect } from "react";

const AdminNavLinks = [
  {
    label: "STUDENTS",
    url: "/admin/students",
  },
  {
    label: "TRAININGS",
    url: "/admin/trainings",
  },
  {
    label: "PARTNERS",
    url: "/admin/partners",
  },
  {
    label: "APPLICATIONS",
    url: "/admin/applications",
  },
  {
    label: "BLOGS",
    url: "/admin/blogs",
  },
];

export default function AdminLayout() {
  const { user, signOut } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/admin/signin");
    }

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [user]);

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-[0.2fr_0.86fr]">
      <SideNavbar
        links={AdminNavLinks}
        logoutFn={signOut}
        type="admin"
        user={user?.user}
      />
      <div className="bg-gray-50 p-2 lg:p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
