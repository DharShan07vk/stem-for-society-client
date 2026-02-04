import { Alert, Button, Input, Modal, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Errorbox from "../../components/Errorbox";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { api } from "../../lib/api";
import { GenericError, GenericResponse } from "../../lib/types";
import { formatDate, mutationErrorHandler } from "../../lib/utils";
import LabelAndValue from "../../components/LabelAndValue";

type AdminCAApplications = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  mobile: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  linkedin: string | null;
  eduType: "UG" | "PG" | "PhD";
  department: string;
  collegeName: string;
  yearInCollege: number | null;
  collegeCity: string;
  dob: string | null;
};

function useAdminCampusAmbassador() {
  return useQuery<
    GenericResponse<AdminCAApplications[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "enquiry", "ca"],
    queryFn: async () =>
      (await api("adminAuth").get("/admin/applications/ca")).data,
    staleTime: 1000 * 60 * 5,
  });
}

export default function AdminCampusAmbassador() {
  const { data, isLoading, error } = useAdminCampusAmbassador();
  const [search, setSearch] = useState<string | undefined>();
  const [activeAmbId, setActiveAmbId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredCampusAmbassador = useMemo(() => {
    if (!data) return [];
    return data.data.filter(
      (registration) =>
        registration.firstName
          .toLowerCase()
          .includes(search?.toLowerCase() || "") ||
        registration.lastName
          ?.toLowerCase()
          .includes(search?.toLowerCase() || "") ||
        registration.email
          .toLowerCase()
          .includes(search?.toLowerCase() || "") ||
        registration.mobile.toLowerCase().includes(search?.toLowerCase() || ""),
    );
  }, [data, search]); // Filter campusAmbassador based on search input

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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Campus Ambassador Applications
            </h1>
            <Text size="sm" c="dimmed" className="text-gray-500">
              Review campus ambassador program applications
            </Text>
          </div>
          <Input
            leftSection={<Search size={18} />}
            radius="md"
            placeholder="Search applications..."
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
                { render: "Name", className: "text-left" },
                { render: "Email", className: "text-left" },
                { render: "Mobile", className: "text-left" },
                { render: "Registered On", className: "text-left" },
                { render: "Actions", className: "w-[12%] text-center" },
              ]}
              classNames={{
                root: "bg-white",
                header: "bg-gray-50",
                body: "divide-y divide-gray-100",
                row: "hover:bg-gray-50 transition-colors",
              }}
              rows={filteredCampusAmbassador.map((r, i) => ({
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
                      <span className="text-gray-600 text-sm">
                        {formatDate(r.createdAt)}
                      </span>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <Button
                        size="xs"
                        variant="light"
                        radius="md"
                        onClick={() => setActiveAmbId(r.id)}
                      >
                        View Details
                      </Button>
                    ),
                    className: "text-center",
                  },
                ],
              }))}
            />
          </div>
        )}
      </div>
      <Modal
        size="xl"
        centered
        title={
          <Text fw={600} size="lg">
            {data?.data.find((amb) => amb.id === activeAmbId)?.firstName +
              " Details"}
          </Text>
        }
        onClose={() => setActiveAmbId(null)}
        opened={!!activeAmbId}
        classNames={{
          content: "rounded-xl",
          header: "border-b border-gray-200 pb-4",
        }}
      >
        {(() => {
          const currentAmb = data?.data.find((amb) => amb.id === activeAmbId);
          if (!currentAmb)
            return <Alert color="red" title="Invalid ambassador selected" />;
          return (
            <div className="space-y-6 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabelAndValue
                  label="Full Name"
                  value={
                    currentAmb.firstName + " " + (currentAmb.lastName ?? "")
                  }
                />
                <LabelAndValue label="Email" value={currentAmb.email} />
                <LabelAndValue label="Mobile" value={currentAmb.mobile} />
                <LabelAndValue
                  label="Education Type"
                  value={currentAmb.eduType}
                />
                <LabelAndValue
                  label="Date of Birth"
                  value={formatDate(currentAmb.dob)}
                />
                <LabelAndValue
                  label="LinkedIn"
                  value={currentAmb.linkedin || "N/A"}
                />
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  College Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LabelAndValue
                    label="College Name"
                    value={currentAmb.collegeName}
                  />
                  <LabelAndValue
                    label="City"
                    value={currentAmb.collegeCity}
                  />
                  <LabelAndValue
                    label="Year"
                    value={currentAmb.yearInCollege || "N/A"}
                  />
                  <LabelAndValue
                    label="Department"
                    value={currentAmb.department}
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <LabelAndValue
                  label="Registered On"
                  value={formatDate(currentAmb.createdAt)}
                />
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
