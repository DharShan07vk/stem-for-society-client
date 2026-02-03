import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components1/ui/button";
import { Input } from "@/components1/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components1/ui/select";
import { Search, SlidersHorizontal, RotateCcw, GraduationCap, Briefcase, Users, Award } from "lucide-react";
import Header from "@/components1/Header";
import Footer from "@/components1/Footer";
import GridBackground from "@/components1/GridBackground";
import FinishingSchoolCard from "@/components1/FinishingSchoolCard";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { api } from "@/lib/api";
import { GenericError, GenericResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Loading from "@/components/Loading";
import Errorbox from "@/components/Errorbox";

// Student training data structure (imported from Courses.tsx pattern)
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

// Fetch only Skill Development courses
function useSkillDevelopmentCourses() {
  return useQuery<StudentTraining[], AxiosError<GenericError>>({
    queryKey: ["trainings", "finishing-school"],
    queryFn: async () => {
      const response = await api().get<GenericResponse<StudentTraining[]>>("/trainings/finishing-schools");
      console.log("🚀 Skill Development courses:", response.data);
      if (!response.data?.data?.length) return [];
      
      // Filter for Skill Development courses only

      
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

// Filter state interface
interface FilterState {
  category: string;
  level: string;
  mode: string;
  searchQuery: string;
}

const FinishingSchool = () => {
  const navigate = useNavigate();
  const { data: courses, isLoading, error } = useSkillDevelopmentCourses();
  
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    level: "",
    mode: "",
    searchQuery: "",
  });

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      category: "",
      level: "",
      mode: "",
      searchQuery: "",
    });
  };

  // Filter courses based on selected filters
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    
    return courses.filter((course) => {
      const searchTerm = filters.searchQuery.toLowerCase();
      const matchesSearch = !searchTerm || 
        course.title.toLowerCase().includes(searchTerm) ||
        course.description?.toLowerCase().includes(searchTerm) ||
        course.category?.toLowerCase().includes(searchTerm);
      
      const matchesCategory = !filters.category || filters.category === "all" ||
        course.category?.toLowerCase().includes(filters.category.toLowerCase());
      
      // For level, we can check category or add a level field if backend provides it
      const matchesLevel = !filters.level || filters.level === "all";
      
      const matchesMode = !filters.mode || filters.mode === "all" ||
        course.type?.toLowerCase() === filters.mode.toLowerCase();
      
      return matchesSearch && matchesCategory && matchesLevel && matchesMode;
    });
  }, [courses, filters]);

  // Calculate duration from start and end dates
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const weeks = end.diff(start, 'week');
    const months = end.diff(start, 'month');
    
    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  };

  if (isLoading) return <Loading />;
  if (error) return <Errorbox message={error.message} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <GridBackground>
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Page Title */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Transform Your Career with{" "}
                <span className="text-[#0D9488]">Industry-Ready Skills</span>
              </h1>
              {/* <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Short, hands-on programs to rapidly upskill for industry roles — practical projects, expert mentors, and career-focused outcomes.
              </p> */}
            </div>

            {/* Stats Section
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#0D9488]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-6 h-6 text-[#0D9488]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">30+</p>
                <p className="text-gray-500 text-sm">Short Courses</p>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#0389FF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-[#0389FF]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <p className="text-gray-500 text-sm">Job-Ready Outcomes</p>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">2000+</p>
                <p className="text-gray-500 text-sm">Learners Trained</p>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">40+</p>
                <p className="text-gray-500 text-sm">Industry Mentors</p>
              </div>
            </div> */}

            {/* Filters Section */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8">
              <div className="flex flex-wrap items-center gap-4">
                {/* Filter Icon */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                  <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Filter By</span>
                </div>

                {/* Category Dropdown */}
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange("category", value)}
                >
                  <SelectTrigger className="w-[160px] h-10 bg-white text-gray-700 font-medium border-gray-200 rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="class 8 - 10">Class 8-10</SelectItem>
                    <SelectItem value="class 11 - 12">Class 11-12</SelectItem>
                    <SelectItem value="Undergraduate">UnderGraduate</SelectItem>
                    <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                  </SelectContent>
                </Select>

                {/* Level Dropdown */}
                <Select
                  value={filters.level}
                  onValueChange={(value) => handleFilterChange("level", value)}
                >
                  <SelectTrigger className="w-[160px] h-10 bg-white text-gray-700 font-medium border-gray-200 rounded-xl">
                    <SelectValue placeholder="Program Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="micro">Micro</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mode Dropdown */}
                <Select
                  value={filters.mode}
                  onValueChange={(value) => handleFilterChange("mode", value)}
                >
                  <SelectTrigger className="w-[140px] h-10 bg-white text-gray-700 font-medium border-gray-200 rounded-xl">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>

                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search courses..."
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                    className="pl-10 h-10 bg-gray-50 border-gray-200 rounded-xl focus:ring-[#0D9488] focus:border-[#0D9488]"
                  />
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="h-10 px-4 rounded-xl border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses
              </p>
            </div>

            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {filteredCourses.map((course) => (
                  <FinishingSchoolCard
                    key={course.id}
                    courseId={course.id}
                    image={course.coverImg}
                    universityLogo={undefined}
                    universityName={course.instructor?.institutionName || `${course.instructor?.firstName || ''} ${course.instructor?.lastName || ''}`.trim()}
                    badge={course.category || 'Course'}
                    title={course.title}
                    description={course.description}
                    duration={calculateDuration(course.startDate, course.endDate)}
                    mode={course.type}
                    modeDescription={course.type === "ONLINE" ? "Live Online Sessions" : course.type === "HYBRID" ? "Online + Offline" : "In-Person"}
                    startDate={formatDate(course.startDate)}                    
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
                <Button
                  onClick={handleResetFilters}
                  className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white rounded-full px-6"
                >
                  Clear Filters
                </Button>
              </div>
            )}


          </div>
        </section>
      </GridBackground>

      <Footer />
    </div>
  );
};

export default FinishingSchool;
