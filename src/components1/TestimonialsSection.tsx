
import { Card, CardContent } from "@/components1/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Tharun Kumar",
      title: "Cellular Biology and Genetics Engineering with Biotechnological Applications",
      rating: 5,
      text: "I am grateful for the Experience Innovation challenges we conduct. Programs are world through and provide practical insights into healthcare technology and devices through lab activities focused on real problem-solving and development."
    },
    {
      name: "Dharshini ", 
      title: "Effective Winning Strategy & Performance-Driven Engineering",
      rating: 5,
      text: "Very informative as it brings me close to point strategies to develop my skills in Engineering. The program exceeded my expectations."
    },
    {
      name: "Vishveshwaran ",
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
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Testimonials</h2>
        
        {/* Scrolling container */
        }
        <div className="relative">
          <div className="flex animate-scroll space-x-4">
            {/* First set of testimonials */}
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex-shrink-0 w-64 sm:w-72 md:w-96 p-4 md:p-6 rounded-xl" style={{ backgroundColor: '#C0E1FF' }}>
                <CardContent className="p-0">
                  <div className="flex mb-3 gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg 
  key={i}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 512 512"
  fill="#00549F"
  className="h-5 w-5 mx-0.5"
>
  <path d="M256 0l73 149 165 24-119 116 28 164-147-77-147 77 28-164L18 173l165-24L256 0z" />
</svg>


                    ))}
                  </div>
                  <h4 className="font-semibold mb-2 text-sm md:text-base line-clamp-2">{testimonial.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{testimonial.text}</p>
                  <p className="font-medium text-sm md:text-base">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
            {/* Duplicate set for seamless scrolling */}
            {testimonials.map((testimonial, index) => (
              <Card key={`duplicate-${index}`} className="flex-shrink-0 w-56 sm:w-64 md:w-80 p-3 md:p-4 rounded-xl" style={{ backgroundColor: '#C0E1FF' }}>
                <CardContent className="p-0">
                  <div className="flex mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current text-current" style={{ color: '#00549F' }} />
                    ))}
                  </div>
                  <h4 className="font-semibold mb-2 text-xs md:text-sm line-clamp-2">{testimonial.title}</h4>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-3">{testimonial.text}</p>
                  <p className="font-medium text-xs md:text-sm">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll {
            animation: scroll 24s linear infinite;
          }
          
          .animate-scroll:hover {
            animation-play-state: paused;
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          /* Speed up on small screens for better perceived motion */
          @media (max-width: 768px) {
            .animate-scroll { animation-duration: 18s; }
          }
          @media (max-width: 480px) {
            .animate-scroll { animation-duration: 14s; }
          }
        `
      }} />
    </section>
  );
};

export default TestimonialsSection;
