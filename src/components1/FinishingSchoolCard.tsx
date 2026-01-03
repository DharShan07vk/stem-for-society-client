import { Card } from "@/components1/ui/card";
import { Badge } from "@/components1/ui/badge";
import { Button } from "@/components1/ui/button";
import { ArrowRight, Clock, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FinishingSchoolCardProps {
  courseId: string;
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
}

const FinishingSchoolCard = ({
  courseId,
  image,
  universityLogo,
  universityName,
  badge,
  title,
  description,
  duration,
  mode,
  modeDescription,
  startDate,
}: FinishingSchoolCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative w-full h-[220px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col">
        {/* University Logo and Badge Row */}
        <div className="flex items-center justify-between mb-4">
          {universityLogo ? (
            <div className="flex items-center gap-2">
              <img
                src={universityLogo}
                alt={universityName}
                className="h-8 w-auto object-contain"
              />
              {universityName && (
                <span className="text-sm font-medium text-gray-700">{universityName}</span>
              )}
            </div>
          ) : (
            <div className="h-8" />
          )}
          <Badge className="bg-[#0D9488] hover:bg-[#0D9488] text-white text-xs px-3 py-1.5 rounded-full font-medium">
            {badge}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-5 line-clamp-3 leading-relaxed flex-grow">
          {description}
        </p>

        {/* Course Info Row */}
        <div className="flex items-center justify-between gap-4 mb-5 pt-4 border-t border-gray-100">
          {/* Duration */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#E0F2F1] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#0D9488]" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wide">Duration</p>
              <p className="text-gray-900 font-semibold text-sm">{duration}</p>
            </div>
          </div>

          {/* Mode */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#E0F2F1] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#0D9488]" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wide">{mode}</p>
              <p className="text-gray-900 font-semibold text-sm">{modeDescription}</p>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#E0F2F1] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#0D9488]" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wide">Starts</p>
              <p className="text-gray-900 font-semibold text-sm">{startDate}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate(`/finishing-school-detail/${courseId}`)}
            className="flex-1 bg-[#0F4C5C] hover:bg-[#0F4C5C]/90 text-white py-3 rounded-full font-medium text-sm transition-all duration-300"
          >
            Explore more
          </Button>
          
        </div>
      </div>
    </Card>
  );
};

export default FinishingSchoolCard;
