import { AccountType } from "../pages/admin/AdminPartnerDetails";
import { AddressType } from "../pages/admin/AdminTrainingSpotlight";

export type GenericResponse<T = undefined> = T extends undefined
  ? {
      message: string;
    }
  : {
      data: T;
    };

export type GenericError =
  | {
      error: string; // This error is when there is server error or simply error to be shown as notification
    }
  | {
      errors: {
        path: string;
        message: string;
      }[]; // This is for form-related errors
    };

export type UserAuthResponse<
  T extends "STUDENT" | "PARTNER" | "ADMIN" = "STUDENT",
> = {
  token: string;
  user: {
    email: string;
    firstName: string;
    id: string;
    mobile: string;
    role: T;
    lastName: string | null;
    createdAt: Date | null;
    isApproved: T extends "PARTNER" ? boolean : unknown;
  };
};

interface RazorpayPrefillOpts {
  name?: string;
  email?: string;
  contact?: string;
  method?: "card" | "netbanking" | "wallet" | "emi" | "upi";
}
interface RazorpayThemeOpts {
  hide_topbar?: boolean;
  color?: string;
  backdrop_color?: string;
}
interface RazorpayErrorCallbackResponse {
  error: {
    code: string;
    description: string;
    field: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      payment_id: string;
      order_id: string;
    };
  };
}
interface RazorpayReadonlyOpts {
  contact?: boolean;
  email?: boolean;
  name?: boolean;
}
interface RazorpayConfigOpts {
  display: {
    language: "en" | "ben" | "hi" | "mar" | "guj" | "tam" | "tel";
  };
}
interface RazorpayModalOpts {
  backdropclose?: boolean;
  escape?: boolean;
  handleback?: boolean;
  confirm_close?: boolean;
  ondismiss?: () => void;
  animation?: boolean;
}
interface RazorpayRetryOpts {
  enabled?: boolean;
}
interface RazorpayHiddenOpts {
  contact?: boolean;
  email?: boolean;
}
interface RazorpaySuccesshandlerArgs {
  razorpay_signature: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
}
export interface RazorpayOrderOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill?: RazorpayPrefillOpts;
  notes?: string;
  theme?: RazorpayThemeOpts;
  modal?: RazorpayModalOpts;
  subscription_id?: string;
  subscription_card_change?: boolean;
  recurring?: boolean;
  callback_url?: string;
  redirect?: boolean;
  customer_id?: string;
  remember_customer?: boolean;
  timeout?: number;
  readonly?: RazorpayReadonlyOpts;
  hidden?: RazorpayHiddenOpts;
  send_sms_hash?: boolean;
  allow_rotation?: boolean;
  retry?: RazorpayRetryOpts;
  config?: RazorpayConfigOpts;
  handler?: (response: RazorpaySuccesshandlerArgs) => void;
}
declare class RazorpayInstance {
  private readonly options;
  private readonly instance;
  constructor(options: RazorpayOrderOptions);
  on(
    event: "payment.failed",
    cb: (response: RazorpayErrorCallbackResponse) => void,
  ): void;
  open(): void;
}
export default RazorpayInstance;

export type PartnerPayoutEligibilityStatus =
  | "approved"
  | "pending-details"
  | "pending-approval"
  | "failed"
  | "no-data";

export type PartnerMiscData = {
  studentsCount: number;
  trainingsCount: number;
  payoutEligibility: PartnerPayoutEligibilityStatus;
};

export type PartnerProfileType = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  mobile: string;
  createdAt: Date | null;
  profileImageURL: string | null;
  trainingTopic: string | null;
  trainingDays: number | null;
  institutionName: string | null;
  addressId: number | null;
  gst: string | null;
  hasGst: boolean | null;
  address: AddressType | null;
  account: AccountType | null;
  logo : string | null;
  digitalSign : string| null;
};

export type HomeCoursesType = {
  title: string;
  coverImg: string;
  description: string;
}[];

export type EnquiryTransactionType = {
  id: string;
  createdAt: Date | null;
  status: "pending" | "success" | "cancelled" | "failed" | null;
  updatedAt: Date | null;
  txnNo: string | null;
  paymentId: string | null;
  orderId: string;
  signature: string | null;
  idempotencyId: string | null;
  amount: string;
};
