import { Badge } from "@/components1/ui/badge";
import { Button } from "@/components1/ui/button";
import { Card } from "@/components1/ui/card";
import { ArrowRight } from "lucide-react";
import { Icon } from "@iconify/react";
import VectorIcon from "@/assets/Vector.png";

interface CourseCardProps {
  image: string;
  category: string;
  tags: string[];
  title: string;
  description: string;
  startDate: string;
  mode: string;
  instructor: string;
  instructorImage?: string;
  trainingId?: string;
  isEnrolled?: boolean;
  onRegister?: () => void;
  onMoreDetails?: () => void;
}

const CourseCard = ({
  image,
  category,
  tags,
  title,
  description,
  startDate,
  mode,
  instructor,
  instructorImage,
  isEnrolled,
  onRegister,
  onMoreDetails,
}: CourseCardProps) => {
  return (
    <Card className="flex flex-col md:flex-row overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative w-full md:w-[320px] h-[200px] md:h-[220px] flex-shrink-0 p-3">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-xl"
        />
        {/* Category Badge */}
        <Badge className="absolute top-5 left-5 bg-[#0389FF] text-white text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap">
          <img src={VectorIcon} className="w-3.5 h-3.5 object-contain" alt="" />
          {category}
        </Badge>
      </div>

      {/* Content Section */}
      <div className="flex-1 py-3 px-4 flex flex-col justify-between">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-[#0389FF] border-[#0389FF] text-xs px-3 py-0.5 rounded-full font-medium bg-white"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0389FF] mr-1.5"></span>
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">{description}</p>

        {/* Info Row */}
        <div className="flex flex-wrap items-center gap-5 mb-3 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <Icon icon="solar:calendar-bold" className="text-[#0389FF]" width="20" height="20" />
            <div>
              <p className="text-gray-400 text-[10px]">Starts</p>
              <p className="text-gray-900 font-semibold text-xs">{startDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Icon icon="basil:location-solid" className="text-[#0389FF]" width="20" height="20" />
            <div>
              <p className="text-gray-400 text-[10px]">Online plus In person</p>
              <p className="text-gray-900 font-semibold text-xs">{mode}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {instructorImage ? (
              <img src={instructorImage} alt={instructor} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <Icon icon="solar:user-bold" width="20" height="20" className="text-[#0389FF]" />
            )}
            <div>
              <p className="text-gray-400 text-[10px]">In collaboration with</p>
              <p className="text-gray-900 font-semibold text-xs">{instructor}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button 
            className="flex items-center gap-2 text-gray-800 font-medium text-sm hover:text-[#0389FF] transition-colors group"
            onClick={onMoreDetails}
          >
            More Details
            <span className="w-5 h-5 rounded-full border-2 border-gray-800 flex items-center justify-center group-hover:border-[#0389FF] transition-colors">
              <ArrowRight className="w-3 h-3 text-gray-800 group-hover:text-[#0389FF]" />
            </span>
          </button>
          
          {isEnrolled ? (
            <Button 
              className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-5 py-2 rounded-full font-medium text-sm"
              onClick={onMoreDetails}
            >
              View Course
            </Button>
          ) : (
            <Button 
              className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white px-5 py-2 rounded-full font-medium text-sm"
              onClick={onRegister}
            >
              Register Now
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
