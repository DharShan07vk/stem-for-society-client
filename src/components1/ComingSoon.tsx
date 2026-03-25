import React from "react";
import comingSoonImg from "../assets/coming-soon.jpeg"; // adjust path

const ComingSoon: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Gradient Glow */}
      <div className="absolute w-[600px] h-[600px] bg-[#0389FF]/10 rounded-full blur-3xl top-[-150px] left-[-150px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-[#0389FF]/10 rounded-full blur-3xl bottom-[-150px] right-[-150px]"></div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 max-w-6xl w-full">

        {/* Left Content */}
        <div className="text-center lg:text-left flex-1">

          <p className="text-[#0389FF] font-semibold tracking-widest uppercase mb-3">
            Stay Tuned
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            <span className="text-gray-800">Coming</span>{" "}
            <span className="text-[#0389FF]">Soon</span>
          </h1>

          <p className="mt-5 text-gray-600 text-lg max-w-md mx-auto lg:mx-0">
            We’re building something powerful and exciting. Get ready for a next-level experience 🚀
          </p>

          {/* Divider Line */}
          <div className="mt-6 h-1 w-20 bg-[#0389FF] mx-auto lg:mx-0 rounded-full"></div>

        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center relative">

          {/* Animated Ring */}
          <div className="absolute w-[420px] h-[420px] border-[10px] border-[#0389FF]/20 rounded-full animate-spin-slow"></div>

          {/* Image */}
          <img
            src={comingSoonImg}
            alt="Coming Soon"
            className="relative z-10 w-[320px] md:w-[400px] drop-shadow-xl"
          />
        </div>

      </div>

      {/* Custom Animation */}
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
        `}
      </style>

    </div>
  );
};

export default ComingSoon;