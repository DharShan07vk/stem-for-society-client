import { useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components1/ui/button";
import { ArrowLeft, Share2, CheckCircle, Award, ExternalLink } from "lucide-react";
import { Icon } from "@iconify/react";
import { Badge } from "@/components1/ui/badge";
import Header from "@/components1/Header";
import Footer from "@/components1/Footer";
import GridBackground from "@/components1/GridBackground";
import { useShare } from "@/hooks/useShare";
import { SharePopup } from "@/components1/ui/SharePopup";
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
import type { StudentTraining } from "./ExploreCourses";
import VectorIcon from "@/assets/Vector.png";
import { Rating, Textarea } from "@mantine/core";
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

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isShowing, handleShare } = useShare();
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
    <div className="min-h-screen bg-white">
      <GridBackground>
        <Header />
        
        {/* Main Content */}
        <div className="container mx-auto px-4 max-w-4xl pt-4 pb-8">
          {/* Back Button and Share */}
          <div className="flex items-center justify-between py-4">
            <Link to="/newcourse">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 text-white border-[#00549FB8] rounded-full px-4 hover:bg-[#00549FB8]/90"
                style={{ backgroundColor: '#00549FB8' }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2 text-white border-[#00549FB8] rounded-full px-4 hover:bg-[#00549FB8]/90"
              style={{ backgroundColor: '#00549FB8' }}
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>

          {/* Title Section */}
          <div className="text-center mb-6">
            <p className="text-[#000000] text-sm mb-1">Detailed view</p>
            <h1 className="text-2xl md:text-3xl font-medium text-[#000000] relative inline-block">
              <span className="relative">
                {training.title}
                <span className="absolute bottom-1 left-0 w-full h-[30%] bg-yellow-300 -z-10"></span>
              </span>
            </h1>
          </div>

          {/* Course Info Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-4 py-2 bg-[#0389FF] text-white text-sm rounded-full">
              Duration : {calculateDuration()}
            </span>
            <span className="px-4 py-2 bg-[#0389FF] text-white text-sm rounded-full">
              Level : Intermediate
            </span>
            <span className="px-4 py-2 bg-[#0389FF] text-white text-sm rounded-full">
              Mode : {training.type === "ONLINE" ? "Online" : training.type === "OFFLINE" ? "Offline" : "Hybrid"}
            </span>
            <span className="px-4 py-2 bg-[#0389FF] text-white text-sm rounded-full">
              Certificate : Yes, Upon Completion
            </span>
          </div>

          {/* Course Image Card */}
          <div className="relative rounded-2xl overflow-hidden mb-6 max-w-[720px] mx-auto">
            <img
              src={training.coverImg || "/course-images/default.jpg"}
              alt={training.title}
              className="w-full h-[300px] md:h-[380px] object-cover"
            />
            {/* Category Badge */}
            <div className="absolute top-2 left-4">
             <Badge className="bg-[#0389FF] text-white text-xs px-3 py-1.5 rounded-2xl font-medium flex items-center gap-1.5 whitespace-nowrap">
          <img src={VectorIcon} className="w-4 h-4 object-contain" alt="" />
          {training.category}
        </Badge>
            </div>
          </div>

          {/* Tags Below Image */}
          <div className="flex flex-wrap gap-2 mb-4 max-w-[720px] mx-auto ">
            {courseTags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#0389FF1A] inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full  text-[#0389FF] bg-white"  
              >
                <span className="w-2 h-2 rounded-full bg-[#0389FF]  "></span>
                {tag}
              </span>
            ))}
          </div>

          {/* Course Title & Short Description */}
          <div className="max-w-[720px] mx-auto mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {training.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {training.description?.substring(0, 150) || "Explore the forefront of genomic research in oncology. Uncover insights for personalized treatments."}
            </p>
          </div>

          {/* Course Meta Info Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-gray-200 max-w-[720px] mx-auto mb-6">
            <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
              <Icon icon="solar:calendar-bold" className="w-5 h-5 text-[#0389FF]" />
              <span>Starts {formatDate(training.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
              <Icon icon="basil:location-solid" className="w-5 h-5 text-[#0389FF]" />
              <span>{getModeText()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
              <Icon icon="solar:user-bold" className="w-5 h-5 text-[#0389FF]" />
              <span>{instructorName}</span>
            </div>
          </div>

          {/* Long Description */}
          <div className="max-w-[720px] mx-auto mb-8">
            <p className="text-gray-700 text-sm leading-relaxed">
              {training.description || "This 6-week online course is designed for medical students and healthcare professionals who want to strengthen their diagnostic skills. You'll explore real-world clinical scenarios, learn to analyze patient symptoms, interpret lab results, and confidently arrive at differential diagnoses. The course includes case-based discussions, expert-led video lectures, interactive simulations, and end-of-module quizzes."}
            </p>
          </div>

          {/* Topics Covered Section */}
          <div className="max-w-[720px] mx-auto mb-6">
            <div className="bg-[#0389FF] text-white px-4 py-3 rounded-t-lg">
              <h3 className="font-medium">Topics Covered</h3>
            </div>
            <div className="bg-[#E8F4FF] px-4 py-4 rounded-b-lg">
              <p className="text-gray-700 text-sm">
                {training.lessons?.map(l => l.title).join(" ") || 
                "Patient history & symptom clustering Common diagnostic tests & imaging Differential diagnosis frameworks Red flags in common presentations Communicating diagnoses to patients"}
              </p>
            </div>
          </div>

          {/* Instructor & Institution Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[720px] mx-auto mb-8">
            {/* Instructor */}
            <div>
              <div className="bg-[#0389FF] text-white px-4 py-3 rounded-t-lg">
                <h3 className="font-medium">Instructor</h3>
              </div>
              <div className="bg-white border border-gray-200 border-t-0 px-4 py-4 rounded-b-lg">
                <p className="text-gray-700 text-sm">{instructorName}</p>
              </div>
            </div>
            
            {/* Institution/Industry */}
            <div>
              <div className="bg-[#0389FF] text-white px-4 py-3 rounded-t-lg">
                <h3 className="font-medium">Institution/Industry</h3>
              </div>
              <div className="bg-white border border-gray-200 border-t-0 px-4 py-4 rounded-b-lg">
                <p className="text-gray-700 text-sm">{institutionName}</p>
              </div>
            </div>
          </div>

          {/* Register Now Button or Enrollment Details */}
          <div className="max-w-[720px] mx-auto mb-8">
            {!userData ? (
              <div className="flex justify-end">
                <Link to="/login">
                  <Button className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-8 py-3 rounded-full font-medium">
                    Sign in to Enroll
                  </Button>
                </Link>
              </div>
            ) : !isEnrolled() ? (
              <div className="flex justify-end">
                <Button
                  onClick={handleRegister}
                  disabled={isPending}
                  className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-8 py-3 rounded-full font-medium"
                >
                  {isPending ? "Processing..." : "Register Now"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Already Enrolled Button */}
                <div className="flex justify-end">
                  <Button className="bg-green-600 text-white px-8 py-3 rounded-full font-medium" disabled>
                    ✓ Already Enrolled
                  </Button>
                </div>
                
                {/* Enrollment Details */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">You're Enrolled!</span>
                  </div>
                  
                  {/* Enrollment Date */}
                  {training.enrolments?.length > 0 && (
                    <div className="mb-2">
                      <span className="text-green-700 text-sm">
                        Enrolled on:{" "}
                        <span className="font-semibold text-green-900">
                          {formatDate(training.enrolments[0]?.createdAt)}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Course Link */}
                  {training.link && (
                    <div className="mb-3">
                      <span className="text-green-700 text-sm">
                        Course Link:{" "}
                        <a
                          href={training.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline font-semibold"
                        >
                          Access Course
                        </a>
                      </span>
                    </div>
                  )}

                  {/* Course Access Button */}
                  {training.link && (
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50 mb-3"
                    >
                      <a 
                        href={training.link} 
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
                {training.enrolments?.[0]?.certificate && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-800 text-lg">
                        🎉 Congratulations!
                      </h4>
                      <p className="text-green-700 text-sm">
                        You have successfully completed the training and earned a certificate!
                      </p>
                      <div className="flex flex-col gap-2">
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          <Link
                            target="_blank"
                            to={training.enrolments[0].certificate}
                            className="flex items-center space-x-2"
                          >
                            <Award className="h-4 w-4" />
                            <span>Download Certificate</span>
                          </Link>
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <Link
                            target="_blank"
                            to={`https://www.linkedin.com/shareArticle?mini=true&url=${training.enrolments[0].certificate}&text=Hello connections! I have completed a course with STEM for society website and have earned a certificate on ${training.title}`}
                            className="flex items-center space-x-2"
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
                {training.displayFeedback && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <RatingAndFeedback
                      data={training}
                      id={id!}
                      disabled={training.ratings?.length > 0}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </GridBackground>

      {/* Footer */}
      <Footer />
      <SharePopup isVisible={isShowing} />
    </div>
  );
};

export default CourseDetails;
