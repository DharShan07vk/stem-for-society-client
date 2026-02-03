import { Badge, Button, NumberInput, Rating } from "@mantine/core";
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
    <div className="w-full mt-4">
      <div className="max-w-7xl h-full mx-auto flex flex-col px-4">
        {!training || Object.keys(training).length === 0 ? (
          <Errorbox message="No data! Must be an invalid link. Please refresh or go back and try again" />
        ) : (
          <>
            <div className=" flex flex-col gap-2">
              <div className="w-full">
                <Button
                  radius={999}
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
                  Back
                </Button>
              </div>
              <h3 className="mt-2 text-xl md:text-3xl flex items-center gap-2 font-semibold">
                {training.title}
                <Badge
                  variant="dot"
                  color={!training.category ? "gray" : "blue"}
                  className={
                    !training.category ? "text-gray-600" : "text-blue-500"
                  }
                >
                  {training.category || "Uncategorized"}
                </Badge>
              </h3>
              <div className="mt-5 flex gap-4">
                <img
                  src={training.coverImg ?? undefined}
                  alt={training.title}
                  className="w-2/3 object-contain aspect-video rounded-lg"
                />
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">Instructor details</h3>
                  <p className="flex flex-col font-semibold">
                    <span className="text-sm font-normal">Instructor</span>
                    {training.instructor.firstName +
                      " " +
                      (training.instructor.lastName ?? "")}
                  </p>
                  <p className="flex flex-col font-semibold">
                    <span className="text-sm font-normal">Institution</span>
                    {training.instructor.institutionName + ", "}
                    <p>{training.instructor.address.addressLine1}</p>
                    <p>{training.instructor.address.addressLine2 ?? ""}</p>
                    <p>{training.instructor.address.city}</p>
                    <p>{training.instructor.address.state}</p>
                    <p>{training.instructor.address.pincode}</p>
                  </p>
                  <span className="text-sm"></span>
                </div>
              </div>
              <span className="mt-2 text-xl md:text-lg">
                {training.description || "No description available"}
              </span>
              <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                Created on{" "}
                <span className="date ml-2 text-black font-semibold">
                  {formatDate(training.createdAt)}
                </span>
              </span>
              <span className="text-green-600 flex items-center gap-2 font-semibold text-xs sm:text-sm md:text-base mb-1">
                <FaLocationDot /> Mode:{" "}
                <span className=" text-black font-normal">
                  <Badge variant="dot" color={location ? "red" : "green"}>
                    {training.type ??
                      (training.location ? "Offline" : "Online")}
                  </Badge>
                </span>
              </span>
              <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                Location:{" "}
                <span className="location text-black font-semibold">
                  {training.location || "N/A"}
                </span>
              </span>
              <span className="text-green-600 flex items-center gap-2 font-semibold text-xs sm:text-sm md:text-base">
                <Link2 /> Meeting Link:{" "}
                <span className="location text-black font-semibold">
                  {training.link || "N/A"}
                </span>
              </span>
              <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                Cost:{" "}
                <span className="location text-black font-semibold">
                  ₹ {training.cost || "N/A"}
                </span>
              </span>
              <span className="text-green-600 flex items-center gap-2 font-semibold text-xs sm:text-sm md:text-base">
                <Calendar size={18} />
                Dates:{" "}
                <span className="location text-black font-semibold">
                  {formatDate(training.startDate) +
                    " to " +
                    formatDate(training.endDate)}
                </span>
              </span>
              <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                Payout:{" "}
                <span className="location text-black font-semibold">
                  {training.cut}%
                </span>
              </span>
            </div>
            <div className="flex justify-start gap-4 mt-5">
              {!training.approvedBy ? (
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                    Assigned Dates:{" "}
                  </span>
                  <div className="flex items-end w-2/3 gap-3">
                    <DateTimePicker
                      label="Start date and time"
                      placeholder="Start date and time"
                      value={formData.startDate}
                      onChange={(value) => handleDateChange("startDate", value)}
                      leftSection={<Calendar size={14} />}
                      className="w-1/3"
                    />
                    <DateTimePicker
                      label="End date and time"
                      placeholder="End date and time"
                      value={formData.endDate}
                      onChange={(value) => handleDateChange("endDate", value)}
                      leftSection={<Calendar size={14} />}
                      className="w-1/3"
                    />
                  </div>

                  <div className="mt-3">
                    <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                      Profit cut:{" "}
                    </span>
                    <NumberInput
                      description="This is the percentage of profit that will be provided to the instructor, after this training ends (Whole numbers only)"
                      step={1}
                      w={200}
                      value={formData.cut}
                      min={10}
                      defaultValue={10}
                      max={90}
                      onChange={(num) =>
                        setFormData((prev) => ({ ...prev, cut: Number(num) }))
                      }
                    />
                    {formData.cut !== 0 && (
                      <>
                        <p className="font-medium text-gray-600">
                          Payout {formData.cut}% for this course
                        </p>
                        <span className="text-sm text-gray-500">
                          If 10 people register for this course for ₹
                          {training.cost}, then after{" "}
                          {formatDate(formData.endDate ?? training.endDate)}
                          :{" "}
                        </span>
                        <br />
                        <span className="text-sm text-gray-500">
                          Instructor earns{" "}
                          {currencyFormatter.format(
                            (Number(training.cost) *
                              10 *
                              Number(formData.cut)) /
                              100,
                          )}{" "}
                          <br />
                          Platform earns{" "}
                          {currencyFormatter.format(
                            (Number(training.cost) *
                              10 *
                              (100 - Number(formData.cut))) /
                              100,
                          )}{" "}
                        </span>
                      </>
                    )}
                  </div>
                  <Button
                    radius={999}
                    w={300}
                    mt={12}
                    variant="filled"
                    color="green"
                    className="text-xs sm:text-sm md:text-base"
                    onClick={() =>
                      mutate({
                        decision: "approve",
                        startDate: formData.startDate ?? training.startDate,
                        endDate: formData.endDate ?? training.endDate,
                        cut: formData.cut!,
                      })
                    }
                    disabled={isPending || isLoading}
                  >
                    Approve
                  </Button>
                </div>
              ) : (
                <Button
                  radius={999}
                  variant="filled"
                  color="red"
                  className="text-xs sm:text-sm md:text-base"
                  onClick={() => mutate({ decision: "deny" })}
                  disabled={isPending || isLoading}
                >
                  Reject
                </Button>
              )}
            </div>

            {training.approvedBy && (
              <>
                <h3 className="text-xl font-medium mt-6">Students enrolled</h3>
                <Table
                  headers={[
                    { render: "S.No", className: "w-[10%]" },
                    { render: "Student Name", className: "w-[12%]" },
                    { render: "Enrolled on" },
                    {
                      render: "Paid on",
                    },
                    {
                      render: "Feedback",
                      className: "max-w-[30%]",
                    },
                    {
                      render: "Certificate",
                    },
                    { render: "Details" },
                  ]}
                  classNames={{
                    root: "bg-white rounded-lg shadow",
                  }}
                  rows={training.enrolments.map((r, i) => ({
                    id: r.id,
                    cells: [
                      {
                        render: i + 1,
                        className: "w-[10%]",
                      },
                      {
                        render:
                          r.user.firstName + " " + (r.user.lastName ?? ""),
                        className: "w-[12%]",
                      },
                      {
                        render: formatDate(r.createdAt),
                      },
                      {
                        render: r.paidOn ? (
                          formatDate(r.paidOn)
                        ) : (
                          <i>Not paid</i>
                        ),
                      },
                      {
                        render: (() => {
                          const fb = training.ratings?.find(
                            (rt) => rt.userId === r.user.id,
                          );
                          if (!fb) return <i>No feedback</i>;
                          return (
                            <div className="grid place-items-center">
                              <Rating value={fb.rating} />
                              {fb.feedback}
                            </div>
                          );
                        })(),
                        className: "max-w-[30%]",
                      },
                      {
                        render: !r.certificate ? (
                          <i>Yet to be generated</i>
                        ) : r.certificate === "generating" ? (
                          <i>Processing</i>
                        ) : (
                          <Link to={r.certificate!}>Click here</Link>
                        ),
                      },
                      {
                        render: (
                          <Link to={`/admin/students/${r.user.id}`}>
                            <Button radius={999}>View details</Button>
                          </Link>
                        ),
                      },
                    ],
                  }))}
                />
              </>
            )}

            {training.lessons && training.lessons.length > 0 && (
              <div className="grid gap-3 mt-8">
                <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                  Course Syllabus
                </span>
                {training.lessons.map((l) => (
                  <div className="w-full border my-1 rounded-md p-4" key={l.id}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">{l.title}</h4>
                      <Badge
                        variant="dot"
                        color={l.type === "ONLINE" ? "red" : "green"}
                      >
                        {l.type}
                      </Badge>
                    </div>
                    {l.content && (
                      <div
                        className="ql-snow"
                        dangerouslySetInnerHTML={{ __html: l.content }}
                      ></div>
                    )}
                    <div className="flex flex-col mb-2 gap-3">
                      <span className="text-gray-600">
                        <Calendar size={16} className="inline-block mr-1" />
                        {formatDate(l.lastDate)}
                      </span>
                      {l.type === "ONLINE" && l.video && (
                        <div className="pt-[56.25%] relative">
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
                    </div>
                    {l.type === "OFFLINE" && l.location && (
                      <div className="text-gray-600">
                        <FaLocationDot
                          size={16}
                          className="inline-block mr-1"
                        />
                        {l.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
