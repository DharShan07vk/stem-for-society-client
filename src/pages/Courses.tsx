import React, { useMemo, useState, useEffect } from 'react';
import Header from '@/components1/Header';
import Footer from '@/components1/Footer';
import { Button } from '@/components1/ui/button';
import { Card, CardContent } from '@/components1/ui/card';
import FilterDropdown from '@/components1/FilterDropdown';
import Errorbox from "../components/Errorbox";
import Loading from "../components/Loading";
import { 
  ArrowLeft, 
  Share2, 
  Filter, 
  Search, 
  Calendar, 
  MapPin, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { parseAsBoolean, useQueryState } from "nuqs";
import { api } from "../lib/api";
import { GenericError, GenericResponse } from "../lib/types";
import { formatDate } from "../lib/utils";
import { SharePopup } from '@/components1/ui/SharePopup';
import { useShare } from '@/hooks/useShare';
dayjs.extend(isBetween);

// Filter option interface for dropdown filters
interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

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
  location?: string; // null = Online, value = Offline
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

/**
 * Custom hook to fetch and group trainings data by month
 * @returns Query object with training data grouped by month
 */
function useTrainings() {
  return useQuery<
    { [key: string]: StudentTraining[] } | object,
    AxiosError<GenericError>
  >({
    queryKey: ["trainings"],
    queryFn: async () => {
      const response = await api().get<GenericResponse<StudentTraining[]>>("/trainings");
      
      // Return empty object if no data
      if (!response.data?.data?.length) return {};
      
      // Group trainings by month (MMM, YYYY format)
      const groupedByMonth = response.data.data.reduce((acc, training) => {
        const monthYear = dayjs(training.startDate).format("MMM, YYYY");
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(training);
        return acc;
      }, {} as { [key: string]: StudentTraining[] });
      
      return groupedByMonth;
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
}


// Course type mapping for filter translations
const COURSE_TYPE_MAPPING = {
  'Seminar': 'Seminars/Webinar/Mentorship',
  'Webinar': 'Seminars/Webinar/Mentorship', 
  'Mentorship': 'Seminars/Webinar/Mentorship',
  'Certificate': 'Certificate Program',
  'Hands On': 'Instrumentation Hands-on',
  'Training Program': 'Corporate Training'
};

// Initial filter options
const INITIAL_SECTOR_FILTERS: FilterOption[] = [
  { id: 'healthcare', label: 'Healthcare', checked: false },
  { id: 'technology', label: 'Technology', checked: false },
  { id: 'biotechnology', label: 'Biotechnology', checked: false },
  { id: 'ai', label: 'AI/ML', checked: false },
  { id: 'data', label: 'Data Science', checked: false },
];

const INITIAL_COURSE_TYPE_FILTERS: FilterOption[] = [
  { id: 'seminar', label: 'Seminar', checked: false },
  { id: 'webinar', label: 'Webinar', checked: false },
  { id: 'mentorship', label: 'Mentorship', checked: false },
  { id: 'certificate', label: 'Certificate', checked: false },
  { id: 'handson', label: 'Hands On', checked: false },
  { id: 'training', label: 'Training Program', checked: false },
];

const INITIAL_DATE_FILTERS: FilterOption[] = [
  { id: 'thisweek', label: 'This Week', checked: false },
  { id: 'thismonth', label: 'This month', checked: false },
];

const INITIAL_MODE_FILTERS: FilterOption[] = [
  { id: 'online', label: 'Online', checked: false },
  { id: 'offline', label: 'Offline', checked: false },
  {id : 'hybrid', label: 'Hybrid', checked: false},
];

const Courses = () => {
  const navigate = useNavigate();
  const { data: trainings, isLoading, error } = useTrainings();
  const { isShowing, handleShare } = useShare();
  const [trainingFilter, setTrainingFilter] = useQueryState<string[] | null>(
    "filter",
    {
      defaultValue: null,
      parse(value) {
        if (!value) return null;
        if (Array.isArray(value)) return value;
        
        // FIX: Handle comma-separated values and URL encoded values
        const decoded = decodeURIComponent(value);
        if (decoded.includes(',')) {
          return decoded.split(',').map(v => v.trim()).filter(Boolean);
        }
        return [decoded];
      },
      serialize(value) {
        if (!value || value.length === 0) return "";
        // FIX: Use comma separation for multiple values
        return value.map(v => encodeURIComponent(v)).join(',');
      },
      clearOnDefault: true,
    }
  );

  const [filterByMe, setFilterByMe] = useQueryState<boolean>(
    "me",
    parseAsBoolean
  );

  // Local state
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  // Filter states
  const [sectorFilters, setSectorFilters] = useState<FilterOption[]>(INITIAL_SECTOR_FILTERS);
  const [courseTypeFilters, setCourseTypeFilters] = useState<FilterOption[]>(INITIAL_COURSE_TYPE_FILTERS);
  const [startDateFilters, setStartDateFilters] = useState<FilterOption[]>(INITIAL_DATE_FILTERS);
  const [modeFilters, setModeFilters] = useState<FilterOption[]>(INITIAL_MODE_FILTERS);

  // FIX: Auto-expand all months when trainings data is loaded
  useEffect(() => {
    if (trainings && Object.keys(trainings).length > 0) {
      const allMonths = Object.keys(trainings);
      setExpandedMonths(new Set(allMonths));
      console.log('Auto-expanding all months:', allMonths);
    }
  }, [trainings]);

  // FIX: Improved sync for course type filters with URL parameters
  useEffect(() => {
    console.log('=== SYNCING COURSE TYPE FILTERS ===');
    console.log('trainingFilter from URL:', trainingFilter);
    
    // Reset all course type filters first
    setCourseTypeFilters(prev => prev.map(item => ({ ...item, checked: false })));
    
    // Set correct filters based on URL parameters
    if (trainingFilter && trainingFilter.length > 0) {
      setCourseTypeFilters(prev => prev.map(item => {
        const mappedValue = COURSE_TYPE_MAPPING[item.label as keyof typeof COURSE_TYPE_MAPPING];
        const isChecked = trainingFilter.includes(mappedValue);
        
        console.log(`Filter "${item.label}" maps to "${mappedValue}" - checked: ${isChecked}`);
        
        return {
          ...item,
          checked: isChecked
        };
      }));
    }
    
    console.log('=== END SYNC ===');
  }, [trainingFilter]);

  // FIX: Remove the problematic URL handling effect that's causing conflicts
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const urlFilter = urlParams.get('filter');
  //   
  //   if (urlFilter && urlFilter !== trainingFilter?.[0]) {
  //     setTrainingFilter([urlFilter]);
  //   }
  // }, [window.location.search]);

  // FIX: Improved reset logic - don't reset when URL filters are being applied
  useEffect(() => {
    // Only reset other filters when URL filter changes AND it's not the initial load
    if (trainingFilter && trainingFilter.length > 0) {
      console.log('Resetting other filters due to URL filter change');
      setSectorFilters(prev => prev.map(item => ({ ...item, checked: false })));
      setStartDateFilters(prev => prev.map(item => ({ ...item, checked: false })));
      setModeFilters(prev => prev.map(item => ({ ...item, checked: false })));
      setSearch('');
      setSearchQuery('');
    }
  }, [trainingFilter?.join(',')]); // Use join to detect actual changes

  // HELPER FUNCTIONS
  const getDisplayMode = (location?: string) => {
    return location ? "Offline" : "Online";
  };

  const getCourseImage = (training: StudentTraining) => {
    return training.coverImg || '/course-images/default.jpg';
  };

  const formatPrice = (cost: string) => {
    if (cost === '0' || cost.toLowerCase() === 'free') return 'Free';
    return `₹${cost}`;
  };

  const checkDateFilter = (startDate: string, filterType: string) => {
    const today = dayjs();
    const courseDate = dayjs(startDate);
    
    switch (filterType) {
      case 'thisweek':
        const weekStart = today.startOf('week').add(1, 'day'); // Monday
        const weekEnd = today.endOf('week').add(1, 'day'); // Sunday
        return courseDate.isBetween(weekStart, weekEnd, null, '[]');
        
      case 'thismonth':
        const monthStart = today.startOf('month');
        const monthEnd = today.endOf('month');
        return courseDate.isBetween(monthStart, monthEnd, null, '[]');
        
      default:
        return true;
    }
  };

  const isUserEnrolled = (training: StudentTraining) => {
    // Check the isEnrolled flag first
    if (training.isEnrolled) return true;
    
    // Check if user has successful transactions
    return training.enrolments.some(enrollment =>
      enrollment.transactions?.some(transaction => 
        transaction.status === "success"
      )
    );
  };

  const toggleMonthExpansion = (month: string) => {
    setExpandedMonths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(month)) {
        newSet.delete(month);
      } else {
        newSet.add(month);
      }
      return newSet;
    });
  };

  const isMonthExpanded = (month: string) => {
    return expandedMonths.has(month);
  };

  /**
   * Main filtering logic - applies all active filters
   */
  const filteredTrainings = useMemo(() => {
    if (!trainings) return {};
    
    console.log('=== FILTERING DEBUG ===');
    console.log('Training filter:', trainingFilter);
    console.log('Available trainings:', trainings);
    
    return Object.keys(trainings).reduce((result, monthKey) => {
      const monthTrainings = trainings[monthKey as keyof typeof trainings] as StudentTraining[];
      
      const filtered = monthTrainings.filter((training) => {
        // Search filter
        const searchTerm = search.toLowerCase();
        const queryTerm = searchQuery.toLowerCase();
        const matchesSearch = !searchTerm && !queryTerm ? true : 
                             training.title.toLowerCase().includes(searchTerm) ||
                             training.title.toLowerCase().includes(queryTerm);
        
        // FIX: Improved category filter logic
        const hasCategories = trainingFilter?.length > 0;
        let matchesCategory = true; // Default to true if no filters
        
        if (hasCategories) {
          console.log(`Checking training "${training.title}" with category "${training.category}" against filters:`, trainingFilter);
          
          matchesCategory = trainingFilter.some(filter => {
            const categoryLower = training.category?.toLowerCase() || '';
            const titleLower = training.title.toLowerCase();
            
            // Direct category match
            if (training.category === filter) {
              console.log('✓ Direct match found');
              return true;
            }
            
            // Flexible matching based on filter type
            switch (filter) {
              case 'Seminars/Webinar/Mentorship':
                const isWebinarType = categoryLower.includes('seminar') || 
                                     categoryLower.includes('webinar') || 
                                     categoryLower.includes('mentorship') ||
                                     titleLower.includes('seminar') ||
                                     titleLower.includes('webinar') ||
                                     titleLower.includes('mentorship');
                console.log('✓ Webinar type check:', isWebinarType);
                return isWebinarType;
                
              case 'Certificate Program':
                const isCertificate = categoryLower.includes('certificate') || 
                                     categoryLower.includes('program') ||
                                     titleLower.includes('certificate') ||
                                     titleLower.includes('program');
                console.log('✓ Certificate check:', isCertificate);
                return isCertificate;
                
              case 'Corporate Training':
                const isCorporate = categoryLower.includes('corporate') || 
                                   categoryLower.includes('training') ||
                                   titleLower.includes('corporate') ||
                                   titleLower.includes('training');
                console.log('✓ Corporate check:', isCorporate);
                return isCorporate;
                
              case 'Instrumentation Hands-on':
                const isHandsOn = categoryLower.includes('instrumentation') || 
                                 categoryLower.includes('hands') ||
                                 categoryLower.includes('practical') ||
                                 categoryLower.includes('workshop') ||
                                 titleLower.includes('instrumentation') ||
                                 titleLower.includes('hands') ||
                                 titleLower.includes('practical') ||
                                 titleLower.includes('workshop');
                console.log('✓ Hands-on check:', isHandsOn);
                return isHandsOn;
                
              default:
                // Fallback: check if any keywords from filter match
                const filterWords = filter.toLowerCase().split(/[\s\/\-+]+/);
                const matches = filterWords.some(word => 
                  word.length > 2 && (categoryLower.includes(word) || titleLower.includes(word))
                );
                console.log('✓ Fallback check:', matches, 'for words:', filterWords);
                return matches;
            }
          });
          
          console.log(`Final category match for "${training.title}":`, matchesCategory);
        }
        
        // Enrollment filter
        const matchesEnrollment = !filterByMe || isUserEnrolled(training);

        // Sector filter
        const hasSectorFilter = sectorFilters.some(f => f.checked);
        const matchesSector = !hasSectorFilter || 
                             sectorFilters.some(filter => 
                               filter.checked && 
                               training.category?.toLowerCase().includes(filter.label.toLowerCase())
                             );
    
        // Mode filter
        const hasModeFilter = modeFilters.some(f => f.checked);
        const matchesMode = !hasModeFilter || 
                           modeFilters.some(filter => {
                             if (!filter.checked) return false;
                             const trainingMode =training.type;
                             return filter.label.toLowerCase() === trainingMode.toLowerCase();
                           });

        // Date filter
        const hasDateFilter = startDateFilters.some(f => f.checked);
        const matchesDate = !hasDateFilter ||
                           startDateFilters.some(filter => {
                             if (!filter.checked) return false;
                             return checkDateFilter(training.startDate, filter.id);
                           });

        const finalResult = matchesSearch && matchesCategory && matchesEnrollment && 
                           matchesSector && matchesMode && matchesDate;
        
        console.log(`Training "${training.title}" final result:`, {
          matchesSearch,
          matchesCategory,
          matchesEnrollment,
          matchesSector,
          matchesMode,
          matchesDate,
          finalResult
        });

        return finalResult;
      });

      if (filtered.length > 0) {
        result[monthKey] = filtered;
        console.log(`Month ${monthKey} has ${filtered.length} courses`);
      }
      return result;
    }, {} as { [key: string]: StudentTraining[] });
  }, [search, searchQuery, trainings, trainingFilter, filterByMe, 
      sectorFilters, modeFilters, startDateFilters]);

  // FIX: Improved debug effect
  useEffect(() => {
    if (trainings && Object.keys(trainings).length > 0) {
      console.log('=== ALL TRAINING CATEGORIES ===');
      const allTrainings = Object.values(trainings).flat() as StudentTraining[];
      const categories = [...new Set(allTrainings.map(t => t.category))].filter(Boolean);
      console.log('Unique categories found:', categories);
      
      console.log('=== TRAINING FILTER MAPPING ===');
      Object.entries(COURSE_TYPE_MAPPING).forEach(([key, value]) => {
        console.log(`"${key}" maps to "${value}"`);
      });
      
      console.log('=== CURRENT FILTER STATE ===');
      console.log('URL trainingFilter:', trainingFilter);
      console.log('Checked courseTypeFilters:', courseTypeFilters.filter(f => f.checked).map(f => f.label));
      console.log('================================');
    }
  }, [trainings, trainingFilter, courseTypeFilters]);

  // ====================
  // EVENT HANDLERS
  // ====================

  /**
   * Handle course type filter changes
   * @param optionId - Filter option ID
   * @param checked - Whether filter is checked
   */
  const handleCourseTypeFilter = (optionId: string, checked: boolean) => {
    console.log('=== HANDLE COURSE TYPE FILTER ===');
    console.log('optionId:', optionId, 'checked:', checked);
    
    const selectedFilter = courseTypeFilters.find(item => item.id === optionId);
    if (!selectedFilter) {
      console.log('Filter not found:', optionId);
      return;
    }
    
    const mappedValue = COURSE_TYPE_MAPPING[selectedFilter.label as keyof typeof COURSE_TYPE_MAPPING];
    console.log('Mapped value:', mappedValue);
    console.log('Current trainingFilter:', trainingFilter);
    
    setTrainingFilter(prev => {
      if (!prev) {
        const newFilter = checked ? [mappedValue] : null;
        console.log('No previous filters, setting to:', newFilter);
        return newFilter;
      }
      
      if (checked) {
        // Add filter if not already present
        if (prev.includes(mappedValue)) {
          console.log('Filter already exists, keeping current:', prev);
          return prev;
        } else {
          const newFilter = [...prev, mappedValue];
          console.log('Adding filter, new array:', newFilter);
          return newFilter;
        }
      } else {
        // Remove filter
        const filtered = prev.filter(x => x !== mappedValue);
        const newFilter = filtered.length > 0 ? filtered : null;
        console.log('Removing filter, new array:', newFilter);
        return newFilter;
      }
    });
    
    console.log('=== END HANDLE ===');
  };

  /**
   * Handle filter changes for all filter types
   * @param filterType - Type of filter being changed
   * @param optionId - Option ID being changed
   * @param checked - New checked state
   */
  const handleFilterChange = (filterType: string, optionId: string, checked: boolean) => {
    console.log('handleFilterChange called:', { filterType, optionId, checked });
    
    const updateFilter = (setter: React.Dispatch<React.SetStateAction<FilterOption[]>>) => {
      setter(prev => prev.map(item => 
        item.id === optionId ? { ...item, checked } : item
      ));
    };

    switch (filterType) {
      case 'sector':
        updateFilter(setSectorFilters);
        break;
      case 'courseType':
        // FIX: Update local state immediately for better UX
        setCourseTypeFilters(prev => prev.map(item => 
          item.id === optionId ? { ...item, checked } : item
        ));
        // Then handle the URL update
        handleCourseTypeFilter(optionId, checked);
        break;
      case 'startDate':
        updateFilter(setStartDateFilters);
        break;
      case 'mode':
        updateFilter(setModeFilters);
        break;
    }
  };

  /**
   * Reset all filters to default state
   */
  const resetAllFilters = () => {
    setSectorFilters(INITIAL_SECTOR_FILTERS);
    setCourseTypeFilters(INITIAL_COURSE_TYPE_FILTERS);
    setStartDateFilters(INITIAL_DATE_FILTERS);
    setModeFilters(INITIAL_MODE_FILTERS);
    setSearchQuery('');
    setSearch('');
    setTrainingFilter(null);
    setFilterByMe(null);
  };

  // ====================
  // LOADING & ERROR STATES
  // ====================

  if (isLoading) return <Loading />;
  if (error) return <Errorbox message={error.message} />;

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        {/* Decorative grid background */}
        <div 
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(107,114,128,0.5) 2px, transparent 2px),
              linear-gradient(90deg, rgba(107,114,128,0.5) 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 35%, transparent 100%)',
          }}
        />

        {/* Main content */}
        <div className="relative z-10">
          <Header />

          {/* Navigation */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <Link to="/">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 bg-[#0389FF] text-white border-[#0389FF] rounded-full px-4 hover:bg-[#0389FF]/90"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                </motion.div>
              </Link>

              {/* Share Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center space-x-2 bg-[#0389FF] text-white border-[#0389FF] rounded-full px-4 hover:bg-[#0389FF]/90"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8 pb-16">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-semibold text-gray-900 mb-2"
            >
              Explore Courses
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold text-gray-900"
            >
              Get trained and become Certified Professional
            </motion.h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8 sticky top-4 z-20"
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Label */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter By</span>
            </div>
            
            {/* Filter Dropdowns */}
            <FilterDropdown
              title="Sector"
              options={sectorFilters}
              onOptionChange={(optionId, checked) => handleFilterChange('sector', optionId, checked)}
            />
            
            <FilterDropdown
              title="Course type"
              options={courseTypeFilters}
              onOptionChange={(optionId, checked) => handleFilterChange('courseType', optionId, checked)}
            />
            
            <FilterDropdown
              title="Start date"
              options={startDateFilters}
              onOptionChange={(optionId, checked) => handleFilterChange('startDate', optionId, checked)}
            />
            
            <FilterDropdown
              title="Mode"
              options={modeFilters}
              onOptionChange={(optionId, checked) => handleFilterChange('mode', optionId, checked)}
            />

            {/* My Enrollments Toggle */}
            <Button
              variant={filterByMe ? "default" : "outline"}
              size="sm"
              className={filterByMe ? "bg-green-600 text-white" : "border-gray-300"}
              onClick={() => setFilterByMe(!filterByMe)}
            >
              My Enrollments
            </Button>
            
            {/* Reset Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-600 flex items-center space-x-1"
                onClick={resetAllFilters}
              >
                <span className="text-red-500">↻</span>
                <span>Reset Filter</span>
              </Button>
            </motion.div>
            
            {/* Search Box */}
            <div className="ml-auto flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1.5">
              <Search className="h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for Courses"
                className="bg-transparent border-none focus:ring-0 text-sm w-64"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Courses List */}
        {Object.entries(filteredTrainings).length > 0 ? (
          Object.entries(filteredTrainings).map(([month, monthTrainings]) => (
            <div key={month} className="mb-8">
              {/* Month Header */}
              <motion.div 
                className="flex items-center justify-between cursor-pointer mb-4 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => toggleMonthExpansion(month)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-medium text-gray-700">{month}</h3>
                  <span className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full font-medium">
                    {monthTrainings.length} course{monthTrainings.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isMonthExpanded(month) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-1 rounded-full hover:bg-gray-200"
                  title={isMonthExpanded(month) ? 'Click to collapse' : 'Click to expand'}
                >
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </motion.div>
              </motion.div>
              
              {/* Course Cards - FIX: Update animation to start expanded */}
              <AnimatePresence>
                {isMonthExpanded(month) && (
                  <motion.div
                    initial={{ opacity: 1, height: 'auto' }} // FIX: Start expanded
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4 overflow-hidden"
                  >
                    {monthTrainings.map((training, index) => (
                      <motion.div
                        key={training.id}
                        initial={{ opacity: 1, y: 0 }} // FIX: Start visible
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <Link to={`/course-detail/${training.id}`}>
                          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                            {/* ...existing card content... */}
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row">
                                {/* Course Image */}
                                <div className="w-full md:w-48 h-48 bg-gray-200 relative overflow-hidden">
                                  <img 
                                    src={getCourseImage(training)} 
                                    alt={training.title}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    onError={(e) => {
                                      e.currentTarget.src = '/course-images/default.jpg';
                                    }}
                                  />
                                  
                                  {/* Category Badge */}
                                  {training.category && (
                                    <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                      {training.category}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Course Details */}
                                <div className="flex-1 p-6">
                                  <div className="flex flex-col h-full justify-between">
                                    <div>
                                      {/* Title and Enrollment Status */}
                                      <div className="flex items-start justify-between">
                                        <h4 className="text-lg font-medium text-gray-900 mb-2">{training.title}</h4>
                                        {isUserEnrolled(training) && (
                                          <span className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm font-medium">
                                            Enrolled
                                          </span>
                                        )}
                                      </div>
                                      
                                      {/* Course Info */}
                                      <div className="mt-3 space-y-2">
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                          <div className="flex items-center space-x-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatDate(training.startDate)}</span>
                                            <span>•</span>
                                            <span>{dayjs(training.startDate).format('dddd')}</span>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <span className="font-medium">Mode:</span>
                                            <span className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-medium border shadow-sm flex items-center space-x-1">
                                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                              <span>{training.type || (training.location ? "Offline" : "Online")}</span>
                                            </span>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                          {/* Location (for offline courses) */}
                                          {training.location && (
                                            <div className="flex items-center space-x-1">
                                              <MapPin className="h-4 w-4" />
                                              <span>{training.location}</span>
                                            </div>
                                          )}
                                          
                                          {/* Instructor Info */}
                                          {training.instructor && (
                                            <div className="flex items-center space-x-1">
                                              <span className="font-medium">Instructor:</span>
                                              <span>
                                                {training.instructor.firstName}
                                                {training.instructor.lastName && ` ${training.instructor.lastName}`}
                                                {training.instructor.institutionName && ` (${training.instructor.institutionName})`}
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        {/* Description */}
                                        {training.description && (
                                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                            {training.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Price and Action Buttons */}
                                    <div className="flex items-center justify-between mt-4">
                                      <div className="flex items-center space-x-1 text-lg font-semibold text-gray-900">
                                        <span>{formatPrice(training.cost)}</span>
                                      </div>
                                      
                                      <div className="flex items-center space-x-3">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                          <Button variant="outline" size="sm" onClick={(e) => e.preventDefault()}>
                                            More Info
                                          </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                          <Button 
                                            className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              navigate(`/course-detail/${training.id}`);
                                            }}
                                          >
                                            {isUserEnrolled(training) ? 'VIEW COURSE' : 'REGISTER NOW'}
                                          </Button>
                                        </motion.div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          // No Results Found
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
            <Button 
              variant="ghost" 
              className="mt-4 text-[#0389FF] hover:text-[#0389FF]/90"
              onClick={resetAllFilters}
            >
              Reset all filters
            </Button>
          </motion.div>
        )}

        {/* Results Summary */}
        {Object.entries(filteredTrainings).length > 0 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-gray-600">
              Showing {Object.values(filteredTrainings).flat().length} courses
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>‹</Button>
              <Button variant="outline" size="sm">›</Button>
            </div>
          </div>
        )}
      </div>

      {/* Counseling CTA Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-blue-100 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 bg-blue-300 rounded-full overflow-hidden shadow-md">
                <img 
                  src="/lovable-uploads/b0da6a24-f85c-48ba-8f2f-2fce65f2f2d1.png" 
                  alt="Counselor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Not sure where to start?</h3>
                <p className="text-lg text-gray-700">Book a free counselling session and we'll guide you.</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => navigate("/career-counselling")} className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-8 py-3 text-lg">
                BOOK COUNSELLING
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Footer />
      <SharePopup isVisible={isShowing} />
    </div>
  );
};

export default Courses;