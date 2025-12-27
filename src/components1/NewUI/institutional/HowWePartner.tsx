import { FileText, Palette, Users,ChartColumn , Lightbulb} from "lucide-react";

const steps = [
  {
    icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
    title: "Consult",
    description: "We assess your institution's specific needs, student demographics, and outcome goals.",
  },
  {
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    title: "Design",
    description: "Our experts create instructor materials & certificates combining relevant modules (e.g., Career + Wellness).",
  },
  {
    icon: <Users className="w-8 h-8 text-blue-600" />,
    title: "Deploy",
    description: "Seamless scheduling for faculty and advisors at student workshops and digital resources.",
  },
  {
    icon: <ChartColumn className="w-8 h-8 text-blue-600" />,
    title: "Impact",
    description: "Regular engagement reports and outcomes that measure the program's success.",
  },
];

export const HowWePartner = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-slate-50 relative overflow-hidden" id="process">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-[Poppins]">
            How We Partner
          </h2>
          <p className="text-lg text-slate-600 font-[Poppins]">A structured, four-step approach to transforming your campus ecosystem.</p>
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

export default HowWePartner;
