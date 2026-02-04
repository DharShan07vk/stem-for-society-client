import { Badge, Input, Text } from "@mantine/core";
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

type AdminCareerCounselling = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  mobile: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  selectedDate : string,
  selectedTime : string,
  plan: "Basics" | "Premium" | null;
  service: string | null;
  transactions: {
    id: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    transactionId: string;
    careerId: string;
    transaction: {
      id: string;
      createdAt: Date | null;
      updatedAt: Date | null;
      txnNo: string | null;
      paymentId: string | null;
      orderId: string;
      signature: string | null;
      idempotencyId: string | null;
      amount: string;
      status: "pending" | "success" | "cancelled" | "failed" | null;
    };
  }[];
};

function useAdminCareerCounselling() {
  return useQuery<
    GenericResponse<AdminCareerCounselling[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "enquiry", "career"],
    queryFn: async () =>
      (await api("adminAuth").get("/admin/applications/career")).data,
    staleTime: 1000 * 60 * 5,
  });
}

export default function AdminCareerCounselling() {
  const { data, isLoading, error } = useAdminCareerCounselling();
  const [search, setSearch] = useState<string | undefined>();
  const navigate = useNavigate();

  const filteredPsychology = useMemo(() => {
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
  }, [data, search]); // Filter psychology based on search input

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
              Career Counselling Registrations
            </h1>
            <Text size="sm" c="dimmed" className="text-gray-500">
              Manage career counselling service registrations
            </Text>
          </div>
          <Input
            leftSection={<Search size={18} />}
            radius="md"
            placeholder="Search registrations..."
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
                { render: "Contact", className: "text-left" },
                { render: "Service/Plan", className: "text-left" },
                { render: "Payment", className: "text-left" },
                { render: "Session", className: "text-left" },
                { render: "Registered", className: "text-left" },
              ]}
              classNames={{
                root: "bg-white",
                header: "bg-gray-50",
                body: "divide-y divide-gray-100",
                row: "hover:bg-gray-50 transition-colors",
              }}
              rows={filteredPsychology.map((r, i) => ({
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
                      <div className="text-sm">
                        <div className="text-gray-900">{r.email}</div>
                        <div className="text-gray-600">{r.mobile}</div>
                      </div>
                    ),
                    className: "text-left",
                  },
                  {
                    render: r.service ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">{r.service}</span>
                        <Badge variant="light" color="blue" size="sm">
                          Service
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">{r.plan}</span>
                        <Badge variant="light" color="purple" size="sm">
                          Plan
                        </Badge>
                      </div>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-gray-900">
                          ₹{r.transactions?.[0]?.transaction.amount || "N/A"}
                        </span>
                        <Badge
                          color={
                            r.transactions?.[0]?.transaction.status === "success"
                              ? "green"
                              : r.transactions?.[0]?.transaction.status ===
                                  "pending"
                              ? "yellow"
                              : "red"
                          }
                          variant="light"
                          size="sm"
                        >
                          {r.transactions?.[0]?.transaction.status || "N/A"}
                        </Badge>
                      </div>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <div className="text-sm">
                        <div className="text-gray-900">{r.selectedDate}</div>
                        <div className="text-gray-600">{r.selectedTime}</div>
                      </div>
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
                ],
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
