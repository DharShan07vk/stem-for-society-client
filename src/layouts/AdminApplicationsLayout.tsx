import { Tabs } from "@mantine/core";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const tabs = [
  { url: "/admin/applications", title: "Individual Applications" },
  {
    url: "/admin/applications/institutions",
    title: "Institution Applications",
  },
  { url: "/admin/applications/ca-programs", title: "Campus Ambassador" },
];

export default function AdminApplicationsLayout() {
  const navigate = useNavigate();

  return (
    <div className="p-3 w-full">
      <div className="p-4 space-y-3 h-full">
        <h4 className="text-3xl font-semibold">Applications</h4>
        <p className="text-gray-700">
          Contains all applications for STEM 4 SOCIETY programs
        </p>
      </div>
      <Tabs onChange={(url) => navigate(url!)}>
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.url} value={tab.url}>
              <NavLink
                to={tab.url}
                end
                className={({ isActive }) =>
                  isActive ? `font-semibold text-blue-600` : ""
                }
              >
                {tab.title}
              </NavLink>
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <div className="flex w-full justify-center items-center">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
}
