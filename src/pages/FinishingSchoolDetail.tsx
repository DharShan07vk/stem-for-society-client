import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components1/ui/button";
import { Input } from "@/components1/ui/input";
import { Calendar, Clock, CheckCircle2, Users, BookOpen, Award } from "lucide-react";
import Header from "@/components1/Header";
import Footer from "@/components1/Footer";
import { toast } from "react-toastify";

// Course data (this should match the data from FinishingSchool.tsx)
const courseData: { [key: string]: any } = {
  "1": {
    title: "Bioinformatics & Genomics & Data Science",
    subtitle: "Post Graduate Specialization",
    description: "This online program is designed to help you advance your career with cutting-edge skills in Bioinformatics, Genomics & Data Science. From understanding the fundamentals to mastering complex data analytics, you'll gain practical knowledge and hands-on experience for a successful and enriching career in life sciences.",
    image: "https://tse1.mm.bing.net/th/id/OIP.H77lzR28If23YLTwfBIFGAHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
    language: "English",
    mode: "Hybrid",
    delivery: "Live",
    duration: "1 year",
    startDate: "Sep 2026",
    price: 50000,
    currency: "INR",
    whoIsItFor: [
      "Fresh graduates looking to specialize in bioinformatics",
      "Working professionals seeking career advancement",
      "Researchers wanting to integrate data science with biology",
      "Students interested in genomics and computational biology",
    ],
    whatYouLearn: [
      "Foundation in bioinformatics and genomics",
      "Advanced data science techniques for biological data",
      "Machine learning applications in genomics",
      "Practical tools and software used in the industry",
      "Research methodologies and project management",
      "Industry best practices and case studies",
    ],
  },
  "2": {
    title: "Gen-AI in Life Science & Healthcare",
    subtitle: "Post Graduate Specialization",
    description: "The PG program in AI in Life Sciences integrates artificial intelligence with biological research, equipping students to innovate in healthcare and biotech. You'll learn to apply AI technologies to advance life sciences and improve patient outcomes through practical projects and industry exposure.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    language: "English",
    mode: "Hybrid",
    delivery: "Live",
    duration: "1 year",
    startDate: "Feb 2026",
    price: 55000,
    currency: "INR",
    whoIsItFor: [
      "Life science graduates interested in AI applications",
      "Healthcare professionals looking to leverage AI",
      "Data scientists wanting to specialize in healthcare",
      "Researchers exploring AI in medical research",
    ],
    whatYouLearn: [
      "Fundamentals of AI and machine learning",
      "AI applications in drug discovery and development",
      "Healthcare data analytics and predictive modeling",
      "Deep learning for medical imaging",
      "Ethical considerations in AI healthcare applications",
      "Real-world case studies and projects",
    ],
  },
  "3": {
    title: "Advanced Clinical Research & Data Analytics",
    subtitle: "Professional Certificate",
    description: "Master the fundamentals of clinical research combined with data analytics skills. Learn regulatory requirements, trial design, and statistical analysis for healthcare research through comprehensive modules and practical assignments.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    language: "English",
    mode: "Online",
    delivery: "Self-paced",
    duration: "6 months",
    startDate: "Mar 2026",
    price: 30000,
    currency: "INR",
    whoIsItFor: [
      "Healthcare professionals transitioning to clinical research",
      "Fresh graduates interested in pharmaceutical research",
      "Data analysts looking to specialize in healthcare",
      "Medical students exploring research opportunities",
    ],
    whatYouLearn: [
      "Clinical trial design and methodology",
      "Regulatory affairs and compliance (ICH-GCP)",
      "Statistical analysis for clinical data",
      "Data management and quality assurance",
      "Medical writing and documentation",
      "Industry certifications and career guidance",
    ],
  },
};

const FinishingSchoolDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = courseData[courseId || "1"];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
  });

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button onClick={() => navigate("/finishing-school")}>Back to Courses</Button>
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
              <p className="text-gray-600 mb-4">{course.subtitle}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <BookOpen className="w-4 h-4" />
                  {course.language}
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
                  <Award className="w-4 h-4" />
                  {course.mode}
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                  <Users className="w-4 h-4" />
                  {course.delivery}
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
                    <p className="text-base font-semibold text-gray-900">{course.startDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0389FF] rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Time</p>
                    <p className="text-base font-semibold text-gray-900">10:00 AM - 12:00 PM</p>
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
                {course.whoIsItFor.map((item: string, index: number) => (
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
                {course.whatYouLearn.map((item: string, index: number) => (
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
                src={course.image}
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
                  ₹{course.price.toLocaleString()}
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
            <p className="text-gray-600">{course.duration}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <Calendar className="w-12 h-12 text-[#0389FF] mx-auto mb-3" />
            <h4 className="font-bold text-gray-900 mb-2">Start Date</h4>
            <p className="text-gray-600">{course.startDate}</p>
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

export default FinishingSchoolDetail;
