import { MessageSquare, UserPlus, ClipboardList, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: <MessageSquare className="w-10 h-10 text-blue-600" />,
    title: "Discovery",
    description: "Book a free 15-min consultation to discuss your current challenges and future goals.",
  },
  {
    icon: <UserPlus className="w-10 h-10 text-blue-600" />,
    title: "Match",
    description: "We pair you with a mentor or psychologist who specializes in your specific needs.",
  },
  {
    icon: <ClipboardList className="w-10 h-10 text-blue-600" />,
    title: "Roadmap",
    description: "Receive a personalized action plan tailored to your career or wellness objectives.",
  },
  {
    icon: <TrendingUp className="w-10 h-10 text-blue-600" />,
    title: "Growth",
    description: "Engage in regular sessions, track your progress, and achieve your milestones.",
  },
];

export const IndividualJourney = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-slate-50 relative overflow-hidden" id="process">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-[Poppins]">
            Your Journey to Success
          </h2>
          <p className="text-lg text-slate-600 font-[Poppins]">Simple steps to start your transformation today.</p>
        </div>

        <div className="relative grid gap-12 md:gap-8 md:grid-cols-4">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-8 relative z-10 group-hover:-translate-y-2 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-slate-200/50">
                <div className="absolute inset-0 bg-blue-50/50 rounded-3xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300 -z-10" />
                {step.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm border-4 border-white">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base max-w-[250px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndividualJourney;
