import { CircleCheck } from "lucide-react";

export const InstitutionalPricing = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white relative overflow-hidden" id="plans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900 mb-4 font-[Poppins]">
            Customize Your Program
          </h2>
          <p className="text-lg text-slate-600 font-[Poppins]">
            Every institution is unique. Choose a single module or build a comprehensive year-long journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Single Theme Program */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-[Poppins]">Single-Theme Program</h3>
            <p className="text-slate-500 mb-6">Focus on a specific need like Mental Well-being</p>
            <div className="text-4xl font-bold text-slate-900 mb-6">
              ₹30,000 <span className="text-base font-normal text-slate-500">/ per student</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-3 text-slate-700">
                <CircleCheck className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Themed workshop</span>
              </li>
              <li className="flex gap-3 text-slate-700">
                <CircleCheck className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Expert facilitators</span>
              </li>
              <li className="flex gap-3 text-slate-700">
                <CircleCheck className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Topic-specific resources</span>
              </li>
            </ul>
            <button className="inline-flex items-center justify-center w-full h-12 font-semibold border border-slate-200 hover:bg-slate-50 text-slate-900 rounded-xl transition-colors">
              Get Single Session
            </button>
          </div>

          {/* Comprehensive Package */}
          <div className="bg-white p-8 rounded-3xl border-2 border-emerald-600 shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
              Recommended
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-[Poppins]">Comprehensive Package</h3>
            <p className="text-slate-500 mb-6">Holistic development for year-long impact</p>
            <div className="text-4xl font-bold text-slate-900 mb-6">
              Custom <span className="text-base font-normal text-slate-500">Pricing</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-3 text-slate-700 text-sm font-medium">
                <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Year-long engagement</span>
              </li>
              <li className="flex gap-3 text-slate-700 text-sm font-medium">
                <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Structured tracking & reports</span>
              </li>
              <li className="flex gap-3 text-slate-700 text-sm font-medium">
                <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Combined module discounts</span>
              </li>
            </ul>
            <button className="inline-flex items-center justify-center w-full h-12 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-200 transition-colors">
              Request Proposal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstitutionalPricing;
