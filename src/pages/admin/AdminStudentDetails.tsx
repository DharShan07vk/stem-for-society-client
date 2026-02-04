import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button, Text } from "@mantine/core";
import { ChevronLeft } from "lucide-react";
import Errorbox from "../../components/Errorbox";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { api } from "../../lib/api";
import { GenericError, GenericResponse } from "../../lib/types";
import { formatDate, mutationErrorHandler } from "../../lib/utils";
import { AdminTrainingDetails } from "./AdminTrainingSpotlight";

export type AdminStudentDetailsType = {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  mobile: string;
  enrolments: {
    id: string;
    completedOn: Date | null;
    userId: string;
    trainingId: string;
    createdAt: string;
    training: Omit<AdminTrainingDetails, "enrolments" | "instructor">;
  }[];
};

function useAdminStudentDetailsType(id: string) {
  return useQuery<
    GenericResponse<AdminStudentDetailsType>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "students", id],
    queryFn: async () =>
      (await api("adminAuth").get(`/admin/students/${id}`)).data,
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

function AdminStudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useAdminStudentDetailsType(id || "");

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

  const student = data?.data;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="subtle"
          leftSection={<ChevronLeft size={18} />}
          radius="md"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <Text size="xs" c="dimmed" className="uppercase tracking-wide mb-1">
              Full Name
            </Text>
            <Text size="lg" fw={600} className="text-gray-900">
              {student?.firstName + " " + (student?.lastName ?? "")}
            </Text>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <Text size="xs" c="dimmed" className="uppercase tracking-wide mb-1">
              Email Address
            </Text>
            <Text size="lg" fw={600} className="text-gray-900">
              {student?.email}
            </Text>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <Text size="xs" c="dimmed" className="uppercase tracking-wide mb-1">
              Phone Number
            </Text>
            <Text size="lg" fw={600} className="text-gray-900">
              {student?.mobile}
            </Text>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Courses Enrolled
          </h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table
              headers={[
                { render: "S.No", className: "w-[6%] text-left pl-4" },
                { render: "Course Name", className: "text-left" },
                { render: "Enrolled On", className: "text-left" },
                { render: "Schedule", className: "text-left" },
                { render: "Actions", className: "w-[12%] text-center" },
              ]}
              classNames={{
                root: "bg-white",
                header: "bg-gray-50",
                body: "divide-y divide-gray-100",
                row: "hover:bg-gray-50 transition-colors",
              }}
              rows={student!.enrolments.map((r, i) => ({
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
                        {r.training.title}
                      </span>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <span className="text-gray-600 text-sm">
                        {formatDate(r.createdAt)}
                      </span>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <span className="text-gray-700 text-sm">
                        {formatDate(r.training.startDate)} -{" "}
                        {formatDate(r.training.endDate)}
                      </span>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <Link to={`/admin/trainings/${r.training.id}`}>
                        <Button size="xs" variant="light" radius="md">
                          View Course
                        </Button>
                      </Link>
                    ),
                    className: "text-center",
                  },
                ],
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStudentDetails;
