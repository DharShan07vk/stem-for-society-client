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
interface FinishingSchoolCourse {
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

// Sample course data for Finishing School programs
const finishingSchoolCourses: FinishingSchoolCourse[] = [
  {
    id: "1",
    image: "https://tse1.mm.bing.net/th/id/OIP.H77lzR28If23YLTwfBIFGAHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
    universityLogo: "/lovable-uploads/b29296a1-1faf-45dc-a273-07bdab44992a.png",
    universityName: "STEM University",
    badge: "Post Graduate specialization",
    title: "Bioinformatics & Genomics & Data Science",
    description: "Advance your career with our PG program in Bioinformatics, Genomics & Data Science, blending biological research with powerful data analytics.",
    duration: "1 year",
    mode: "Hybrid",
    modeDescription: "Online + In-person",
    startDate: "Sep'25",
    category: "life-sciences",
    level: "postgraduate",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    universityLogo: "/lovable-uploads/b29296a1-1faf-45dc-a273-07bdab44992a.png",
    universityName: "STEM University",
    badge: "Post Graduate specialization",
    title: "Gen-AI in Life Science & Healthcare",
    description: "The PG program in AI in Life Sciences integrates artificial intelligence with biological research, equipping students to innovate in healthcare and biotech. Graduates are prepared to apply AI technologies to advance life sciences and improve patient outcomes.",
    duration: "1 year",
    mode: "Hybrid",
    modeDescription: "Online + In-person",
    startDate: "Feb'26",
    category: "healthcare",
    level: "postgraduate",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    universityLogo: "/lovable-uploads/b29296a1-1faf-45dc-a273-07bdab44992a.png",
    universityName: "STEM University",
    badge: "Professional Certificate",
    title: "Advanced Clinical Research & Data Analytics",
    description: "Master the fundamentals of clinical research combined with data analytics skills. Learn regulatory requirements, trial design, and statistical analysis for healthcare research.",
    duration: "6 months",
    mode: "Online",
    modeDescription: "Self-paced Learning",
    startDate: "Mar'25",
    category: "healthcare",
    level: "certificate",
  },
  {
    id: "4",
    image: "https://th.bing.com/th/id/OIP.9xv8gmnTjDUVXAvJYUGHSwHaDt?w=345&h=175&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    universityLogo: "/lovable-uploads/b29296a1-1faf-45dc-a273-07bdab44992a.png",
    universityName: "STEM University",
    badge: "Post Graduate specialization",
    title: "Pharmaceutical Sciences & Drug Development",
    description: "Comprehensive program covering drug discovery, development processes, regulatory affairs, and quality assurance in the pharmaceutical industry.",
    duration: "1 year",
    mode: "Hybrid",
    modeDescription: "Online + In-person",
    startDate: "Jul'25",
    category: "pharmaceutical",
    level: "postgraduate",
  },
  {
    id: "5",
    image: "https://www.e3melbusiness.com/assets/images/Leadership-in-Healthcare-Management.jpg",
    universityLogo: "/lovable-uploads/b29296a1-1faf-45dc-a273-07bdab44992a.png",
    universityName: "STEM University",
    badge: "Executive Program",
    title: "Healthcare Management & Leadership",
    description: "Develop leadership skills tailored for healthcare organizations. Learn strategic planning, operations management, and healthcare policy implementation.",
    duration: "8 months",
    mode: "Online",
    modeDescription: "Weekend Classes",
    startDate: "Apr'25",
    category: "healthcare",
    level: "executive",
  },
  {
    id: "6",
    image: "https://royed.in/wp-content/uploads/2018/05/Latam-drug-regulatory-affairs-1.png",
    universityLogo: "/lovable-uploads/b29296a1-1faf-45dc-a273-07bdab44992a.png",
    universityName: "STEM University",
    badge: "Professional Certificate",
    title: "Medical Device Regulatory Affairs",
    description: "Specialized program focusing on medical device regulations, quality management systems, and compliance requirements across global markets.",
    duration: "4 months",
    mode: "Online",
    modeDescription: "Self-paced Learning",
    startDate: "May'25",
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

const FinishingSchool = () => {
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
    return finishingSchoolCourses.filter(course => {
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
  const handleDownloadBrochure = (course: FinishingSchoolCourse) => {
    // Placeholder for brochure download functionality
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
                Transform Your Career with{" "}
                <span className="text-[#0D9488]">Industry-Ready Skills</span>
              </h1>
              {/* <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Bridge the gap between academy and industry with our specialized finishing school programs. 
                Gain practical skills, industry certifications, and hands-on experience to accelerate your professional journey.
              </p> */}
            </div>

            {/* Stats Section
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#0D9488]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-6 h-6 text-[#0D9488]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">15+</p>
                <p className="text-gray-500 text-sm">Programs Available</p>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#0389FF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-[#0389FF]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">90%</p>
                <p className="text-gray-500 text-sm">Placement Rate</p>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">5000+</p>
                <p className="text-gray-500 text-sm">Alumni Network</p>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">50+</p>
                <p className="text-gray-500 text-sm">Industry Partners</p>
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
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="postgraduate">Post Graduate</SelectItem>
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
                    placeholder="Search programs..."
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
                Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> programs
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
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
