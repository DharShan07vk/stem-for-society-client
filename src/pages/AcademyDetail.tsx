import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components1/ui/button";
import { Input } from "@/components1/ui/input";
import { Calendar, Clock, CheckCircle2, Users, BookOpen, Award } from "lucide-react";
import Header from "@/components1/Header";
import Footer from "@/components1/Footer";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { GenericError, GenericResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Loading from "@/components/Loading";
import Errorbox from "@/components/Errorbox";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

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

const AcademyDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: trainingData, isLoading, error } = useTraining(courseId);
  
  const course = trainingData?.data;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
  });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (!formData.fullName || !formData.email || !formData.mobile) {
      toast.error("Please fill in all personal details");
      return;
    }
    
    // Navigate to booking confirmation or payment
    toast.success("Proceeding to booking confirmation");
    // You can navigate to a payment page here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {course.title}
              </h1>
              <p className="text-gray-600 mb-4">{course.category || 'Professional Program'}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <BookOpen className="w-4 h-4" />
                  English
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
                  <Award className="w-4 h-4" />
                  {getModeText()}
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                  <Users className="w-4 h-4" />
                  Live
                </span>
              </div>
            </div>

            {/* Date and Time Display (Static) */}
            <div className="w-full lg:w-80 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#0D9488] rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Date</p>
                    <p className="text-base font-semibold text-gray-900">{formatDate(course.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0389FF] rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Time</p>
                    <p className="text-base font-semibold text-gray-900">{getTimeRange()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Overview */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Session Overview</h2>
          <p className="text-gray-600 leading-relaxed">{course.description}</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Who is it for? */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Who is it for?</h3>
              <ul className="space-y-3">
                {whoIsItFor.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0D9488] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What You'll Learn */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What You'll Learn?</h3>
              <ul className="space-y-3">
                {whatYouLearn.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0389FF] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course Image */}
            <div className="rounded-2xl overflow-hidden">
              <img
                src={course.coverImg || "/course-images/default.jpg"}
                alt={course.title}
                className="w-full h-[300px] object-cover"
              />
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-gradient-to-br from-[#0D9488] to-[#0389FF] rounded-2xl p-8 text-white shadow-xl">
              <div className="text-center mb-6">
                <p className="text-lg mb-2">With</p>
                <p className="text-4xl font-bold">
                  ₹{Number(course.cost || 0).toLocaleString()}
                </p>
                <p className="text-lg mt-2">confirm your seat</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2">

                    Personal details
                  </span>
                 
                </div>

                <div className="space-y-4">
                  <Input
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="h-12 bg-white text-gray-900 rounded-xl"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 bg-white text-gray-900 rounded-xl"
                  />
                  <Input
                    type="tel"
                    placeholder="Mobile number"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    className="h-12 bg-white text-gray-900 rounded-xl"
                  />
                </div>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full h-14 bg-white text-[#0D9488] hover:bg-gray-100 rounded-xl font-bold text-lg shadow-lg"
              >
                Continue
              </Button>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-2xl p-6 mt-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Terms & Conditions</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Class link shared on session day (join early for tech checks)</li>
                <li>• Fee is non-refundable and non-transferable</li>
                <li>• Active internet connection required</li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">
                By continuing, you agree to share your info with STEM for Society & the course provider, as per data protection laws.
              </p>
            </div>
          </div>
        </div>

        {/* Program Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <BookOpen className="w-12 h-12 text-[#0D9488] mx-auto mb-3" />
            <h4 className="font-bold text-gray-900 mb-2">Duration</h4>
            <p className="text-gray-600">{calculateDuration()}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <Calendar className="w-12 h-12 text-[#0389FF] mx-auto mb-3" />
            <h4 className="font-bold text-gray-900 mb-2">Start Date</h4>
            <p className="text-gray-600">{formatDate(course.startDate)}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <Award className="w-12 h-12 text-[#F59E0B] mx-auto mb-3" />
            <h4 className="font-bold text-gray-900 mb-2">Certification</h4>
            <p className="text-gray-600">Industry Recognized</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AcademyDetail;
