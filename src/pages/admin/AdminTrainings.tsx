import { useQuery } from "@tanstack/react-query";
import Table from "../../components/Table";
import { PartnerTrainingResponse } from "../partner/PartnerTrainings";
import { api } from "../../lib/api";
import { GenericError, GenericResponse } from "../../lib/types";
import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { formatDate, mutationErrorHandler } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import Errorbox from "../../components/Errorbox";
import { Badge, Button, Input, Text } from "@mantine/core";
import { Calendar1, CalendarCheckIcon, Search } from "lucide-react";

type AdminTrainingsType = PartnerTrainingResponse;

function useAdminTrainings() {
  return useQuery<
    GenericResponse<AdminTrainingsType[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "trainings"],
    queryFn: async () => (await api("adminAuth").get("/admin/trainings")).data,
    staleTime: 1000 * 60 * 5,
  });
}

export default function AdminTrainings() {
  const { data, isLoading, error } = useAdminTrainings();
  const [search, setSearch] = useState<string | undefined>();
  const navigate = useNavigate();

  const filteredTrainings = useMemo(() => {
    if (!data) return [];
    return data.data.filter(
      (training) =>
        training.title.toLowerCase().includes(search?.toLowerCase() || "") ||
        training.instructor.firstName
          .toLowerCase()
          .includes(search?.toLowerCase() || "") ||
        (training.instructor.lastName &&
          training.instructor.lastName
            .toLowerCase()
            .includes(search?.toLowerCase() || "")) ||
        training.enrolments?.length.toString().includes(search || ""),
    );
  }, [data, search]); // Filter trainings based on search input

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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Trainings</h1>
            <Text size="sm" c="dimmed" className="text-gray-500">
              Manage and review training courses
            </Text>
          </div>
          <Input
            leftSection={<Search size={18} />}
            radius="md"
            placeholder="Search trainings..."
            type="search"
            value={search}
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
                { render: "S.No", className: "w-[6%] text-left pl-4" },
                { render: "Course Name", className: "text-left" },
                { render: "Instructor", className: "text-left" },
                { render: "Enrolments", className: "text-center" },
                { render: "Schedule", className: "text-left" },
                { render: "Status", className: "text-center" },
                { render: "Actions", className: "w-[12%] text-center" },
              ]}
              classNames={{
                root: "bg-white",
                header: "bg-gray-50",
                body: "divide-y divide-gray-100",
                row: "hover:bg-gray-50 transition-colors",
              }}
              rows={filteredTrainings.map((r, i) => ({
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
                      <span className="font-medium text-gray-900 line-clamp-2">
                        {r.title}
                      </span>
                    ),
                    className: "text-left max-w-xs",
                  },
                  {
                    render: (
                      <span className="text-gray-700 text-sm">
                        {r.instructor.firstName +
                          " " +
                          (r.instructor.lastName ?? "")}
                      </span>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <Badge variant="light" color="blue" size="sm">
                        {r.enrolments?.length ?? 0}
                      </Badge>
                    ),
                    className: "text-center",
                  },
                  {
                    render: (
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-1 text-gray-700">
                          <Calendar1 size={14} />
                          <span>{formatDate(r.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <CalendarCheckIcon size={14} />
                          <span>{formatDate(r.endDate)}</span>
                        </div>
                      </div>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <Badge
                        color={r.approvedBy ? "green" : "yellow"}
                        variant="light"
                        size="sm"
                      >
                        {r.approvedBy ? "Approved" : "Pending"}
                      </Badge>
                    ),
                    className: "text-center",
                  },
                  {
                    render: (
                      <Link to={`/admin/trainings/${r.id}`}>
                        <Button size="xs" variant="light" radius="md">
                          View
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
