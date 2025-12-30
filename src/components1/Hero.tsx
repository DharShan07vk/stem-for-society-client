
import { Button } from "@/components1/ui/button";
import { Card, CardContent } from "@/components1/ui/card";
import { Badge } from "@/components1/ui/badge";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const stats = [
    { 
      title: "Industry & Institution Collaboration",
      subtitle: "Collaboration", 
      description: "Building stronger academic-industry ties to shape future-ready learners.",
      stats: [
        { label: "Institution Partners", value: "40+" },
        { label: "Industry Partners", value: "70+" },
        { label: "Learning partners", value: "Trusted" }
      ]
    },
    { 
      title: "Trained Individuals",
      subtitle: "Growth", 
      description: "Much more students on our platform from the world",
      stats: [
        { label: "Trained Students", value: "22,000+" }
      ],
      hasAvatars: true
    },
    { 
      title: "Discover Our Courses",
      subtitle: "Course", 
      description: "Gain in-depth knowledge from expert mentors with our carefully curated courses.",
      stats: [
        { label: "World class Courses", value: "100+" },
        { label: "Success Rate", value: "90%" }
      ]
    }
  ];

  return (
    <section 
      className="py-8 sm:py-12 md:py-16 relative overflow-hidden" >
{/* Left Side - Horizontal Arrows at Different Heights */}
<div className="absolute top-48 left-[10%] xl:left-96 hidden lg:flex flex-row gap-x-12 xl:gap-x-24">
  {/* Arrow 1 - higher */}
  <div className="flex flex-col items-center mt-12">
    <div className="w-px h-24 bg-gradient-to-b from-transparent to-blue-500 animate-pulse delay-500"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
  </div>

  {/* Arrow 2 - lower */}
  <div className="flex flex-col items-center mt-0">
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    <div className="w-px h-24 bg-gradient-to-b from-blue-500 to-transparent animate-pulse"></div>
  </div>
</div>

{/* Right Side - Horizontal Arrows at Different Heights */}
<div className="absolute top-48 right-[10%] xl:right-96 hidden lg:flex flex-row gap-x-12 xl:gap-x-24 items-end">
  {/* Arrow 1 - lower */}
  <div className="flex flex-col items-center mt-12">
    <div className="w-px h-24 bg-gradient-to-b from-transparent to-blue-500 animate-pulse delay-500"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
  </div>

  {/* Arrow 2 - higher */}
  <div className="flex flex-col items-center mt-0">
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    <div className="w-px h-24 bg-gradient-to-b from-blue-500 to-transparent animate-pulse"></div>
  </div>
</div>


      
      <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 relative z-10">
        <p className="text-black mb-3 sm:mb-4 text-base sm:text-lg">Empowering Future Innovators through STEM Learning</p>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal mb-3 sm:mb-4 leading-tight max-w-5xl mx-auto">
          <span className="text-gray-400">Let's</span> <span className="text-black">Innovate, Incubate and Impact</span> <span className="text-gray-400">the<br className="hidden sm:block" /> world together!</span>
        </h1>
        
        <p className="text-black mb-4 sm:mb-6 text-base sm:text-lg max-w-xl mx-auto">
          Join hands with us to solve <span className="relative font-normal
  before:content-[''] before:absolute before:left-0 before:bottom-[0.15em]
  before:h-[0.5em] before:w-full before:bg-[#FFEE00]/80 before:-z-10
  before:rounded-sm">
  Real-world challenges
</span>

        </p>
        
        <Link to="/explore-program-dashboard">
          <Button
  size="lg"
  className="mb-8 sm:mb-12 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded transition-all duration-300 hover:scale-105 shadow-lg"
  style={{
    backgroundColor: "#0389FF",
    color: "white",
  }}
>
  EXPLORE OUR PROGRAMS
</Button>

        </Link>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const isMiddleCard = index === 1;
            return (
              <Card
                key={index}
                className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 transition-transform duration-300 transform-gpu hover:scale-105 hover:z-10 backdrop-blur-sm min-h-[200px] sm:min-h-56 ${isMiddleCard ? 'border-[#0389FF] bg-[#1288ef40]' : 'border-black/60'} ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                style={{ willChange: 'transform' }}>
                <CardContent className="p-0 h-full flex flex-col justify-between">
                  <div className="flex items-center mb-2 sm:mb-3">
                    <Badge className={`rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm border-2 ${isMiddleCard ? 'border-white/60 bg-white/20 text-black' : 'border-black/60 text-black'}`}>
                      {stat.subtitle}
                    </Badge>
                  </div>
                  
                  <h3 className={`font text-xl sm:text-2xl mb-1 sm:mb-2 text-left text-black`}>{stat.title}</h3>
                  <p className={`text-xs sm:text-sm mb-2 sm:mb-3 text-left leading-relaxed text-gray-600`}>{stat.description}</p>
                  
                  {stat.hasAvatars && (
                    <div className="flex items-center mb-2 sm:mb-3">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-300 border-2 border-white"></div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-400 border-2 border-white"></div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-400 border-2 border-white"></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-6 text-left items-center">
                    {stat.stats.map((item, idx) => (
                      <div key={idx} className="min-w-fit">
                        <div className={`text-lg sm:text-xl font-sans mb-0.5 sm:mb-1 ${isMiddleCard ? 'text-white' : 'text-black'}`}>{item.value}</div>
                        <div className={`text-[10px] sm:text-s ${isMiddleCard ? 'text-white/80' : 'text-black'}`}>{item.label}</div>
                      </div>
                    ))}
                  </div>

                  {stat.title === "Discover Our Courses" && (
                    <div className="mt-3 sm:mt-4">
                      <Link to="/courses">
                       <Button
  size="sm"
  className="w-full rounded transition-all duration-300 text-sm sm:text-base py-2 sm:py-2.5"
  style={{
    backgroundColor: "#0389FF",
    color: "white",
  }}
>
  Browse Courses
</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
