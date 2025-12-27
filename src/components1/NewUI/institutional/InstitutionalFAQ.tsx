import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components1/ui/accordion";
import { MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "Are the programs age-appropriate?",
    answer: "Yes, all our programs are designed to be age-appropriate and tailored to the specific needs of different student groups, from middle school to higher education.",
  },
  {
    question: "Can we run these as part of our timetable?",
    answer: "Absolutely! We work with your institution's schedule to seamlessly integrate our programs into your existing timetable, whether as dedicated sessions or extracurricular activities.",
  },
  {
    question: "Do you provide reports and feedback?",
    answer: "Yes, we provide comprehensive reports and feedback after each program, including attendance, engagement metrics, and actionable insights for continued student development.",
  },
  {
    question: "Can we start with a pilot?",
    answer: "Yes, we encourage starting with a pilot program. This allows your institution to experience the value firsthand before committing to a full implementation.",
  },
];

export const InstitutionalFAQ = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-slate-50 relative overflow-hidden" id="faq">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900 mb-4 font-[Poppins]">
            FAQ (for institutions)
          </h2>
          <p className="text-lg text-slate-600 font-[Poppins]">Common questions about partnering with us</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-100 last:border-0">
              <AccordionTrigger className="text-left text-base md:text-lg font-medium text-slate-800 hover:text-blue-600 hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-700 hover:bg-white transition-colors text-sm font-medium">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors text-sm font-medium">
            <MessageCircle className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>
    </section>
  );
};

export default InstitutionalFAQ;
