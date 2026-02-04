import {Badge, Button, Input, Modal, Group, Text, Alert, Paper } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Search, Eye, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Errorbox from "../../components/Errorbox";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { api } from "../../lib/api";
import { GenericError, GenericResponse } from "../../lib/types";
import { formatDate, mutationErrorHandler } from "../../lib/utils";

type AdminPsychologyTrainings = {
  id: string;
  name : string,
  email: string;
  mobile: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  selectedDate : string,
  selectedTime : string,
  designation:  string,
  organizationName;string,
  requirements: string,
  concerns: string,
  serviceInterest: string,
  transactionId : string;
  transactions: {
    id: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    transactionId: string;
    psychologyId: string;
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

function useAdminPsychology() {
  return useQuery<
    GenericResponse<AdminPsychologyTrainings[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "enquiry", "psychology"],
    queryFn: async () =>
      (await api("adminAuth").get("/admin/applications/individual")).data,
    staleTime: 1000 * 60 * 5,
  });
}

export default function AdminPsychology() {
  const { data, isLoading, error } = useAdminPsychology();
  const [search, setSearch] = useState<string | undefined>();
  const [activeRegistrationId, setActiveRegistrationId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredPsychology = useMemo(() => {
    if (!data) return [];
    return data.data.filter(
      (registration) =>
        registration.name.toLowerCase().includes(search?.toLowerCase() || "") ||
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

  const exportToCSV = () => {
    if (!filteredPsychology.length) return;
    
    const headers = [
      "S.No", "Name", "Email", "Mobile", "Designation", "Organization", 
      "Registered On", "Session Date", "Session Time", "Service Interest",
      "Requirements", "Concerns", "Transaction ID", "Amount", "Payment Status"
    ];
    
    const rows = filteredPsychology.map((r, i) => [
      i + 1,
      r.name,
      r.email,
      r.mobile,
      r.designation || "N/A",
      r.organizationName || "N/A",
      formatDate(r.createdAt),
      r.selectedDate,
      r.selectedTime,
      r.serviceInterest || "N/A",
      r.requirements || "N/A",
      r.concerns || "N/A",
      r.transactions?.[0]?.transaction.orderId || "N/A",
      r.transactions?.[0]?.transaction.amount || "N/A",
      r.transactions?.[0]?.transaction.status || "N/A",
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `psychology-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Individual Registrations
            </h1>
            <Text size="sm" c="dimmed" className="text-gray-500">
              Total: {filteredPsychology.length} registrations
            </Text>
          </div>
          <Group className="flex-wrap">
            <Input
              leftSection={<Search size={18} />}
              radius="md"
              placeholder="Search name, email, mobile..."
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80"
              classNames={{
                input: "h-10",
              }}
            />
            <Button
              leftSection={<Download size={18} />}
              variant="outline"
              radius="md"
              onClick={exportToCSV}
              disabled={!filteredPsychology.length}
              className="h-10"
            >
              Export CSV
            </Button>
          </Group>
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
                { render: "Organization", className: "text-left" },
                { render: "Session", className: "text-left" },
                { render: "Payment", className: "text-left" },
                { render: "Registered", className: "text-left" },
                { render: "Actions", className: "w-[10%] text-center" },
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
                      <div>
                        <div className="font-medium text-gray-900">{r.name}</div>
                        {r.designation && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {r.designation}
                          </div>
                        )}
                      </div>
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
                    render: (
                      <span className="text-gray-700 text-sm">
                        {r.organizationName || "N/A"}
                      </span>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {r.selectedDate}
                        </div>
                        <div className="text-gray-600">{r.selectedTime}</div>
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
                          size="sm"
                          variant="light"
                          color={
                            r.transactions?.[0]?.transaction.status === "success"
                              ? "green"
                              : r.transactions?.[0]?.transaction.status ===
                                  "pending"
                              ? "yellow"
                              : "red"
                          }
                        >
                          {r.transactions?.[0]?.transaction.status || "N/A"}
                        </Badge>
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
                  {
                    render: (
                      <Button
                        size="xs"
                        variant="light"
                        leftSection={<Eye size={14} />}
                        radius="md"
                        onClick={() => setActiveRegistrationId(r.id)}
                      >
                        View
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

      {/* Details Modal */}
      <Modal
        centered
        opened={!!activeRegistrationId}
        onClose={() => setActiveRegistrationId(null)}
        title={
          <Text fw={600} size="lg">
            Registration Details
          </Text>
        }
        size="xl"
        classNames={{
          content: "rounded-xl",
          header: "border-b border-gray-200 pb-4",
        }}
      >
        {(() => {
          const currentReg = data?.data.find(
            (reg) => reg.id === activeRegistrationId,
          );
          if (!currentReg)
            return <Alert color="red" title="Invalid registration selected" />;

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <Paper p="md" withBorder className="rounded-lg">
                <Text size="sm" fw={600} mb="md" c="blue" className="uppercase tracking-wide">
                  Personal Information
                </Text>
                <div className="space-y-2 text-sm">
                  <div>
                    <Text span c="dimmed" size="xs">Full Name:</Text>{" "}
                    <Text span fw={500}>{currentReg.name}</Text>
                  </div>
                  <div>
                    <Text span c="dimmed" size="xs">Email:</Text>{" "}
                    <Text span fw={500}>{currentReg.email}</Text>
                  </div>
                  <div>
                    <Text span c="dimmed" size="xs">Mobile:</Text>{" "}
                    <Text span fw={500}>{currentReg.mobile}</Text>
                  </div>
                  <div>
                    <Text span c="dimmed" size="xs">Designation:</Text>{" "}
                    <Text span fw={500}>{currentReg.designation || "N/A"}</Text>
                  </div>
                  <div>
                    <Text span c="dimmed" size="xs">Organization:</Text>{" "}
                    <Text span fw={500}>
                      {currentReg.organizationName || "N/A"}
                    </Text>
                  </div>
                </div>
              </Paper>

              {/* Session Information */}
              <Paper p="md" withBorder className="rounded-lg">
                <Text size="sm" fw={600} mb="md" c="green" className="uppercase tracking-wide">
                  Session Information
                </Text>
                <div className="space-y-2 text-sm">
                  <div>
                    <Text span c="dimmed" size="xs">Session Date:</Text>{" "}
                    <Text span fw={500}>{currentReg.selectedDate}</Text>
                  </div>
                  <div>
                    <Text span c="dimmed" size="xs">Session Time:</Text>{" "}
                    <Text span fw={500}>{currentReg.selectedTime}</Text>
                  </div>
                  <div>
                    <Text span c="dimmed" size="xs">Service Interest:</Text>{" "}
                    <Text span fw={500}>
                      {currentReg.serviceInterest || "N/A"}
                    </Text>
                  </div>
                  <div>
                    <Text span c="dimmed" size="xs">Registered On:</Text>{" "}
                    <Text span fw={500}>
                      {formatDate(currentReg.createdAt)}
                    </Text>
                  </div>
                  {currentReg.updatedAt && (
                    <div>
                      <Text span c="dimmed" size="xs">Last Updated:</Text>{" "}
                      <Text span fw={500}>
                        {formatDate(currentReg.updatedAt)}
                      </Text>
                    </div>
                  )}
                </div>
              </Paper>

              {/* Additional Details */}
              <Paper p="md" withBorder className="rounded-lg">
                <Text size="sm" fw={600} mb="md" c="purple" className="uppercase tracking-wide">
                  Additional Details
                </Text>
                <div className="space-y-2 text-sm">
                  <div>
                    <Text span c="dimmed" size="xs">Requirements:</Text>{" "}
                    <Text span fw={500}>
                      {currentReg.requirements || "N/A"}
                    </Text>
                  </div>
                  <div>
                    <Text span c="dimmed" size="xs">Concerns:</Text>{" "}
                    <Text span fw={500}>{currentReg.concerns || "N/A"}</Text>
                  </div>
                </div>
              </Paper>

              {/* Payment Information */}
              <Paper p="md" withBorder className="rounded-lg">
                <Text size="sm" fw={600} mb="md" c="orange" className="uppercase tracking-wide">
                  Payment Information
                </Text>
                <div className="space-y-2 text-sm">
                  <div>
                    <Text span c="dimmed" size="xs">Amount:</Text>{" "}
                    <Text span fw={700} size="md">
                      ₹{currentReg.transactions?.[0]?.transaction.amount || "N/A"}
                    </Text>
                  </div>
                  <div>
                    <Text span c="dimmed" size="xs">Status:</Text>{" "}
                    <Badge
                      size="sm"
                      variant="light"
                      color={
                        currentReg.transactions?.[0]?.transaction.status ===
                        "success"
                          ? "green"
                          : currentReg.transactions?.[0]?.transaction.status ===
                              "pending"
                            ? "yellow"
                            : "red"
                      }
                    >
                      {currentReg.transactions?.[0]?.transaction.status ||
                        "N/A"}
                    </Badge>
                  </div>
                  <div>
                    <Text span c="dimmed" size="xs">Order ID:</Text>{" "}
                    <Text span fw={500} size="xs" className="font-mono">
                      {currentReg.transactions?.[0]?.transaction.orderId ||
                        "N/A"}
                    </Text>
                  </div>
                  {currentReg.transactions?.[0]?.transaction.paymentId && (
                    <div>
                      <Text span c="dimmed" size="xs">Payment ID:</Text>{" "}
                      <Text span fw={500} size="xs" className="font-mono">
                        {currentReg.transactions[0].transaction.paymentId}
                      </Text>
                    </div>
                  )}
                  {currentReg.transactions?.[0]?.transaction.txnNo && (
                    <div>
                      <Text span c="dimmed" size="xs">Txn No:</Text>{" "}
                      <Text span fw={500} className="font-mono">
                        {currentReg.transactions[0].transaction.txnNo}
                      </Text>
                    </div>
                  )}
                </div>
              </Paper>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}


