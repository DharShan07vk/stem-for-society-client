import { Button, Input, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Errorbox from "../../components/Errorbox";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { api } from "../../lib/api";
import { GenericError, GenericResponse } from "../../lib/types";
import { mutationErrorHandler } from "../../lib/utils";
import { Search } from "lucide-react";

export type AdminStudents = {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  mobile: string;
};

export type AdminStudentsType = AdminStudents & {
  trainings:
    | {
        id: string;
      }[]
    | null;
};

function useAdminStudents() {
  return useQuery<
    GenericResponse<AdminStudentsType[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "students"],
    queryFn: async () => (await api("adminAuth").get("/admin/students")).data,
    staleTime: 1000 * 60 * 5,
  });
}

export default function AdminStudents() {
  const { data, isLoading, error } = useAdminStudents();
  const [search, setSearch] = useState<string | undefined>();
  const navigate = useNavigate();

  const filteredStudents = useMemo(() => {
    if (!data) return [];
    return data.data.filter(
      (d) =>
        d.firstName
          .toLowerCase()
          .trim()
          .includes(search || "") ||
        d.lastName
          ?.toLowerCase()
          .trim()
          .includes(search || "") ||
        d.email
          .toLowerCase()
          .trim()
          .includes(search || "") ||
        d.mobile
          .toLowerCase()
          .trim()
          .includes(search || ""),
    );
  }, [data, search]);

  useEffect(() => {
    if (error) mutationErrorHandler(error, navigate, "/admin/signin");
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [error]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Errorbox message={error.message} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Students</h1>
            <Text size="sm" c="dimmed" className="text-gray-500">
              Manage and view all registered students
            </Text>
          </div>
          <Input
            leftSection={<Search size={18} />}
            placeholder="Search students..."
            type="search"
            value={search}
            radius="md"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80"
            classNames={{
              input: "h-10",
            }}
          />
        </div>
        {!data ? (
          <Errorbox message="Cannot get data due to some unknown error" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table
              headers={[
                { render: "S.No", className: "w-[8%] text-left pl-4" },
                { render: "Name", className: "text-left" },
                { render: "Email", className: "text-left" },
                { render: "Mobile", className: "text-left" },
                { render: "Actions", className: "w-[15%] text-center" },
              ]}
              classNames={{
                root: "bg-white",
                header: "bg-gray-50",
                body: "divide-y divide-gray-100",
                row: "hover:bg-gray-50 transition-colors",
              }}
              rows={filteredStudents.map((r, i) => ({
                id: r.id,
                cells: [
                  {
                    render: (
                      <span className="text-gray-600 font-medium">{i + 1}</span>
                    ),
                    className: "text-left pl-4",
                  },
                  {
                    render: (
                      <span className="font-medium text-gray-900">
                        {r.firstName + " " + (r.lastName ?? "")}
                      </span>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <span className="text-gray-700 text-sm">{r.email}</span>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <span className="text-gray-700 text-sm">{r.mobile}</span>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <Link to={`/admin/students/${r.id}`}>
                        <Button
                          size="xs"
                          variant="light"
                          radius="md"
                          className="font-medium"
                        >
                          View Details
                        </Button>
                      </Link>
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
