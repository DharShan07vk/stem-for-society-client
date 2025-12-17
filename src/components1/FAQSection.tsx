
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components1/ui/accordion";
import { Button } from "@/components1/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components1/ui/dropdown-menu";

const FAQSection = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [openItem, setOpenItem] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("General Information");
  
  const faqCategories = {
    "General Information": [
      { 
        question: "What is STEM for Society?", 
        answer: "We are a leading organization providing comprehensive STEM education and training programs to bridge the gap between academic knowledge and industry requirements." 
      },
      { 
        question: "How can I get started?", 
        answer: "You can explore our programs, register for courses, or contact us for personalized guidance based on your interests and career goals." 
      }
    ],
    "Training Programs": [
      { 
        question: "What training programs do you offer?", 
        answer: "We offer certificate programs, corporate training, instrumentation hands-on training, and specialized workshops across various STEM fields." 
      },
      { 
        question: "How long are the training programs?", 
        answer: "Program duration varies from intensive weekend workshops to comprehensive 6-month certificate programs, depending on the complexity and depth of the subject matter." 
      }
    ],
    "Internship": [
      { 
        question: "Do you provide internship opportunities?", 
        answer: "Yes, we offer structured internship programs with industry partners, research institutions, and our internal projects to provide hands-on experience." 
      },
      { 
        question: "How can I apply for internships?", 
        answer: "Applications are accepted through our online portal. Requirements vary by program, but generally include academic transcripts and a statement of purpose." 
      }
    ],
    "Skill Development": [
      { 
        question: "What skills will I develop?", 
        answer: "Our programs focus on technical skills, research methodology, scientific communication, project management, and industry-specific competencies." 
      },
      { 
        question: "Are the skills industry-relevant?", 
        answer: "Absolutely. Our curriculum is designed in collaboration with industry experts to ensure relevance to current market demands and emerging technologies." 
      }
    ],
    "Certification": [
      { 
        question: "Are your programs certified?", 
        answer: "Yes, we provide industry-recognized certificates upon successful completion of our programs, which are valued by employers and academic institutions." 
      },
      { 
        question: "How is assessment conducted?", 
        answer: "Assessment includes practical projects, theoretical examinations, presentations, and peer evaluations to ensure comprehensive skill development." 
      }
    ],
    "Support and Resources": [
      { 
        question: "What support do you provide to students?", 
        answer: "We offer mentorship, career counseling, psychology counseling, technical support, and access to our extensive library of resources." 
      },
      { 
        question: "Are resources available after program completion?", 
        answer: "Yes, alumni have continued access to our community platform, job placement assistance, and ongoing professional development resources." 
      }
    ],
    "Networking Opportunities": [
      { 
        question: "How can I network with other professionals?", 
        answer: "We facilitate networking through alumni events, industry meetups, online community platforms, and collaborative project opportunities." 
      },
      { 
        question: "Do you organize professional events?", 
        answer: "Yes, we regularly organize seminars, webinars, conferences, and networking events featuring industry leaders and experts." 
      }
    ],
    "Partnership": [
      { 
        question: "How can my organization partner with you?", 
        answer: "We welcome partnerships with educational institutions, corporations, and research organizations. Contact us to discuss collaboration opportunities." 
      },
      { 
        question: "What are the benefits of partnership?", 
        answer: "Partners gain access to our talent pool, customized training programs, research collaboration opportunities, and co-branding benefits." 
      }
    ]
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-full">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h2 className="text-5xl  text-[#00000080]">Frequently Asked Questions</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`border-rounded px-3 py-1 text-sm flex items-center ${
                    isToggled ? 'bg-[#C0E1FF] border-[#C0E1FF]' : 'bg-white border-gray-200'
                  }`}
                  style={{
                    backgroundColor: isToggled ? '#C0E1FF' : 'white',
                    borderColor: isToggled ? '#C0E1FF' : '#e5e7eb'
                  }}
                >
                  {selectedCategory} <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border shadow-lg">
                {Object.keys(faqCategories).map((category) => (
                  <DropdownMenuItem 
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="cursor-pointer"
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Accordion 
            type="single" 
            collapsible 
            className="w-full space-y-4"
            value={openItem}
            onValueChange={setOpenItem}
          >
            {faqCategories[selectedCategory as keyof typeof faqCategories]?.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className={`border rounded-lg overflow-hidden transition-colors ${
                  openItem === `item-${index}` ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <AccordionTrigger className={`text-left text-base px-6 py-4 hover:no-underline ${
                  openItem === `item-${index}` ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  0{index + 1}. {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
