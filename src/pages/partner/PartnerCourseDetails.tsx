import { Alert, Badge, Button, Paper, Rating, Skeleton, Text } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Calendar, ChevronLeft, Link2 } from "lucide-react";
import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Errorbox from "../../components/Errorbox";
import Loading from "../../components/Loading";
import PartnerErrorHandler from "../../components/PartnerErrorHandler";
import PayoutStatusBanner from "../../components/PayoutStatusBanner";
import Table from "../../components/Table";
import { api } from "../../lib/api";
import { usePartnerHomeData } from "../../lib/hooks";
import { GenericError, GenericResponse } from "../../lib/types";
import {
  currencyFormatter,
  formatDate,
  mutationErrorHandler,
} from "../../lib/utils";
import { PartnerTraining } from "./PartnerTrainings";
import ReactPlayer from "react-player";

type PartnerTrainings = PartnerTraining & {
  enrolments: {
    id: string; // Change from number to string
    paidOn: Date | null;
    certificate: string | null;
    user: {
      firstName: string;
      lastName: string;
      mobile: string;
      email: string;
      id: string;
    };
  }[];
};

function useTrainingData({ id }: { id?: string }) {
  return useQuery<GenericResponse<PartnerTrainings>, AxiosError<GenericError>>({
    queryKey: ["partner", "trainings", id],
    queryFn: async () =>
      (await api("partnerAuth").get("/partner/trainings/" + id)).data,
    staleTime: 1000 * 60 * 10,
  });
}

function useGenerateCertificates({ id }: { id?: string }) {
  const queryClientHook = useQueryClient();
  const navigate = useNavigate();
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    (string | number)[]
  >({
    mutationFn: async (data) => {
      console.log("🚀 Certificate generation request:", {
        trainingId: id,
        selectedStudents: data,
        dataTypes: data.map((item) => typeof item),
      });

      // Convert all numbers to strings to match backend UUID validation
      const stringifiedData = data.map((item) => String(item));

      console.log("🚀 Sending to backend:", stringifiedData);

      return (
        await api("partnerAuth").post(
          `/partner/trainings/${id}/generate`,
          stringifiedData,
        )
      ).data;
    },
    onError: (err) => {
      console.error("🚀 Certificate generation error:", err);
      console.error("🚀 Error response:", err.response?.data);
      mutationErrorHandler(err, navigate, "/partner/signin");
    },
    onSuccess: (res) => {
      console.log("🚀 Certificate generation success:", res);
      queryClientHook.invalidateQueries({
        queryKey: ["partner", "trainings", id],
      });
      queryClientHook.setQueryDefaults(["partner", "trainings", id], {
        refetchInterval: 10 * 1000,
      });
      toast.success(res.message);
    },
  });
}

export default function PartnerCourseDetails() {
  const { id } = useParams();
  const { data, error, isLoading } = useTrainingData({ id });
  const { mutate: generateCertificates, isPending } = useGenerateCertificates({
    id,
  });
  const { data: payoutData, isLoading: payoutLoading } = usePartnerHomeData();
  const [selectedStudents, setSelectedStudents] = useState<(string | number)[]>(
    [],
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) return <PartnerErrorHandler error={error} />;

  const event = data?.data;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      <div className="max-w-full mx-auto">
        {!event ? (
          <Errorbox message="No data! Must be an invalid link. Please refresh or go back and try again" />
        ) : (
          <>
            {/* Back Button & Header */}
            <div className="space-y-4 animate-in slide-in-from-top duration-500">
              <div>
                {/*// @ts-expect-error shutup */}
                <Link to={-1}>
                  <Button 
                    variant="subtle" 
                    leftSection={<ChevronLeft size={18} />}
                    radius="md"
                    className="hover:bg-gray-100 transition-colors"
                  >
                    Back
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl font-semibold text-gray-900">
                      {event.title}
                    </h1>
                    <Badge
                      variant="light"
                      color={!event.category ? "gray" : "blue"}
                      size="lg"
                      radius="sm"
                    >
                      {event.category || "Uncategorized"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Payout Status */}
            <div className="animate-in fade-in duration-500 delay-100">
              {payoutLoading || !payoutData ? (
                <Skeleton width="100%" height={100} radius="xl" />
              ) : (
                <PayoutStatusBanner status={payoutData.payoutEligibility} />
              )}
            </div>

            {/* Approval Status */}
            <div className="animate-in fade-in duration-500 delay-150">
              <Alert 
                color={event.approvedBy ? "green" : "yellow"} 
                variant="light"
                className="rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    color={event.approvedBy ? "green" : "yellow"}
                    variant="filled"
                    size="md"
                  >
                    {event.approvedBy ? "Approved" : "Pending"}
                  </Badge>
                  <span className="font-medium">
                    {event.approvedBy
                      ? "Course has been approved and is live"
                      : "Course is awaiting admin approval"}
                  </span>
                </div>
              </Alert>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 delay-200">
              {/* Left Column - Cover Image & Description */}
              <div className="lg:col-span-2 space-y-6">
                <Paper p="lg" withBorder className="rounded-xl">
                  <img
                    src={event.coverImg ?? undefined}
                    alt={event.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <Text size="sm" c="dimmed" className="uppercase tracking-wide font-medium mb-2">
                    Description
                  </Text>
                  <Text size="md" className="text-gray-700">
                    {event.description}
                  </Text>
                </Paper>

                {/* Lessons Section */}
                {event.lessons && event.lessons.length > 0 && (
                  <Paper p="lg" withBorder className="rounded-xl">
                    <Text size="sm" c="dimmed" className="uppercase tracking-wide font-medium mb-4">
                      Course Syllabus
                    </Text>
                    <div className="space-y-4">
                      {event.lessons.map((l) => (
                        <Paper
                          key={l.id}
                          p="md"
                          withBorder
                          className="rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">{l.title}</h4>
                            <Badge
                              variant="dot"
                              color={l.type === "ONLINE" ? "blue" : "green"}
                            >
                              {l.type}
                            </Badge>
                          </div>
                          {l.content && (
                            <div
                              className="ql-snow text-sm text-gray-700 mb-3"
                              dangerouslySetInnerHTML={{ __html: l.content }}
                            ></div>
                          )}
                          <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} />
                              {formatDate(l.lastDate)}
                            </div>
                            {l.type === "OFFLINE" && l.location && (
                              <div className="flex items-center gap-2">
                                <FaLocationDot size={16} />
                                {l.location}
                              </div>
                            )}
                          </div>
                          {l.type === "ONLINE" && l.video && (
                            <div className="pt-[56.25%] relative mt-3">
                              <ReactPlayer
                                url={l.video}
                                controls
                                height="100%"
                                width="100%"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                }}
                              />
                            </div>
                          )}
                        </Paper>
                      ))}
                    </div>
                  </Paper>
                )}
              </div>

              {/* Right Column - Course Details */}
              <div className="space-y-4">
                <Paper p="lg" withBorder className="rounded-xl">
                  <Text size="sm" c="dimmed" className="uppercase tracking-wide font-medium mb-4">
                    Course Details
                  </Text>
                  <div className="space-y-4">
                    <div>
                      <Text size="xs" c="dimmed" className="mb-1">Created On</Text>
                      <Text size="sm" fw={500}>{formatDate(event.createdAt)}</Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" className="mb-1">Mode</Text>
                      <Badge variant="dot" color={event.type === "ONLINE" ? "blue" : "green"}>
                        {event.type ?? (event.location ? "Offline" : "Online")}
                      </Badge>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" className="mb-1">Location</Text>
                      <Text size="sm" fw={500}>{event.location || "N/A"}</Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" className="mb-1">Meeting Link</Text>
                      <Text size="sm" fw={500} className="break-all">
                        {event.link || "N/A"}
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" className="mb-1">Cost</Text>
                      <Text size="lg" fw={600} c="blue">₹ {event.cost || "N/A"}</Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" className="mb-1">Duration</Text>
                      <Text size="sm" fw={500}>
                        {formatDate(event.startDate)} to {formatDate(event.endDate)}
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" className="mb-1">Your Payout</Text>
                      <Text size="sm" fw={500}>{event.cut}%</Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" className="mb-1">Total Enrollments</Text>
                      <Text size="xl" fw={700} c="blue">{event.enrolments.length}</Text>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <Text size="xs" c="dimmed" className="mb-1">Potential Earnings</Text>
                      <Text size="xl" fw={700} c="green">
                        {currencyFormatter.format(
                          event.enrolments.length *
                            Number(event.cost) *
                            (Number(event.cut) / 100)
                        )}
                      </Text>
                    </div>
                  </div>
                </Paper>
              </div>
            </div>

            {/* Certificate Generation Section */}
            <div className="animate-in fade-in duration-500 delay-300">
              <Paper p="lg" withBorder className="rounded-xl">
                <div className="mb-6">
                  <Text size="lg" fw={600} className="text-gray-900 mb-2">
                    Certificate Generation
                  </Text>
                  <Text size="sm" c="dimmed">
                    Select students to generate certificates for course completion
                  </Text>
                </div>
                
                <div className="mb-4">
                  <Button
                    size="md"
                    radius="md"
                    disabled={isPending || selectedStudents.length < 1}
                    onClick={() => {
                      generateCertificates(selectedStudents);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                  >
                    {selectedStudents.length < 1
                      ? "Select Students to Generate"
                      : `Generate Certificates (${selectedStudents.length})`}
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <Table
                    selectable
                    setSelectedRows={setSelectedStudents}
                    selectedRows={selectedStudents}
                    selectionDisabled={event.enrolments
                      .filter((enr) => enr.certificate)
                      .map((enr) => enr.id)}
                    selectionDisabledRender="N/A"
                    headers={[
                      { render: "S.No", className: "w-[6%] text-left pl-4" },
                      { render: "Student", className: "text-left" },
                      { render: "Enrolled On", className: "text-left" },
                      { render: "Feedback", className: "text-left" },
                      { render: "Certificate", className: "text-center" },
                    ]}
                    classNames={{
                      root: "bg-white",
                      header: "bg-gray-50",
                      body: "divide-y divide-gray-100",
                      row: "hover:bg-gray-50 transition-colors",
                    }}
                    rows={event.enrolments?.map((enrolment, i) => ({
                      id: enrolment.id,
                      cells: [
                        {
                          render: <span className="text-gray-600 font-medium">{i + 1}</span>,
                          className: "text-left pl-4",
                        },
                        {
                          render: (
                            <div>
                              <div className="font-medium text-gray-900">
                                {enrolment.user.firstName}{" "}
                                {enrolment.user.lastName ?? ""}
                              </div>
                              <div className="text-xs text-gray-500">
                                {enrolment.user.email}
                              </div>
                              <div className="text-xs text-gray-500">
                                {enrolment.user.mobile}
                              </div>
                            </div>
                          ),
                          className: "text-left",
                        },
                        {
                          render: (
                            <div className="text-sm text-gray-700">
                              {enrolment.paidOn
                                ? formatDate(enrolment.paidOn)
                                : <Badge color="gray" size="sm">Not Paid</Badge>}
                            </div>
                          ),
                          className: "text-left",
                        },
                        {
                          render: (() => {
                            const fb = event.ratings?.find(
                              (rt) => rt.userId === enrolment.user.id
                            );
                            if (!fb)
                              return (
                                <Text size="xs" c="dimmed" fs="italic">
                                  No feedback
                                </Text>
                              );
                            return (
                              <div className="space-y-1">
                                <Rating value={fb.rating} size="sm" />
                                <Text size="xs" className="text-gray-600">
                                  {fb.feedback}
                                </Text>
                              </div>
                            );
                          })(),
                          className: "text-left",
                        },
                        {
                          render: !enrolment.certificate ? (
                            <Badge color="gray" variant="light" size="sm">
                              Not Generated
                            </Badge>
                          ) : enrolment.certificate === "generating" ? (
                            <Badge color="yellow" variant="light" size="sm">
                              Processing
                            </Badge>
                          ) : (
                            <Link
                              to={enrolment.certificate!}
                              target="_blank"
                              className="text-blue-600 hover:underline text-sm font-medium"
                            >
                              View Certificate
                            </Link>
                          ),
                          className: "text-center",
                        },
                      ],
                    }))}
                  />
                </div>
              </Paper>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
