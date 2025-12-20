import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { ChevronDown, MapPin, User, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import { GenericError, GenericResponse } from "@/lib/types";

// Training type (matching Courses.tsx)
type Training = {
  id: string;
  title: string;
  coverImg: string;
  startDate: string;
  endDate: string;
  description: string;
  instructor: {
    firstName: string;
    lastName?: string;
  };
  type: "ONLINE" | "OFFLINE" | "HYBRID";
};

function useUpcomingTrainings() {
  return useQuery<Training[], AxiosError<GenericError>>({
    queryKey: ["upcoming-trainings"],
    queryFn: async () => {
      const response = await api().get<GenericResponse<Training[]>>("/trainings");
      if (!response.data?.data?.length) return [];
      const today = dayjs().startOf("day");
      const upcoming = response.data.data
        .filter((training) => dayjs(training.startDate).isAfter(today) || dayjs(training.startDate).isSame(today))
        .sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate)))
        .slice(0, 3);
      return upcoming;
    },
    staleTime: 1000 * 60 * 5,
  });
}

function formatSessionDate(date: string) {
  const d = dayjs(date);
  const day = d.date();
  const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
  return `Starts ${day}${suffix} ${d.format("MMM'YY")}`;
}

function formatMode(type: string) {
  switch (type) {
    case "HYBRID": return "Hybrid(Online + Inperson)";
    case "ONLINE": return "Online";
    case "OFFLINE": return "In-person";
    default: return type;
  }
}

const UpcomingSessions = () => {
  const navigate = useNavigate();
  const { data: trainings, isLoading } = useUpcomingTrainings();

  const sessions = useMemo(() => {
    if (!trainings) return [];
    return trainings.map((training) => ({
      id: training.id,
      title: training.title,
      desc: training.description,
      date: formatSessionDate(training.startDate),
      mode: formatMode(training.type),
      collab: `In collaboration with ${training.instructor?.firstName || ""} ${training.instructor?.lastName || ""}`.trim(),
      image: training.coverImg,
    }));
  }, [trainings]);

  if (isLoading) {
    return (
      <section className="bg-[#2B8C63] text-[#FFD6DC] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xl">Loading upcoming sessions...</p>
        </div>
      </section>
    );
  }

  if (!sessions.length) {
    return null; // No course sessions bcz design illa 
  }

  return (
    <section className="bg-[#2B8C63] text-[#FFD6DC] py-16 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-wide italic">
            UPCOMING SESSIONS
          </h2>
          <span className="text-2xl md:text-3xl font-light">
            THIS MONTH
          </span>
          <ChevronDown className="w-8 h-8 ml-1" />
        </div>

        {/* Timeline List */}
        <div className="relative">
          {sessions.map((item) => (
            <div 
              key={item.id} 
              className="relative group cursor-pointer"
              onClick={() => navigate(`/course-detail/${item.id}`)}
            >
              {/* Content Row */}
              <div className="flex items-center gap-6 md:gap-10 py-6 md:py-10">
                
                {/* Left Side - Date / Image with date overlay on hover */}
                <div className="w-[180px] md:w-[220px] shrink-0 relative h-[100px] md:h-[120px]">
                  {/* Date text - visible by default, fades out on hover */}
                  <div className="absolute inset-0 flex items-center transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:translate-y-2">
                    <p className="text-xl md:text-2xl font-semibold leading-tight">
                      {item.date}
                    </p>
                  </div>

                  {/* Cover Image with date overlay - fades in on hover */}
                  <div className="absolute inset-0 opacity-0 scale-95 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100">
                    <div className="relative w-full h-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      {/* Date badge overlay at bottom-left of image */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl px-3 py-2">
                        <p className="text-sm md:text-base font-medium text-white">
                          {item.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 max-w-2xl">
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 text-[#FFD6DC]">
                    {item.title}
                  </h3>

                  <p className="text-sm md:text-base opacity-90 mb-4 line-clamp-2">
                    {item.desc}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-6 text-sm">
                    <span className="flex items-center gap-2">
                      <MapPin size={16} className="shrink-0" />
                      {item.mode}
                    </span>

                    <span className="flex items-center gap-2">
                      <User size={16} className="shrink-0" />
                      {item.collab}
                    </span>
                  </div>
                </div>

                {/* Arrow in circle - rotates clockwise on hover */}
                <div className="shrink-0 self-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#FFD6DC] flex items-center justify-center transition-all duration-500 ease-in-out group-hover:bg-[#FFD6DC]">
                    <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-[#FFD6DC] transition-all duration-500 ease-in-out rotate-180 group-hover:rotate-0 group-hover:text-[#2B8C63]" />
                  </div>
                </div>

              </div>

              {/* Divider line with diamond on left */}
              <div className="flex items-center">
                <span className="w-3 h-3 bg-[#FFD6DC] rotate-45 shrink-0" />
                <div className="flex-1 h-px bg-[#FFD6DC]/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingSessions;
