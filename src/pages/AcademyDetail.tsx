import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components1/ui/button";
import { Input } from "@/components1/ui/input";
import { Calendar, Clock, CheckCircle2, Users, BookOpen, Award, ExternalLink } from "lucide-react";
import Header from "@/components1/Header";
import Footer from "@/components1/Footer";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api, queryClient } from "@/lib/api";
import { GenericError, GenericResponse, RazorpayOrderOptions } from "@/lib/types";
import { formatDate, mutationErrorHandler, initializeRazorpay } from "@/lib/utils";
import Loading from "@/components/Loading";
import Errorbox from "@/components/Errorbox";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useUser } from "@/lib/hooks";
import { RZPY_KEYID } from "@/Constants";
import { Rating, Textarea } from "@mantine/core";
import { FaLinkedin } from "react-icons/fa";

dayjs.extend(utc);

// Student training data structure
export type StudentTraining = {
  id: string;
  title: string;
  coverImg: string;
  startDate: string;
  endDate: string;
  description: string;
  createdAt: string;
  category?: string;
  course_type?: string;
  instructor: {
    firstName: string;
    lastName?: string;
    institutionName?: string;
  };
  link?: string;
  cost: string;
  location?: string;
  isEnrolled: boolean;
  displayFeedback: boolean;
  ratings: {
    feedback: string;
    rating: number;
    completedOn: string;
  }[];
  enrolments: {
    id: string;
    userId: string;
    trainingId: string;
    completedOn: string | null;
    createdAt: string;
    updatedAt?: string;
    certificateNo?: string;
    certificate?: string;
    transactions?: {
      amount: string;
      status: string;
    }[];
  }[];
  type: "ONLINE" | "OFFLINE" | "HYBRID";
  whoIsItFor?: string[];
  whatYouWillLearn?: string[];
};

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
      toast.success(data.message || "Feedback submitted successfully!");
    },
    onError: (err) => {
      console.error("Feedback submission error:", err.response?.data);
      
      // Only redirect to login if it's an auth error
      if (err.status === 401) {
        mutationErrorHandler(err, navigate, "/login");
      }
    },
  });
}

// Rating and Feedback Component
function RatingAndFeedback({
  id,
  data,
  disabled,
}: {
  id: string;
  data: StudentTraining;
  disabled?: boolean;
}) {
  const [rating, setRating] = useState<number>(
    data.ratings ? data.ratings[0]?.rating : 0
  );
  const [feedback, setFeedback] = useState<string>(
    data.ratings ? data.ratings[0]?.feedback : ""
  );
  const mutation = useSubmitFeedback(id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ rating, feedback });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900">Rate & Review</h4>
      <Rating
        value={rating}
        onChange={setRating}
        className={disabled ? "opacity-80 pointer-events-none" : ""}
      />
      <Textarea
        rows={5}
        value={feedback}
        className={disabled ? "opacity-80 pointer-events-none" : ""}
        onChange={(event) => setFeedback(event.currentTarget.value)}
        placeholder="Enter feedback to apply for certificate"
      />
      <Button
        onClick={handleSubmit}
        disabled={data.ratings?.length > 0 || mutation.isPending}
        className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white"
      >
        {data.ratings?.length > 0 ? "Already submitted" : "Submit feedback"}
      </Button>
    </div>
  );
}
const AcademyDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user: userData } = useUser();
  const { data: trainingData, isLoading, error } = useTraining(courseId);
  const { mutateAsync, isPending } = useEnroll(courseId);
  
  const course = trainingData?.data;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
  });

  // Populate form data when userData is available
  useEffect(() => {
    if (userData?.user) {
      setFormData({
        fullName: userData.user.firstName && userData.user.lastName 
          ? `${userData.user.firstName} ${userData.user.lastName}` 
          : userData.user.firstName || "",
        email: userData.user.email || "",
        mobile: userData.user.mobile || "",
      });
    }
  }, [userData]);

  // Calculate duration from start and end dates
  const calculateDuration = () => {
    if (!course?.startDate || !course?.endDate) return "6 months";
    const start = dayjs(course.startDate);
    const end = dayjs(course.endDate);
    const weeks = end.diff(start, 'week');
    const months = end.diff(start, 'month');
    
    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  };

  // Get mode text
  const getModeText = () => {
    if (!course?.type) return "Hybrid";
    return course.type.charAt(0) + course.type.slice(1).toLowerCase();
  };

  // Get formatted time range
  const getTimeRange = () => {
    if (!course?.startDate || !course?.endDate) return "10:00 AM - 12:00 PM";
    const startTime = dayjs.utc(course.startDate).format("hh:mm A");
    const endTime = dayjs.utc(course.endDate).format("hh:mm A");
    return `${startTime} - ${endTime}`;
  };

  // Check if user is enrolled
  const isEnrolled = () => {
    if (!course) return false;
    if (course.isEnrolled) return true;
    return course.enrolments?.some(enrollment =>
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

  // Default values for incase of missing data
  const whoIsItFor = course?.whoIsItFor || [
    "Fresh graduates looking to specialize",
    "Working professionals seeking career advancement",
    "Researchers wanting to advance their skills",
    "Students interested in the field",
  ];

  const whatYouLearn = course?.whatYouWillLearn || [
    "Foundation and fundamentals",
    "Advanced techniques and methodologies",
    "Practical tools and software",
    "Research methodologies and project management",
    "Industry best practices and case studies",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        description: course?.title || "Course Enrollment",
        image: "https://stem-for-society.netlify.app/logo-01.png",
        order_id: order.orderId,
        prefill: {
          name: formData.fullName || userData?.user?.firstName + " " + (userData?.user?.lastName || ""),
          email: formData.email || userData?.user?.email,
          contact: formData.mobile || userData?.user?.mobile,
        },
        async handler(response) {
          try {
            if ("error" in response) {
              // @ts-expect-error error handling
              toast.error(response.error.reason);
              queryClient.invalidateQueries({ queryKey: ["trainings"] });
              queryClient.invalidateQueries({ queryKey: ["trainings", courseId] });
              return;
            }
            
            toast.success(
              "Payment was made successfully and is being verified. We will get back to you shortly if verification fails",
              { autoClose: false, closeOnClick: false }
            );
            
            // Force immediate refresh
            await queryClient.invalidateQueries({ queryKey: ["trainings"] });
            await queryClient.invalidateQueries({ queryKey: ["trainings", courseId] });
            await queryClient.refetchQueries({ queryKey: ["trainings", courseId] });
            
            // Send course registration email
            try {
              await api().post('/email/send-course-registration', {
                userEmail: formData.email || userData?.user?.email,
                userName: formData.fullName || userData?.user?.firstName,
                courseName: course?.title || 'Course',
                amount: Number(order.amount),
                currency: 'INR',
                paymentId: response.razorpay_payment_id,
                courseDuration: generateDuration(course?.startDate || '', course?.endDate || ''),
                startDate: formatDate(course?.startDate || ''),
                phoneNumber: formData.mobile || userData?.user?.mobile
              });
            } catch (emailError) {
              console.error('Failed to send course registration email:', emailError);
            }
            
          } catch (error) {
            console.error("Payment handler error:", error);
            toast.error("Payment was made, but it could not be verified");
            await queryClient.invalidateQueries({ queryKey: ["trainings"] });
            await queryClient.invalidateQueries({ queryKey: ["trainings", courseId] });
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
        await queryClient.invalidateQueries({ queryKey: ["trainings", courseId] });
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
  }, [mutateAsync, userData, courseId, course, formData]);

  // Handle registration
  const handleContinue = async () => {
    // Validate form data
    if (!formData.fullName || !formData.email || !formData.mobile) {
      toast.error("Please fill in all personal details");
      return;
    }

    // Check if user is logged in
    if (!userData) {
      toast.error("Please login to continue with enrollment");
      navigate("/login");
      return;
    }

    // Check if already enrolled
    if (isEnrolled()) {
      toast.info("You are already enrolled in this course");
      return;
    }

    // If course is free
    if (course?.cost === "0" || course?.cost === "free") {
      try {
        await api().post(`/trainings/${courseId}/enroll`);
        queryClient.invalidateQueries({ queryKey: ["trainings", courseId] });
        toast.success("Successfully enrolled!");
      } catch (err) {
        toast.error("Failed to enroll");
      }
      return;
    }

    // Paid course - use handlePayment
    await handlePayment();
  };

  if (isLoading) return <Loading />;
  if (error) return <Errorbox message={error.message} />;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button onClick={() => navigate("/")}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 mb-6 md:mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 md:gap-6 lg:gap-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3 break-words">
                {course.title}
              </h1>
              <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">{course.category || 'Professional Program'}</p>
              <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm">
                <span className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 bg-gray-100 rounded-full whitespace-nowrap">
                  <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  English
                </span>
                <span className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
                  <Award className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {getModeText()}
                </span>
                <span className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 bg-green-100 text-green-700 rounded-full whitespace-nowrap">
                  <Users className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Live
                </span>
              </div>
            </div>

            {/* Date and Time Display (Static) */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-2 md:space-y-3">
              <div className="bg-gray-50 rounded-xl p-3 md:p-4 border border-gray-200">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-8 md:w-10 h-8 md:h-10 bg-[#0D9488] rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 md:w-5 h-4 md:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Date</p>
                    <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{formatDate(course.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 md:w-10 h-8 md:h-10 bg-[#0389FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 md:w-5 h-4 md:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Time</p>
                    <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{getTimeRange()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Overview */}
        <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 mb-6 md:mb-8 shadow-sm">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Session Overview</h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">{course.description}</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-4 md:space-y-6">
            {/* Who is it for? */}
            <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Who is it for?</h3>
              <ul className="space-y-2 md:space-y-3">
                {whoIsItFor.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 md:gap-3">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#0D9488] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What You'll Learn */}
            <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">What You'll Learn?</h3>
              <ul className="space-y-2 md:space-y-3">
                {whatYouLearn.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 md:gap-3">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#0389FF] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course Image */}
            
          </div>

          {/* Right Column - Booking Form / Enrollment Status */}
          <div className=" lg:top-6 pb-6 h-fit space-y-3 md:space-y-4">
            {!userData ? (
              <>
                <div className="bg-gradient-to-br from-[#0D9488] to-[#0389FF] rounded-2xl p-4 md:p-6 lg:p-8 text-white shadow-xl">
                  <div className="text-center mb-4 md:mb-6">
                    <p className="text-sm md:text-base opacity-90 mb-2">With</p>
                    <p className="text-3xl md:text-4xl font-bold">
                      ₹{Number(course.cost || 0).toLocaleString()}
                    </p>
                    <p className="text-sm md:text-base opacity-90 mt-2">confirm your seat</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 mb-4 md:mb-6">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <span className="flex items-center gap-2 text-sm md:text-base">
                        Personal details
                      </span>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <Input
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="h-10 md:h-12 bg-white text-gray-900 rounded-xl text-sm"
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="h-10 md:h-12 bg-white text-gray-900 rounded-xl text-sm"
                      />
                      <Input
                        type="tel"
                        placeholder="Mobile number"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange("mobile", e.target.value)}
                        className="h-10 md:h-12 bg-white text-gray-900 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full h-10 md:h-12 bg-white text-[#0D9488] hover:bg-gray-100 rounded-xl font-semibold md:font-bold text-sm md:text-base shadow-lg"
                  >
                    Login to Continue
                  </Button>
                </div>
              </>
            ) : !isEnrolled() ? (
              <>
                <div className="bg-gradient-to-br from-[#0D9488] to-[#0389FF] rounded-2xl p-4 md:p-6 lg:p-8 text-white shadow-xl">
                  <div className="text-center mb-4 md:mb-6">
                    <p className="text-sm md:text-base opacity-90 mb-2">With</p>
                    <p className="text-3xl md:text-4xl font-bold">
                      ₹{Number(course.cost || 0).toLocaleString()}
                    </p>
                    <p className="text-sm md:text-base opacity-90 mt-2">confirm your seat</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 mb-4 md:mb-6">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <span className="flex items-center gap-2 text-sm md:text-base">
                        Personal details
                      </span>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <Input
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="h-10 md:h-12 bg-white text-gray-900 rounded-xl text-sm"
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="h-10 md:h-12 bg-white text-gray-900 rounded-xl text-sm"
                      />
                      <Input
                        type="tel"
                        placeholder="Mobile number"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange("mobile", e.target.value)}
                        className="h-10 md:h-12 bg-white text-gray-900 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleContinue}
                    disabled={isPending}
                    className="w-full h-10 md:h-12 bg-white text-[#0D9488] hover:bg-gray-100 rounded-xl font-semibold md:font-bold text-sm md:text-base shadow-lg"
                  >
                    {isPending ? "Processing..." : "Continue"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {/* Already Enrolled Card */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 md:p-6 lg:p-8 text-white shadow-xl">
                  <div className="text-center mb-4 md:mb-6">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">You're Enrolled!</h3>
                    <p className="text-green-100">You have successfully registered for this course</p>
                  </div>

                  {/* Enrollment Details */}
                  {course.enrolments?.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 mb-3 md:mb-4">
                      <p className="text-sm mb-2">
                        Enrolled on:{" "}
                        <span className="font-semibold">
                          {formatDate(course.enrolments[0]?.createdAt)}
                        </span>
                      </p>
                      {course.link && (
                        <p className="text-sm">
                          Course Link:{" "}
                          <a
                            href={course.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-semibold hover:text-green-100"
                          >
                            Access Course
                          </a>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Course Access Button */}
                  {course.link && (
                    <Button
                      variant="outline"
                      className="w-full bg-white text-green-600 hover:bg-green-50 border-0 h-10 md:h-12 rounded-xl font-semibold text-sm md:text-base"
                    >
                      <a 
                        href={course.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 w-full"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Access Course</span>
                      </a>
                    </Button>
                  )}
                </div>

                {/* Certificate Section */}
                {course.enrolments?.[0]?.certificate && (
                  <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border-2 border-green-500">
                    <div className="space-y-4">
                      <div className="text-center">
                        <Award className="w-12 h-12 text-green-600 mx-auto mb-3" />
                        <h4 className="font-bold text-green-800 text-xl mb-2">
                          🎉 Congratulations!
                        </h4>
                        <p className="text-gray-700 text-sm">
                          You have successfully completed the training and earned a certificate!
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 md:gap-3">
                        <Button className="bg-green-600 hover:bg-green-700 text-white h-10 md:h-12 rounded-xl text-sm md:text-base">
                          <Link
                            target="_blank"
                            to={course.enrolments[0].certificate}
                            className="flex items-center justify-center space-x-2 w-full"
                          >
                            <Award className="h-3.5 md:h-4 w-3.5 md:w-4" />
                            <span>Download Certificate</span>
                          </Link>
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50 h-10 md:h-12 rounded-xl text-sm md:text-base"
                        >
                          <Link
                            target="_blank"
                            to={`https://www.linkedin.com/shareArticle?mini=true&url=${course.enrolments[0].certificate}&text=Hello connections! I have completed a course with STEM for society website and have earned a certificate on ${course.title}`}
                            className="flex items-center justify-center space-x-2 w-full"
                          >
                            <FaLinkedin className="h-4 w-4" />
                            <span>Share on LinkedIn</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                {course.displayFeedback && (
                  <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
                    <RatingAndFeedback
                      data={course}
                      id={courseId!}
                      disabled={course.ratings?.length > 0}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Terms & Conditions - Full Width */}
        <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 mb-8 md:mb-12 shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Terms & Conditions</h3>
          <ul className="space-y-2 text-sm md:text-base text-gray-600 mb-4">
            <li>• Class link shared on session day (join early for tech checks)</li>
            <li>• Fee is non-refundable and non-transferable</li>
            <li>• Active internet connection required</li>
          </ul>
          <p className="text-xs md:text-sm text-gray-500">
            By continuing, you agree to share your info with STEM for Society & the course provider, as per data protection laws.
          </p>
        </div>

        {/* Program Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          <div className="bg-white rounded-2xl p-4 md:p-6 text-center shadow-sm">
            <BookOpen className="w-8 md:w-12 h-8 md:h-12 text-[#0D9488] mx-auto mb-2 md:mb-3" />
            <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Duration</h4>
            <p className="text-gray-600 text-xs md:text-sm">{calculateDuration()}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 text-center shadow-sm">
            <Calendar className="w-8 md:w-12 h-8 md:h-12 text-[#0389FF] mx-auto mb-2 md:mb-3" />
            <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Start Date</h4>
            <p className="text-gray-600 text-xs md:text-sm">{formatDate(course.startDate)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 text-center shadow-sm">
            <Award className="w-8 md:w-12 h-8 md:h-12 text-[#F59E0B] mx-auto mb-2 md:mb-3" />
            <h4 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Certification</h4>
            <p className="text-gray-600 text-xs md:text-sm">Industry Recognized</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AcademyDetail;
