import { useState, useEffect, createContext, useContext } from "react";
import { useSearchParams } from "react-router-dom"; // Added this import

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

export type Mode = "individual" | "institution";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const modeParam = searchParams.get("mode");
  const mode: Mode = (modeParam === "institution" || modeParam === "individual") 
    ? modeParam 
    : "individual";

  const setMode = (newMode: Mode) => {
    setSearchParams({ mode: newMode }, { replace: true });
  };

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