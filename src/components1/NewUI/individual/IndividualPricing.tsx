import { CircleCheck } from "lucide-react";
import { useEnquiry } from "@/pages/InstitutionOrIndividual";

export const IndividualPricing = () => {
  const { openEnquiry } = useEnquiry();

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white relative overflow-hidden" id="plans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900 mb-4 font-[Poppins]">
            Plans & Pricing
          </h2>
          <p className="text-lg text-slate-600 font-[Poppins]">
            Choose the level of support that fits your goals and budget.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Single Session */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-[Poppins]">Single Session</h3>
            <p className="text-slate-500 mb-6">Career or Wellness Consultation</p>
            <div className="text-4xl font-bold text-slate-900 mb-6">
              ₹3,000 <span className="text-base font-normal text-slate-500">/ session</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-3 text-slate-700">
                <CircleCheck className="w-5 h-5 text-blue-500 shrink-0" />
                <span>45-60 min Expert Session</span>
              </li>
              <li className="flex gap-3 text-slate-700">
                <CircleCheck className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Specific Problem Solving</span>
              </li>
              <li className="flex gap-3 text-slate-700">
                <CircleCheck className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Actionable Next Steps</span>
              </li>
            </ul>
            <button 
              onClick={() => openEnquiry("career-counselling-session")}
              className="inline-flex items-center justify-center w-full h-12 font-semibold border border-slate-200 hover:bg-slate-50 text-slate-900 rounded-xl transition-colors"
            >
              Book Session
            </button>
          </div>

          {/* Standard Package */}
          <div className="bg-white p-8 rounded-3xl border-2 border-blue-600 shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
              Best Value
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-[Poppins]">Standard Package</h3>
            <p className="text-slate-500 mb-6">Complete Career Roadmap</p>
            <div className="text-4xl font-bold text-slate-900 mb-6">
              ₹30,000 <span className="text-base font-normal text-slate-500">/ person</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-3 text-slate-700 text-sm font-medium">
                <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Extensive candidate profile review</span>
              </li>
              <li className="flex gap-3 text-slate-700 text-sm font-medium">
                <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Shortlisting of calls & University</span>
              </li>
              <li className="flex gap-3 text-slate-700 text-sm font-medium">
                <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Enhancing CV, SOP & LOR</span>
              </li>
              <li className="flex gap-3 text-slate-700 text-sm font-medium">
                <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Refining Research proposal</span>
              </li>
              <li className="flex gap-3 text-slate-700 text-sm font-medium">
                <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Guidance for application</span>
              </li>
              <li className="flex gap-3 text-slate-700 text-sm font-medium">
                <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Connecting with Experts</span>
              </li>
              <li className="flex gap-3 text-slate-700 text-sm font-medium">
                <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Interview readiness Program</span>
              </li>
              <li className="flex gap-3 text-slate-700 text-sm font-medium">
                <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Guidance for Funding</span>
              </li>
            </ul>
            <button 
              onClick={() => openEnquiry("career-counselling-full")}
              className="inline-flex items-center justify-center w-full h-12 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-colors"
            >
              Get Standard Package
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndividualPricing;
