import { AxiosError } from "axios";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GenericError } from "./types";
import { toast } from "react-toastify";
import { NavigateFunction } from "react-router-dom";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(time: number) {
  return await new Promise((res) => setTimeout(res, time));
}

// Simplified error handler - no session management
export function mutationErrorHandler(
  error: AxiosError<GenericError>,
  navigate?: NavigateFunction,
  path?: string,
) {
  console.error("mutation error:", error);
  
  const errorObject =
    typeof error.response?.data !== "string" && error.response?.data;
  const errorMessage =
    errorObject && "error" in errorObject && errorObject.error;
  const validationError =
    errorObject && "errors" in errorObject && errorObject.errors;

  // Handle 401 errors by redirecting to login
  if (error.status === 401) {
    toast.error('Authentication required');
    if (navigate) {
      navigate(path ?? "/");
    }
    return;
  }

  if (validationError) {
    validationError.forEach((err) => {
      toast.error(
        err.path[0].toUpperCase() + err.path.slice(1) + ": " + err.message,
      );
    });
    return;
  }
  
  toast.error(errorMessage || error.message || "Unknown error");
}

export function formatDate(date: string | Date | null) {
  return !date ? "No date" : dayjs(date).format("ddd, DD MMM YYYY");
}

export function initializeRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

export const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});
