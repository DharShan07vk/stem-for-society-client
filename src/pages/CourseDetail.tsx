import React, { useState } from 'react';
import Header from '@/components1/Header';
import Footer from '@/components1/Footer';
import { Button } from '@/components1/ui/button';
import { ArrowLeft, Share2, Calendar, Clock, Award, User, BookOpen, CheckCircle, ChevronDown, ChevronUp, Play, ExternalLink } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@mantine/core';
import { motion } from 'framer-motion';
import { useShare } from '@/hooks/useShare';
import { SharePopup } from '@/components1/ui/SharePopup';
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NotepadText } from "lucide-react";
import { useCallback } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { toast } from "react-toastify";
import Errorbox from "../components/Errorbox";
import Loading from "../components/Loading";
import { RZPY_KEYID } from "../Constants";
import { api, queryClient } from "../lib/api";
import { useUser } from "../lib/hooks";
import RazorpayInstance, {
  GenericError,
  GenericResponse,
  RazorpayOrderOptions,
} from "../lib/types";
import {
  formatDate,
  initializeRazorpay,
  mutationErrorHandler,
} from "../lib/utils";
import { StudentTraining } from "./Courses";

function useTraining(id?: string) {
  return useQuery<
    GenericResponse<StudentTraining>, AxiosError<GenericError>
  >({
    queryKey: ["trainings", id],
    queryFn: async () => (await api().get(`/trainings/${id}`)).data,
    staleTime: 1000 * 60 * 10,
  });
}

export type CreatePaymentResponse = {
  amount: string,
  orderId: string
}

function useEnroll(id?: string) {
  const nav = useNavigate();
  return useMutation<
    GenericResponse<CreatePaymentResponse>,
    AxiosError<GenericError>
  >({
    mutationFn: async () => {
      return (await api().post("/payments/create", { trainingId: id })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainings"] })
    },
    onError: (err) => mutationErrorHandler(err, nav, "/login")
  })
}


const CourseDetail = () => {
  const { id } = useParams();
  const { isShowing, handleShare } = useShare();
  const { data, isLoading, error } = useTraining(id);
  const { user } = useUser();
  const { mutateAsync, isPending } = useEnroll(id);
  
  // State for show more/less functionality
  const [showAllLessons, setShowAllLessons] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

  const handlePayment = useCallback(async () => {
    try {
      const rzrpyInit = await initializeRazorpay();
      if (!rzrpyInit) return toast.error("Unable to initialize payment!");
      const data = await mutateAsync();
      console.log("🚀 ~ handlePayment ~ data:", data);
      if (!data.data) {
        toast.error("Something went wrong in creating payment!");
        return;
      }
      const order = data.data;

      const options: RazorpayOrderOptions = {
        key: RZPY_KEYID,
        amount: Number(order.amount) * 100,
        currency: "INR",
        name: "Stem for Society",
        description: "Premium plan purchase",
        image: "https://stem-4-society.netlify.app/logo-01.png",
        order_id: order.orderId,
        prefill: {
          name: user?.user.firstName,
          email: user?.user.email,
          contact: user?.user.mobile,
        },
        async handler(response) {
          try {
            if ("error" in response) {
              console.log("🚀 ~ handler ~ response:", response);
              // @ts-expect-error smh
              toast.error(response.error.reason);
              queryClient.invalidateQueries({ queryKey: ["trainings"] });
              return;
            }
            toast.success(
              "Payment was made successfully and is being verified. We will get back to you shortly if verification fails",
              { autoClose: false, closeOnClick: false },
            );
          } catch (error) {
            console.log("🚀 ~ handler ~ error:", error);
            toast.error("Payment was made, but it could not be verified");
          }
        },
      };

      // @ts-expect-error dhe chi pae
      const rzp: RazorpayInstance = new Razorpay(options);

      rzp.on("payment.failed", (res) => {
        console.log("Failure:", res);
        toast.error("Payment failed! Reason:\n" + res.error.description, {
          autoClose: false,
          closeOnClick: false,
        });
        toast.error(
          "Please note Order ID: " +
            res.error.metadata.order_id +
            "\n Payment ID: " +
            res.error.metadata.payment_id,
          { autoClose: false, closeOnClick: false },
        );
      });

      rzp.open();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 401) {
          toast.error("Please login again");
          return;
        }
      }
      console.log("🚀 ~ handlePayment ~ error:", error);
      toast.error("Something went wrong in the payment process");
    }
  }, [mutateAsync, user]);

  if (isLoading) {
    return <Loading />
  }
  if (error) {
    return <Errorbox message={error.message} />;
  }

  function generateDuration(start: string, end: string) {
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
  }

  const course = data?.data;

  if (!course) {
    return <Errorbox message="Course not found" />;
  }

  // Check if course is online to determine syllabus display format
  const isOnline = course.type === "ONLINE" || !course.location;
  console.log('isOnline:', isOnline);
  console.log('course.lessons:', course.lessons);

  // Safe check for lessons array
  const lessons = course.lessons || [];
  const hasLessons = lessons.length > 0;

  // Helper functions for lesson management
  const toggleLessonExpansion = (lessonId: string) => {
    setExpandedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const isLessonExpanded = (lessonId: string) => {
    return expandedLessons.has(lessonId);
  };

  // Function to render video link
  const renderVideoLink = (videoUrl: string) => {
    if (!videoUrl) return null;
    
    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    
    return (
      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2">
          <Play className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            {isYouTube ? 'YouTube Video' :  'Video Content'}
          </span>
        </div>
        <a 
          href={videoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm mt-2 transition-colors"
        >
          <span>Watch Video</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    );
  };

  // Determine how many lessons to show initially - with safe array handling
  const lessonsToShow = showAllLessons ? lessons : lessons.slice(0, 3);
  const hasMoreLessons = lessons.length > 3;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Area */}
      <div className="relative bg-gradient-to-r from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />

          <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
            <Link to="/courses">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 bg-[#0389FF] text-white border-[#0389FF] rounded-full px-4 hover:bg-[#0389FF]/90"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Courses</span>
                </Button>
              </motion.div>
            </Link>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-2 bg-[#0389FF] text-white border-[#0389FF] rounded-full px-4 hover:bg-[#0389FF]/90"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Course</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Course Meta */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                {course.description?.split('.')[0] || course.description || ""}
                {course.description?.includes('.') ? '.' : ''}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{formatDate(course.startDate)} - {formatDate(course.endDate)}</span>
                </div>

                {course.category && (
                  <div className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                    <Award className="h-5 w-5 mr-2" />
                    <span>{course.category}</span>
                  </div>
                )}

                <div className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                  <FaLocationDot className="h-4 w-4 mr-2" />
                  <Badge color={course.location ? "red" : "green"}>
                    {course.type || (course.location ? "Offline" : "Online")}
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Enrollment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 h-fit sticky top-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">₹{course.cost}</h3>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Starts {formatDate(course.startDate)}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <span className="w-5 h-5 flex items-center justify-center text-blue-500">💻</span>
                <span>{course.type || (course.location ? "Offline" : "Online")}{course.location ? ` • ${course.location}` : ""}</span>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {!user ? (
                <Link to="/login">
                  <Button className="w-full bg-[#0389FF] hover:bg-[#0389FF]/90 text-white py-4 text-lg">
                    Sign in to Enroll
                  </Button>
                </Link>
              ) : !course.isEnrolled ? (
                <Button
                  className="w-full bg-[#0389FF] hover:bg-[#0389FF]/90 text-white py-4 text-lg"
                  onClick={handlePayment}
                  disabled={isPending}
                >
                  {isPending ? "Processing..." : "Enroll Now"}
                </Button>
              ) : (
                <Button className="w-full bg-green-600 text-white py-4 text-lg" disabled>
                  Already Enrolled
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Course Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Image */}
            {course.coverImg && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <img
                  src={course.coverImg}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
              </motion.div>
            )}

            {/* Detailed Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About This Course</h2>
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 mb-4">{course.description}</p>
              </div>
            </motion.div>

            {/* Enhanced Syllabus for Online Courses */}
            {isOnline && hasLessons && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="h-6 w-6 mr-3 text-blue-500" />
                  Course Syllabus ({lessons.length} Days)
                </h2>
                
                <div className="space-y-4">
                  {lessonsToShow.map((lesson, index) => (
                    <div key={lesson.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Lesson Header */}
                      <div 
                        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleLessonExpansion(lesson.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium">
                            Day {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                            {lesson.lastDate && (
                              <p className="text-gray-600 text-sm">
                                <Calendar className="h-4 w-4 inline mr-1" />
                                {formatDate(lesson.lastDate)}
                              </p>
                            )}
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isLessonExpanded(lesson.id) ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        </motion.div>
                      </div>

                      {/* Lesson Content - Expandable */}
                      {isLessonExpanded(lesson.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 border-t border-gray-200"
                        >
                          {/* Lesson Content */}
                          {lesson.content && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 mb-2">Content:</h4>
                              <div
                                className="text-gray-600 text-sm prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: lesson.content }}
                              />
                            </div>
                          )}

                          {/* Video Link */}
                          {lesson.video && renderVideoLink(lesson.video)}

                          {/* Location for offline lessons */}
                          {lesson.location && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <FaLocationDot className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Location:</span>
                                <span className="text-sm text-gray-600">{lesson.location}</span>
                              </div>
                            </div>
                          )}

                          {/* Lesson Type Badge */}
                          <div className="mt-3">
                            <Badge 
                              color={lesson.type === "ONLINE" ? "green" : "red"}
                              size="sm"
                            >
                              {lesson.type}
                            </Badge>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Show More/Less Button */}
                {hasMoreLessons && (
                  <div className="text-center mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllLessons(!showAllLessons)}
                      className="flex items-center space-x-2"
                    >
                      {showAllLessons ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          <span>Show Less</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          <span>Show {lessons.length - 3} More Days</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Message when no lessons available */}
            {isOnline && !hasLessons && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="h-6 w-6 mr-3 text-blue-500" />
                  Course Syllabus
                </h2>
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg">
                    Syllabus will be available soon
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Course content is being prepared and will be published before the start date.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Regular Syllabus for Offline Courses */}
            {!isOnline && hasLessons && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="h-6 w-6 mr-3 text-blue-500" />
                  Course Syllabus
                </h2>
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-start border-b border-gray-100 pb-4">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0 text-sm font-medium">
                        Week {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{lesson.title}</h3>
                        {lesson.lastDate && (
                          <p className="text-gray-600 text-sm mb-2">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            {formatDate(lesson.lastDate)}
                          </p>
                        )}
                        {lesson.content && (
                          <div
                            className="text-gray-600 text-sm prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: lesson.content }}
                          />
                        )}
                        {lesson.location && (
                          <p className="text-gray-600 text-sm mt-2">
                            <FaLocationDot className="h-4 w-4 inline mr-1" />
                            {lesson.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Instructor Card */}
            {course.instructor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  Instructor
                </h2>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                      {course.instructor.firstName.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {course.instructor.firstName} {course.instructor.lastName || ''}
                    </h3>
                    {course.instructor.institutionName && (
                      <p className="text-gray-600 text-sm">{course.instructor.institutionName}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Course Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                Course Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{generateDuration(course.startDate, course.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode:</span>
                  <span className="font-medium">{course.type || (course.location ? "Offline" : "Online")}</span>
                </div>
                {course.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{course.location}</span>
                  </div>
                )}
                {hasLessons && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Lessons:</span>
                    <span className="font-medium">{lessons.length} {isOnline ? 'Days' : 'Weeks'}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-lg">₹{course.cost}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center bg-gradient-to-r from-blue-50 to-white rounded-xl p-8 md:p-12 mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Career?</h3>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join this comprehensive {generateDuration(course.startDate, course.endDate)} program with {course.instructor.firstName}
            {course.instructor.institutionName && ` from ${course.instructor.institutionName}`}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            {!user ? (
              <Link to="/login">
                <Button className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-12 md:px-16 py-4 md:py-6 text-lg md:text-xl">
                  Sign in to Enroll for ₹{course.cost}
                </Button>
              </Link>
            ) : !course.isEnrolled ? (
              <Button
                className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-12 md:px-16 py-4 md:py-6 text-lg md:text-xl"
                onClick={handlePayment}
                disabled={isPending}
              >
                {isPending ? "Processing..." : `Enroll Now for ₹${course.cost}`}
              </Button>
            ) : (
              <Button className="bg-green-600 text-white px-12 md:px-16 py-4 md:py-6 text-lg md:text-xl" disabled>
                Already Enrolled
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>

      <Footer />
      <SharePopup isVisible={isShowing} />
    </div>
  );
};

export default CourseDetail;