import { Alert, Badge, Button, Input, Modal, Text, Paper, Group } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Search, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Errorbox from "../../components/Errorbox";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { api } from "../../lib/api";
import {
  EnquiryTransactionType,
  GenericError,
  GenericResponse,
} from "../../lib/types";
import { formatDate, mutationErrorHandler } from "../../lib/utils";

type AdminInsitutionPlans = {
  id: string;
  name : string,
  email: string;
  mobile: string;
  type:string;
  designation: string;
  organizationName: string;
  requirements: string;
  concerns: string;
  serviceInterest: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  selectedDate: string;
  selectedTime: string;
  transactions: {
    id: string;
    Id : string;
    createdAt: Date | null;
    updatedAt: Date | null;
    plan: "Basics" | "Premium";
    transactionId: string;
    transaction: EnquiryTransactionType;
  }[];
};

function useAdminInstitutionRegistrations() {
  return useQuery<
    GenericResponse<AdminInsitutionPlans[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "enquiry", "inst-plans"],
    queryFn: async () =>
      (await api("adminAuth").get("/admin/applications/institution-plans"))
        .data,
    staleTime: 1000 * 60 * 5,
  });
}

export default function AdminInstitutionRegistrations() {
  const { data, isLoading, error } = useAdminInstitutionRegistrations();
  const [search, setSearch] = useState<string | undefined>();
  const navigate = useNavigate();
  const [activeInstituteId, setActiveInstituteId] = useState<string | null>(
    null,
  );

  const filteredInstitutionRegistrations = useMemo(() => {
    if (!data) return [];
    return data.data.filter(
      (registration) =>
        registration.organizationName
          .toLowerCase()
          .includes(search?.toLowerCase() || "") ||
        registration.name
          ?.toLowerCase()
          .includes(search?.toLowerCase() || "") ||
        registration.mobile
          .toLowerCase()
          .includes(search?.toLowerCase() || "") ||
        registration.email
          .toLowerCase()
          .includes(search?.toLowerCase() || "") ||
        registration.designation
          .toLowerCase()
          .includes(search?.toLowerCase() || ""),
    );
  }, [data, search]); // Filter institutionRegistrations based on search input

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
    if (!filteredInstitutionRegistrations.length) return;
    
    const headers = [
      "S.No", "Organization", "Name", "Email", "Mobile", "Designation", "Type",
      "Registered On", "Session Date", "Session Time", "Amount", "Payment Status",
      "Service Interest", "Requirements", "Concerns", "Transaction ID"
    ];
    
    const rows = filteredInstitutionRegistrations.map((r, i) => [
      i + 1,
      r.organizationName,
      r.name,
      r.email,
      r.mobile,
      r.designation || "N/A",
      r.type || "N/A",
      formatDate(r.createdAt),
      r.selectedDate,
      r.selectedTime,
      r.transactions?.[0]?.transaction.amount || "N/A",
      r.transactions?.[0]?.transaction.status || "N/A",
      r.serviceInterest || "N/A",
      r.requirements || "N/A",
      r.concerns || "N/A",
      r.transactions?.[0]?.transaction.orderId || "N/A",
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `institution-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full p-4">
      <div className="control-bar w-full mb-4 flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">
            Institution Registrations
          </h1>
          <Text size="sm" c="dimmed">
            Total: {filteredInstitutionRegistrations.length} registrations
          </Text>
        </div>
        <Group>
          <Input
            leftSection={<Search size={16} />}
            radius="md"
            placeholder="Search name, organization, mobile..."
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: "250px" }}
          />
          <Button 
            leftSection={<Download size={16} />}
            variant="outline"
            onClick={exportToCSV}
            disabled={!filteredInstitutionRegistrations.length}
          >
            Export to XLS
          </Button>
        </Group>
      </div>
      <div className="w-full">
        {!data ? (
          <Errorbox message="Cannot get data due to some unknown error" />
        ) : (
          <Table
            headers={[
              { render: "S.No", className: "w-[10%]" },
              { render: "Organization" },
              { render: "Contact Person" },
              { render: "Contact Info" },
              { render: "Payment" },
              { render: "Session Date" },
              { render: "Details" },
            ]}
            classNames={{
              root: "bg-white rounded-lg shadow",
            }}
            rows={filteredInstitutionRegistrations.map((r, i) => ({
              id: r.id,
              cells: [
                {
                  render: i + 1,
                  className: "w-[10%]",
                },
                {
                  render: (
                    <div>
                      <div className="font-medium text-gray-900">{r.organizationName}</div>
                      {r.type && (
                        <div className="text-xs text-gray-500">{r.type}</div>
                      )}
                    </div>
                  ),
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
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{r.selectedDate}</div>
                      <div className="text-gray-600">{r.selectedTime}</div>
                    </div>
                  ),
                },
                {
                  render: (
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => setActiveInstituteId(r.id)}
                    >
                      View
                    </Button>
                  ),
                },
              ],
            }))}
          />
        )}
      </div>

      {/* Modal for details */}
      <Modal
        centered
        opened={!!activeInstituteId}
        onClose={() => setActiveInstituteId(null)}
        title={
          <Text fw={600}>
            Institution Registration Details
          </Text>
        }
        size="1000px"
      >
        {(() => {
          const currentInst = data?.data.find(
            (inst) => inst.id === activeInstituteId,
          );
          if (!currentInst)
            return <Alert color="red" title="Invalid institution selected" />;
          
          return (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                {/* Organization & Payment Information */}
                <Paper p="md" withBorder>
                  <Text size="sm" fw={600} mb="sm" c="blue">
                    Organization & Payment
                  </Text>
                  <div style={{ fontSize: "13px" }}>
                    <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Organization:</Text> <Text span fw={500}>{currentInst.organizationName}</Text></div>
                    <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Type:</Text> <Text span fw={500}>{currentInst.type || "N/A"}</Text></div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text span c="dimmed">Amount:</Text> <Text span fw={700}>₹{currentInst.transactions?.[0]?.transaction.amount || "N/A"}</Text>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text span c="dimmed">Payment Status:</Text> {" "}
                      <Badge 
                        size="sm" 
                        color={
                          currentInst.transactions?.[0]?.transaction.status === "success" 
                            ? "green" 
                            : currentInst.transactions?.[0]?.transaction.status === "pending"
                            ? "yellow"
                            : "red"
                        }
                      >
                        {currentInst.transactions?.[0]?.transaction.status || "N/A"}
                      </Badge>
                    </div>
                    <div><Text span c="dimmed">Service Interest:</Text> <Text span fw={500}>{currentInst.serviceInterest || "N/A"}</Text></div>
                  </div>
                </Paper>

                {/* Contact Information */}
                <Paper p="md" withBorder>
                  <Text size="sm" fw={600} mb="sm" c="green">
                    Contact Information
                  </Text>
                  <div style={{ fontSize: "13px" }}>
                    <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Contact Name:</Text> <Text span fw={500}>{currentInst.name}</Text></div>
                    <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Email:</Text> <Text span fw={500}>{currentInst.email}</Text></div>
                    <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Mobile:</Text> <Text span fw={500}>{currentInst.mobile}</Text></div>
                    <div><Text span c="dimmed">Designation:</Text> <Text span fw={500}>{currentInst.designation || "N/A"}</Text></div>
                  </div>
                </Paper>

                {/* Session Information */}
                <Paper p="md" withBorder>
                  <Text size="sm" fw={600} mb="sm" c="purple">
                    Session & Timeline
                  </Text>
                  <div style={{ fontSize: "13px" }}>
                    <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Session Date:</Text> <Text span fw={500}>{currentInst.selectedDate}</Text></div>
                    <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Session Time:</Text> <Text span fw={500}>{currentInst.selectedTime}</Text></div>
                    <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Registered On:</Text> <Text span fw={500}>{formatDate(currentInst.createdAt)}</Text></div>
                    {currentInst.updatedAt && (
                      <div><Text span c="dimmed">Last Updated:</Text> <Text span fw={500}>{formatDate(currentInst.updatedAt)}</Text></div>
                    )}
                  </div>
                </Paper>

                {/* Additional Details */}
                <Paper p="md" withBorder>
                  <Text size="sm" fw={600} mb="sm" c="orange">
                    Additional Details
                  </Text>
                  <div style={{ fontSize: "13px" }}>
                    <div style={{ marginBottom: "8px" }}><Text span c="dimmed">Requirements:</Text> <Text span fw={500}>{currentInst.requirements || "N/A"}</Text></div>
                    <div><Text span c="dimmed">Concerns:</Text> <Text span fw={500}>{currentInst.concerns || "N/A"}</Text></div>
                  </div>
                </Paper>
              </div>

              {/* Transaction Details Table */}
              {currentInst.transactions && currentInst.transactions.length > 0 && (
                <Paper p="md" withBorder>
                  <Text size="sm" fw={600} mb="sm" c="blue">
                    Transaction Details
                  </Text>
                  <div className="overflow-auto">
                    <Table
                      classNames={{
                        root: "w-full",
                        body: "text-sm",
                      }}
                      headers={[
                        { render: "S.No", className: "w-[10%]" },
                        { render: "Amount" },
                        { render: "Txn No." },
                        { render: "Order Id" },
                        { render: "Payment Id" },
                        { render: "Status" },
                        { render: "Paid on" },
                      ]}
                      rows={currentInst.transactions?.map((trans, i) => ({
                        id: trans.id,
                        cells: [
                          {
                            render: i + 1,
                          },
                          {
                            render: "₹" + trans.transaction.amount,
                          },
                          {
                            render: trans.transaction.txnNo || (
                              <i className="text-gray-500">N/A</i>
                            ),
                          },
                          {
                            render: trans.transaction.orderId,
                          },
                          {
                            render: trans.transaction.paymentId ?? (
                              <i className="text-gray-500">No data</i>
                            ),
                          },
                          {
                            render: <Badge>{trans.transaction.status}</Badge>,
                          },
                          {
                            render: formatDate(trans.updatedAt),
                          },
                        ],
                      })) || []}
                    />
                  </div>
                </Paper>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
