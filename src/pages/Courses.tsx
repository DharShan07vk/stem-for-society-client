import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components1/ui/button";
import { ChevronLeft, ChevronRight, Share2, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import Header from "@/components1/Header";
import Footer from "@/components1/Footer";
import GridBackground from "@/components1/GridBackground";
import CourseCard from "@/components1/CourseCard";
import CourseFilters from "@/components1/CourseFilters";
import CounsellingBanner from "@/components1/CounsellingBanner";
import { useShare } from "@/hooks/useShare";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { parseAsBoolean, useQueryState } from "nuqs";
import { api } from "@/lib/api";
import { GenericError, GenericResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Loading from "@/components/Loading";
import Errorbox from "@/components/Errorbox";

dayjs.extend(isBetween);

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
  filterBy: string;
  sector: string;
  authorType: string;
  publicationDate: string;
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
    staleTime: 1000 * 60 * 5, // Reduced to 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
}

// Course type mapping for filter translations
const COURSE_TYPE_MAPPING: Record<string, string> = {
  'Seminar/Webinar/Mentorship': 'Seminars/Webinar/Mentorship',
  'Certificate': 'Certificate Program',
  'Hands On': 'Instrumentation Hands-on',
  'Training Program': 'Corporate Training'
};



const Courses = () => {
  const navigate = useNavigate();
  const { data: trainings, isLoading, error } = useTrainings();
  const { isShowing, handleShare } = useShare();
  function check(id: string, isEnrolled: boolean) {
  navigate(`/newcourse/${id}`);
   console.log(isEnrolled)
}
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<FilterState>({
    filterBy: "",
    sector: "",
    authorType: "",
    publicationDate: "",
    searchQuery: "",
  });

  const [trainingFilter, setTrainingFilter] = useQueryState<string[] | null>(
    "filter",
    {
      defaultValue: null,
      parse(value) {
        if (!value) return null;
        if (Array.isArray(value)) return value;
        const decoded = decodeURIComponent(value);
        if (decoded.includes(',')) {
          return decoded.split(',').map(v => v.trim()).filter(Boolean);
        }
        return [decoded];
      },
      serialize(value) {
        if (!value || value.length === 0) return "";
        return value.map(v => encodeURIComponent(v)).join(',');
      },
      clearOnDefault: true,
    }
  );

  const [filterByMe, setFilterByMe] = useQueryState<boolean>(
    "me",
    parseAsBoolean
  );

  // Auto-expand all months when trainings data is loaded
  useEffect(() => {
    if (trainings && Object.keys(trainings).length > 0) {
      const allMonths = Object.keys(trainings);
      const expandedState: Record<string, boolean> = {};
      allMonths.forEach(month => {
        expandedState[month] = true;
      });
      setExpandedMonths(expandedState);
    }
  }, [trainings]);

  // Helper functions
  const checkDateFilter = (startDate: string, filterType: string) => {
    const today = dayjs();
    const courseDate = dayjs(startDate);
    
    switch (filterType) {
      case 'this-week':
        const weekStart = today.startOf('week').add(1, 'day');
        const weekEnd = today.endOf('week').add(1, 'day');
        return courseDate.isBetween(weekStart, weekEnd, null, '[]');
      case 'this-month':
        const monthStart = today.startOf('month');
        const monthEnd = today.endOf('month');
        return courseDate.isBetween(monthStart, monthEnd, null, '[]');
      case 'last-3-months':
        const threeMonthsAgo = today.subtract(3, 'month');
        return courseDate.isAfter(threeMonthsAgo);
      case 'this-year':
        return courseDate.year() === today.year();
      default:
        return true;
    }
  };

  const isUserEnrolled = (training: StudentTraining) => {
    if (training.isEnrolled) return true;
   
    return training.enrolments.some(enrollment =>
      enrollment.transactions?.some(transaction => 
        transaction.status === "success"
      )
    );

  };

  // Main filtering logic
  const filteredTrainings = useMemo(() => {
    if (!trainings) return {};
    
    return Object.keys(trainings).reduce((result, monthKey) => {
      const monthTrainings = trainings[monthKey as keyof typeof trainings] as StudentTraining[];
      
      const filtered = monthTrainings.filter((training) => {
        // Search filter
        const searchTerm = filters.searchQuery.toLowerCase();
        const matchesSearch = !searchTerm ? true : 
          training.title.toLowerCase().includes(searchTerm) ||
          training.description?.toLowerCase().includes(searchTerm) ||
          training.category?.toLowerCase().includes(searchTerm);
        
        // Category/URL filter logic
        const hasCategories = trainingFilter && trainingFilter.length > 0;
        let matchesCategory = true;
        
        if (hasCategories) {
          matchesCategory = trainingFilter.some(filter => {
            const categoryLower = training.category?.toLowerCase() || '';
            const titleLower = training.title.toLowerCase();
            
            if (training.category === filter) return true;
            
            switch (filter) {
              case 'Seminars/Webinar/Mentorship':
                return categoryLower.includes('seminar') || 
                       categoryLower.includes('webinar') || 
                       categoryLower.includes('mentorship') ||
                       titleLower.includes('seminar') ||
                       titleLower.includes('webinar');
              case 'Certificate Program':
                return categoryLower.includes('certificate') || 
                       titleLower.includes('certificate');
              case 'Corporate Training':
                return categoryLower.includes('corporate') || 
                       categoryLower.includes('training');
              case 'Instrumentation Hands-on':
                return categoryLower.includes('instrumentation') || 
                       categoryLower.includes('hands');
              default:
                return categoryLower.includes(filter.toLowerCase());
            }
          });
        }
        
        // Sector filter
        const matchesSector = !filters.sector || filters.sector === 'all' ||
          training.category?.toLowerCase().includes(filters.sector.toLowerCase());
        
        // Mode filter (from authorType dropdown - repurposed)
        const matchesMode = !filters.authorType || filters.authorType === 'all' ||
          training.type.toLowerCase() === filters.authorType.toLowerCase();
        
        // Date filter
        const matchesDate = !filters.publicationDate || filters.publicationDate === 'all' ||
          checkDateFilter(training.startDate, filters.publicationDate);
        
        // Enrollment filter
        const matchesEnrollment = !filterByMe || isUserEnrolled(training);

        return matchesSearch && matchesCategory && matchesSector && 
               matchesMode && matchesDate && matchesEnrollment;
      });

      if (filtered.length > 0) {
        result[monthKey] = filtered;
      }
      return result;
    }, {} as { [key: string]: StudentTraining[] });
  }, [trainings, filters, trainingFilter, filterByMe]);

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthKey]: !prev[monthKey],
    })); 
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Flatten all trainings for pagination
  const allFilteredTrainings = useMemo(() => {
    return Object.values(filteredTrainings).flat() as StudentTraining[];
  }, [filteredTrainings]);
  
  const totalItems = allFilteredTrainings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get paginated trainings for current page
  const paginatedTrainings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = allFilteredTrainings.slice(startIndex, endIndex);
    
    // Group paginated items back by month
    return paginatedItems.reduce((acc, training) => {
      const monthYear = dayjs(training.startDate).format("MMMM YYYY");
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(training);
      return acc;
    }, {} as { [key: string]: StudentTraining[] });
  }, [allFilteredTrainings, currentPage, itemsPerPage]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, trainingFilter, filterByMe]);

  // Get course tags based on category
  const getCourseTags = (training: StudentTraining): string[] => {
    const tags: string[] = [];
    if (training.category) {
      tags.push(training.category);
    }
   
      tags.push('For Individuals');
    
    return tags;
  };

  if (isLoading) return <Loading />;
  if (error) return <Errorbox message={error.message} />;

  return (
    <div className="min-h-screen bg-white">
      <GridBackground>
        <Header />
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 max-w-7xl pt-4 pb-8">
          {/* Back Button and Share */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <Link to="/">
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
    </div>

          {/* Title Section */}
          <div className="text-center mb-6">
            <p className="text-[#000000] text-sm mb-1">Explore Courses</p>
            <h1 className="text-2xl md:text-3xl font-thin  text-[#000000] relative inline-block">
              <span className="relative">
                Get trained and become Certified Professional
                <span className="absolute bottom-1 left-0 w-full h-[30%] bg-yellow-300 -z-10"></span>
              </span>
            </h1>
          </div>

          {/* Filters */}
          <div className="mb-10">
            <CourseFilters onFilterChange={handleFilterChange} />
          </div>

          {/* Course Listings by Month */}
          <div className="space-y-10">
            {Object.entries(paginatedTrainings).length > 0 ? (
              Object.entries(paginatedTrainings).map(([monthKey, monthTrainings]) => (
                <div key={monthKey} className="space-y-5">
                  {/* Month Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">{monthKey}</h2>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 text-gray-900 rounded-full px-4 py-2 text-sm font-bold bg-blue-200"
                      onClick={() => toggleMonth(monthKey)}
                    >
                      {monthTrainings.length} sessions
                      {expandedMonths[monthKey] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Course Cards */}
                  {expandedMonths[monthKey] && (
                    <div className="space-y-5">
                      {monthTrainings.map((training) => (
                        <CourseCard
                          key={training.id}
                          image={training.coverImg}
                          category={training.category || 'Course'}
                          tags={getCourseTags(training)}
                          title={training.title}
                          description={training.description}
                          startDate={formatDate(training.startDate)}
                          mode={training.type}
                          instructor={`${training.instructor?.firstName || ''} ${training.instructor?.lastName || ''}`.trim() || 'Instructor'}
                          instructorImage={undefined}
                          trainingId={training.id}
                          isEnrolled={isUserEnrolled(training)}
                          onRegister={() => navigate(`/newcourse/${training.id}`)}
                          onMoreDetails={() => check(training.id, training.isEnrolled)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No courses found matching your filters.</p>
                <Button 
                  variant="ghost" 
                  className="mt-4 text-[#0389FF]"
                  onClick={() => setFilters({
                    filterBy: "",
                    sector: "",
                    authorType: "",
                    publicationDate: "",
                    searchQuery: "",
                  })}
                >
                  Reset filters
                </Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-8 py-4">
            <p className="text-gray-600 text-sm">
              Showing {totalItems === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems.toLocaleString()}
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10 rounded-lg border-gray-300"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10 rounded-lg border-gray-300"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Counselling CTA Banner */}
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <CounsellingBanner />
        </div>
      </GridBackground>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Courses;
