import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Header from "@/components1/Header";
import Footer from "@/components1/Footer";
import CourseCard from "@/components1/CourseCard";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { api } from "@/lib/api";
import { GenericError, GenericResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Loading from "@/components/Loading";
import Errorbox from "@/components/Errorbox";

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

// Filter state interface
interface FilterState {
  searchQuery: string;
}

function useTrainings() {
  return useQuery<
    { [key: string]: StudentTraining[] } | object,
    AxiosError<GenericError>
  >({
    queryKey: ["trainings"],
    queryFn: async () => {
      const response = await api().get<GenericResponse<StudentTraining[]>>("/trainings");
      
      if (!response.data?.data?.length) return {};
      
      const groupedByMonth = response.data.data.reduce((acc, training) => {
        const monthYear = dayjs(training.startDate).format("MMMM YYYY");
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(training);
        return acc;
      }, {} as { [key: string]: StudentTraining[] });
      
      return groupedByMonth;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}



const Courses = () => {
  const navigate = useNavigate();
  const { data: trainings, isLoading, error } = useTrainings();
  const [search, setSearch] = useState<string>("");

  const isUserEnrolled = (training: StudentTraining) => {
    if (training.isEnrolled) return true;
    return training.enrolments.some(enrollment =>
      enrollment.transactions?.some(transaction => 
        transaction.status === "success"
      )
    );
  };

  const filteredTrainings = useMemo(() => {
    if (!trainings) return {};
    
    return Object.keys(trainings).reduce((result, monthKey) => {
      const monthTrainings = trainings[monthKey as keyof typeof trainings] as StudentTraining[];
      
      const filtered = monthTrainings.filter((training) => {
        // Only show enrolled courses
        const isEnrolled = isUserEnrolled(training);
        if (!isEnrolled) return false;
        
        // Apply search filter
        const searchTerm = search.toLowerCase();
        return !searchTerm ? true : 
          training.title.toLowerCase().includes(searchTerm) ||
          training.description?.toLowerCase().includes(searchTerm) ||
          training.category?.toLowerCase().includes(searchTerm);
      });

      if (filtered.length > 0) {
        result[monthKey] = filtered;
      }
      return result;
    }, {} as { [key: string]: StudentTraining[] });
  }, [trainings, search]);

  if (isLoading) return <Loading />;
  if (error) return <Errorbox message={error.message} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Courses
          </h1>
          <p className="text-gray-600">Your enrolled training programs and courses</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your courses..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white text-gray-900"
            />
          </div>
        </div>

        {/* Course Listings by Month */}
        <div className="space-y-8">
          {Object.keys(filteredTrainings).length > 0 ? (
            Object.entries(filteredTrainings).map(([monthKey, monthTrainings]) => (
              <div key={monthKey} className="space-y-6">
                <div className="pb-4 border-b-2 border-[#0D9488]">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{monthKey}</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {(monthTrainings as StudentTraining[]).map((training) => (
                    <CourseCard
                      key={training.id}
                      image={training.coverImg}
                      category={training.category || 'Course'}
                      tags={[training.category || 'Course', 'For Individuals']}
                      title={training.title}
                      description={training.description}
                      startDate={formatDate(training.startDate)}
                      mode={training.type}
                      instructor={`${training.instructor?.firstName || ''} ${training.instructor?.lastName || ''}`.trim() || 'Instructor'}
                      instructorImage={undefined}
                      trainingId={training.id}
                      isEnrolled={isUserEnrolled(training)}
                      onRegister={() => navigate(`/course-detail/${training.id}`)}
                      onMoreDetails={() => navigate(`/course-detail/${training.id}`)}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No enrolled courses found. Explore available courses to get started.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Courses;
