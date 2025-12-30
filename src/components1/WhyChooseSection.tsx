
import { useState } from "react";
import { Globe, Users, Award, Building, HeadphonesIcon } from "lucide-react";

const WhyChooseSection = () => {
  const [activeItem, setActiveItem] = useState<number>(0);

  const whyChooseItems = [
    {
      title: "World Class Instructors",
      content: "Learn from top industry professionals with real-world experience.",
      icon: <Globe className="h-6 w-6 text-white" />,
      bgColor: "bg-[#FFE0CD]",
      iconBg: "from-orange-500 to-orange-600"
    },
    {
      title: "1 on 1 Mentorship", 
      content: "Get personalized guidance and support throughout your learning journey.",
      icon: <HeadphonesIcon className="h-6 w-6 text-white" />,
      bgColor: "bg-[#D4E7FE]",
      iconBg: "from-blue-500 to-blue-600"
    },
    {
      title: "Industrial Training",
      content: "Hands-on experience with real industry projects and scenarios.", 
      icon: <Building className="h-6 w-6 text-white" />,
      bgColor: "bg-[#D5F5E3]",
      iconBg: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Placement Assistant",
      content: "Comprehensive support for career placement and job opportunities.",
      icon: <Award className="h-6 w-6 text-white" />,
      bgColor: "bg-[#E8DAEF]",
      iconBg: "from-purple-500 to-purple-600"
    }
  ];

  // Calculate total height needed for the right side
  const totalHeight = 56 * 3 + 140 + 12 * 3; // 3 collapsed + 1 expanded + gaps

  return (
    <section className="py-4 md:py-8 overflow-hidden bg-[#F2F2F2] ">
      <div className="max-w-7xl bg-[#F2F2F2] mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 rounded-2xl sm:rounded-3xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left side - Title with background - Fixed height to prevent movement */}
          <div 
            className="relative flex items-center justify-center"
            style={{ minHeight: `${totalHeight}px` }}
          >
            {/* Decorative background pattern - Fixed position */}
            <div 
              className="absolute w-72 h-72 md:w-80 md:h-80 opacity-15 bg-center bg-no-repeat bg-contain pointer-events-none"
              style={{ 
                backgroundImage: `url("src/assets/logo.png")`,
                transform: 'translateZ(0)'
              }}
            />
            
            {/* Title - Fixed position */}
            <div className="relative z-10 text-center pointer-events-none">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                Why Choose
              </h2>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-blue-600">
                Stem for Society ?
              </h2>
            </div>
          </div>

          {/* Right side - Features with vertical grow animation */}
          <div className="relative z-10 flex flex-col gap-3 md:gap-4">
            {whyChooseItems.map((item, index) => {
              const isActive = activeItem === index;
              
              return (
                <div 
                  key={index} 
                  className={`
                    relative rounded-2xl cursor-pointer overflow-hidden
                    transition-all duration-500 ease-out
                    ${isActive 
                      ? `${item.bgColor} shadow-lg` 
                      : 'bg-white shadow-sm'
                    }
                  `}
                  onMouseEnter={() => setActiveItem(index)}
                  style={{
                    height: isActive ? '200px' : '52px',
                    transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  {/* Icon in top right - only visible when active */}
                  <div 
                    className={`
                      absolute top-3 right-3 h-10 w-10 rounded-full 
                      bg-gradient-to-br ${item.iconBg}
                      flex items-center justify-center
                      transition-all duration-300 ease-out z-10
                      ${isActive 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-75'
                      }
                    `}
                    style={{
                      transitionDelay: isActive ? '0.1s' : '0s'
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Content wrapper - flex column to push title to bottom */}
                  <div className="h-full flex flex-col justify-end p-4 md:p-5">
                    {/* Content - appears above title on hover, grows from bottom */}
                    <h3 className="font-semibold text-base md:text-lg text-gray-900">
                      {item.title}
                    </h3>
                    <div 
                      className={`
                        overflow-hidden transition-all duration-400 ease-out
                        ${isActive 
                          ? 'max-h-20 opacity-100 mb-2' 
                          : 'max-h-0 opacity-0 mb-0'
                        }
                      `}
                      style={{
                        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, margin 0.3s ease'
                      }}
                    >
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed pr-14">
                        {item.content}
                      </p>
                    </div>
                    
                    {/* Title - always visible at bottom left */}
                    
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
