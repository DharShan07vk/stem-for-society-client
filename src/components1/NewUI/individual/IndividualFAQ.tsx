import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components1/ui/accordion";

const faqs = [
  {
    question: "How long is each session?",
    answer: "Each session typically lasts 45-60 minutes, depending on the type of consultation. Career guidance sessions may extend slightly longer for comprehensive assessments.",
  },
  {
    question: "Can I choose multiple areas (e.g., both career and mental well-being)?",
    answer: "Absolutely! Many of our clients benefit from combining career counselling with mental well-being support. We offer package options that cover both areas for a more holistic approach.",
  },
  {
    question: "Who conducts the sessions?",
    answer: "Our sessions are conducted by certified professionals including career counsellors, licensed psychologists, and industry experts with extensive experience in their respective fields.",
  },
  {
    question: "How do I book?",
    answer: "Simply click the 'Get Started' button, fill out a brief form about your needs, and our team will reach out within 24 hours to schedule your first session.",
  },
];

export const IndividualFAQ = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-slate-50 relative overflow-hidden" id="faq">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900 mb-4 font-[Poppins]">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 font-[Poppins]">Got questions? We've got answers.</p>
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
      </div>
    </section>
  );
};

export default IndividualFAQ;
