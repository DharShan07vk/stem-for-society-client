import React from "react";
import comingSoonImg from "../assets/coming-soon.webp"; // adjust path

const ComingSoon: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[700px] h-[700px] bg-[#0389FF]/10 rounded-full blur-3xl top-[-200px]"></div>

      {/* Top Text */}
      <p className="text-[#0389FF] font-semibold tracking-widest uppercase mb-4 z-10">
        Stay Tuned
      </p>

      {/* Main Image Section */}
      <div className="relative flex items-center justify-center">

        {/* Big Animated Ring */}
        <div className="absolute w-[600px] h-[600px] md:w-[700px] md:h-[700px] border-[14px] border-[#0389FF]/20 rounded-full animate-spin-slow"></div>

        {/* Glow Behind Image */}
        <div className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] bg-[#0389FF]/10 rounded-full blur-2xl"></div>

        {/* Image */}
        <img
          src={comingSoonImg}
          alt="Coming Soon"
          className="relative z-10 w-[400px] md:w-[550px] lg:w-[650px] drop-shadow-2xl hover:scale-105 transition duration-500"
        />
      </div>

      {/* Bottom Text */}
      {/* <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-center z-10">
        <span className="text-gray-800">Coming</span>{" "}
        <span className="text-[#0389FF]">Soon</span>
      </h1> */}

      {/* Animation */}
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 25s linear infinite;
          }
        `}
      </style>

    </div>
  );
};

export default ComingSoon;