import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../Constants";
import { api } from "./api";
import { BlogStepperContext } from "./context";
import {
  GenericError,
  GenericResponse,
  HomeCoursesType,
  PartnerMiscData,
  PartnerProfileType,
  UserAuthResponse,
} from "./types";
import { mutationErrorHandler, sleep } from "./utils";

type UseUserArgs = {
  extraOnSuccess?: () => void;
};

export function useUser({ extraOnSuccess = () => null }: UseUserArgs = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Query for fetching the current user
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<UserAuthResponse | null>({
    queryKey: ["auth"],
    queryFn: async () => {
      // First check React Query cache
      let authObject = queryClient.getQueryData<UserAuthResponse>(["auth"]);
      
      // If not in cache, check localStorage
      if (!authObject) {
        const stored = localStorage.getItem("studentAuth");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            // Check if stored data has expired (24 hours)
            if (parsed.timestamp && Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
              localStorage.removeItem("studentAuth");
              return null;
            }
            authObject = parsed;
          } catch {
            localStorage.removeItem("studentAuth");
            return null;
          }
        }
      }
      
      if (authObject && authObject.user?.role !== "STUDENT") {
        localStorage.removeItem("studentAuth");
        return null;
      }
      return authObject ?? null;
    },
    staleTime: 1000 * 60 * 60, // Increased to 1 hour for better session persistence
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });

  // Mutation for signing in
  const { mutate: signInUser, isPending: isSigningIn } = useMutation<
    GenericResponse<UserAuthResponse>,
    AxiosError<GenericError>,
    {
      email: string;
      password: string;
    },
    unknown
  >({
    mutationFn: async (data) => {
      await sleep(500);
      const response = await api().post<GenericResponse<UserAuthResponse>>(
        API_URL + "/auth/sign-in",
        data,
      );
      return response.data;
    },
    onSuccess: ({ data }) => {
      // CLEAR ALL PREVIOUS DATA FIRST
      queryClient.clear();
      
      queryClient.setQueryData(["auth"], data);
      // Persist to localStorage with timestamp for expiry management
      const authData = {
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem("studentAuth", JSON.stringify(authData));
      extraOnSuccess();
    },
    onError: (error) => {
      mutationErrorHandler(error);
      queryClient.setQueryData(["auth"], null);
      localStorage.removeItem("studentAuth");
    },
  });

  const signOut = () => {
    // CLEAR ALL CACHED DATA
    queryClient.clear();
    queryClient.setQueryData(["auth"], null);
    localStorage.removeItem("studentAuth");
    
    // Clear any other related localStorage items
    localStorage.removeItem("partnerAuth");
    localStorage.removeItem("adminAuth");
    
    navigate("/login");
  };

  return {
    user,
    isLoading,
    isError,
    isSigningIn,
    signIn: signInUser,
    signOut,
  };
}

export function usePartner({ extraOnSuccess = () => null }: UseUserArgs = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<UserAuthResponse<"PARTNER"> | null, AxiosError<GenericError>>({
    queryKey: ["partnerAuth"],
    queryFn: async () => {
      // First check React Query cache
      let authObject = queryClient.getQueryData<UserAuthResponse<"PARTNER">>([
        "partnerAuth",
      ]);
      
      // If not in cache, check localStorage
      if (!authObject) {
        const storedAuth = localStorage.getItem("partnerAuth");
        if (storedAuth) {
          try {
            authObject = JSON.parse(storedAuth);
            // Validate the stored data before using it
            if (authObject && authObject.user && authObject.token) {
              // Restore to cache
              queryClient.setQueryData(["partnerAuth"], authObject);
            } else {
              localStorage.removeItem("partnerAuth");
              authObject = null;
            }
          } catch (error) {
            localStorage.removeItem("partnerAuth");
            authObject = null;
          }
        }
      }
      
      if (authObject && authObject.user?.role !== "PARTNER") return null;
      return authObject ?? null;
    },
    staleTime: 1000 * 60 * 60, // Increased to 1 hour for better session persistence
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });

  // Mutation for signing in
  const { mutate: signInUser, isPending: isSigningIn } = useMutation<
    GenericResponse<UserAuthResponse<"PARTNER">>,
    AxiosError<GenericError>,
    {
      email: string;
      password: string;
    },
    unknown
  >({
    mutationFn: async (data) => {
      const response = await api().post<
        GenericResponse<UserAuthResponse<"PARTNER">>
      >(API_URL + "/partner/auth/sign-in", data);
      return response.data;
    },
    onSuccess: ({ data }) => {
      console.log("🚀 ~ useUserPartner ~ data:", data);
      queryClient.setQueryData(["partnerAuth"], data);
      // Persist to localStorage with timestamp for expiry management
      const authData = {
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem("partnerAuth", JSON.stringify(authData));
      extraOnSuccess();
    },
    onError: (errors) => {
      mutationErrorHandler(errors);
      queryClient.setQueryData(["partnerAuth"], null);
      localStorage.removeItem("partnerAuth");
    },
  });

  return {
    user,
    isLoading,
    isError,
    error,
    isSigningIn,
    signIn: signInUser,
    signOut: () => {
      navigate("/partner/signin");
      queryClient.setQueryData(["partnerAuth"], null);
      localStorage.removeItem("partnerAuth");
      queryClient.invalidateQueries({ queryKey: ["partner"] });
    },
  };
}

export function useAdmin({ extraOnSuccess = () => null }: UseUserArgs = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<UserAuthResponse<"ADMIN"> | null>({
    queryKey: ["adminAuth"],
    queryFn: async () => {
      // First check React Query cache
      let authObject = queryClient.getQueryData<UserAuthResponse<"ADMIN">>([
        "adminAuth",
      ]);
      
      // If not in cache, check localStorage
      if (!authObject) {
        const storedAuth = localStorage.getItem("adminAuth");
        if (storedAuth) {
          try {
            authObject = JSON.parse(storedAuth);
            // Validate the stored data before using it
            if (authObject && authObject.user && authObject.token) {
              // Restore to cache
              queryClient.setQueryData(["adminAuth"], authObject);
            } else {
              localStorage.removeItem("adminAuth");
              authObject = null;
            }
          } catch (error) {
            localStorage.removeItem("adminAuth");
            authObject = null;
          }
        }
      }
      
      if (authObject && authObject.user?.role !== "ADMIN") return null;
      return authObject ?? null;
    },
    staleTime: 1000 * 60 * 60, // Increased to 1 hour for better session persistence
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });

  // Mutation for signing in
  const { mutate: signInUser, isPending: isSigningIn } = useMutation<
    GenericResponse<UserAuthResponse<"ADMIN">>,
    AxiosError<GenericError>,
    {
      email: string;
      password: string;
    },
    unknown
  >({
    mutationFn: async (data) => {
      await sleep(500);
      const response = await api().post(API_URL + "/admin/auth/sign-in", data);
      return response.data;
    },
    onSuccess: ({ data }) => {
      console.log("🚀 ~ useAdmin ~ data:", data);
      queryClient.setQueryData(["adminAuth"], data);
      // Persist to localStorage with timestamp for expiry management
      const authData = {
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem("adminAuth", JSON.stringify(authData));
      extraOnSuccess();
    },
    onError: (error) => {
      mutationErrorHandler(error);
      queryClient.setQueryData(["adminAuth"], null);
      localStorage.removeItem("adminAuth");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });

  return {
    user,
    isLoading,
    isError,
    isSigningIn,
    signIn: signInUser,
    signOut: () => {
      navigate("/admin/signin");
      queryClient.setQueryData(["adminAuth"], null);
      localStorage.removeItem("adminAuth");
    },
  };
}

export const useBlogStepper = () => {
  const context = useContext(BlogStepperContext);
  if (context === undefined) {
    throw new Error("useBlogStepper must be used within a BlogStepperProvider");
  }
  return context;
};

export function usePartnerHomeData() {
  return useQuery<PartnerMiscData, AxiosError<GenericError>>({
    queryKey: ["partner", "home"],
    queryFn: async () => {
      const raw = (
        await api("partnerAuth").get<GenericResponse<PartnerMiscData>>(
          "/partner/misc",
        )
      ).data;
      return raw.data;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function usePartnerProfileData() {
  return useQuery<PartnerProfileType, AxiosError<GenericError>>({
    queryKey: ["partner", "profile"],
    queryFn: async () => {
      const raw = (
        await api("partnerAuth").get<GenericResponse<PartnerProfileType>>(
          "/partner/misc/me",
        )
      ).data;
      return raw.data;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useHomeCoursesData() {
  return useQuery<HomeCoursesType, AxiosError<GenericError>>({
    queryKey: ["misc", "courses"],
    queryFn: async () => {
      const raw = (
        await api().get<GenericResponse<HomeCoursesType>>("/home/carousel")
      ).data;
      return raw.data;
    },
    staleTime: 1000 * 60 * 30,
  });
}
