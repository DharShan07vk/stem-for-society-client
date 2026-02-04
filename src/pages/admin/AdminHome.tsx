import { Paper, Skeleton, Text } from "@mantine/core";
import { cn } from "../../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  BookOpen,
  FileText,
  GraduationCap,
  TrendingUp,
  Users,
  UserCheck,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { GenericError, GenericResponse } from "../../lib/types";
import { AdminStudentsType } from "./AdminStudents";
import { AdminPartnersType } from "./AdminParnters";
import { AdminBlogType } from "./AdminBlogs";
import { PartnerTrainingResponse } from "../partner/PartnerTrainings";

// Type definitions for applications
type AdminPsychologyTrainings = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  selectedDate: string;
  selectedTime: string;
  designation: string;
  organizationName: string;
  requirements: string;
  concerns: string;
  serviceInterest: string;
  transactionId: string;
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

type AdminCareerCounsellingType = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  mobile: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  selectedDate: string;
  selectedTime: string;
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

type AdminCAApplicationsType = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  mobile: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  linkedin: string | null;
  eduType: "UG" | "PG" | "PhD";
  department: string;
  collegeName: string;
  yearInCollege: number | null;
  collegeCity: string;
  dob: string | null;
};

type AdminInsitutionPlansType = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  type: string;
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
    Id: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    plan: "Basics" | "Premium";
    transactionId: string;
    transaction: any;
  }[];
};

// Hooks for fetching data
function useAdminStudentsCount() {
  return useQuery<
    GenericResponse<AdminStudentsType[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "students"],
    queryFn: async () => (await api("adminAuth").get("/admin/students")).data,
    staleTime: 1000 * 60 * 5,
  });
}

function useAdminTrainingsCount() {
  return useQuery<
    GenericResponse<PartnerTrainingResponse[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "trainings"],
    queryFn: async () => (await api("adminAuth").get("/admin/trainings")).data,
    staleTime: 1000 * 60 * 5,
  });
}

function useAdminPartnersCount() {
  return useQuery<
    GenericResponse<AdminPartnersType[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "partners"],
    queryFn: async () => (await api("adminAuth").get("/admin/partners")).data,
    staleTime: 1000 * 60 * 5,
  });
}

function useAdminBlogsCount() {
  return useQuery<
    GenericResponse<AdminBlogType[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "blogs"],
    queryFn: async () => (await api("adminAuth").get("/blogs")).data,
    staleTime: 1000 * 60 * 5,
  });
}

function useAdminIndividualApplications() {
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

function useAdminCareerApplications() {
  return useQuery<
    GenericResponse<AdminCareerCounsellingType[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "enquiry", "career"],
    queryFn: async () =>
      (await api("adminAuth").get("/admin/applications/career")).data,
    staleTime: 1000 * 60 * 5,
  });
}

function useAdminCAApplications() {
  return useQuery<
    GenericResponse<AdminCAApplicationsType[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "enquiry", "ca"],
    queryFn: async () =>
      (await api("adminAuth").get("/admin/applications/ca")).data,
    staleTime: 1000 * 60 * 5,
  });
}

function useAdminInstitutionApplications() {
  return useQuery<
    GenericResponse<AdminInsitutionPlansType[]>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "enquiry", "inst-plans"],
    queryFn: async () =>
      (await api("adminAuth").get("/admin/applications/institution-plans"))
        .data,
    staleTime: 1000 * 60 * 5,
  });
}

export default function AdminHome() {
  const { data: studentsData, isLoading: studentsLoading } =
    useAdminStudentsCount();
  const { data: trainingsData, isLoading: trainingsLoading } =
    useAdminTrainingsCount();
  const { data: partnersData, isLoading: partnersLoading } =
    useAdminPartnersCount();
  const { data: blogsData, isLoading: blogsLoading } = useAdminBlogsCount();
  const { data: individualApps, isLoading: individualLoading } =
    useAdminIndividualApplications();
  const { data: careerApps, isLoading: careerLoading } =
    useAdminCareerApplications();
  const { data: caApps, isLoading: caLoading } = useAdminCAApplications();
  const { data: institutionApps, isLoading: institutionLoading } =
    useAdminInstitutionApplications();

  // Calculate counts
  const studentsCount = studentsData?.data?.length || 0;
  const activeTrainingsCount =
    trainingsData?.data?.filter((t) => t.approvedBy)?.length || 0;
  const partnersCount = partnersData?.data?.length || 0;
  const blogsCount = blogsData?.data?.length || 0;

  // Calculate pending applications (applications without approvedBy)
  const pendingApplicationsCount = useMemo(() => {
    let count = 0;
    // Individual applications - these don't have approvedBy field, so count all
    if (individualApps?.data) count += individualApps.data.length;
    // Career applications - count all
    if (careerApps?.data) count += careerApps.data.length;
    // CA applications - count all
    if (caApps?.data) count += caApps.data.length;
    // Institution applications - count all
    if (institutionApps?.data) count += institutionApps.data.length;
    return count;
  }, [individualApps, careerApps, caApps, institutionApps]);

  // Calculate growth rate (placeholder - can be enhanced with date comparison)
  // const growthRate = useMemo(() => {
  //   // Simple calculation: compare current month registrations
  //   // For now, return a placeholder
  //   return "+12%";
  // }, []);

  const isLoading =
    studentsLoading ||
    trainingsLoading ||
    partnersLoading ||
    blogsLoading ||
    individualLoading ||
    careerLoading ||
    caLoading ||
    institutionLoading;

  const stats = [
    {
      label: "Total Students",
      value: studentsCount.toLocaleString(),
      icon: GraduationCap,
      color: "blue",
      link: "/admin/students",
      loading: studentsLoading,
    },
    {
      label: "Active Trainings",
      value: activeTrainingsCount.toLocaleString(),
      icon: BookOpen,
      color: "green",
      link: "/admin/trainings",
      loading: trainingsLoading,
    },
    {
      label: "Partners",
      value: partnersCount.toLocaleString(),
      icon: Users,
      color: "purple",
      link: "/admin/partners",
      loading: partnersLoading,
    },
    {
      label: "Pending Applications",
      value: pendingApplicationsCount.toLocaleString(),
      icon: UserCheck,
      color: "orange",
      link: "/admin/applications",
      loading:
        individualLoading ||
        careerLoading ||
        caLoading ||
        institutionLoading,
    },
    {
      label: "Blog Posts",
      value: blogsCount.toLocaleString(),
      icon: FileText,
      color: "pink",
      link: "/admin/blogs",
      loading: blogsLoading,
    },
    
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
        <Text size="xl" fw={600} className="mb-2">
          Welcome to Admin Dashboard
        </Text>
        <Text size="sm" className="opacity-90">
          Manage your platform, review applications, and monitor activity from
          here.
        </Text>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "bg-blue-50 text-blue-600",
            green: "bg-green-50 text-green-600",
            purple: "bg-purple-50 text-purple-600",
            orange: "bg-orange-50 text-orange-600",
            pink: "bg-pink-50 text-pink-600",
            teal: "bg-teal-50 text-teal-600",
          };

          const content = (
            <Paper
              p="lg"
              withBorder
              className={cn(
                "rounded-xl transition-all duration-200",
                stat.link !== "#"
                  ? "hover:shadow-lg cursor-pointer hover:scale-[1.02]"
                  : "cursor-default"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Text
                    size="xs"
                    c="dimmed"
                    className="uppercase tracking-wide mb-1"
                  >
                    {stat.label}
                  </Text>
                  {stat.loading ? (
                    <Skeleton height={32} width={80} />
                  ) : (
                    <Text size="2xl" fw={700} className="text-gray-900">
                      {stat.value}
                    </Text>
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg flex-shrink-0 ${colorClasses[stat.color as keyof typeof colorClasses]}`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </Paper>
          );

          return stat.link !== "#" ? (
            <Link key={stat.label} to={stat.link}>
              {content}
            </Link>
          ) : (
            <div key={stat.label}>{content}</div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Paper p="lg" withBorder className="rounded-xl">
          <Text size="lg" fw={600} className="mb-4 text-gray-900">
            Quick Actions
          </Text>
          <div className="space-y-3">
            <Link
              to="/admin/applications"
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Text size="sm" fw={500} className="text-gray-900">
                Review Pending Applications
              </Text>
              <Text size="xs" c="dimmed" className="text-gray-500">
                Check and approve new applications
              </Text>
            </Link>
            <Link
              to="/admin/trainings"
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Text size="sm" fw={500} className="text-gray-900">
                Manage Trainings
              </Text>
              <Text size="xs" c="dimmed" className="text-gray-500">
                View and approve training courses
              </Text>
            </Link>
            <Link
              to="/admin/blogs"
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Text size="sm" fw={500} className="text-gray-900">
                Review Blog Posts
              </Text>
              <Text size="xs" c="dimmed" className="text-gray-500">
                Approve or reject blog submissions
              </Text>
            </Link>
          </div>
        </Paper>

        <Paper p="lg" withBorder className="rounded-xl">
          <Text size="lg" fw={600} className="mb-4 text-gray-900">
            Recent Activity
          </Text>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <Text size="sm" className="text-gray-900">
                  No recent activity
                </Text>
                <Text size="xs" c="dimmed" className="text-gray-500">
                  Activity will appear here
                </Text>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
}
