import { useState } from "react";
import { Avatar } from "@mantine/core";
import { Button } from "@/components1/ui/button";
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarTrigger 
} from "@/components1/ui/menubar";
import { ChevronDown, CircleUserIcon, Menu , X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../lib/hooks";
import { parseAsBoolean, useQueryState } from "nuqs";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, signOut } = useUser();
  const [filterByMe, setFilterByMe] = useQueryState<boolean>(
    "me",
    parseAsBoolean,
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className="relative shadow-sm">
 
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/b29296a1-1faf-45dc-a273-07bdab44992a.png" 
              alt="STEM for Society Logo" 
              className="h-12 w-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Menubar className="border-none bg-transparent p-0 h-auto">
              {/* Courses/Trainings Dropdown */}
              <MenubarMenu>
                <MenubarTrigger className="bg-transparent hover:bg-white/20 data-[state=open]:bg-white/20 px-6 py-3 rounded-full cursor-pointer flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-all duration-300 font-medium shadow-none backdrop-blur-sm border-none outline-none">
                  <span>Courses/Trainings</span>
                  <ChevronDown className="h-4 w-4" />
                </MenubarTrigger>
                <MenubarContent className="bg-white backdrop-blur-md shadow-xl rounded-3xl p-3 min-w-[240px] z-50 mt-2 border-0">
                  <MenubarItem asChild>
                    <Link 
                      to="/courses?filter=Seminars%2FWebinar%2FMentorship" 
                      className="block px-5 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all duration-200 cursor-pointer font-medium"
                    >
                      Seminars/Webinar
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link 
                      to="/courses?filter=Certificate%20Program" 
                      className="block px-5 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all duration-200 cursor-pointer font-medium"
                    >
                      Certificate Program
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link 
                      to="/courses?filter=Corporate%20Training" 
                      className="block px-5 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all duration-200 cursor-pointer font-medium"
                    >
                      Corporate Training
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link 
                      to="/courses?filter=Instrumentation%20Hands-on" 
                      className="block px-5 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all duration-200 cursor-pointer font-medium"
                    >
                      Instrumentation Hands-on
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* Services Dropdown */}
              <MenubarMenu>
                <MenubarTrigger className="bg-transparent hover:bg-white/20 data-[state=open]:bg-white/20 px-6 py-3 rounded-full cursor-pointer flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-all duration-300 font-medium shadow-none backdrop-blur-sm border-none outline-none">
                  <span>Services</span>
                  <ChevronDown className="h-4 w-4" />
                </MenubarTrigger>
                <MenubarContent className="bg-white backdrop-blur-md shadow-xl rounded-3xl p-3 min-w-[240px] z-50 mt-2 border-0">
                  <MenubarItem asChild>
                    <Link 
                      to="/mental-wellbeing" 
                      className="block px-5 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all duration-200 cursor-pointer font-medium"
                    >
                     Mental WellBeing
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link 
                      to="/career-counselling" 
                      className="block px-5 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all duration-200 cursor-pointer font-medium"
                    >
                      Career Counselling
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link 
                      to="/institution-pricing" 
                      className="block px-5 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all duration-200 cursor-pointer font-medium"
                    >
                      Institution Plan & Pricing
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* Resources Dropdown */}
              <MenubarMenu>
                <MenubarTrigger className="bg-transparent hover:bg-white/20 data-[state=open]:bg-white/20 px-6 py-3 rounded-full cursor-pointer flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-all duration-300 font-medium shadow-none backdrop-blur-sm border-none outline-none">
                  <span>Resources</span>
                  <ChevronDown className="h-4 w-4" />
                </MenubarTrigger>
                <MenubarContent className="bg-white backdrop-blur-md shadow-xl rounded-3xl p-3 min-w-[240px] z-50 mt-2 border-0">
                  <MenubarItem asChild>
                    <Link 
                      to="/blog" 
                      className="block px-5 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all duration-200 cursor-pointer font-medium"
                    >
                      Scientific Communications
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link 
                      to="/community" 
                      className="block px-5 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all duration-200 cursor-pointer font-medium"
                    >
                      Join the community
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link 
                      to="/campus-ambassador" 
                      className="block px-5 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all duration-200 cursor-pointer font-medium"
                    >
                      Campus Ambassador (CA)
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            
            {user ? (
  <div className="relative">
    <button
      onClick={() => setDropdownOpen(!dropdownOpen)}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
    >
      <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-300 text-gray-700">
        <CircleUserIcon className="h-5 w-5" />
      </div>
      <span className="font-medium">{user.user.firstName}</span>
      <ChevronDown className="h-4 w-4" />
    </button>

    {dropdownOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
        <Link
          to="/courses"
          className="block px-4 py-2 hover:bg-gray-100"
          onClick={() => {
            setDropdownOpen(false);
            setFilterByMe(true); // same as old header
          }}
        >
          My trainings
        </Link>
        <button
          onClick={() => {
            setDropdownOpen(false);
            signOut();
          }}
          className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    )}
  </div>
) : (
 <div className="flex items-center space-x-3">
                <Link to="/partner-role">
                  <Button variant="outline" className="border-2 border-[#0389FF] text-[#0389FF] hover:bg-[#0389FF] hover:text-white bg-white/70 backdrop-blur-sm rounded px-6 py-3 font-medium shadow-sm transition-all duration-300">
                    Partner with us
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-[#0389FF] hover:bg-[#0389FF]/90 text-white rounded px-6 py-3 font-medium shadow-sm transition-all duration-300">
                    LOGIN
                  </Button>
                </Link>
              </div>
)}

          
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-3 rounded-full hover:bg-white/50 transition-all duration-300 backdrop-blur-sm"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-white/95 backdrop-blur-md rounded-3xl mt-2 shadow-xl">
            <div className="space-y-2 px-4">
              <div className="space-y-1">
                <div className="px-4 py-2 text-sm font-medium text-gray-500">Courses/Trainings</div>
                <Link 
                  to="/courses?filter=Seminars%2FWebinar%2FMentorship" 
                  className="block px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Seminars/Webinar
                </Link>
                <Link 
                  to="/courses?filter=Certificate%20Program" 
                  className="block px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Certificate Program
                </Link>
                <Link 
                  to="/courses?filter=Corporate%20Training" 
                  className="block px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Corporate Training
                </Link>
                <Link 
                  to="/courses?filter=Instrumentation%20Hands-on" 
                  className="block px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Instrumentation Hands-on
                </Link>
              </div>
              
              <div className="space-y-1">
                <div className="px-4 py-2 text-sm font-medium text-gray-500">Services</div>
                <Link 
                  to="/mental-wellbeing" 
                  className="block px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mental WellBeing
                </Link>
                <Link 
                  to="/career-counselling" 
                  className="block px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Career Counselling
                </Link>
                <Link 
                  to="/institution-pricing" 
                  className="block px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Institution Plan & Pricing
                </Link>
              </div>
              
              <div className="space-y-1">
                <div className="px-4 py-2 text-sm font-medium text-gray-500">Resources</div>
                <Link 
                  to="/blog" 
                  className="block px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Scientific Communications
                </Link>
                <Link 
                  to="/community" 
                  className="block px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join the community
                </Link>
                <Link 
                  to="/campus-ambassador" 
                  className="block px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Campus Ambassador (CA)
                </Link>
              </div>
              
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link to="/partner-role" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-[#0389FF] text-[#0389FF] hover:bg-[#0389FF] hover:text-white rounded-full">
                    Partner with us
                  </Button>
                </Link>
                {user ?( 
                  <button
          onClick={() => {
            setDropdownOpen(false);
            signOut();
          }}
          className="w-full bg-[#0389FF] hover:bg-[#0389FF]/90 text-white rounded-full"
        >
          Logout
        </button>
                ):(
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-[#0389FF] hover:bg-[#0389FF]/90 text-white rounded-full">
                    LOGIN
                  </Button>
                </Link>

                )}
                
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;