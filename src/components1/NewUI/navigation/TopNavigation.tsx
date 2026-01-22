import { Users, Building2 } from "lucide-react";
import type { Mode } from "@/pages/InstitutionOrIndividual";

interface TopNavigationProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export const TopNavigation = ({ mode, setMode }: TopNavigationProps) => {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-6 z-[60]">
      <div
        role="tablist"
        aria-label="View Mode Selection"
        className="relative backdrop-blur-md bg-white/80 shadow-lg flex isolate gap-1 border border-slate-200/60 p-1 rounded-full"
      >
        <button
          role="tab"
          aria-selected={mode === "individual"}
          onClick={() => setMode("individual")}
          className={`relative text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 z-10 ${
            mode === "individual"
              ? "text-white"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {mode === "individual" && (
            <div className="absolute inset-0 bg-slate-900 rounded-full shadow-md -z-10" style={{ opacity: 1 }} />
          )}
          <Users className="w-4 h-4 relative z-10" aria-hidden="true" />
          <span className="relative z-10">Individual</span>
        </button>
        <button
          role="tab"
          aria-selected={mode === "institution"}
          onClick={() => setMode("institution")}
          className={`relative text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 z-10 ${
            mode === "institution"
              ? "text-white"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {mode === "institution" && (
            <div className="absolute inset-0 bg-slate-900 rounded-full shadow-md -z-10" style={{ opacity: 1 }} />
          )}
          <Building2 className="w-4 h-4 relative z-10" aria-hidden="true" />
          <span className="relative z-10">Institutional</span>
        </button>
      </div>
    </div>
  );
};

export default TopNavigation;
