import { Badge, Button, Input } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Errorbox from "../../components/Errorbox";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { api } from "../../lib/api";
import { GenericError, GenericResponse } from "../../lib/types";
import { formatDate, mutationErrorHandler } from "../../lib/utils";

export type PartnerTraining = {
  id: string;
  title: string;
  description: string | null;
  coverImg: string | null;
  link: string | null;
  startDate: Date | null;
  endDate: Date | null;
  durationValue: string;
  durationType: "Weeks" | "Days" | "Months" | "Hours";
  type: "ONLINE" | "OFFLINE" | "HYBRID";
  location: string | null;
  cost: string | null;
  cut: number | null;
  ratings?: {
    userId: string;
    trainingId: string;
    rating: number;
    feedback: string;
  }[];
  createdBy: string | null;
  approvedBy: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  category: string | null;
  lessons: {
    id: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    title: string;
    location: string | null;
    type: "ONLINE" | "OFFLINE";
    trainingId: string | null;
    content: string | null;
    video: string | null;
    lastDate: Date | null;
  }[];
};

export type PartnerTrainingResponse = PartnerTraining & {
  instructor: {
    firstName: string;
    lastName?: string;
  };
  enrolments: {
    id: number;
  }[];
};

function usePartnerTrainings() {
  return useQuery<
    GenericResponse<PartnerTrainingResponse[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["partner", "trainings"],
    queryFn: async () => {
      return (await api("partnerAuth").get("/partner/trainings")).data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export default function PartnerTrainings() {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string | undefined>();
  const { data, isPending, error } = usePartnerTrainings();

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
  }, [data, search]);

  useEffect(() => {
    if (error) mutationErrorHandler(error, navigate, "/partner/signin");
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [error]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-in slide-in-from-left duration-500">
          <h1 className="text-3xl font-semibold text-gray-900">Your Trainings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and monitor your training courses</p>
        </div>
        <div className="flex items-center gap-3 animate-in slide-in-from-right duration-500">
          <Input
            leftSection={<Search size={16} />}
            className="w-64"
            onChange={(e) => setSearch(e.target.value)}
            radius="md"
            placeholder="Search trainings..."
            type="search"
            classNames={{
              input: "transition-all duration-200 focus:shadow-sm",
            }}
          />
          <Link to={"/partner/create"}>
            <Button
              size="md"
              radius="md"
              leftSection={<Plus size={18} />}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-md"
            >
              Create Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-500 delay-100">
        {error ? (
          <Errorbox message={error.message} />
        ) : !error && isPending ? (
          <Loading />
        ) : (
          data && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <Table
                headers={[
                  { render: "S.No", className: "w-[6%] text-left pl-4" },
                  { render: "Course Name", className: "text-left" },
                  { render: "Enrollments", className: "text-center w-[12%]" },
                  { render: "Duration", className: "text-left" },
                  { render: "Status", className: "text-center w-[10%]" },
                  { render: "Actions", className: "w-[12%] text-center" },
                ]}
                classNames={{
                  root: "bg-white",
                  header: "bg-gray-50",
                  body: "divide-y divide-gray-100",
                  row: "hover:bg-gray-50 transition-colors duration-150",
                }}
                rows={filteredTrainings.map((r, i) => ({
                  id: r.id,
                  cells: [
                    {
                      render: <span className="text-gray-600 font-medium">{i + 1}</span>,
                      className: "text-left pl-4",
                    },
                    {
                      render: (
                        <div>
                          <div className="font-medium text-gray-900">{r.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            by {r.instructor.firstName} {r.instructor.lastName || ""}
                          </div>
                        </div>
                      ),
                      className: "text-left",
                    },
                    {
                      render: (
                        <div className="flex items-center justify-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                            {r.enrolments?.length ?? 0}
                          </span>
                        </div>
                      ),
                      className: "text-center",
                    },
                    {
                      render: (
                        <div className="text-sm text-gray-700">
                          <div>{formatDate(r.startDate)}</div>
                          <div className="text-xs text-gray-500">to {formatDate(r.endDate)}</div>
                        </div>
                      ),
                      className: "text-left",
                    },
                    {
                      render: (
                        <div className="flex justify-center">
                          <Badge
                            color={r.approvedBy ? "green" : "yellow"}
                            variant="light"
                            size="md"
                            radius="sm"
                            classNames={{ label: "font-medium capitalize" }}
                          >
                            {r.approvedBy ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                      ),
                      className: "text-center",
                    },
                    {
                      render: (
                        <div className="flex justify-center">
                          <Link to={`/partner/trainings/${r.id}`}>
                            <Button
                              size="sm"
                              radius="md"
                              variant="light"
                              className="hover:bg-blue-50 transition-colors duration-200"
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      ),
                      className: "text-center",
                    },
                  ],
                }))}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
