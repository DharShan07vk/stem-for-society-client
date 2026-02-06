import { Alert, Button, Paper, SegmentedControl, TextInput } from "@mantine/core";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import PartnerErrorHandler from "../../components/PartnerErrorHandler";
import { usePartner, usePartnerProfileData } from "../../lib/hooks";
import { Info } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GenericError, GenericResponse } from "../../lib/types";
import { AxiosError } from "axios";
import { api } from "../../lib/api";
import { mutationErrorHandler } from "../../lib/utils";
import { toast } from "react-toastify";

type BankAccountType = {
  ifsc: string;
  bank_name: string;
  name: string;
  account_number: string;
};

type VPAAccountType = { address: string };

export type AccountDataType =
  | {
      type: "bank_account";
      bank_account?: BankAccountType;
    }
  | {
      type: "vpa";
      vpa?: VPAAccountType;
    }
  | null;

function usePartnerAccountSubmit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    { bank_account: BankAccountType } | { vpa: VPAAccountType }
  >({
    mutationFn: async (data) => {
      return (await api("partnerAuth").post("/partner/misc/account", data))
        .data;
    },
    onError: (err) => mutationErrorHandler(err, navigate, "/partner/"),
    onSuccess(data) {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["partner", "profile"] });
    },
  });
}

export default function PartnerAccounts() {
  const { user, isLoading, error } = usePartner();
  const {
    isLoading: partnerProfileLoading,
    error: partnerProfileError,
    data: partnerProfile,
  } = usePartnerProfileData();
  const { mutate, isPending } = usePartnerAccountSubmit();

  const [formData, setFormData] = useState<AccountDataType>({
    type: "bank_account",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // @ts-expect-error mairu
    setFormData((prevData) => {
      if (prevData?.type === "bank_account") {
        return {
          type: "bank_account",
          bank_account: {
            ...(prevData.bank_account || {}),
            [name]: value,
          },
        };
      }
      if (prevData?.type === "vpa") {
        return {
          type: "vpa",
          vpa: {
            ...(prevData.vpa || {}),
            [name]: value,
          },
        };
      }
      return null;
    });
  };

  if (isLoading || partnerProfileLoading) {
    return <Loading />;
  }

  if (error || partnerProfileError)
    return <PartnerErrorHandler error={error || partnerProfileError!} />;

  if (!user) return <Navigate to={"/partner"} />;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2 animate-in slide-in-from-top duration-500">
        <h1 className="text-3xl font-semibold text-gray-900">Payment Account Settings</h1>
        <p className="text-sm text-gray-600">
          Configure your payment details to receive payouts from your trainings
        </p>
      </div>

      {/* Info Alert */}
      <div className="animate-in fade-in duration-500 delay-100">
        <Alert icon={<Info />} color="blue" variant="light" className="rounded-lg">
          You are only eligible for payouts after your account details are verified by our team
        </Alert>
      </div>

      {/* Main Form */}
      <Paper
        p="xl"
        withBorder
        className="rounded-xl animate-in slide-in-from-bottom duration-500 delay-200"
      >
        <div className="space-y-6">
          {partnerProfile?.account?.bankAccVerifiedOn ||
          partnerProfile?.account?.VPAVerifiedOn ||
          partnerProfile?.account?.cardVerifiedOn ? (
            <Alert color="green" variant="light" className="rounded-lg">
              ✓ Your account has been verified. You are eligible for payouts
            </Alert>
          ) : (partnerProfile?.account?.rzpyBankAcctId &&
              !partnerProfile.account.bankAccVerifiedOn) ||
            (partnerProfile?.account?.rzpyCardId &&
              !partnerProfile.account.cardVerifiedOn) ||
            (partnerProfile?.account?.rzpyVPAId &&
              !partnerProfile.account.VPAVerifiedOn) ? (
            <Alert color="yellow" variant="light" className="rounded-lg">
              ⏱ Your account is being verified. You will be eligible for payouts soon
            </Alert>
          ) : (
            <>
              <SegmentedControl
                data={[
                  { label: "Bank Account", value: "bank_account" },
                  { label: "UPI", value: "vpa", disabled: true },
                ]}
                value={formData?.type}
                onChange={(value) =>
                  // @ts-expect-error moodu
                  setFormData((prev) => ({ ...prev, type: value }))
                }
                size="md"
                className="w-full"
              />
              
              <div className="space-y-4 pt-4">
                {formData?.type === "bank_account" ? (
                  <>
                    <TextInput
                      label="Account Holder Name"
                      placeholder="Enter account holder name"
                      size="md"
                      required
                      name="name"
                      value={formData?.bank_account?.name}
                      onChange={handleInputChange}
                      classNames={{
                        input: "transition-all duration-200 focus:shadow-sm",
                      }}
                    />
                    <TextInput
                      label="Bank Name"
                      placeholder="Enter bank name"
                      size="md"
                      required
                      name="bank_name"
                      value={formData?.bank_account?.bank_name}
                      onChange={handleInputChange}
                      classNames={{
                        input: "transition-all duration-200 focus:shadow-sm",
                      }}
                    />
                    <TextInput
                      label="IFSC Code"
                      placeholder="Enter IFSC code (e.g., SBIN0001234)"
                      size="md"
                      required
                      name="ifsc"
                      value={formData?.bank_account?.ifsc}
                      onChange={handleInputChange}
                      classNames={{
                        input: "transition-all duration-200 focus:shadow-sm",
                      }}
                    />
                    <TextInput
                      label="Account Number"
                      placeholder="Enter account number"
                      size="md"
                      required
                      name="account_number"
                      value={formData?.bank_account?.account_number}
                      onChange={handleInputChange}
                      classNames={{
                        input: "transition-all duration-200 focus:shadow-sm",
                      }}
                    />
                  </>
                ) : formData?.type === "vpa" ? (
                  <TextInput
                    label="UPI Address"
                    placeholder="yourname@upi"
                    size="md"
                    required
                    name="address"
                    value={formData?.vpa?.address}
                    onChange={handleInputChange}
                    classNames={{
                      input: "transition-all duration-200 focus:shadow-sm",
                    }}
                  />
                ) : null}
              </div>
            </>
          )}
          
          <Button
            fullWidth
            size="md"
            radius="md"
            type="submit"
            onClick={() => {
              console.log("🚀 ~ PartnerAccounts ~ formData:", formData);
              if (!formData) {
                return toast.error("Invalid data");
              }
              mutate(
                formData.type === "bank_account"
                  ? { bank_account: formData.bank_account! }
                  : { vpa: formData.vpa! },
              );
            }}
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-md mt-6"
          >
            {isPending ? "Submitting..." : "Submit for Verification"}
          </Button>
        </div>
      </Paper>
    </div>
  );
}
