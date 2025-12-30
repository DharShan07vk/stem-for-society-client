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
    <section className="py-10 bg-white px-[120px]">
      <div className="max-w-screen-2xl mx-auto px-4">

        <h2 className="text-4xl px-5 mb-10 text-[#00000080]">
          Our Programs
    </h2>
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-6 grid-rows-6 gap-6 w-[1440px] h-[1080px] mx-auto">


            <div
              onMouseEnter={() => setHoveredCard("skill")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative w-[397.33px] h-[712px] row-span-4 col-span-2 rounded-3xl p-6 overflow-hidden transition-all duration-500 bg-[#C6B7E2] hover:bg-[#B8A7D8] ${getCardClasses("skill")}`}
            >
              
              <img
                src={asset1}
                alt=""
                className="absolute transition-all duration-500 group-hover:scale-105"
                style={{
                  width: '411px',      
                  height: '549px',     
                  bottom: '-20px',     
                  left: '50%',         
                  transform: 'translateX(-50%)', 
                }}
              />

              <div className="relative z-10">
                <h3 className="text-4xl font-instrument mb-3 text-[#472059] scale-y-[1.5] inline-block">
                  Skill development
                </h3>
                <p className="text-2sm max-w-[85%]">
                  Bridging academic learning with industrial skills for impactful career readiness.
                </p>
              </div>

              <div className="absolute inset-0 bg-black/5 rounded-3xl pointer-events-none" />
            </div>


            <div
              onMouseEnter={() => setHoveredCard("finishing")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative w-[818.67px] h-[344px] col-span-4 row-span-2 rounded-[40px] p-6 overflow-hidden transition-all duration-500 bg-[#FF8FB0] hover:bg-[#FF7FA4] ${getCardClasses("finishing")}`}
            >
              <img
                src={asset2}
                alt=""
                className="absolute transition-all duration-500 group-hover:scale-105 group-hover:-translate-x-2 group-hover:-translate-y-2"
                style={{
                  width: '550px',      
                  height: '378px',     
                  bottom: '-34px',     
                  right: '-40px',      
                  top : '-30px'
                }}
              />
              <div className="relative z-10">
                <h3 className="text-4xl font-instrument mb-3 text-[#582059] scale-y-[1.5] inline-block">
                  Finishing School
                </h3>
                <p className="text-2sm max-w-[45%]">
                 Where students/learns become confident achievers equipped with the essential soft skills, clarity, & professionalism employers expect in today's competitive world.
                </p>
              </div>
            </div>


            
            <div
              onMouseEnter={() => setHoveredCard("individuals")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative w-[397.33px] h-[344px] col-start-3 col-span-2 row-span-2 row-start-3 rounded-3xl p-6 overflow-hidden transition-all duration-500 bg-[#FFE07A] hover:bg-[#FFD65C] ${getCardClasses("individuals")}`}
            >
      
              <img
                src={asset3}
                alt=""
                className="absolute transition-all duration-500 group-hover:scale-105"
                style={{
                  width: '368px', 
                  height: 'auto',    
                  top: '-20px',  
                  right: '20px',  
                }}
              />
              <div className="relative z-10">
                <h3 className="text-4xl font-instrument mb-3 text-[#594D20] scale-y-[1.5] inline-block">
                  Individuals
                </h3>
                <p className="w-[241px] h-[120px]">
                Expert counselling to help you choose the right career path, strengthen emotional resilience, and unlock your highest personal potential.
                </p>
              </div>

             
            </div>

            <div
              onMouseEnter={() => setHoveredCard("institutions")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative col-start-5 row-start-3 col-span-2 row-span-2 w-[397.33px] h-[344px] rounded-3xl p-6 overflow-hidden transition-all duration-500 bg-[#C8DD9A] hover:bg-[#B9D487] ${getCardClasses("institutions")}`}
            >
            
              <img
                src={asset4}
                alt=""
                className="absolute transition-all duration-500  hover:scale-105"
                style={{
                  bottom:'-90px',     
                  right: '-9px',     
                  transition: 'all 0.3s ease-in-out',
                }}
              />
              <div className="relative z-10">
                <h3 className="text-4xl font-instrument mb-3 text-[#594D20] scale-y-[1.5] inline-block">
                  Institutions
                </h3>
                <p className="text-2sm max-w-[85%]">
                Holistic development solutions for edu institutions focusing on career readiness, well-being, and skill enhancement programs.
                </p>
              </div>

              
            </div>

            {/* 5. Founders Nest */}
            <div
              onMouseEnter={() => setHoveredCard("founders")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative col-span-4 row-start-5 row-span-2 rounded-3xl p-6 overflow-hidden transition-all duration-500 bg-[#FFB27D] hover:bg-[#FFA165] ${getCardClasses("founders")}`}
            >
              
              <img
                src={asset6}
                alt=""
                className="absolute transition-all duration-500 group-hover:scale-105"
                style={{
                  width: '500px', 
                  height: 'auto',      
                  bottom: '-20px',     
                  right: '0px',       
                }}
              />
              <div className="absolute bottom-4 left-6 z-10">
                <h3 className="text-4xl font-instrument mb-3 text-[#592B20] scale-y-[1.5] inline-block tracking-widest">
                  Founders Nest
                </h3>
                <p className="text-2sm max-w-[40%]">
                  Empowering early-stage founders with clarity, leadership mindset, and investor-ready skills to build sustainable, scalable startups.
                </p>
              </div>
            </div>

            {/* 6. Join Community */}
            <div
              onMouseEnter={() => setHoveredCard("community")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative col-start-5 row-start-5 col-span-2 row-span-2 rounded-3xl p-6 overflow-hidden transition-all duration-500 bg-[#C5D7E6] hover:bg-[#B5CADC] ${getCardClasses("community")}`}
            >
              <img
                src={joinAsset}
                alt=""
                className="absolute transition-all duration-500 group-hover:scale-105"
                style={{
                  width: '357px',    
                  height: '224px',     
                  bottom: '-20px',    
                  right: '-10px',      
                }}
              />
              <div className="relative z-10">
                <h3 className="text-4xl font-instrument mb-3 text-[#203D59] h-[48px] scale-y-[1.5] inline-block">
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
