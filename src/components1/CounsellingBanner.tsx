import { Button } from "@/components1/ui/button";
import { Link } from "react-router-dom";

const CounsellingBanner = () => {
  return (
    <div className="bg-[#D6ECFF] rounded-3xl overflow-hidden w-full max-w-[1440px] mx-auto max-h-[240px]">
      <div className="container mx-auto px-8 py-6 flex flex-col md:flex-row items-center gap-8 h-full">
        {/* Illustration - Woman with laptop */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img 
              src="/lovable-uploads/Frame 427319842.png" 
              alt="Counselling" 
              className="relative z-10 w-52 h-auto object-contain"
              onError={(e) => {
                // Fallback placeholder
                e.currentTarget.src = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop";
              }}
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-left">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1 italic">
            Not sure where to start?
          </h2>
          <h3 className="text-lg md:text-2xl font-semibold text-gray-900 italic">
            Book a free counselling session and
          </h3>
          <h3 className="text-lg md:text-2xl font-semibold text-gray-900 italic">
            we'll guide you.
          </h3>
        </div>

        {/* CTA Button */}
        <div className="flex-shrink-0 self-end mb-4">
          <Link to="/career-counselling">
            <Button 
              className="bg-[#0389FF] text-white hover:bg-[#0389FF]/90 px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all duration-300 hover:scale-105"
            >
              BOOK COUNSELLING
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CounsellingBanner;
