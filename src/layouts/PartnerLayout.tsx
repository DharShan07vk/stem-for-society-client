import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";
import { usePartner } from "../lib/hooks";

const PartnerNavLinks = [
  {
    label: "HOME",
    url: "/partner",
  },
  {
    label: "STUDENTS",
    url: "/partner/students",
  },
  {
    label: "TRAININGS",
    url: "/partner/trainings",
  },
  {
    label: "SETTINGS",
    url: "/partner/settings",
  },
];

export default function PartnerLayout() {
  const { signOut, user } = usePartner();
  const navigate = useNavigate();
  const shouldRedirect = location.pathname.endsWith("/signup");

  useEffect(() => {
    if (!user && !shouldRedirect) {
      navigate("/partner-signin");
      return;
    }

    /** Disabling extra safety check to ensure partner does not use other pages while they are yet to be approved */
    if (user?.user.isApproved === false) {
      navigate("/partner");
      return;
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [user]);

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-[0.2fr_0.86fr]">
      <SideNavbar
        user={user?.user}
        links={
          user?.user.isApproved
            ? PartnerNavLinks
            : [{ label: "HOME", url: "/partner" }]
        }
        logoutFn={signOut}
        type="partner"
      />
      <div className="bg-gray-50 p-2 lg:p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
