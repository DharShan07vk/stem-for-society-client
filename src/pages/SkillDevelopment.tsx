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

// Course data interface
interface SkillCourse {
  id: string;
  image: string;
  universityLogo?: string;
  universityName?: string;
  badge: string;
  title: string;
  description: string;
  duration: string;
  mode: string;
  modeDescription: string;
  startDate: string;
  category: string;
  level: string;
}

// Short-term skill development course samples (reduced durations)
const skillDevelopmentCourses: SkillCourse[] = [
  {
    id: "1",
    image: "https://tse1.mm.bing.net/th/id/OIP.H77lzR28If23YLTwfBIFGAHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
    universityLogo: "/lovable-uploads/b29296a1-1faf-45dc-a273-07bdab44992a.png",
    universityName: "STEM University",
    badge: "Micro Course",
    title: "Intro to Bioinformatics & Data Skills",
    description: "Fast-track fundamentals of bioinformatics and data analysis to start applying computational biology techniques quickly.",
    duration: "12 weeks",
    mode: "Hybrid",
    modeDescription: "Online + Short workshops",
    startDate: "Mar'25",
    category: "life-sciences",
    level: "micro",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    universityLogo: "/lovable-uploads/b29296a1-1faf-45dc-a273-07bdab44992a.png",
    universityName: "STEM University",
    badge: "Micro Course",
    title: "Applied Gen-AI for Life Sciences",
    description: "Hands-on modules showing how to apply generative AI tools for real-world life-science problems.",
    duration: "8 weeks",
    mode: "Online",
    modeDescription: "Live sessions + projects",
    startDate: "Apr'25",
    category: "healthcare",
    level: "micro",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    universityLogo: "/lovable-uploads/b29296a1-1faf-45dc-a273-07bdab44992a.png",
    universityName: "STEM University",
    badge: "Short Certificate",
    title: "Clinical Research Essentials",
    description: "Compact coverage of trial design, regulatory basics, and analysis for immediate application in research roles.",
    duration: "6 weeks",
    mode: "Online",
    modeDescription: "Self-paced + community",
    startDate: "May'25",
    category: "healthcare",
    level: "certificate",
  },
  {
    id: "4",
    image: "https://th.bing.com/th/id/OIP.9xv8gmnTjDUVXAvJYUGHSwHaDt?w=345&h=175&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    universityLogo: "/lovable-uploads/b29296a1-1faf-45dc-a273-07bdab44992a.png",
    universityName: "STEM University",
    badge: "Micro Course",
    title: "Drug Development Fundamentals",
    description: "Quick practical overview of drug discovery and key development milestones for cross-functional teams.",
    duration: "10 weeks",
    mode: "Hybrid",
    modeDescription: "Online + workshop",
    startDate: "Jun'25",
    category: "pharmaceutical",
    level: "micro",
  },
  {
    id: "5",
    image: "https://www.e3melbusiness.com/assets/images/Leadership-in-Healthcare-Management.jpg",
    universityLogo: "/lovable-uploads/b29296a1-1faf-45dc-a273-07bdab44992a.png",
    universityName: "STEM University",
    badge: "Short Program",
    title: "Healthcare Leadership Essentials",
    description: "Practical leadership and operations modules tailored for healthcare professionals aiming for rapid impact.",
    duration: "8 weeks",
    mode: "Online",
    modeDescription: "Weekend-intensive",
    startDate: "May'25",
    category: "healthcare",
    level: "executive",
  },
  {
    id: "6",
    image: "https://royed.in/wp-content/uploads/2018/05/Latam-drug-regulatory-affairs-1.png",
    universityLogo: "/lovable-uploads/b29296a1-1faf-45dc-a273-07bdab44992a.png",
    universityName: "STEM University",
    badge: "Short Certificate",
    title: "Medical Device Compliance Basics",
    description: "Focused coverage of regulatory essentials for med-device teams and newcomers to compliance roles.",
    duration: "4 weeks",
    mode: "Online",
    modeDescription: "Self-paced",
    startDate: "Apr'25",
    category: "medical-devices",
    level: "certificate",
  },
];

// Filter state interface
interface FilterState {
  category: string;
  level: string;
  mode: string;
  searchQuery: string;
}

const SkillDevelopment = () => {
  const navigate = useNavigate();
  
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
    return skillDevelopmentCourses.filter(course => {
      const matchesSearch = !filters.searchQuery || 
        course.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const matchesCategory = !filters.category || filters.category === "all" ||
        course.category === filters.category;
      
      const matchesLevel = !filters.level || filters.level === "all" ||
        course.level === filters.level;
      
      const matchesMode = !filters.mode || filters.mode === "all" ||
        course.mode.toLowerCase() === filters.mode.toLowerCase();
      
      return matchesSearch && matchesCategory && matchesLevel && matchesMode;
    });
  }, [filters]);

  // Handle course explore
  const handleExplore = (courseId: string) => {
    navigate(`/course-detail/${courseId}`);
  };

  // Handle brochure download
  const handleDownloadBrochure = (course: SkillCourse) => {
    console.log("Downloading brochure for:", course.title);
  };

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
                Quick Skill Boosts with <span className="text-[#0D9488]">Short Practical Courses</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Short, hands-on programs to rapidly upskill for industry roles — practical projects, expert mentors, and career-focused outcomes.
              </p>
            </div>

            {/* Stats Section */}
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
            </div>

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
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="life-sciences">Life Sciences</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="pharmaceutical">Pharmaceutical</SelectItem>
                    <SelectItem value="medical-devices">Medical Devices</SelectItem>
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
                    image={course.image}
                    universityLogo={course.universityLogo}
                    universityName={course.universityName}
                    badge={course.badge}
                    title={course.title}
                    description={course.description}
                    duration={course.duration}
                    mode={course.mode}
                    modeDescription={course.modeDescription}
                    startDate={course.startDate}                    
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

export default SkillDevelopment;
