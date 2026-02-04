import { Badge, Button, Paper, Text } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Errorbox from "../../components/Errorbox";
import Loading from "../../components/Loading";
import { api, queryClient } from "../../lib/api";
import {
  GenericError,
  GenericResponse,
  PartnerPayoutEligibilityStatus,
} from "../../lib/types";
import { formatDate, mutationErrorHandler } from "../../lib/utils";
import { ChevronLeft } from "lucide-react";
import { PartnerTraining } from "../partner/PartnerTrainings";
import { AddressType } from "./AdminTrainingSpotlight";
import { toast } from "react-toastify";
import Table from "../../components/Table";

export type AdminPartnersDetailsType = {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  mobile: string;
  topics?: string[] | null;
  trainingDays?: string | null;
  institutionName: string | null;
  addressId?: number;
  approvedBy: string | null;
  createdAt: string;
  trainings: (PartnerTraining & {
    enrolments?: { id: string; paidOn?: string; createdAt: string }[];
  })[];
  address: AddressType;
  account?: AccountType;
  payoutEligibility: PartnerPayoutEligibilityStatus;
};

export type AccountType = {
  id: string;
  partnerId: string;
  rzpyContactId: string | null;
  rzpyFundingAcctId: string | null;
  rzpyBankAcctId: string | null;
  rzpyVPAId: string | null;
  rzpyCardId: string | null;
  bankAccVerifiedOn: string;
  VPAVerifiedOn: Date | string | null;
  cardVerifiedOn: Date | string | null;
};

function useAdminPartnersDetailsType(id: string) {
  return useQuery<
    GenericResponse<AdminPartnersDetailsType>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "partners", id],
    queryFn: async () =>
      (await api("adminAuth").get(`/admin/partners/${id}`)).data,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Ensure query only runs if `id` is defined
  });
}

function useAdminPartnerApproval(id?: string) {
  const navigate = useNavigate();
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    "approve" | "deny"
  >({
    mutationFn: async (data) =>
      (
        await api("adminAuth").post(`/admin/partners/${id}/decision`, {
          decision: data,
        })
      ).data,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["admin", "partners", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "partners"] });
    },
    onError: (err) => mutationErrorHandler(err, navigate, "/admin/signin"),
  });
}

function AdminPartnerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useAdminPartnersDetailsType(id || "");
  const { mutate, isPending } = useAdminPartnerApproval(id);

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

  const partner = data?.data;

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partner Details</h1>
          <div className="mt-4 sm:mt-0">
            {!partner?.approvedBy ? (
              <Button
                radius="md"
                variant="filled"
                color="green"
                onClick={() => mutate("approve")}
                disabled={isPending}
                size="md"
              >
                Approve Partner
              </Button>
            ) : (
              <Button
                radius="md"
                variant="filled"
                color="red"
                onClick={() => mutate("deny")}
                disabled={isPending}
                size="md"
              >
                Reject Partner
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Paper p="md" withBorder className="rounded-lg">
            <Text size="xs" c="dimmed" className="uppercase tracking-wide mb-2">
              Personal Information
            </Text>
            <div className="space-y-3">
              <div>
                <Text size="xs" c="dimmed">Full Name</Text>
                <Text size="lg" fw={600} className="text-gray-900">
                  {partner?.firstName + " " + (partner?.lastName ?? "")}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">Email</Text>
                <Text size="sm" fw={500} className="text-gray-900">
                  {partner?.email}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">Phone</Text>
                <Text size="sm" fw={500} className="text-gray-900">
                  {partner?.mobile}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">Joined On</Text>
                <Text size="sm" fw={500} className="text-gray-900">
                  {formatDate(partner?.createdAt ?? null)}
                </Text>
              </div>
            </div>
          </Paper>

          <Paper p="md" withBorder className="rounded-lg">
            <Text size="xs" c="dimmed" className="uppercase tracking-wide mb-2">
              Institution Details
            </Text>
            <div className="space-y-3">
              <div>
                <Text size="xs" c="dimmed">Institution Name</Text>
                <Text size="sm" fw={500} className="text-gray-900">
                  {partner?.institutionName || "Individual Partner"}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">Address</Text>
                <Text size="sm" fw={500} className="text-gray-900">
                  {partner?.address.addressLine1}
                  {partner?.address.addressLine2 && (
                    <>, {partner.address.addressLine2}</>
                  )}
                  <br />
                  {partner?.address.city}, {partner?.address.state}
                  <br />
                  {partner?.address.pincode}
                </Text>
              </div>
              {partner?.topics && partner.topics.length > 0 && (
                <div>
                  <Text size="xs" c="dimmed" className="mb-1">Teaching Topics</Text>
                  <div className="flex flex-wrap gap-2">
                    {partner.topics.map((topic, idx) => (
                      <Badge key={idx} variant="light" color="blue" size="sm">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Paper>

          <Paper p="md" withBorder className="rounded-lg">
            <Text size="xs" c="dimmed" className="uppercase tracking-wide mb-2">
              Account & Payout
            </Text>
            <div className="space-y-3">
              <div>
                <Badge
                  color={
                    partner?.payoutEligibility === "approved"
                      ? "green"
                      : partner?.payoutEligibility === "failed"
                      ? "red"
                      : "yellow"
                  }
                  variant="light"
                  size="md"
                  className="mb-2"
                >
                  {partner?.payoutEligibility === "approved"
                    ? "Eligible for Payouts"
                    : partner?.payoutEligibility === "no-data"
                    ? "No Account Data"
                    : partner?.payoutEligibility === "failed"
                    ? "Verification Failed"
                    : "Pending"}
                </Badge>
              </div>
              <div>
                <Text size="xs" c="dimmed">Razorpay Contact ID</Text>
                <Text size="xs" fw={500} className="text-gray-900 font-mono">
                  {partner?.account?.rzpyContactId || "N/A"}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">Bank Account ID</Text>
                <div className="flex items-center gap-2">
                  <Text size="xs" fw={500} className="text-gray-900 font-mono">
                    {partner?.account?.rzpyBankAcctId || "N/A"}
                  </Text>
                  {partner?.account?.bankAccVerifiedOn && (
                    <Badge size="xs" color="green" variant="light">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <Text size="xs" c="dimmed">VPA ID</Text>
                <div className="flex items-center gap-2">
                  <Text size="xs" fw={500} className="text-gray-900 font-mono">
                    {partner?.account?.rzpyVPAId || "N/A"}
                  </Text>
                  {partner?.account?.VPAVerifiedOn && (
                    <Badge size="xs" color="green" variant="light">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Paper>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Courses Created
          </h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table
              headers={[
                { render: "S.No", className: "w-[6%] text-left pl-4" },
                { render: "Course Name", className: "text-left" },
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
              rows={partner!.trainings.map((r, i) => ({
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
                      <span className="font-medium text-gray-900">{r.title}</span>
                    ),
                    className: "text-left",
                  },
                  {
                    render: (
                      <Badge variant="light" color="blue" size="sm">
                        {r.enrolments?.length || 0}
                      </Badge>
                    ),
                    className: "text-center",
                  },
                  {
                    render: (
                      <span className="text-gray-700 text-sm">
                        {formatDate(r.startDate)} - {formatDate(r.endDate)}
                      </span>
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
        </div>
      </div>
    </div>
  );
}

export default AdminPartnerDetails;
