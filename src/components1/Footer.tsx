import { Button } from "@/components1/ui/button";
import { Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#00549F" }} className="text-white py-8 sm:py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Logo + Tagline */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <img
            src="/lovable-uploads/FooterLogo.png"
            alt="STEM for Society Logo"
            className="h-16 w-16 object-contain"
          />
          <div>
            <div className="text-xl font-bold">STEM FOR SOCIETY</div>
            <div className="text-sm text-blue-100">
              Let's Innovate, Incubate and Impact the world together!
            </div>
          </div>
        </div>

        {/* Links + Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 text-sm">
          
          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold mb-2">PROGRAMS</h4>
              <ul className="space-y-1 text-blue-100">
                <li><a href="/courses" className="hover:text-white">Explore Courses</a></li>
                <li><a href="/mental-wellbeing" className="hover:text-white">Psychology counselling</a></li>
                <li><a href="/career-counselling" className="hover:text-white">Career counselling</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">FOR INSTITUTIONS</h4>
              <ul className="space-y-1 text-blue-100">
                <li><a href="/institution-pricing" className="hover:text-white">Plans and pricings</a></li>
                <li><a href="/campus-ambassador" className="hover:text-white">Campus Ambassador Program</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">COMMUNITY</h4>
              <ul className="space-y-1 text-blue-100">
                <li><a href="/community" className="hover:text-white">Join Community</a></li>
                <li><a href="/blog" className="hover:text-white">Scientific Blog</a></li>
                <li><a href="https://www.youtube.com/@stemforsociety" className="hover:text-white">YouTube Channel</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">QUICK LINKS</h4>
              <ul className="space-y-1 text-blue-100">
                <li><a href="/signup" className="hover:text-white">Register</a></li>
                <li><a href="/login" className="hover:text-white">Login</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full lg:w-1/4">
            <h4 className="font-semibold mb-2">SUBSCRIBE</h4>
            <input
              type="text"
              placeholder="First name"
              className="w-full mb-2 px-3 py-1.5 rounded-lg bg-white text-gray-900 text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-2 px-3 py-1.5 rounded-lg bg-white text-gray-900 text-sm"
            />
            <Button className="bg-white text-blue-600 w-full text-sm py-1.5 hover:bg-blue-50">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t border-blue-300 text-blue-100 text-xs">
          <div className="text-center md:text-left">
            217 Broadway, Floor 9, New York, NY 10007 • 844-402-4344 • support@tomorrowhealth.com
          </div>
          <div className="flex gap-3 mt-3 md:mt-0">
            <a href="https://twitter.com/EmpoweringSci" className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105">
              <Twitter className="h-4 w-4 text-blue-600" />
            </a>
            <a href="https://www.instagram.com/esf_life_science_jobs/" className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105">
              <Instagram className="h-4 w-4 text-blue-600" />
            </a>
            <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105">
              <Linkedin className="h-4 w-4 text-blue-600" />
            </a>
            <a href="https://www.youtube.com/@stemforsociety" className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105">
              <Youtube className="h-4 w-4 text-blue-600" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center text-xs text-blue-200">
          © 2025 STEM for Society. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;