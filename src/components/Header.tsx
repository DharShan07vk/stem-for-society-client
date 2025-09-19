import { Avatar, Menu } from "@mantine/core";
import { ChevronDown, CircleUserIcon, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "/logo-01.png";
import { useUser } from "../lib/hooks";
import { parseAsBoolean, useQueryState } from "nuqs";

type BaseMenuItem = { label: string; href: string; onClick?: () => void };

const data: ((BaseMenuItem & { submenus: BaseMenuItem[] }) | BaseMenuItem)[] = [
  { label: "Home", href: "/" },
  {
    label: "Courses/Trainings",
    href: "/training",
    submenus: [
      {
        label: "Seminars/Webinar",
        value: "Seminars/Webinar/Mentorship",
      },
      { value: "Certificate+Program", label: "Certificate Program" },
      { value: "Corporate+Training", label: "Corporate Training" },
      { value: "Instrumentation+Hands-on", label: "Instrumentation Hands-on" },
    ].map((men) => ({
      label: men.label,
      href: `/training?filter=${men.value}`,
    })),
  },
  {
    label: "Services",
    href: "#",
    submenus: [
      {
        href: "/psychology-training",
        label: "Psychology Trainings",
      },
      {
        href: "/career-counselling",
        label: "Career Counselling",
      },
      {
        href: "/pricing",
        label: "Institution Plans & Pricing",
      },
    ],
  },
  {
    label: "Resources",
    href: "#",
    submenus: [
      { href: "/blogs", label: "Scientific Communications" },
      { label: "Join community", href: "/join-community" },
      { label: "Campus Ambassador (CA)", href: "ca-program" },
    ],
  },
];

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useUser();
  const [filterByMe, setFilterByMe] = useQueryState<boolean>(
    "me",
    parseAsBoolean,
  );

  const items = data.map((item) =>
    "submenus" in item ? (
      <Menu width={200} shadow="md" withArrow trigger="click-hover">
        <Menu.Target>
          <div
            className={`font-semibold flex items-center lg:gap-1 gap-3 cursor-pointer px-6 py-2 bg-sky-100 border-2 border-sky-400 rounded-full text-gray-600 hover:text-black transition-all ease-in-out`}
            onClick={item.onClick}
          >
            {item.href !== "#" ? (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => {
                  setIsOpen(false);
                  if (filterByMe && item.href === "/training") {
                    setFilterByMe(null);
                  }
                }}
              >
                {item.label}
              </NavLink>
            ) : (
              item.label
            )}
            <ChevronDown size={12} />
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          {item.submenus.map((sub) => (
            <Menu.Item
              key={sub.href}
              component={Link}
              className="font-medium tracking-wide"
              to={sub.href}
            >
              {sub.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    ) : (
      <NavLink
        key={item.label}
        to={item.href}
        onClick={() => setIsOpen(false)}
        className={({ isActive }) =>
          `px-6 transition-all py-2 rounded-full bg-sky-100 border-2 border-sky-400 ${
            isActive ? "text-black font-medium" : "text-gray-600"
          }`
        }
      >
        {item.label}
      </NavLink>
    ),
  );

  return (
    <div className="[backdrop-filter:blur(2px)] sticky w-full top-0 left-0 z-50">
      <div className="flex justify-between items-center px-6 py-4 mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="h-20" />
        </Link>

        {/* Mobile Menu Toggle */}

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center mx-auto">{items}</div>
        {user ? (
          <Menu width={200} shadow="md" withArrow trigger="hover">
            <Menu.Target>
              <div className="flex cursor-pointer items-center gap-2">
                <Avatar alt="User Avatar" radius="xl">
                  <CircleUserIcon size={25} />
                </Avatar>
                {user.user?.firstName || user.user?.email?.split('@')[0] || 'User'}
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                component={Link}
                // className="font-semibold"
                to={"/training"}
                onClick={() => setFilterByMe(true)}
              >
                My trainings
              </Menu.Item>
              <Menu.Item onClick={() => {
                // Clear any query filters that might persist
                setFilterByMe(null);
                signOut();
              }}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <>
            <Link
              to="/partner"
              className="font-medium hover:underline text-center md:px-5 px-3 py-2 text-blue-500 transition-all"
            >
              Partner With us
            </Link>
            <Link
              to="/login"
              className="font-semibold rounded-full text-center px-5 py-2 text-white bg-blue-500  hover:bg-blue-400 transition-all"
            >
              Login
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 md:hidden focus:outline-none"
            >
              {isOpen ? <X size={32} /> : <MenuIcon size={32} />}
            </button>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md absolute top-full z-[100] left-0 w-full">
          <div className="flex flex-col items-center py-4 gap-4">
            {items}
            {user ? (
              <>
                <Avatar alt="User Avatar" radius="xl">
                  <CircleUserIcon size={25} />
                </Avatar>
                {user.user?.firstName || user.user?.email?.split('@')[0] || 'User'}
              </>
            ) : (
              <Link
                to="/login"
                className="font-semibold rounded-full text-center px-5 py-2 text-white bg-blue-500  hover:bg-blue-400 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
