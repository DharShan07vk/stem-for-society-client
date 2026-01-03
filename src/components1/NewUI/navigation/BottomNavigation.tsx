import { useState } from "react";
import { X, Menu } from "lucide-react";
import type { Mode } from "@/pages/InstitutionOrIndividual"

interface BottomNavigationProps {
  mode: Mode;
  activeSection: string;
}

export const BottomNavigation = ({ mode, activeSection }: BottomNavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const individualNavItems = [
    { id: "services", label: "Services" },
    { id: "process", label: "Process" },
    { id: "plans", label: "Plans" },
    { id: "faq", label: "FAQ" },
  ];

  const institutionNavItems = [
    { id: "services", label: "Modules" },
    { id: "process", label: "Process" },
    { id: "faq", label: "FAQ" },
  ];

  const navItems = mode === "institutional" ? institutionNavItems : individualNavItems;
  const ctaButtonText = mode === "institutional" ? "Partner With Us" : "Get Started";

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-all duration-500 ease-out ${
          isMenuOpen 
            ? "translate-y-0 opacity-100" 
            : "translate-y-full opacity-0"
        }`}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl border-t border-slate-100 p-6 pb-8">
          {/* Handle bar */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
          
          {/* Menu Items */}
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                }}
                className={`w-full text-left px-4 py-4 rounded-2xl transition-all duration-300 flex items-center justify-between group ${
                  isMenuOpen 
                    ? "translate-y-0 opacity-100" 
                    : "translate-y-4 opacity-0"
                } ${
                  activeSection === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="text-lg font-medium">{item.label}</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    activeSection === item.id ? "text-blue-600" : "text-slate-400"
                  } group-hover:translate-x-1`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          {/* CTA Button in Mobile Menu */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className={`w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-500 ${
              isMenuOpen 
                ? "translate-y-0 opacity-100" 
                : "translate-y-4 opacity-0"
            }`}
            style={{
              transitionDelay: isMenuOpen ? `${navItems.length * 50}ms` : "0ms",
            }}
          >
            {ctaButtonText}
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[90%] md:max-w-2xl" style={{ opacity: 1 }}>
        <div className="bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-slate-900/20 rounded-full p-2 flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  activeSection === item.id
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 pl-2 md:pl-0">
            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 gap-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 h-10 shadow-lg shadow-blue-500/20">
              {ctaButtonText}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" 
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-5 h-5">
                {/* Hamburger Icon */}
                <Menu 
                  className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
                    isMenuOpen 
                      ? "opacity-0 rotate-90 scale-50" 
                      : "opacity-100 rotate-0 scale-100"
                  }`} 
                />
                {/* Close Icon */}
                <X 
                  className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
                    isMenuOpen 
                      ? "opacity-100 rotate-0 scale-100" 
                      : "opacity-0 -rotate-90 scale-50"
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation;
