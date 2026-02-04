import { Badge, Button, NumberInput, Rating, Paper, Text } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Calendar, ChevronLeft, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import ReactPlayer from "react-player";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Errorbox from "../../components/Errorbox";
import Loading from "../../components/Loading";
import Table from "../../components/Table";
import { api, queryClient } from "../../lib/api";
import { CourseCategoriesType } from "../../lib/data";
import { GenericError, GenericResponse } from "../../lib/types";
import {
  currencyFormatter,
  formatDate,
  mutationErrorHandler,
} from "../../lib/utils";

export type AddressType = {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  district: string | null;
  state: string;
  pincode: string;
};

export type AdminTrainingDetails = {
  id: string;
  title: string;
  description: string | null;
  coverImg: string | null;
  link: string | null;
  startDate: Date | null;
  endDate: Date | null;
  durationValue: string;
  durationType: "Weeks" | "Days" | "Months" | "Hours";
  type: "ONLINE" | "OFFLINE" | "HYBRID";
  location: string | null;
  cost: string | null;
  cut: number | null;
  category?: CourseCategoriesType;
  createdBy: string | null;
  approvedBy: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  ratings?: {
    userId: string;
    trainingId: string;
    rating: number;
    feedback: string;
  }[];
  instructor: {
    firstName: string;
    lastName: string | null;
    institutionName: string;
    mobile: string;
    email: string;
    address: AddressType;
  };
  enrolments: {
    id: string;
    completedOn: Date | null;
    createdAt: Date | string;
    paidOn: string;
    certificate: string;
    user: {
      firstName: string;
      lastName: string;
      mobile: string;
      email: string;
      id: string;
    };
  }[];
  lessons: {
    id: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    title: string;
    location: string | null;
    type: "ONLINE" | "OFFLINE";
    trainingId: string | null;
    content: string | null;
    video: string | null;
    lastDate: Date | null;
  }[];
};

type FormDataType = {
  decision: "approve";
  startDate: Date | null;
  endDate: Date | null;
  cut: number;
};

function useAdminTrainingDetails(id: string) {
  return useQuery<
    GenericResponse<AdminTrainingDetails>,
    AxiosError<GenericError>
  >({
    queryKey: ["admin", "trainings", id],
    queryFn: async () =>
      (await api("adminAuth").get(`/admin/trainings/${id}`)).data,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Ensure query only runs if `id` is defined
  });
}

function useAdminTrainingsApproval(id?: string) {
  const navigate = useNavigate();
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    FormDataType | { decision: "deny" }
  >({
    mutationFn: async (data) =>
      (await api("adminAuth").post(`/admin/trainings/${id}/decision`, data))
        .data,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["admin", "trainings", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "trainings"] });
    },
    onError: (err) => mutationErrorHandler(err, navigate, "/admin/signin"),
  });
}

export default function AdminTrainingSpotlight() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useAdminTrainingDetails(id || "");
  const { mutate, isPending } = useAdminTrainingsApproval(id);
  const [formData, setFormData] = useState<Partial<FormDataType>>({
    startDate: undefined,
    endDate: undefined,
    cut: 0,
  });

  const handleDateChange = (
    name: "startDate" | "endDate",
    value: Date | null,
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const training = data?.data;

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

      {!training || Object.keys(training).length === 0 ? (
        <Errorbox message="No data! Must be an invalid link. Please refresh or go back and try again" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                {training.title}
              </h1>
              <Badge
                variant="light"
                color={!training.category ? "gray" : "blue"}
                size="lg"
              >
                {training.category || "Uncategorized"}
              </Badge>
            </div>
            {training.approvedBy && (
              <Button
                radius="md"
                variant="filled"
                color="red"
                onClick={() => mutate({ decision: "deny" })}
                disabled={isPending || isLoading}
                size="md"
              >
                Reject Training
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              {training.coverImg && (
                <img
                  src={training.coverImg}
                  alt={training.title}
                  className="w-full object-cover aspect-video rounded-lg"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <Text size="md" className="text-gray-700 leading-relaxed">
                  {training.description || "No description available"}
                </Text>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Paper p="md" withBorder className="rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Training Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Mode
                    </Text>
                    <Badge
                      variant="light"
                      color={training.type === "OFFLINE" ? "red" : "green"}
                      size="sm"
                      className="mt-1"
                    >
                      {training.type ?? (training.location ? "OFFLINE" : "ONLINE")}
                    </Badge>
                  </div>
                  {training.location && (
                    <div>
                      <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                        Location
                      </Text>
                      <Text size="sm" fw={500} className="text-gray-900">
                        {training.location}
                      </Text>
                    </div>
                  )}
                  {training.link && (
                    <div>
                      <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                        Meeting Link
                      </Text>
                      <Link
                        to={training.link}
                        target="_blank"
                        className="text-blue-600 hover:underline text-sm break-all"
                      >
                        {training.link}
                      </Link>
                    </div>
                  )}
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Cost
                    </Text>
                    <Text size="lg" fw={700} className="text-gray-900">
                      ₹{training.cost || "N/A"}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Schedule
                    </Text>
                    <Text size="sm" fw={500} className="text-gray-900">
                      {formatDate(training.startDate)} -{" "}
                      {formatDate(training.endDate)}
                    </Text>
                  </div>
                  {training.cut && (
                    <div>
                      <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                        Instructor Payout
                      </Text>
                      <Text size="sm" fw={500} className="text-gray-900">
                        {training.cut}%
                      </Text>
                    </div>
                  )}
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Created On
                    </Text>
                    <Text size="sm" fw={500} className="text-gray-900">
                      {formatDate(training.createdAt)}
                    </Text>
                  </div>
                </div>
              </Paper>

              <Paper p="md" withBorder className="rounded-lg mt-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Instructor Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Name
                    </Text>
                    <Text size="sm" fw={500} className="text-gray-900">
                      {training.instructor.firstName +
                        " " +
                        (training.instructor.lastName ?? "")}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Institution
                    </Text>
                    <Text size="sm" fw={500} className="text-gray-900">
                      {training.instructor.institutionName}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Contact
                    </Text>
                    <Text size="sm" fw={500} className="text-gray-900">
                      {training.instructor.email}
                    </Text>
                    <Text size="sm" fw={500} className="text-gray-900">
                      {training.instructor.mobile}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Address
                    </Text>
                    <Text size="sm" fw={500} className="text-gray-900">
                      {training.instructor.address.addressLine1}
                      {training.instructor.address.addressLine2 && (
                        <>, {training.instructor.address.addressLine2}</>
                      )}
                      <br />
                      {training.instructor.address.city},{" "}
                      {training.instructor.address.state} -{" "}
                      {training.instructor.address.pincode}
                    </Text>
                  </div>
                </div>
              </Paper>
            </div>
          </div>
          {!training.approvedBy && (
            <Paper p="md" withBorder className="rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Approval Settings
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DateTimePicker
                    label="Start date and time"
                    placeholder="Select start date and time"
                    value={formData.startDate}
                    onChange={(value) => handleDateChange("startDate", value)}
                    leftSection={<Calendar size={16} />}
                    radius="md"
                  />
                  <DateTimePicker
                    label="End date and time"
                    placeholder="Select end date and time"
                    value={formData.endDate}
                    onChange={(value) => handleDateChange("endDate", value)}
                    leftSection={<Calendar size={16} />}
                    radius="md"
                  />
                </div>

                <div>
                  <NumberInput
                    label="Instructor Profit Cut (%)"
                    description="Percentage of profit that will be provided to the instructor after this training ends (10-90%)"
                    step={1}
                    value={formData.cut}
                    min={10}
                    defaultValue={10}
                    max={90}
                    onChange={(num) =>
                      setFormData((prev) => ({ ...prev, cut: Number(num) }))
                    }
                    radius="md"
                  />
                  {formData.cut !== 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <Text size="sm" fw={600} className="text-gray-900 mb-2">
                        Payout Calculation Example
                      </Text>
                      <Text size="xs" className="text-gray-700">
                        If 10 students register for ₹{training.cost} each, after{" "}
                        {formatDate(formData.endDate ?? training.endDate)}:
                      </Text>
                      <div className="mt-2 space-y-1">
                        <Text size="xs" className="text-gray-700">
                          • Instructor earns:{" "}
                          <span className="font-semibold">
                            {currencyFormatter.format(
                              (Number(training.cost) *
                                10 *
                                Number(formData.cut)) /
                                100,
                            )}
                          </span>
                        </Text>
                        <Text size="xs" className="text-gray-700">
                          • Platform earns:{" "}
                          <span className="font-semibold">
                            {currencyFormatter.format(
                              (Number(training.cost) *
                                10 *
                                (100 - Number(formData.cut))) /
                                100,
                            )}
                          </span>
                        </Text>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  radius="md"
                  variant="filled"
                  color="green"
                  size="md"
                  onClick={() =>
                    mutate({
                      decision: "approve",
                      startDate: formData.startDate ?? training.startDate,
                      endDate: formData.endDate ?? training.endDate,
                      cut: formData.cut!,
                    })
                  }
                  disabled={isPending || isLoading}
                  className="w-full sm:w-auto"
                >
                  {isPending ? "Approving..." : "Approve Training"}
                </Button>
              </div>
            </Paper>
          )}

          {training.approvedBy && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Students Enrolled ({training.enrolments.length})
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <Table
                  headers={[
                    { render: "S.No", className: "w-[6%] text-left pl-4" },
                    { render: "Student Name", className: "text-left" },
                    { render: "Enrolled On", className: "text-left" },
                    { render: "Paid On", className: "text-left" },
                    { render: "Feedback", className: "text-left" },
                    { render: "Certificate", className: "text-left" },
                    { render: "Actions", className: "w-[10%] text-center" },
                  ]}
                  classNames={{
                    root: "bg-white",
                    header: "bg-gray-50",
                    body: "divide-y divide-gray-100",
                    row: "hover:bg-gray-50 transition-colors",
                  }}
                  rows={training.enrolments.map((r, i) => ({
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
                          <span className="font-medium text-gray-900">
                            {r.user.firstName + " " + (r.user.lastName ?? "")}
                          </span>
                        ),
                        className: "text-left",
                      },
                      {
                        render: (
                          <span className="text-gray-600 text-sm">
                            {formatDate(r.createdAt)}
                          </span>
                        ),
                        className: "text-left",
                      },
                      {
                        render: r.paidOn ? (
                          <span className="text-gray-600 text-sm">
                            {formatDate(r.paidOn)}
                          </span>
                        ) : (
                          <Badge variant="light" color="yellow" size="sm">
                            Not Paid
                          </Badge>
                        ),
                        className: "text-left",
                      },
                      {
                        render: (() => {
                          const fb = training.ratings?.find(
                            (rt) => rt.userId === r.user.id,
                          );
                          if (!fb)
                            return (
                              <span className="text-gray-400 text-sm">
                                No feedback
                              </span>
                            );
                          return (
                            <div className="flex flex-col gap-1">
                              <Rating value={fb.rating} size="sm" readOnly />
                              <Text size="xs" className="text-gray-600 max-w-xs">
                                {fb.feedback}
                              </Text>
                            </div>
                          );
                        })(),
                        className: "text-left",
                      },
                      {
                        render: !r.certificate ? (
                          <Badge variant="light" color="gray" size="sm">
                            Pending
                          </Badge>
                        ) : r.certificate === "generating" ? (
                          <Badge variant="light" color="blue" size="sm">
                            Processing
                          </Badge>
                        ) : (
                          <Link
                            to={r.certificate!}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Download
                          </Link>
                        ),
                        className: "text-left",
                      },
                      {
                        render: (
                          <Link to={`/admin/students/${r.user.id}`}>
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
          )}

          {training.lessons && training.lessons.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Course Syllabus ({training.lessons.length} lessons)
              </h3>
              <div className="space-y-4">
                {training.lessons.map((l) => (
                  <Paper
                    p="md"
                    withBorder
                    className="rounded-lg"
                    key={l.id}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {l.title}
                      </h4>
                      <Badge
                        variant="light"
                        color={l.type === "ONLINE" ? "blue" : "green"}
                        size="sm"
                      >
                        {l.type}
                      </Badge>
                    </div>
                    {l.content && (
                      <div
                        className="ql-snow mb-3 text-sm"
                        dangerouslySetInnerHTML={{ __html: l.content }}
                      ></div>
                    )}
                    <div className="flex flex-col gap-2 text-sm">
                      {l.lastDate && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} />
                          <span>Due: {formatDate(l.lastDate)}</span>
                        </div>
                      )}
                      {l.type === "ONLINE" && l.video && (
                        <div className="pt-[56.25%] relative rounded-lg overflow-hidden bg-gray-100">
                          <ReactPlayer
                            url={l.video}
                            controls
                            height={"100%"}
                            width={"100%"}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                            }}
                          />
                        </div>
                      )}
                      {l.type === "OFFLINE" && l.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaLocationDot size={16} />
                          <span>{l.location}</span>
                        </div>
                      )}
                    </div>
                  </Paper>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
