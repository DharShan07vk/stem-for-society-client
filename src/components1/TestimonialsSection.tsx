import { Card, CardContent } from "@/components1/ui/card";
import { Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Tharun Kumar",
      title: "Cellular Biology and Genetics Engineering with Biotechnological Applications",
      rating: 5,
      text: "I am grateful for the Experience Innovation challenges we conduct. Programs are world through and provide practical insights into healthcare technology and devices through lab activities focused on real problem-solving and development."
    },
    {
      name: "Dharshini",
      title: "Effective Winning Strategy & Performance-Driven Engineering",
      rating: 5,
      text: "Very informative as it brings me close to point strategies to develop my skills in Engineering. The program exceeded my expectations."
    },
    {
      name: "Vishveshwaran",
      title: "Biomedical Engineering and Healthcare Innovation",
      rating: 5,
      text: "The hands-on approach and mentorship provided transformed my understanding of biomedical applications. Highly recommend this program."
    },
    {
      name: "Sivani",
      title: "Data Science and Machine Learning Applications",
      rating: 5,
      text: "Outstanding curriculum that bridges theory and practice. The industry connections and placement support were exceptional."
    },
    {
      name: "Raghul",
      title: "Renewable Energy Systems and Sustainability",
      rating: 5,
      text: "The program opened my eyes to sustainable technology solutions. The mentorship and hands-on projects were incredibly valuable for my career growth."
    },
    {
      name: "Sachithra",
      title: "Artificial Intelligence and Robotics Innovation",
      rating: 5,
      text: "Amazing experience with cutting-edge AI and robotics projects. The industrial training component provided real-world exposure that was invaluable."
    }
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-medium text-gray-500 mb-8">
          Testimonials
        </h2>

        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-scroll hover:[animation-play-state:paused]">
            
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <Card
                key={index}
                className="min-w-[320px] max-w-[340px] rounded-xl border-none flex-shrink-0"
                style={{ backgroundColor: "#C0E1FF" }}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <Quote
                    className="w-16 h-16 text-[#9EC9F2] mb-4 scale-y-[-1] scale-x-[-1] fill-[#1010101A] stroke-none"
                    strokeWidth={3}
                  />

                  <h4 className="font-semibold text-sm md:text-base leading-relaxed mb-3 line-clamp-3">
                    {testimonial.title}
                  </h4>

                  <p className="text-sm text-gray-600 mb-auto line-clamp-3">
                    {testimonial.text}
                  </p>

                  <div className="flex items-center gap-3 mt-6">
                    <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center text-white text-xs">
                      {testimonial.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {testimonial.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

          </div>
        </div>
      </div>

      {/* animation */}
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default TestimonialsSection;
