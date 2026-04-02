import { Badge, Button } from "@mantine/core";
import { Calendar, ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";

interface EventCardProps {
  title: string;
  date: string;
  location?: string;
  id: string;
  posterUrl: string;
  price: string;
  isEnrolled: boolean;
  isExpired?: boolean;
  category?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  location,
  id,
  posterUrl,
  price,
  isEnrolled,
  isExpired,
  category,
}) => {
  return (
    <div className="flex lg:flex-row flex-col shadow-md p-4 mb-4 w-full lg:gap-0 gap-3 max-w-5xl rounded-lg border">
      {/* Left Section: Poster */}
      <div className="flex-shrink-0 lg:w-[unset] w-full h-52 aspect-video mr-6 bg-gray-100 flex items-center justify-center">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-auto max-h-full object-contain object-center rounded-lg"
        />
      </div>

      {/* Right Section: Event Details */}
      <div className="details flex flex-col gap-2 w-full justify-start">
        <span className="title font-medium flex lg:flex-row flex-col justify-between text-xl sm:text-2xl md:text-xl mb-2 line-clamp-2 overflow-hidden text-ellipsis">
          {title}
          <Badge
            variant="dot"
            color={!category ? "gray" : "blue"}
            className={!category ? "text-gray-600" : "text-blue-500"}
          >
            {category || "Uncategorized"}
          </Badge>
        </span>
        <span className="text-green-600 flex items-center gap-2 font-semibold text-xs sm:text-sm md:text-base mb-1">
          <Calendar size={18} /> Date:{" "}
          <span className="date text-black font-normal">{date}</span>
        </span>
        <span className="text-green-600 flex items-center gap-2 font-semibold text-xs sm:text-sm md:text-base mb-1">
          <FaLocationDot /> Mode:{" "}
          <span className=" text-black font-normal">
            <Badge variant="dot" color={location ? "red" : "green"}>
              {location ? "Offline" : "Online"}
            </Badge>
          </span>
        </span>
        {location && (
          <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base mb-2 line-clamp-2">
            Location:{" "}
            <span className="location text-black font-normal">{location}</span>
          </span>
        )}
        <div className="w-full mt-auto flex lg:flex-row flex-col gap-2">
          <h3 className="text-lg font-medium">₹ {price}</h3>
          <div className="flex gap-2 lg:ml-auto">
            {!isEnrolled && !isExpired ? (
              <Button radius={999} px={20} className="lg:w-[unset] w-full">
                <Link to={`/training/${id}`}>Register now</Link>
              </Button>
            ) : (
              <Button
                radius={999}
                px={20}
                className="lg:w-[unset] w-full"
                disabled
              >
                Already Registered
              </Button>
            )}
            <Link
              to={`/training/${id}`}
              className="text-blue-500 text-xs sm:text-sm md:text-base lg:w-[unset] w-full"
            >
              <Button
                radius={999}
                classNames={{
                  label: "flex items-center justify-center gap-1",
                }}
                className="lg:w-[unset] w-full"
                variant="outline"
              >
                <span>View details</span>
                <ChevronRight size={12} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
