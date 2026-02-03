import { Alert, Badge, Button, Rating, Skeleton } from "@mantine/core";
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
    <div className="w-full my-4">
      <div className="max-w-7xl mx-auto flex flex-col">
        {!event ? (
          <Errorbox message="No data! Must be an invalid link. Please refresh or go back and try again" />
        ) : (
          <>
            <div className="px-2 flex flex-col gap-4">
              <div className="w-full">
                {/*// @ts-expect-error shutup */}
                <Link to={-1}>
                  <Button radius={999} fullWidth={false}>
                    <ChevronLeft size={16} />
                    Back
                  </Button>
                </Link>
              </div>
              <h3 className="mt-2 text-xl md:text-3xl flex items-center gap-2 font-semibold">
                {event.title}
                <Badge
                  variant="dot"
                  color={!event.category ? "gray" : "blue"}
                  className={
                    !event.category ? "text-gray-600" : "text-blue-500"
                  }
                >
                  {event.category || "Uncategorized"}
                </Badge>
              </h3>
              {payoutLoading || !payoutData ? (
                <Skeleton width={"100%"} h={100} />
              ) : (
                <PayoutStatusBanner status={payoutData.payoutEligibility} />
              )}
              <Alert color={event.approvedBy ? "green" : "yellow"}>
                <Badge
                  color={event.approvedBy ? "green" : "yellow"}
                  classNames={{ label: "font-normal" }}
                >
                  {event.approvedBy ? "approved" : "pending"}
                </Badge>
                <br />
                {event.approvedBy
                  ? "Course approved!"
                  : "Course awaits approval"}
              </Alert>
              <div className=" mt-5">
                <img
                  src={event.coverImg ?? undefined}
                  alt={event.title}
                  className="w-2/3 object-contain rounded-lg"
                />
              </div>
              <span className="mt-2 text-xl md:text-lg">
                {event.description}
              </span>
              <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                Created on{" "}
                <span className="date ml-2 text-black font-semibold">
                  {formatDate(event.createdAt)}
                </span>
              </span>
              <span className="text-green-600 flex items-center gap-2 font-semibold text-xs sm:text-sm md:text-base mb-1">
                <FaLocationDot /> Mode:{" "}
                <span className=" text-black font-normal">
                  <Badge variant="dot" color={location ? "red" : "green"}>
                    {event.type ?? (event.location ? "Offline" : "Online")}
                  </Badge>
                </span>
              </span>
              <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                Location:{" "}
                <span className="location text-black font-semibold">
                  {event.location || "N/A"}
                </span>
              </span>
              <span className="text-green-600 flex items-center gap-2 font-semibold text-xs sm:text-sm md:text-base">
                <Link2 /> Meeting Link:{" "}
                <span className="location text-black font-semibold">
                  {event.link || "N/A"}
                </span>
              </span>
              <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                Cost:{" "}
                <span className="location text-black font-semibold">
                  ₹ {event.cost || "N/A"}
                </span>
              </span>
              <span className="text-green-600 flex items-center gap-2 font-semibold text-xs sm:text-sm md:text-base">
                <Calendar size={18} />
                Dates:{" "}
                <span className="location text-black font-semibold">
                  {formatDate(event.startDate) +
                    " to " +
                    formatDate(event.endDate)}
                </span>
              </span>
              <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                Payout:{" "}
                <span className="location text-black font-semibold">
                  {event.cut}%
                </span>
              </span>
              <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                Total registrations:{" "}
                <span className="location text-black font-semibold">
                  {event.enrolments.length} student(s)
                </span>{" "}
              </span>
              <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                Potential Pay:{" "}
                <span className="location text-black font-semibold">
                  {currencyFormatter.format(
                    event.enrolments.length *
                      Number(event.cost) *
                      (Number(event.cut) / 100),
                  )}{" "}
                </span>{" "}
              </span>

              {event.lessons && event.lessons.length > 0 && (
                <div className="grid gap-3 mt-8">
                  <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                    Course Syllabus
                  </span>
                  {event.lessons.map((l) => (
                    <div
                      className="w-full border my-1 rounded-md p-4"
                      key={l.id}
                    >
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

              <div className="mt-6 w-full">
                <h2 className="font-medium text-lg">Certificate generation</h2>
                <p className="text-sm mb-3">
                  Select the students for whom you want to generate certificates
                </p>
                <div className="flex mb-4">
                  <Button
                    radius={999}
                    disabled={isPending || selectedStudents.length < 1}
                    onClick={() => {
                      generateCertificates(selectedStudents);
                    }}
                  >
                    {selectedStudents.length < 1
                      ? "Select to generate"
                      : "Generate certificates"}
                  </Button>
                </div>
                <Table
                  selectable
                  setSelectedRows={setSelectedStudents}
                  selectedRows={selectedStudents}
                  selectionDisabled={event.enrolments
                    .filter((enr) => enr.certificate)
                    .map((enr) => enr.id)}
                  selectionDisabledRender={"N/A"}
                  headers={[
                    {
                      render: "S.No",
                    },
                    {
                      render: "Student",
                    },
                    {
                      render: "Enrolled on",
                    },
                    {
                      render: "Feedback",
                      className: "max-w-[30%]",
                    },
                    {
                      render: "Certificate",
                    },
                  ]}
                  rows={event.enrolments?.map((enrolment, i) => ({
                    id: enrolment.id,
                    cells: [
                      {
                        render: i + 1,
                      },
                      {
                        render: (
                          <div className="flex flex-col">
                            <p className="font-medium">
                              {enrolment.user.firstName +
                                " " +
                                (enrolment.user.lastName ?? "")}
                            </p>
                            <p>
                              {enrolment.user.mobile +
                                " " +
                                enrolment.user.email}
                            </p>
                          </div>
                        ),
                      },
                      {
                        render: enrolment.paidOn
                          ? formatDate(enrolment.paidOn)
                          : "Not paid",
                      },
                      {
                        render: (() => {
                          const fb = event.ratings?.find(
                            (rt) => rt.userId === enrolment.user.id,
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
                        render: !enrolment.certificate ? (
                          <i>Yet to be generated</i>
                        ) : enrolment.certificate === "generating" ? (
                          <i>Processing</i>
                        ) : (
                          <Link
                            to={enrolment.certificate!}
                            target="_blank"
                            className="text-blue-500 underline"
                          >
                            Click here
                          </Link>
                        ),
                      },
                    ],
                  }))}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
