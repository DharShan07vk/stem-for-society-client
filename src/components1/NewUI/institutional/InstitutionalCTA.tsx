import { useState } from "react";
import EnquiryPopup from "../EnquiryPopup";

export const InstitutionalCTA = () => {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const openEnquiry = () => {
    setIsEnquiryOpen(true);
  };

  const closeEnquiry = () => {
    setIsEnquiryOpen(false);
  };

  return (
    <>
      <section className="py-24 md:py-32 lg:py-40 bg-slate-900 text-white text-center relative overflow-hidden isolate">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />

        <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-tight font-[Poppins]">
            Need a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Custom Solution?
            </span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-12 text-lg md:text-xl leading-relaxed font-light">
            We understand that every institution is unique. If you require a custom service or specific workshop tailored to your institution's offerings, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={openEnquiry}
              className="group bg-white text-slate-900 hover:bg-slate-100 text-lg px-10 h-16 rounded-full font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all duration-300 transform hover:-translate-y-1">
              Discuss Custom Needs
            </button>
            <button 
              onClick={openEnquiry}
              className="border border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:border-slate-600 text-lg px-10 h-16 rounded-full font-medium backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* Enquiry Popup with institution mode and calendar/time picker */}
      <EnquiryPopup
        isOpen={isEnquiryOpen}
        onClose={closeEnquiry}
        mode="institution"
        preSelectedService="single-theme"
      />
    </>
  );
};

export default InstitutionalCTA;
