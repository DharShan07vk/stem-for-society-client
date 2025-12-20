
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
      className="py-16 relative overflow-hidden" >
{/* Left Side - Horizontal Arrows at Different Heights */}
<div className="absolute top-48 left-96 hidden lg:flex flex-row gap-x-24">
  {/* Arrow 1 - higher */}
  <div className="flex flex-col items-center mt-12">
    <div className="w-px h-24 bg-gradient-to-b from-transparent to-blue-500 animate-pulse delay-500"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div> {/* No gap */}
  </div>

  {/* Arrow 2 - lower */}
  <div className="flex flex-col items-center mt-0">
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    <div className="w-px h-24 bg-gradient-to-b from-blue-500 to-transparent animate-pulse"></div> {/* Removed mt-2 */}
  </div>
</div>

{/* Right Side - Horizontal Arrows at Different Heights */}
<div className="absolute top-48 right-96 hidden lg:flex flex-row gap-x-24 items-end">
  {/* Arrow 1 - lower */}
  <div className="flex flex-col items-center mt-12">
    <div className="w-px h-24 bg-gradient-to-b from-transparent to-blue-500 animate-pulse delay-500"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div> {/* No gap */}
  </div>

  {/* Arrow 2 - higher */}
  <div className="flex flex-col items-center mt-0">
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    <div className="w-px h-24 bg-gradient-to-b from-blue-500 to-transparent animate-pulse"></div> {/* Removed mt-2 */}
  </div>
</div>


      
      <div className="container mx-auto text-center px-4 relative max-w-7xl z-10">
        <p className="text-#000000 mb-4 text-lg">Empowering Future Innovators through STEM Learning</p>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-4 leading-tight max-w-5xl mx-auto">
          <span className="text-gray-400">Let's</span> <span className="text-black">Innovate, Incubate and Impact</span> <span className="text-gray-400">the<br />world together!</span>
        </h1>
        
        <p className="text-#000000 mb-6 text-lg max-w-xl mx-auto">
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
  className="mb-12 px-8 py-4 text-lg rounded transition-all duration-300 hover:scale-105 shadow-lg"
  style={{
    backgroundColor: "#0389FF",
    color: "white",
  }}
>
  EXPLORE OUR PROGRAMS
</Button>

        </Link>

        {/* Stats Cards */}
        <div className="flex flex-row gap-6 max-w-6xl mx-auto justify-center items-stretch flex-nowrap overflow-visible">
          {stats.map((stat, index) => {
            const isMiddleCard = index === 1;
            return (
              <Card
                key={index}
                className={`p-4 rounded-3xl border-2 transition-transform duration-300 transform-gpu hover:scale-105 hover:z-10 backdrop-blur-sm ${isMiddleCard ? 'bg-blue-50/60' : 'bg-transparent'} border-black/60 self-stretch min-h-56`}
                style={{ willChange: 'transform' }}>
                <CardContent className="p-0 h-full flex flex-col justify-between">
                  <div className="flex items-center mb-3">
                    <Badge variant="secondary" className={`rounded-full px-3 py-1 text-sm border-2 border-black/60 ${isMiddleCard ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
                      {stat.subtitle}
                    </Badge>
                  </div>
                  
                  <h3 className="font text-2xl mb-2 text-left text-black">{stat.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 text-left leading-relaxed">{stat.description}</p>
                  
                  {stat.hasAvatars && (
                    <div className="flex items-center mb-3">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                        <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-row gap-6 text-left items-center whitespace-nowrap">
                    {stat.stats.map((item, idx) => (
                      <div key={idx}>
                        <div className="text-xl font-bold text-gray-800 mb-1">{item.value}</div>
                        <div className="text-xs text-gray-500">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  {stat.title === "Discover Our Courses" && (
                    <div className="mt-4">
                      <Link to="/courses">
                       <Button
  size="sm"
  className="w-full rounded transition-all duration-300"
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
