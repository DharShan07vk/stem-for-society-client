
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const PartnerRole = () => {
  const ArrowWithTail = () => (
    <div className="absolute top-3 right-3 flex items-center">
     <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect y="30" width="30" height="30" rx="15" transform="rotate(-90 0 30)" fill="#F2F2F2"/>
  <path d="M8.3418 10.0098L8.3706 21.0874L19.4482 21.1161C19.5636 21.1318 19.6811 21.1224 19.7926 21.0888C19.904 21.0551 20.007 20.9977 20.0944 20.9209C20.1818 20.844 20.2517 20.7491 20.2993 20.6427C20.3469 20.5364 20.3711 20.4212 20.3703 20.3047C20.3695 20.1882 20.3436 20.0733 20.2945 19.9677C20.2454 19.8621 20.1741 19.7683 20.0856 19.6926C19.9971 19.617 19.8934 19.5611 19.7814 19.529C19.6695 19.4969 19.5519 19.4892 19.4368 19.5065L11.1357 19.4721L22.1328 8.4749C22.2853 8.3224 22.371 8.1156 22.371 7.9001C22.371 7.6844 22.2853 7.4777 22.1328 7.3252C21.9804 7.1727 21.7736 7.0871 21.558 7.0871C21.3424 7.0871 21.1356 7.1727 20.9831 7.3252L9.986 18.3223L9.9515 10.0213C9.9507 9.8056 9.8643 9.5989 9.7112 9.447C9.5581 9.295 9.3509 9.2099 9.1352 9.2107C8.9195 9.2115 8.7128 9.2979 8.5608 9.451C8.4088 9.6041 8.3237 9.8113 8.3245 10.027L8.3418 10.0098Z" fill="#0389FF"/>
</svg>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 bg-cover animate-subtle-zoom"
        style={{
          backgroundImage: `url("/lovable-uploads/cc0094aa-ced3-4e50-b5f1-d61b7b6d2988.png")`,
          backgroundPosition: 'center 75%',
        }}
      />
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Desktop Layout */}
      <div className="hidden lg:block relative z-10 min-h-screen">
        <div className="flex min-h-screen">
          {/* Left Section - Logo */}
          <div className="w-1/2 relative flex items-center justify-center">
            <div className="text-center text-white">
              <img 
                src="/lovable-uploads/ceabc523-dba1-475b-b670-7ed6b88782a1.png" 
                alt="STEM for Society Logo" 
                className="h-40 w-40 md:h-56 md:w-56 lg:h-72 lg:w-72 opacity-50 mx-auto mb-8"
              />
              <h1 className="text-4xl font-bold mb-4">STEM FOR SOCIETY</h1>
              <p className="text-xl">Let's Innovate, Incubate and Impact the world together!</p>
            </div>
          </div>

          {/* Right Section - Role Selection */}
          <div className="w-1/2 relative">
            {/* White transparent overlay with curved left corner */}
            <div className="absolute inset-0 bg-white/90 rounded-l-3xl"></div>
            
            {/* Content Container */}
            <div className="relative z-10 h-full flex items-center justify-center px-8 py-8">
              <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    
                  
                  <p className="text-gray-600 text-lg">
                    Log in as a partner institution.
                  </p></h1>
                </div>

                {/* Role Selection Cards */}
                <div className="space-y-6">
                  {/* Partner - Individual */}
                  {/* <Link to="/campus-ambassador" className="block">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 hover:shadow-md cursor-pointer group relative">
                      <ArrowWithTail />
                      <div className="pr-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          Become a Campus Ambassador
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Promote STEM for Society programs within your campus or community and help bridge the education gap while building your own leadership profile.
                        </p>
                      </div>
                    </div>
                  </Link> */}

                  {/* Partner - Institution */}
                  <Link to="/partner-institution-signup" className="block">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 hover:shadow-md cursor-pointer group relative">
                      <ArrowWithTail />
                      <div className="pr-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          Partner Institution Portal
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Manage collaborations, propose training programs, and access institutional insights for your students' academic and career growth.
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden relative z-10 min-h-screen flex flex-col">
        {/* Mobile Logo Section */}
        <div className="flex-shrink-0 flex items-center justify-center px-4 py-8 pt-16">
          <div className="text-center text-white">
            <img 
              src="/lovable-uploads/ceabc523-dba1-475b-b670-7ed6b88782a1.png" 
              alt="STEM for Society Logo" 
              className="h-20 w-20 sm:h-24 sm:w-24 mx-auto mb-4 opacity-50"
            />
            <h1 className="text-xl sm:text-2xl font-bold mb-2">STEM FOR SOCIETY</h1>
            <p className="text-sm sm:text-base">Let's Innovate, Incubate and Impact!</p>
          </div>
        </div>
        
        {/* Mobile Content Section */}
        <div className="flex-1 relative min-h-0">
          <div className="absolute inset-0 bg-white/90 rounded-t-3xl"></div>
          <div className="relative z-10 h-full overflow-y-auto px-4 py-6">
            <div className="w-full max-w-sm mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  Select your Role
                </h1>
                <p className="text-gray-600 text-sm">
                  Choose your partner type
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <Link to="/campus-ambassador" className="block">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <ArrowWithTail />
                    <div className="pr-10">
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-2">Become a Campus Ambassador</h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        Promote STEM programs within your campus and build your leadership profile.
                      </p>
                    </div>
                  </div>
                </Link>

                <Link to="/partner-institution-signup" className="block">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <ArrowWithTail />
                    <div className="pr-10">
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-2">Partner Institution Portal</h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        Manage collaborations and access insights for your students' growth.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="text-center pb-4">
                <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold text-sm">
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerRole;
