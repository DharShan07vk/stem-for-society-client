import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components1/ui/button";
import { ArrowLeft, CheckCircle, Award, ExternalLink, Calendar, MapPin, User } from "lucide-react";
import Header from "@/components1/Header";
import Footer from "@/components1/Footer";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { api, queryClient } from "@/lib/api";
import { GenericError, GenericResponse, RazorpayOrderOptions } from "@/lib/types";
import { formatDate, mutationErrorHandler, initializeRazorpay } from "@/lib/utils";
import Loading from "@/components/Loading";
import Errorbox from "@/components/Errorbox";
import { useUser } from "@/lib/hooks";
import { RZPY_KEYID } from "@/Constants";
import type { StudentTraining } from "./Courses";
import { FaLinkedin } from "react-icons/fa";

// Hook to fetch single training
function useTraining(id?: string) {
  return useQuery<GenericResponse<StudentTraining>, AxiosError<GenericError>>({
    queryKey: ["trainings", id],
    queryFn: async () => {
      const response = await api().get(`/trainings/${id}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

// Payment types
type CreatePaymentResponse = {
  amount: string;
  orderId: string;
};

function useEnroll(id?: string) {
  const nav = useNavigate();
  return useMutation<GenericResponse<CreatePaymentResponse>, AxiosError<GenericError>>({
    mutationFn: async () => {
      return (await api().post("/payments/create", { trainingId: id })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainings"] });
      queryClient.invalidateQueries({ queryKey: ["trainings", id] });
    },
    onError: (err) => mutationErrorHandler(err, nav, "/login"),
  });
}

// Feedback submission hook
function useSubmitFeedback(id: string) {
  const navigate = useNavigate();
  return useMutation<
    GenericResponse,
    AxiosError<GenericError>,
    { rating: number; feedback: string }
  >({
    mutationFn: async ({ rating, feedback }) => {
      const response = await api().post(`/trainings/${id}/feedback`, {
        rating,
        feedback,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["trainings", id] });
      toast.success(data.message);
    },
    onError: (err) => mutationErrorHandler(err, navigate, "/login"),
  });
}

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: userData } = useUser();
  
  const { data: trainingData, isLoading, error } = useTraining(id);
  const { mutateAsync, isPending } = useEnroll(id);
  
  const training = trainingData?.data;

  // Calculate course duration in weeks
  const calculateDuration = () => {
    if (!training?.startDate || !training?.endDate) return "6 weeks";
    const start = new Date(training.startDate);
    const end = new Date(training.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return `${diffWeeks} weeks`;
  };

  // Get mode text
  const getModeText = () => {
    if (!training?.type) return "Online";
    switch (training.type) {
      case "ONLINE": return "Online";
      case "OFFLINE": return "Offline";
      case "HYBRID": return "Hybrid(Online + Inperson)";
      default: return "Online";
    }
  };

  // Check if user is enrolled
  const isEnrolled = () => {
    if (!training) return false;
    if (training.isEnrolled) return true;
    return training.enrolments?.some(enrollment =>
      enrollment.transactions?.some(transaction => transaction.status === "success")
    );
  };

  // Generate duration string for email
  const generateDuration = (start: string, end: string) => {
    const startDate = new Date(formatDate(start));
    const endDate = new Date(formatDate(end));
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let duration: string;
    if (daysDiff === 1) {
      duration = "one day";
    } else if (daysDiff <= 7) {
      duration = `${daysDiff} days`;
    } else if (daysDiff <= 14) {
      duration = daysDiff === 7 ? "one week" : `${Math.ceil(daysDiff / 7)} weeks`;
    } else if (daysDiff <= 30) {
      duration = `${Math.ceil(daysDiff / 7)} weeks`;
    } else {
      const months = Math.ceil(daysDiff / 30);
      duration = months === 1 ? "one month" : `${months} months`;
    }
    return duration;
  };

  // Handle payment with full error handling and email
  const handlePayment = useCallback(async () => {
    try {
      const rzrpyInit = await initializeRazorpay();
      if (!rzrpyInit) return toast.error("Unable to initialize payment!");
      
      const paymentData = await mutateAsync();
      if (!paymentData.data) {
        toast.error("Something went wrong in creating payment!");
        return;
      }
      
      const order = paymentData.data;

      const options: RazorpayOrderOptions = {
        key: RZPY_KEYID,
        amount: Number(order.amount) * 100,
        currency: "INR",
        name: "STEM For Society",
        description: training?.title || "Course Enrollment",
        image: "https://stem-for-society.netlify.app/logo-01.png",
        order_id: order.orderId,
        prefill: {
          name: userData?.user?.firstName + " " + (userData?.user?.lastName || ""),
          email: userData?.user?.email,
          contact: userData?.user?.mobile,
        },
        async handler(response) {
          try {
            if ("error" in response) {
              // @ts-expect-error error handling
              toast.error(response.error.reason);
              queryClient.invalidateQueries({ queryKey: ["trainings"] });
              queryClient.invalidateQueries({ queryKey: ["trainings", id] });
              return;
            }
            
            toast.success(
              "Payment was made successfully and is being verified. We will get back to you shortly if verification fails",
              { autoClose: false, closeOnClick: false }
            );
            
            // Force immediate refresh
            await queryClient.invalidateQueries({ queryKey: ["trainings"] });
            await queryClient.invalidateQueries({ queryKey: ["trainings", id] });
            await queryClient.refetchQueries({ queryKey: ["trainings", id] });
            
            // Send course registration email
            try {
              await api().post('/email/send-course-registration', {
                userEmail: userData?.user?.email,
                userName: userData?.user?.firstName,
                courseName: training?.title || 'Course',
                amount: Number(order.amount),
                currency: 'INR',
                paymentId: response.razorpay_payment_id,
                courseDuration: generateDuration(training?.startDate || '', training?.endDate || ''),
                startDate: formatDate(training?.startDate || ''),
                phoneNumber: userData?.user?.mobile
              });
            } catch (emailError) {
              console.error('Failed to send course registration email:', emailError);
            }
            
          } catch (error) {
            console.error("Payment handler error:", error);
            toast.error("Payment was made, but it could not be verified");
            await queryClient.invalidateQueries({ queryKey: ["trainings"] });
            await queryClient.invalidateQueries({ queryKey: ["trainings", id] });
          }
        },
      };

      // @ts-expect-error Razorpay global
      const rzp = new Razorpay(options);

      rzp.on("payment.failed", async (res: any) => {
        console.error("Payment Failure:", res);
        toast.error("Payment failed! Reason:\n" + res.error.description, {
          autoClose: false,
          closeOnClick: false,
        });
        toast.error(
          "Please note Order ID: " + res.error.metadata.order_id +
          "\n Payment ID: " + res.error.metadata.payment_id,
          { autoClose: false, closeOnClick: false }
        );
        await queryClient.invalidateQueries({ queryKey: ["trainings"] });
        await queryClient.invalidateQueries({ queryKey: ["trainings", id] });
      });

      rzp.open();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 401) {
          toast.error("Please login again");
          return;
        }
      }
      console.error("Payment error:", error);
      toast.error("Something went wrong in the payment process");
    }
  }, [mutateAsync, userData, id, training]);

  // Handle registration
  const handleRegister = async () => {
    if (!userData) {
      navigate("/login");
      return;
    }

    if (isEnrolled()) {
      toast.info("You are already enrolled in this course");
      return;
    }

    // If course is free
    if (training?.cost === "0" || training?.cost === "free") {
      try {
        await api().post(`/trainings/${id}/enroll`);
        queryClient.invalidateQueries({ queryKey: ["trainings", id] });
        toast.success("Successfully enrolled!");
      } catch (err) {
        toast.error("Failed to enroll");
      }
      return;
    }

    // Paid course - use handlePayment
    handlePayment();
  };

  // Get course tags
  const getCourseTags = (): string[] => {
    const tags: string[] = [];
    if (training?.category) {
      tags.push(training.category);
    } else {
      tags.push("Certificate Program");
    }

      tags.push("For Individuals");

    return tags;
  };

  if (isLoading) return <Loading />;
  if (error) return <Errorbox message={error.message} />;
  if (!training) return <Errorbox message="Course not found" />;

  const instructorName = `${training.instructor?.firstName || ""} ${training.instructor?.lastName || ""}`.trim() || "Instructor";
  const institutionName = training.instructor?.institutionName || "Institution";
  const courseTags = getCourseTags();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2 text-gray-600 border-gray-200 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {training.title}
              </h1>
              <p className="text-gray-600 mb-4">{training.category || 'Professional Program'}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full">
                  <Calendar className="w-4 h-4 text-[#0D9488]" />
                  {formatDate(training.startDate)}
                </span>
                <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full">
                  <MapPin className="w-4 h-4 text-[#0389FF]" />
                  {getModeText()}
                </span>
                <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full">
                  <User className="w-4 h-4 text-[#F59E0B]" />
                  {instructorName}
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="w-full lg:w-80">
              <div className="rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={training.coverImg || "/course-images/default.jpg"}
                  alt={training.title}
                  className="w-full h-48 md:h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description and Register */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600 leading-relaxed">{training.description}</p>
            </div>

            {/* Topics Section */}
            {training.lessons && training.lessons.length > 0 && (
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Topics Covered</h2>
                <ul className="space-y-2">
                  {training.lessons.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#0D9488] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{lesson.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Instructor</h3>
                <p className="text-lg font-semibold text-gray-900">{instructorName}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Institution</h3>
                <p className="text-lg font-semibold text-gray-900">{institutionName}</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Registration Section */}
            {!userData ? (
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm text-center">
                <p className="text-gray-600 mb-4">Sign in to enroll in this course</p>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-[#0D9488] text-white hover:bg-teal-600 rounded-xl h-12 font-semibold"
                >
                  Sign In
                </Button>
              </div>
            ) : !isEnrolled() ? (
              <div className="bg-gradient-to-br from-[#0D9488] to-[#0389FF] rounded-2xl p-6 text-white shadow-sm">
                <div className="mb-4">
                  <p className="text-lg opacity-90 mb-1">Price</p>
                  <p className="text-3xl font-bold">
                    ₹{Number(training.cost || 0).toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={handleRegister}
                  disabled={isPending}
                  className="w-full bg-white text-[#0D9488] hover:bg-gray-100 rounded-xl h-12 font-semibold"
                >
                  {isPending ? "Processing..." : "Enroll Now"}
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Already Enrolled</span>
                </div>

                {training.link && (
                  <Button
                    onClick={() => window.open(training.link, "_blank")}
                    className="w-full bg-[#0D9488] text-white hover:bg-teal-600 rounded-xl h-12 font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Access Course
                  </Button>
                )}

                {training.enrolments?.[0]?.certificate && (
                  <>
                    <Button
                      onClick={() => window.open(training.enrolments?.[0]?.certificate, "_blank")}
                      className="w-full bg-green-600 text-white hover:bg-green-700 rounded-xl h-12 font-semibold"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Download Certificate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${training.enrolments?.[0]?.certificate}&text=I completed ${training.title} on STEM for Society!`, "_blank")}
                      className="w-full border-[#0D9488] text-[#0D9488] rounded-xl h-12 font-semibold"
                    >
                      <FaLinkedin className="w-4 h-4 mr-2" />
                      Share on LinkedIn
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Course Info */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-medium">Duration</p>
                <p className="text-sm font-semibold text-gray-900">{calculateDuration()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Mode</p>
                <p className="text-sm font-semibold text-gray-900">{getModeText()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Certificate</p>
                <p className="text-sm font-semibold text-gray-900">Yes, Upon Completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetails;
