import { ChevronRight, MenuIcon } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import logo from '../assets/logo.webp';
import { UserAuthResponse } from "../lib/types";
import { cn } from "../lib/utils";
import { useMemo } from "react";
import { Menu } from "@mantine/core";

type CommonNavbarProps = {
  links: {
    label: string;
    url: string;
  }[];
  logoutFn: () => void;
  user?: UserAuthResponse<"PARTNER" | "ADMIN">["user"];
  type: "admin" | "partner";
};

export default function SideNavbar({
  links,
  logoutFn,
  type,
  user,
}: CommonNavbarProps) {
  const menuItems = useMemo(
    () =>
      links.map((menuItem, i) => (
        <NavLink
          to={menuItem.url}
          className={({ isActive }) =>
            cn(" flex items-center gap-2 w-full py-2", {
              "font-semibold": isActive,
            })
          }
          key={i}
          end
        >
          {({ isActive }) => (
            <>
              <h4>{menuItem.label}</h4>
              {isActive ? <ChevronRight size={16} /> : ""}
            </>
          )}
        </NavLink>
      )),
    [links],
  );

  return (
    <nav
      aria-roledescription="Navigation bar"
      className="flex lg:flex-col lg:gap-6 bg-primary shadow-md border-r items-center py-2 lg:py-8 sticky lg:h-screen lg:pt-16 top-0 z-50"
    >
      <Link to={"/"}>
        <img src={logo}alt="S4S Logo" className="h-auto w-48" />
      </Link>

      {/* Avatar and Name */}
      {type === "partner" && !user ? (
        <h3 className="font-semibold text-lg">Partner dashboard</h3>
      ) : (
        <div className="flex gap-4 w-full items-center px-8 p-4">
          {/* <div className="h-8 w-8 aspect-square grid place-items-center text-sm bg-gray-200 rounded-full">
            {user ? (
              user.firstName[0].toUpperCase() +
              (user.lastName?.[0]?.toUpperCase() ?? "")
            ) : (
              <i></i>
            )}
          </div> */}
          <h3 className=" text-ellipsis">
            {user ? (
              user.firstName + " " + (user.lastName ?? "")
            ) : (
              <i className="text-gray-400 text-sm"></i>
            )}
          </h3>
        </div>
      )}

      {/* Menu Items */}
      <div className="flex lg:flex-col w-full px-8 gap-2">
        {user ? (
          <>
            <div className="hidden lg:grid lg:gap-2">{menuItems}</div>
            <div className="lg:hidden block ml-auto">
              <Menu width={200} withArrow trigger="click" shadow="lg">
                <Menu.Target>
                  <MenuIcon />
                </Menu.Target>
                <Menu.Dropdown className="p-3">
                  {menuItems}
                  <Link
                    to={"#"}
                    className="text-red-500 font-medium mt-auto"
                    onClick={logoutFn}
                  >
                    LOGOUT
                  </Link>
                </Menu.Dropdown>
              </Menu>
            </div>
          </>
        ) : (
          <>
            <NavLink
              to={(type === "admin" ? "/admin" : "/partner") + "/signin"}
              className={({ isActive }) =>
                cn(" flex items-center gap-2 w-full py-2", {
                  "font-semibold": isActive,
                })
              }
            >
              {({ isActive }) => (
                <>
                  <h4>Sign In</h4>
                  {isActive ? <ChevronRight size={16} /> : ""}
                </>
              )}
            </NavLink>
            {type === "partner" && (
              <NavLink
                to={"/partner" + "/signup"}
                className={({ isActive }) =>
                  cn(" flex items-center gap-2 w-full py-2", {
                    "font-semibold": isActive,
                  })
                }
              >
                {({ isActive }) => (
                  <>
                    <h4>Sign Up</h4>
                    {isActive ? <ChevronRight size={16} /> : ""}
                  </>
                )}
              </NavLink>
            )}
          </>
        )}
      </div>

      {user && (
        <Link
          to={"#"}
          className="text-red-500 font-medium mt-auto lg:block hidden"
          onClick={logoutFn}
        >
          LOGOUT
        </Link>
      )}
    </nav>
  );
}
