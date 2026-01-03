import { Compass, Heart, CircleCheck, Download } from "lucide-react";
import { useEnquiry } from "@/pages/InstitutionOrIndividual";

export const IndividualServices = () => {
  const { openEnquiry } = useEnquiry();

  const services = [
    {
      badge: "Career Path",
      badgeColor: "text-blue-700 bg-blue-50",
      iconColor: "text-blue-600",
      icon: <Compass className="w-7 h-7" />,
      title: "Career Counselling & Guidance",
      subtitle: "FIND YOUR DIRECTION. CHOOSE WITH CLARITY.",
      description: "Your career should be an extension of your strengths, interests, and aspirations — not just a random choice. In our one-on-one career counselling sessions, you'll discover your natural talents, explore compatible career paths, and create an action plan that aligns with your goals.",
      pricing: "₹3000 per Session",
      outcome: "Personalized career roadmap, skill gap identification, and goal-based strategy.",
      includes: [
        "Career choice & Industry jobs",
        "Shortlisting Abroad Masters/PhD",
        "PG/PhD abroad application guidance",
        "Post Doc Application",
        "CV/Resume prep",
        "Research Proposal editing",
        "LOR/SOP editing & preparation",
      ],
      image: "https://images.unsplash.com/photo-1696453424699-f6ebbe24c28a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBjYXJlZXIlMjBjb3Vuc2VsaW5nJTIwc2Vzc2lvbiUyMHByb2Zlc3Npb25hbCUyMGRlc2t8ZW58MXx8fHwxNzY1Nzk3MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      badge: "Inner Balance",
      badgeColor: "text-emerald-700 bg-emerald-50",
      iconColor: "text-emerald-600",
      icon: <Heart className="w-7 h-7" />,
      title: "Mental Well-being",
      subtitle: "A SAFE SPACE TO TALK, HEAL, AND GROW.",
      description: "Your mental well-being matters as much as your success. Our counselling sessions create a safe, confidential space to talk about stress, anxiety, burnout, or any emotional challenges you face. We combine psychological insight with practical techniques.",
      pricing: "₹3000 per session",
      outcome: "Better emotional regulation, clarity of thought, and improved daily functioning.",
      includes: [
        "Mindfulness techniques",
        "Journaling practices",
        "Resilience coaching",
        "Stress management",
      ],
      image: "https://images.unsplash.com/photo-1698373890183-ae3943362fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50YWwlMjBoZWFsdGglMjB0aGVyYXB5JTIwc2Vzc2lvbiUyMGNvbWZvcnRhYmxlJTIwcm9vbSUyMHBlYWNlZnVsfGVufDF8fHx8MTc2NTc5NzI1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white relative overflow-hidden" id="services">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900 mb-4 font-[Poppins]">
            Our <span className="text-blue-600">Services</span>
          </h2>
          <p className="text-lg text-slate-600 font-[Poppins]">Choose the path that fits your needs.</p>
        </div>

        <div className="grid gap-8 mx-auto md:grid-cols-2 max-w-5xl">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative flex flex-col h-full bg-slate-50 rounded-3xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 overflow-hidden"
            >
              {/* Image Section */}
              <div className="h-72 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-500 z-10" />
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className={`inline-flex items-center justify-center rounded-md border text-xs w-fit whitespace-nowrap shrink-0 backdrop-blur-sm border-none shadow-sm font-semibold px-3 py-1.5 ${service.badgeColor}`}>
                    {service.badge}
                  </span>
                </div>
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hidden md:block">
                  <button className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-slate-500 hover:text-blue-600 hover:bg-white" title="Download Brochure">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 flex flex-col h-full relative bg-transparent z-30">
                <div className={`w-14 h-14 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center -mt-10 relative z-20 mb-6 group-hover:scale-110 transition-transform duration-300 ${service.iconColor}`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 transition-colors">{service.title}</h3>
                <p className={`${service.iconColor} font-medium text-sm mb-6 uppercase tracking-wide`}>{service.subtitle}</p>
                <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>

                {/* Pricing */}
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Pricing</p>
                  <p className="text-slate-900 font-bold">{service.pricing}</p>
                </div>

                {/* Outcome */}
                <div className="mb-6 p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Outcome</p>
                  <p className="text-slate-700 text-sm font-medium leading-relaxed">{service.outcome}</p>
                </div>

                {/* Service Includes */}
                <div className="space-y-3 mb-8 flex-grow">
                  <p className="text-sm font-bold text-slate-900 mb-2">Service Includes:</p>
                  {service.includes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <div className={`w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mt-0.5 ${service.iconColor}`}>
                        <CircleCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-tight">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <button 
                    onClick={() => openEnquiry(index === 0 ? "career-counselling-full" : "mental-wellbeing")}
                    className="inline-flex items-center justify-center w-full h-12 rounded-xl text-white transition-all duration-300 font-semibold bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndividualServices;
