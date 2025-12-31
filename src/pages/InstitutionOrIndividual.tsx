import { useState, useEffect, createContext, useContext } from "react";

// Navigation Components
import TopNavigation from "@/components1/NewUI/navigation/TopNavigation";
import BottomNavigation from "@/components1/NewUI/navigation/BottomNavigation";

// Individual View Components
import IndividualHero from "@/components1/NewUI/individual/IndividualHero";
import IndividualServices from "@/components1/NewUI/individual/IndividualServices";
import IndividualJourney from "@/components1/NewUI/individual/IndividualJourney";
import IndividualPricing from "@/components1/NewUI/individual/IndividualPricing";
import IndividualFAQ from "@/components1/NewUI/individual/IndividualFAQ";
import IndividualCTA from "@/components1/NewUI/individual/IndividualCTA";

// Institutional View Components
import InstitutionalHero from "@/components1/NewUI/institutional/InstitutionalHero";
import InstitutionalModules from "@/components1/NewUI/institutional/InstitutionalModules";
import HowWePartner from "@/components1/NewUI/institutional/HowWePartner";
import InstitutionalPricing from "@/components1/NewUI/institutional/InstitutionalPricing";
import InstitutionalFAQ from "@/components1/NewUI/institutional/InstitutionalFAQ";
import InstitutionalCTA from "@/components1/NewUI/institutional/InstitutionalCTA";

// Enquiry Popup
import EnquiryPopup, { EnquiryMode } from "@/components1/NewUI/EnquiryPopup";

export type Mode = "individual" | "institutional";

// Context for enquiry popup
interface EnquiryContextType {
  openEnquiry: (service?: string) => void;
  closeEnquiry: () => void;
}

export const EnquiryContext = createContext<EnquiryContextType>({
  openEnquiry: () => {},
  closeEnquiry: () => {},
});

export const useEnquiry = () => useContext(EnquiryContext);

const Index = () => {
  const [mode, setMode] = useState<Mode>("individual");
  const [activeSection, setActiveSection] = useState<string>("services");
  
  // Enquiry popup state
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");

  const openEnquiry = (service?: string) => {
    if (service) {
      setSelectedService(service);
    }
    setIsEnquiryOpen(true);
  };

  const closeEnquiry = () => {
    setIsEnquiryOpen(false);
    setSelectedService("");
  };

  // Scroll spy to track active section
  useEffect(() => {
    const ids = ["services", "process", "plans", "faq"];
    
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0.1,
    });

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [mode]);

  return (
    <EnquiryContext.Provider value={{ openEnquiry, closeEnquiry }}>
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-[Poppins]">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-slate-50" />
          <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-blue-100/20 to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-emerald-100/20 to-transparent opacity-50" />
        </div>

        {/* Top Navigation */}
        <TopNavigation mode={mode} setMode={setMode} />

        {/* Bottom Navigation */}
        <BottomNavigation mode={mode} activeSection={activeSection} />

        {/* Main Content */}
        <main className="relative z-10 w-full max-w-[1600px] mx-auto bg-white rounded-none sm:rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-slate-900/5 md:mt-6 md:mb-32">
          {mode === "individual" ? (
            // Individual View
            <div className="transition-opacity duration-300">
              <IndividualHero />
              <IndividualServices />
              <IndividualJourney />
              <IndividualPricing />
              <IndividualFAQ />
              <IndividualCTA />
            </div>
          ) : (
            // Institutional View
            <div className="transition-opacity duration-300">
              <InstitutionalHero />
              <InstitutionalModules />
              <HowWePartner />
              <InstitutionalPricing />
              <InstitutionalFAQ />
              <InstitutionalCTA />
            </div>
          )}
        </main>

        {/* Enquiry Popup */}
        <EnquiryPopup
          isOpen={isEnquiryOpen}
          onClose={closeEnquiry}
          mode={mode as EnquiryMode}
          preSelectedService={selectedService}
        />
      </div>
    </EnquiryContext.Provider>
  );
};

export default Index;


// import { useState } from "react";
// import { Hero } from "@/components1/NewUI/Hero";
// import { ServicesSelector } from "@/components1/NewUI/ServicesSelector";
// import { Process } from "@/components1/NewUI/Process";
// import { Plans } from "@/components1/NewUI/Plans";
// import { FAQ } from "@/components1/NewUI/FAQ";
// import { CTA } from "@/components1/NewUI/CTA";
// import { Footer } from "@/components1/NewUI/Footer";
// import { FloatingNavbar } from "@/components1/NewUI/FloatingNavbar";
// import { Toaster } from "sonner";

// export default function Index() {
//   const [viewMode, setViewMode] = useState<'individual' | 'institutional'>('individual');

//   return (
//     <>
//       <style>{`
//         .institution-individual-wrapper {
//           --background: 0 0% 100%;
//           --foreground: 222.2 84% 4.9%;
//           --card: 0 0% 100%;
//           --card-foreground: 222.2 84% 4.9%;
//           --popover: 0 0% 100%;
//           --popover-foreground: 222.2 84% 4.9%;
//           --primary: 221.2 83.2% 53.3%;
//           --primary-foreground: 210 40% 98%;
//           --secondary: 210 40% 96.1%;
//           --secondary-foreground: 222.2 47.4% 11.2%;
//           --muted: 210 40% 96.1%;
//           --muted-foreground: 215.4 16.3% 46.9%;
//           --accent: 210 40% 96.1%;
//           --accent-foreground: 222.2 47.4% 11.2%;
//           --destructive: 0 84.2% 60.2%;
//           --destructive-foreground: 210 40% 98%;
//           --border: 214.3 31.8% 91.4%;
//           --input: 214.3 31.8% 91.4%;
//           --ring: 221.2 83.2% 53.3%;
//           --radius: 0.5rem;
//         }
        
//         /* Scoped responsive media defaults */
//         .institution-individual-wrapper img,
//         .institution-individual-wrapper svg,
//         .institution-individual-wrapper video,
//         .institution-individual-wrapper canvas,
//         .institution-individual-wrapper iframe {
//           max-width: 100%;
//           height: auto;
//         }
//       `}</style>
      
//       <div className="institution-individual-wrapper min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex justify-center p-0 md:p-4 lg:p-6 pb-24 md:pb-32 lg:pb-40 relative overflow-x-hidden font-[Poppins]">
//       {/* Enhanced Ambient Background - Minimal Version */}
//       <div className="fixed inset-0 z-0 pointer-events-none">
//           <div className="absolute inset-0 bg-slate-50" />
//           <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-blue-100/20 to-transparent opacity-50" />
//           <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-emerald-100/20 to-transparent opacity-50" />
//       </div>

//       <FloatingNavbar viewMode={viewMode} setViewMode={setViewMode} />
//       {/* 
// 78:       <ScrollToTop /> 
// 79:       */}
//       <Toaster />
//       <main className="w-full max-w-[1600px] bg-white rounded-none sm:rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-slate-900/5 relative isolate z-10">
//         <Hero viewMode={viewMode} />
//         <ServicesSelector viewMode={viewMode} />
//         <Process viewMode={viewMode} />
//         <Plans viewMode={viewMode} />
//         <FAQ viewMode={viewMode} />
//         <CTA viewMode={viewMode} />
//         <Footer viewMode={viewMode} />
//       </main>
//       </div>
   
//     </>
//   );
// }


