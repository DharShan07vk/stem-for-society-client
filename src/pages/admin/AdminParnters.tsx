import { Badge, Button, Input, Text } from "@mantine/core";
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

export type AdminPartners = {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  mobile: string;
  trainingTopic?: string | null;
  trainingDays?: string | null;
  institutionName: string | null;
  addressId: number;
  approvedBy: string | null;
};

export type AdminPartnersType = AdminPartners & {
  trainings:
    | {
        id: string;
      }[]
    | null;
};

function useAdminPartners() {
  return useQuery<
    GenericResponse<AdminPartnersType[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "partners"],
    queryFn: async () => (await api("adminAuth").get("/admin/partners")).data,
    staleTime: 1000 * 60 * 5,
  });
}

export default function AdminPartners() {
  const { data, isLoading, error } = useAdminPartners();
  const [search, setSearch] = useState<string | undefined>();
  const navigate = useNavigate();

  const filteredPartners = useMemo(() => {
    if (!data) return [];
    return data.data.filter(
      (partner) =>
        partner.firstName.toLowerCase().includes(search?.toLowerCase() || "") ||
        (partner.lastName &&
          partner.lastName
            .toLowerCase()
            .includes(search?.toLowerCase() || "")) ||
        partner.email.toLowerCase().includes(search?.toLowerCase() || "") ||
        partner.mobile.includes(search || "") ||
        (partner.institutionName &&
          partner.institutionName
            .toLowerCase()
            .includes(search?.toLowerCase() || "")),
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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Partners</h1>
            <Text size="sm" c="dimmed" className="text-gray-500">
              Manage partner instructors and institutions
            </Text>
          </div>
          <Input
            leftSection={<Search size={18} />}
            placeholder="Search partners..."
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            radius="md"
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
                { render: "Institution", className: "text-left" },
                { render: "Status", className: "text-center" },
                { render: "Actions", className: "w-[12%] text-center" },
              ]}
              classNames={{
                root: "bg-white",
                header: "bg-gray-50",
                body: "divide-y divide-gray-100",
                row: "hover:bg-gray-50 transition-colors",
              }}
              rows={filteredPartners.map((r, i) => ({
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
                    render: r.institutionName ? (
                      <span className="text-gray-700 text-sm">
                        {r.institutionName}
                      </span>
                    ) : (
                      <Badge variant="light" color="blue" size="sm">
                        Individual
                      </Badge>
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
                      <Link to={`/admin/partners/${r.id}`}>
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
