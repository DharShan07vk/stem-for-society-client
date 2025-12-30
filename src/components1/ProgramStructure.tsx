import { useState } from "react";

// Import images for production build
import asset1 from "../assets/asset1.png";
import asset2 from "../assets/asset2.png";
import asset3 from "../assets/asset3.png";
import asset4 from "../assets/asset4.png";
import asset6 from "../assets/asset6.png";
import joinAsset from "../assets/joinAsset.png";


const OurPrograms = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getCardClasses = (cardId: string) => {
    if (hoveredCard === null) return "";
    if (hoveredCard === cardId) return "";
    return "opacity-50";
  };

  return (
    <section className="py-6 sm:py-8 md:py-10 bg-white px-4 sm:px-8 md:px-16 lg:px-20 xl:px-[120px]">
      <div className="max-w-screen-2xl mx-auto">

        <h2 className="text-2xl sm:text-3xl md:text-4xl px-2 sm:px-5 mb-6 sm:mb-8 md:mb-10 text-[#00000080]">
          Our Programs
        </h2>
        <div className="w-full flex justify-center">
          {/* Mobile: Single column, Tablet: 2 columns, Desktop: Original 6-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 w-full max-w-[1440px] mx-auto auto-rows-auto lg:grid-rows-6 lg:h-[1080px]">

            {/* 1. Skill Development Card */}
            <div
              onMouseEnter={() => setHoveredCard("skill")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-full lg:row-span-4 lg:col-span-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden transition-all duration-500 bg-[#C6B7E2] hover:bg-[#B8A7D8] cursor-pointer ${getCardClasses("skill")}`}
            >
              <img
                src={asset1}
                alt="Skill Development"
                className="absolute left-1/2 -translate-x-1/2 bottom-[-20px] sm:bottom-[-15px] md:bottom-[-20px] w-[250px] sm:w-[300px] md:w-[360px] lg:w-[411px] h-auto object-contain transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-instrument mb-2 sm:mb-3 text-[#472059] scale-y-[1.3] sm:scale-y-[1.5] inline-block">
                  Skill development
                </h3>
                <p className="text-sm sm:text-base max-w-[90%] sm:max-w-[85%]">
                  Bridging academic learning with industrial skills for impactful career readiness.
                </p>
              </div>
              <div className="absolute inset-0 bg-black/5 rounded-2xl sm:rounded-3xl pointer-events-none" />
            </div>

            {/* 2. Finishing School Card */}
            <div
              onMouseEnter={() => setHoveredCard("finishing")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative w-full h-[280px] sm:h-[300px] md:h-[344px] lg:col-span-4 lg:row-span-2 rounded-2xl sm:rounded-[40px] p-4 sm:p-6 overflow-hidden transition-all duration-500 bg-[#FF8FB0] hover:bg-[#FF7FA4] cursor-pointer ${getCardClasses("finishing")}`}
            >
              <img
                src={asset2}
                alt="Finishing School"
                className="absolute right-[-20px] sm:right-[-30px] md:right-[-40px] top-[-15px] sm:top-[-25px] md:top-[-30px] w-[220px] sm:w-[380px] md:w-[480px] lg:w-[550px] h-auto object-contain transition-all duration-500 group-hover:scale-110 group-hover:-translate-x-2 group-hover:-translate-y-2"
              />
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-instrument mb-2 sm:mb-3 text-[#582059] scale-y-[1.3] sm:scale-y-[1.5] inline-block">
                  Finishing School
                </h3>
                <p className="text-sm sm:text-base max-w-[70%] sm:max-w-[55%] md:max-w-[45%]">
                 Where students/learns become confident achievers equipped with the essential soft skills, clarity, & professionalism employers expect in today's competitive world.
                </p>
              </div>
            </div>

            {/* 3. Individuals Card */}
            <div
              onMouseEnter={() => setHoveredCard("individuals")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative w-full h-[280px] sm:h-[320px] md:h-[344px] lg:col-start-3 lg:col-span-2 lg:row-span-2 lg:row-start-3 rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden transition-all duration-500 bg-[#FFE07A] hover:bg-[#FFD65C] cursor-pointer ${getCardClasses("individuals")}`}
            >
              <img
                src={asset3}
                alt="Individuals"
                className="absolute right-[10px] sm:right-[15px] md:right-[20px] top-[-10px] sm:top-[-15px] md:top-[-20px] w-[180px] sm:w-[260px] md:w-[320px] lg:w-[368px] h-auto object-contain transition-all duration-500 group-hover:scale-110"
              />
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-instrument mb-2 sm:mb-3 text-[#594D20] scale-y-[1.3] sm:scale-y-[1.5] inline-block">
                  Individuals
                </h3>
                <p className="text-sm sm:text-base max-w-[180px] sm:max-w-[210px] md:max-w-[241px]">
                Expert counselling to help you choose the right career path, strengthen emotional resilience, and unlock your highest personal potential.
                </p>
              </div>
            </div>

            {/* 4. Institutions Card */}
            <div
              onMouseEnter={() => setHoveredCard("institutions")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative w-full h-[280px] sm:h-[320px] md:h-[344px] lg:col-start-5 lg:row-start-3 lg:col-span-2 lg:row-span-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden transition-all duration-500 bg-[#C8DD9A] hover:bg-[#B9D487] cursor-pointer ${getCardClasses("institutions")}`}
            >
              <img
                src={asset4}
                alt="Institutions"
                className="absolute bottom-[-40px] sm:bottom-[-60px] md:bottom-[-90px] right-[-5px] sm:right-[-7px] md:right-[-9px] w-[180px] sm:w-[260px] md:w-[320px] lg:w-auto h-auto object-contain transition-all duration-500 group-hover:scale-110"
              />
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-instrument mb-2 sm:mb-3 text-[#594D20] scale-y-[1.3] sm:scale-y-[1.5] inline-block">
                  Institutions
                </h3>
                <p className="text-sm sm:text-base max-w-[90%] sm:max-w-[85%]">
                Holistic development solutions for edu institutions focusing on career readiness, well-being, and skill enhancement programs.
                </p>
              </div>
            </div>

            {/* 5. Founders Nest */}
            <div
              onMouseEnter={() => setHoveredCard("founders")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative w-full h-[280px] sm:h-[320px] md:h-[344px] sm:col-span-2 lg:col-span-4 lg:row-start-5 lg:row-span-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden transition-all duration-500 bg-[#FFB27D] hover:bg-[#FFA165] cursor-pointer ${getCardClasses("founders")}`}
            >
              <img
                src={asset6}
                alt="Founders Nest"
                className="absolute bottom-[-10px] sm:bottom-[-15px] md:bottom-[-20px] right-0 w-[220px] sm:w-[320px] md:w-[420px] lg:w-[500px] h-auto object-contain transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-6 z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-instrument mb-2 sm:mb-3 text-[#592B20] scale-y-[1.3] sm:scale-y-[1.5] inline-block tracking-wider sm:tracking-widest">
                  Founders Nest
                </h3>
                <p className="text-sm sm:text-base max-w-[65%] sm:max-w-[50%] md:max-w-[40%]">
                  Empowering early-stage founders with clarity, leadership mindset, and investor-ready skills to build sustainable, scalable startups.
                </p>
              </div>
            </div>

            {/* 6. Join Community */}
            <div
              onMouseEnter={() => setHoveredCard("community")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative w-full h-[250px] sm:h-[280px] md:h-[344px] lg:col-start-5 lg:row-start-5 lg:col-span-2 lg:row-span-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden transition-all duration-500 bg-[#C5D7E6] hover:bg-[#B5CADC] cursor-pointer ${getCardClasses("community")}`}
            >
              <img
                src={joinAsset}
                alt="Join Community"
                className="absolute bottom-[-10px] sm:bottom-[-15px] md:bottom-[-20px] right-[-5px] sm:right-[-8px] md:right-[-10px] w-[200px] sm:w-[260px] md:w-[320px] lg:w-[357px] h-auto object-contain transition-all duration-500 group-hover:scale-110"
              />
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-instrument mb-2 sm:mb-3 text-[#203D59] scale-y-[1.3] sm:scale-y-[1.5] inline-block">
                  Join Community
                </h3>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPrograms;
