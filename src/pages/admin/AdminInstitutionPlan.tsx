import { Alert, Badge, Button, Input, Modal } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Search } from "lucide-react";
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
import LabelAndValue from "../../components/LabelAndValue";

type AdminInsitutionPlans = {
  id: string;
  addressId: number;
  schoolName: string;
  contactName: string;
  contactMobile: string;
  contactEmail: string;
  studentsCount: number | null;
  selectedDate: string;
  selectedTime: string;
  address: {
    id: number;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    district: string | null;
    state: string;
    pincode: string;
  };
  transactions: {
    id: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    plan: "Basics" | "Premium";
    institutionId: string;
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
        registration.schoolName
          .toLowerCase()
          .includes(search?.toLowerCase() || "") ||
        registration.contactName
          ?.toLowerCase()
          .includes(search?.toLowerCase() || "") ||
        registration.contactMobile
          .toLowerCase()
          .includes(search?.toLowerCase() || "") ||
        registration.contactEmail
          .toLowerCase()
          .includes(search?.toLowerCase() || "") ||
        registration.address.city
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

  return (
    <div className="flex flex-col items-center gap-4 w-full p-4">
      <div className="control-bar w-full mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Institution registrations</h1>
        <Input
          leftSection={<Search size={16} />}
          radius={999}
          classNames={{ wrapper: "ml-auto w-64" }}
          placeholder="Search for name, city, mobile, etc..."
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="w-full">
        {!data ? (
          <Errorbox message="Cannot get data due to some unknown error" />
        ) : (
          <Table
            headers={[
              { render: "S.No", className: "w-[10%]" },
              { render: "Insitution" },
              { render: "Address" },
              { render: "Contact" },
              { render: "Plan" },
              { render: "Selected Date & Time" },
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
                  render: r.schoolName,
                },
                {
                  render: (
                    <>
                      {r.address?.addressLine1}
                      {r.address?.addressLine2 &&
                        ", " + r.address?.addressLine2}
                      <br />
                      {r.address?.district}
                      {r.address?.city && ", " + r.address?.city}
                      {r.address?.state && ", " + r.address?.state}
                      {r.address?.pincode && " - " + r.address?.pincode}
                    </>
                  ),
                },
                {
                  render: (
                    <div className="grid">
                      {r.contactName}
                      <span className="truncate">
                        ({r.contactEmail} - {r.contactMobile})
                      </span>
                    </div>
                  ),
                  className: "max-w-[40%]",
                },
                {
                  render: r.transactions?.[0]?.plan || "No Plan",
                },
                {
                  render : r.selectedDate + " " + r.selectedTime,
                },
                {
                  render: (
                    <Button
                      radius={999}
                      onClick={() => setActiveInstituteId(r.id)}
                    >
                      Click
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
        classNames={{
          title: "font-medium",
        }}
        size={"1200"}
        title={
          data?.data.find((inst) => inst.id === activeInstituteId)?.schoolName +
          " details"
        }
        onClose={() => setActiveInstituteId(null)}
        opened={!!activeInstituteId}
      >
        {(() => {
          const currentInst = data?.data.find(
            (inst) => inst.id === activeInstituteId,
          );
          if (!currentInst)
            return <Alert color="red" title="Invalid institution selected" />;
          return (
            <div className="grid gap-6">
              <div className="flex gap-3">
                <LabelAndValue
                  label="Institution Name"
                  value={currentInst.schoolName}
                />
                <LabelAndValue
                  label="Address"
                  value={
                    <>
                      {currentInst.address?.addressLine1}
                      {currentInst.address?.addressLine2 &&
                        ", " + currentInst.address?.addressLine2}
                      <br />
                      {currentInst.address?.district}
                      {currentInst.address?.city &&
                        ", " + currentInst.address?.city}
                      {currentInst.address?.state &&
                        ", " + currentInst.address?.state}
                      {currentInst.address?.pincode &&
                        " - " + currentInst.address?.pincode}
                    </>
                  }
                />
              </div>
              <div className="flex gap-3">
                <LabelAndValue
                  label="Contact name"
                  value={currentInst.contactName}
                />
                <LabelAndValue
                  label="Contact mobile"
                  value={currentInst.contactMobile}
                />
                <LabelAndValue
                  label="Contact email"
                  value={currentInst.contactEmail}
                />
              </div>
              <div className="flex gap-3">
                <LabelAndValue
                  label="Plan chosen"
                  value={
                    <Badge color="dark">
                      {currentInst.transactions?.[0]?.plan || "No Plan"}
                    </Badge>
                  }
                />
                <LabelAndValue
                  label="Students count"
                  value={currentInst.studentsCount ?? 0}
                />
              </div>
              <div className="grid overflow-auto">
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
                        render: trans.transaction.amount,
                      },
                      {
                        render: trans.transaction.txnNo,
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
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
