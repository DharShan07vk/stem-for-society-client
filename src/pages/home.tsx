import FAQ from "../components1/FAQSection";
import Footer from "../components1/Footer";
import HomeCarousel from "../components1/Hero";
import Partners from "../components1/PartnersSection";
import ProgramsOffered from "../components1/ProgramStructure";
import ReviewCards from "../components1/TestimonialsSection";
import SectorsWeFocus from "../components1/SectorsSection";
import WhyChooseUs from "../components1/WhyChooseSection";
import Header from "../components1/Header";
import UpcomingSessions from "@/components1/UpcomingSection"; 

function Home() {
  return (
    <div className="min-h-screen w-full">

      {/* 🌐 Grid Background Only for Header + Hero */}
      <div className="relative overflow-hidden">
      <div 
  className="absolute inset-0 opacity-50 pointer-events-none z-0"
  style={{
    backgroundImage: `
      linear-gradient(rgba(107,114,128,0.5) 2px, transparent 2px),
      linear-gradient(90deg, rgba(107,114,128,0.5) 2px, transparent 2px)
    `,
    backgroundSize: '100px 100px',
    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 35%, transparent 100%)',
    maskImage: 'linear-gradient(to bottom, black 0%, transparent 35%, transparent 100%)',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
  }}
/>





        <div className="relative z-10">
          <Header />
          <HomeCarousel />
        </div>
      </div>

      {/* Other Sections */}
      <SectorsWeFocus />
      <ProgramsOffered/>
     <WhyChooseUs />
       <Partners/>
       <UpcomingSessions/>
      <ReviewCards/>
      <FAQ />
      <Footer />
    </div>
  );
}

export default Home;
