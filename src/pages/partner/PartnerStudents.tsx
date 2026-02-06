import { Button, Input } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Search } from "lucide-react";
import Loading from "../../components/Loading";
import PartnerErrorHandler from "../../components/PartnerErrorHandler";
import Table from "../../components/Table";
import { api } from "../../lib/api";
import { GenericError, GenericResponse } from "../../lib/types";
import { useMemo, useState } from "react";

type PartnerStudents = {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  mobile:string;
};

function usePartnerStudents() {
  return useQuery<GenericResponse<PartnerStudents[]>, AxiosError<GenericError>>(
    {
      queryKey: ["partner", "students"],
      queryFn: async () => {
        return (await api("partnerAuth").get("/partner/students")).data;
      },
      staleTime: 1000 * 60 * 5,
    },
  );
}

export default function PartnerStudents() {
  const { data, isLoading, error } = usePartnerStudents();
  const [search, setSearch] = useState<string | undefined>();
  const filteredStudents = useMemo(() => {
    if (!data) return [];
    return data.data.filter(
      (d) =>
        d.firstName
          .toLowerCase()
          .trim()
          .includes(search?.toLowerCase() || "") ||
        d.lastName
          ?.toLowerCase()
          .trim()
          .includes(search?.toLowerCase() || "") ||
        d.email
          .toLowerCase()
          .trim()
          .includes(search?.toLowerCase() || "") ||
        d.mobile
          .toLowerCase()
          .trim()
          .includes(search?.toLowerCase() || ""),
    );
  }, [data, search]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) return <PartnerErrorHandler error={error} />;

  const students = data?.data;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-in slide-in-from-left duration-500">
          <h1 className="text-3xl font-semibold text-gray-900">Students</h1>
          <p className="text-sm text-gray-600 mt-1">View all enrolled students in your courses</p>
        </div>
        <div className="animate-in slide-in-from-right duration-500">
          <Input
            leftSection={<Search size={16} />}
            className="w-64"
            placeholder="Search students..."
            value={search}
            radius="md"
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            classNames={{
              input: "transition-all duration-200 focus:shadow-sm",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-500 delay-100">
        {!students || students.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No students found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <Table
              headers={[
                { id: 1, render: "S.No", className: "w-[8%] text-left pl-4" },
                { id: 2, render: "Name", className: "text-left" },
                { id: 3, render: "Email", className: "text-left" },
                { id: 5, render: "Phone Number", className: "w-[15%] text-center" },
              ]}
              classNames={{
                root: "bg-white",
                header: "bg-gray-50",
                body: "divide-y divide-gray-100",
                row: "hover:bg-gray-50 transition-colors duration-150",
              }}
              rows={filteredStudents.map((r, i) => ({
                id: r.id,
                cells: [
                  {
                    render: <span className="text-gray-600 font-medium">{i + 1}</span>,
                    className: "text-left pl-4",
                  },
                  {
                    render: (
                      <div className="font-medium text-gray-900">
                        {r.firstName} {r.lastName || ""}
                      </div>
                    ),
                    className: "text-left",
                  },
                  {
                    render: <div className="text-sm text-gray-700">{r.email}</div>,
                    className: "text-left",
                  },
                  {
                    render: (
                      <div className="flex justify-center">
                        {r.mobile} 
                      </div>
                    ),
                    className: "text-center",
                  },
                ],
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
