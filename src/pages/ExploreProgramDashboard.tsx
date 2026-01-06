import LoginStages from "@/components1/ui/LoginStages";
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import GridBackground from '@/components1/GridBackground';

const ExploreProgramDashboard = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      category: "Students (UG/PG/PhD), Job Seekers",
      title: "Career Counselling",
      description: "Get expert guidance to plan your academic and professional journey with confidence.",
      route: "/insituion-individual?mode=individual"
    },
    {
      category: "Students, Researchers, Young Professionals",
      title: "Mental Wellbeings Counselling",
      description: "Access personalized mental wellness support to thrive in both studies and life.",
      route: "/insituion-individual?mode=individual"
    },
   
    {
      category: "College Students, Campus Leaders",
      title: "Ambassador Program",
      description: "Become the face of STEM in your institution and develop real-world leadership skills.",
      route: "/campus-ambassador"
    }
  ];
  
  const handleServiceClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 bg-cover animate-subtle-zoom"
        style={{
          backgroundImage: `url("/lovable-uploads/cc0094aa-ced3-4e50-b5f1-d61b7b6d2988.png")`,
          backgroundPosition: 'center 70%',
        }}
      />
      
      {/* Grid Background Overlay */}
      <GridBackground>
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Main Content Container */}
        <div className="relative z-10 min-h-screen">
          <LoginStages>
            {(stage) => (
              <>
                {/* Logo Element - Improved responsive positioning */}
                <div className={`absolute top-1/2 -translate-y-1/2 transition-all duration-[2500ms] ${
                  stage === 'initial' || stage === 'textFadeOut'
                    ? 'left-1/2 -translate-x-1/2' 
                    : 'left-[20%] lg:left-[25%] -translate-x-1/2'
                }`}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                  transform: 'translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)'
                }}>
                  <img 
                    src="/lovable-uploads/ceabc523-dba1-475b-b670-7ed6b88782a1.png" 
                    alt="STEM for Society Logo" 
                    className={`object-contain transition-all duration-[2500ms] ${
                      stage === 'initial' || stage === 'textFadeOut'
                        ? 'h-24 w-24 sm:h-32 sm:w-32 md:h-48 md:w-48 lg:h-64 lg:w-64' 
                        : 'h-32 w-32 sm:h-40 sm:w-40 md:h-56 md:w-56 lg:h-72 lg:w-72 opacity-50'
                    } ${stage === 'logoTransition' ? 'animate-pulse-glow-delayed' : ''}`}
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
                    }}
                  />
                </div>

                {/* Text Element */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out ${
                  stage === 'initial' 
                    ? 'opacity-100 translate-y-16 sm:translate-y-24 md:translate-y-32 lg:translate-y-40' 
                    : 'opacity-0 -translate-y-5'
                }`}>
                  <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4 leading-tight">
                    Explore Our Programs & Services
                  </h1>
                </div>

                {/* Desktop Services Section - Fixed header positioning */}
                <div className={`hidden md:block absolute right-0 top-0 h-full transition-all duration-[2500ms] ${
                  stage === 'logoTransition' 
                    ? 'translate-x-0 opacity-100 w-[55%] lg:w-1/2' 
                    : 'translate-x-full opacity-0 w-1/2'
                }`}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                  transform: 'translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)'
                }}>
                  {/* White transparent overlay with curved left corner */}
                  <div className="absolute inset-0 bg-white/95 rounded-l-3xl"></div>
                  
                  {/* Services Container - Fixed header visibility */}
                  <div className="relative z-10 h-full max-h-screen overflow-y-auto flex flex-col justify-start px-4 lg:px-8 xl:px-12 py-8 pt-12 lg:pt-16">
                    <div className="space-y-6 lg:space-y-8">
                      {/* Header - Reduced size and ensured visibility */}
                      <div className="mb-6 lg:mb-8">
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-4 text-center">
                          Our Services
                        </h2>
                      </div>

                      {/* Services Cards */}
                      <div className="space-y-4 lg:space-y-6">
                        {services.map((service, index) => (
                          <div 
                            key={index} 
                            onClick={() => handleServiceClick(service.route)} 
                            className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-white group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-3">
                                <p className="text-xs lg:text-sm text-gray-500 font-medium mb-2">
                                  {service.category}
                                </p>
                                <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2 lg:mb-3">
                                  {service.title}
                                </h3>
                                <p className="text-gray-600 text-xs lg:text-sm leading-relaxed">
                                  {service.description}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout - Improved positioning and sizing */}
                <div className={`md:hidden absolute inset-0 transition-all duration-1000 ease-out ${
                  stage === 'logoTransition' ? 'opacity-100' : 'opacity-0'
                }`}>
                  {/* Mobile Logo */}
                  <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img 
                      src="/lovable-uploads/ceabc523-dba1-475b-b670-7ed6b88782a1.png" 
                      alt="STEM for Society Logo" 
                      className="h-20 w-20 sm:h-24 sm:w-24 object-contain animate-pulse-glow-delayed opacity-50"
                    />
                  </div>
                  
                  {/* Mobile Services with white overlay and curved corners */}
                  <div className="absolute bottom-0 left-0 right-0 h-[60vh] sm:h-[65vh]">
                    <div className="absolute inset-0 bg-white/95 rounded-t-3xl"></div>
                    <div className="relative z-10 h-full overflow-y-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-4">
                      <div className="text-center mb-4 sm:mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                          Our Services
                        </h2>  
                      </div>
                      <div className="space-y-3 sm:space-y-4 pb-safe">
                        {services.map((service, index) => (
                          <div 
                            key={index} 
                            onClick={() => handleServiceClick(service.route)} 
                            className="bg-white/90 rounded-xl p-4 sm:p-5 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-3">
                                <p className="text-xs text-gray-500 font-medium mb-1">
                                  {service.category}
                                </p>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                                  {service.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                  {service.description}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <ArrowRight className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </LoginStages>
        </div>
      </GridBackground>
    </div>
  );
};

export default ExploreProgramDashboard;
