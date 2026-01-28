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
    <div className="flex flex-col items-center gap-4 w-full p-4">
      <div className="control-bar w-full mb-4 flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">
            Individual Registrations
          </h1>
          <Text size="sm" c="dimmed">
            Total: {filteredPsychology.length} registrations
          </Text>
        </div>
        <Group>
          <Input
            leftSection={<Search size={16} />}
            radius="md"
            placeholder="Search name, email, mobile..."
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: "250px" }}
          />
          <Button 
            leftSection={<Download size={16} />}
            variant="outline"
            onClick={exportToCSV}
            disabled={!filteredPsychology.length}
          >
            Export To XLS
          </Button>
        </Group>
      </div>
      
      <div className="w-full overflow-x-auto">
        {!data ? (
          <Errorbox message="Cannot get data due to some unknown error" />
        ) : (
          <div className="min-w-full">
            <Table
              headers={[
                { render: "S.No", className: "w-16" },
                { render: "Name", className: "min-w-[150px]" },
                { render: "Contact", className: "min-w-[200px]" },
                { render: "Organization", className: "min-w-[180px]" },
                { render: "Session", className: "min-w-[150px]" },
                { render: "Payment", className: "min-w-[120px]" },
                { render: "Registered", className: "min-w-[120px]" },
                { render: "Actions", className: "w-24" },
              ]}
              classNames={{
                root: "bg-white rounded-lg shadow",
              }}
              rows={filteredPsychology.map((r, i) => ({
                id: r.id,
                cells: [
                  {
                    render: i + 1,
                    className: "font-medium text-gray-600",
                  },
                  {
                    render: (
                      <div>
                        <div className="font-medium text-gray-900">{r.name}</div>
                        {r.designation && (
                          <div className="text-xs text-gray-500">{r.designation}</div>
                        )}
                      </div>
                    ),
                  },
                  {
                    render: (
                      <div className="text-sm">
                        <div className="text-gray-900">{r.email}</div>
                        <div className="text-gray-600">{r.mobile}</div>
                      </div>
                    ),
                  },
                  {
                    render: (
                      <div className="text-sm">
                        <div className="text-gray-900">{r.organizationName || "N/A"}</div>
                      </div>
                    ),
                  },
                  {
                    render: (
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{r.selectedDate}</div>
                        <div className="text-gray-600">{r.selectedTime}</div>
                      </div>
                    ),
                  },
                  {
                    render: (
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">
                          ₹{r.transactions?.[0]?.transaction.amount || "N/A"}
                        </div>
                        <Badge 
                          size="sm" 
                          color={
                            r.transactions?.[0]?.transaction.status === "success" 
                              ? "green" 
                              : r.transactions?.[0]?.transaction.status === "pending"
                              ? "yellow"
                              : "red"
                          }
                        >
                          {r.transactions?.[0]?.transaction.status || "N/A"}
                        </Badge>
                      </div>
                    ),
                  },
                  {
                    render: (
                      <div className="text-sm text-gray-600">
                        {formatDate(r.createdAt)}
                      </div>
                    ),
                  },
                  {
                    render: (
                      <Button
                        size="xs"
                        variant="light"
                        leftSection={<Eye size={14} />}
                        onClick={() => setActiveRegistrationId(r.id)}
                      >
                        View
                      </Button>
                    ),
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
          <Text fw={600}>
            Registration Details
          </Text>
        }
        size="900px"
      >
        {(() => {
          const currentReg = data?.data.find(
            (reg) => reg.id === activeRegistrationId,
          );
          if (!currentReg)
            return <Alert color="red" title="Invalid registration selected" />;
          
          return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* Personal Information */}
              <Paper p="md" withBorder>
                <Text size="sm" fw={600} mb="sm" c="blue">
                  Personal Information
                </Text>
                <div style={{ fontSize: "13px" }}>
                  <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Full Name:</Text> <Text span fw={500}>{currentReg.name}</Text></div>
                  <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Email:</Text> <Text span fw={500}>{currentReg.email}</Text></div>
                  <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Mobile:</Text> <Text span fw={500}>{currentReg.mobile}</Text></div>
                  <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Designation:</Text> <Text span fw={500}>{currentReg.designation || "N/A"}</Text></div>
                  <div><Text span c="dimmed">Organization:</Text> <Text span fw={500}>{currentReg.organizationName || "N/A"}</Text></div>
                </div>
              </Paper>

              {/* Session Information */}
              <Paper p="md" withBorder>
                <Text size="sm" fw={600} mb="sm" c="green">
                  Session Information
                </Text>
                <div style={{ fontSize: "13px" }}>
                  <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Session Date:</Text> <Text span fw={500}>{currentReg.selectedDate}</Text></div>
                  <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Session Time:</Text> <Text span fw={500}>{currentReg.selectedTime}</Text></div>
                  <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Service Interest:</Text> <Text span fw={500}>{currentReg.serviceInterest || "N/A"}</Text></div>
                  <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Registered On:</Text> <Text span fw={500}>{formatDate(currentReg.createdAt)}</Text></div>
                  {currentReg.updatedAt && (
                    <div><Text span c="dimmed">Last Updated:</Text> <Text span fw={500}>{formatDate(currentReg.updatedAt)}</Text></div>
                  )}
                </div>
              </Paper>

              {/* Additional Details */}
              <Paper p="md" withBorder>
                <Text size="sm" fw={600} mb="sm" c="purple">
                  Additional Details
                </Text>
                <div style={{ fontSize: "13px" }}>
                  <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Requirements:</Text> <Text span fw={500}>{currentReg.requirements || "N/A"}</Text></div>
                  <div><Text span c="dimmed">Concerns:</Text> <Text span fw={500}>{currentReg.concerns || "N/A"}</Text></div>
                </div>
              </Paper>

              {/* Payment Information */}
              <Paper p="md" withBorder>
                <Text size="sm" fw={600} mb="sm" c="orange">
                  Payment Information
                </Text>
                <div style={{ fontSize: "13px" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <Text span c="dimmed">Amount:</Text> <Text span fw={700}>₹{currentReg.transactions?.[0]?.transaction.amount || "N/A"}</Text>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <Text span c="dimmed">Status:</Text>{" "}
                    <Badge 
                      size="sm"
                      color={
                        currentReg.transactions?.[0]?.transaction.status === "success" 
                          ? "green" 
                          : currentReg.transactions?.[0]?.transaction.status === "pending"
                          ? "yellow"
                          : "red"
                      }
                    >
                      {currentReg.transactions?.[0]?.transaction.status || "N/A"}
                    </Badge>
                  </div>
                  <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Order ID:</Text> <Text span fw={500} size="xs">{currentReg.transactions?.[0]?.transaction.orderId || "N/A"}</Text></div>
                  {currentReg.transactions?.[0]?.transaction.paymentId && (
                    <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Payment ID:</Text> <Text span fw={500} size="xs">{currentReg.transactions[0].transaction.paymentId}</Text></div>
                  )}
                  {currentReg.transactions?.[0]?.transaction.txnNo && (
                    <div><Text span c="dimmed">Txn No:</Text> <Text span fw={500}>{currentReg.transactions[0].transaction.txnNo}</Text></div>
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


