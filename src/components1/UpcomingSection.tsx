import { ArrowUpRight, MapPin, User } from "lucide-react";

const sessions = [
  {
    title: "Cancer Genomics",
    desc:
      "Explore the forefront of genomic research in oncology. Uncover insights for personalized treatments.",
    date: "Starts 12th Feb’26",
    mode: "Hybrid (Online + Inperson)",
    collab: "In collaboration with Dr. Karthick",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    title: "Cancer Genomics",
    desc:
      "Explore the forefront of genomic research in oncology. Uncover insights for personalized treatments.",
    date: "Starts 12th Feb’26",
    mode: "Hybrid (Online + Inperson)",
    collab: "In collaboration with Dr. Karthick",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
];

const UpcomingSessions = () => {
  return (
    <section className="bg-[#2B8C63] text-[#FFD6DC] py-16 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-14">
          <h2 className="text-4xl font-semibold tracking-wide">
            UPCOMING SESSIONS
          </h2>
          <span className="text-3xl font-light opacity-80">
            THIS MONTH
          </span>
        </div>

        {/* List */}
        <div className="space-y-16">
          {sessions.map((item, index) => (
            <div key={index} className="relative group">

              {/* Divider line + diamond */}
              <div className="absolute left-0 right-0 top-0 flex items-center">
                <span className="w-3 h-3 bg-[#FFD6DC] rotate-45 mx-3" />
                <div className="flex-1 h-px bg-[#FFD6DC]/60" /> 
              </div>

              <div className="p-12 flex items-start gap-10">
                
                {/* Date → Image swap */}
                <div className="w-[260px] shrink-0 relative">
                  {/* Date */}
                  <p className="text-lg font-semibold transition-opacity duration-300 group-hover:opacity-0">
                    {item.date}
                  </p>

                  {/* Image */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <img
                      src={item.image}
                      alt=""
                      className="rounded-3xl border-4 border-[#FBCED9]/40"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 max-w-2xl">
                  <h3 className="text-xl font-semibold mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm opacity-90 mb-4">
                    {item.desc}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 text-sm">
                    <span className="flex items-center gap-2 fill-[#FFD6DC]">
                      <MapPin size={16} />
                      {item.mode}
                    </span>

                    <span className="flex items-center gap-2">
                      <User size={16} />
                      {item.collab}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 transition-transform duration-300 group-hover:rotate-180 group-hover:color-white">
                  <div className="w-12 h-12 rounded-full bg-[#FFD6DC] flex items-center justify-center">
                    <ArrowUpRight className="text-[#2B8C63]" />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingSessions;
