import { Compass, Lightbulb, UserCircle, Heart, Smartphone, HeartPulse, CircleCheck } from "lucide-react";

const modules = [
  {
    shortTitle: "Career Ready",
    badge: "Career Path",
    badgeColor: "bg-blue-600 text-white",
    iconColor: "text-blue-600",
    icon: <Compass className="w-6 h-6" />,
    title: "Career Counselling and Guidance",
    subtitle: "FROM CONFUSION TO CLARITY",
    description: "Help students move from confusion to clarity. Provide actionable roadmaps for higher education and careers.",
    price: "₹20,000",
    keyModules: ["Career Awareness", "Career Readiness", "Career Assessment"],
    gains: [
      "Clarity about streams, specializations, and future study options",
      "Understanding of strengths, interests, and aptitude",
      "Actionable roadmaps for higher education and careers",
    ],
    image: "https://images.unsplash.com/photo-1743793175419-2b4d6e96f0f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FyZWVyJTIwZmFpciUyMGJvb3RoJTIwc3R1ZGVudHMlMjB0YWxraW5nfGVufDF8fHx8MTc2NTc5NzI2NHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    shortTitle: "Innovation",
    badge: "Entrepreneurship",
    badgeColor: "bg-orange-500 text-white",
    iconColor: "text-orange-500",
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Entrepreneurship",
    subtitle: "FROM IDEA TO IMPACT",
    description: "Ignite the entrepreneurial spirit. Learn to find business ideas, pitch like a pro, and master branding and storytelling.",
    price: "₹20,000",
    keyModules: ["Finding Business Ideas", "Pitching Like a Pro", "Branding & Storytelling", "Entrepreneurial Mindset"],
    gains: [
      "Practical framework for launching ventures",
      "Mastering the art of persuasion and sales",
      "Building a personal and business brand",
    ],
    image: "https://images.unsplash.com/photo-1690192436145-6f9942af5156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGJyYWluc3Rvcm1pbmclMjBzdGFydHVwJTIwaWRlYSUyMHdoaXRlYm9hcmQlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NjU3OTcyNTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    shortTitle: "Soft Skills",
    badge: "Personality",
    badgeColor: "bg-violet-600 text-white",
    iconColor: "text-violet-600",
    icon: <UserCircle className="w-6 h-6" />,
    title: "Attitude and Personality Development",
    subtitle: "SHAPE CONFIDENT INDIVIDUALS",
    description: "Shape confident, grounded and emotionally intelligent individuals.",
    price: "₹20,000",
    keyModules: ["Personality Development", "Critical Thinking", "Team Building", "Communication Skills", "Leadership 101"],
    gains: [
      "Better self-image and interpersonal skills",
      "Ability to build and maintain healthy relationships",
      "Leadership and teamwork skills for academic and professional settings",
    ],
    image: "https://images.unsplash.com/photo-1755692881528-c3f15962206e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjBzdHVkZW50JTIwbGVhZGVyJTIwc3BlYWtpbmclMjB0byUyMGdyb3VwJTIwb3V0ZG9vcnN8ZW58MXx8fHwxNzY1Nzk3MjY0fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    shortTitle: "Resilience",
    badge: "Mental Health",
    badgeColor: "bg-emerald-600 text-white",
    iconColor: "text-emerald-600",
    icon: <Heart className="w-6 h-6" />,
    title: "Mental Well-being",
    subtitle: "FOUNDATION OF SUCCESS",
    description: "Because mental health is foundational to academic success.",
    price: "₹20,000",
    keyModules: ["Stress and Burnout", "Resilience Building", "Procrastination and Motivation", "Handling Emotions"],
    gains: [
      "Tools for managing exam pressure and academic stress",
      "Improved self-awareness and emotional regulation",
      "Healthier coping strategies and stronger inner resilience",
    ],
    image: "https://images.unsplash.com/photo-1610070835951-156b6921281d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGdyb3VwJTIwZGlzY3Vzc2lvbiUyMGNpcmNsZSUyMHdlbGxuZXNzJTIwc3VwcG9ydHxlbnwxfHx8fDE3NjU3OTcyNTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    shortTitle: "Digital Balance",
    badge: "Digital Wellness",
    badgeColor: "bg-sky-500 text-white",
    iconColor: "text-sky-500",
    icon: <Smartphone className="w-6 h-6" />,
    title: "Digital Wellness & Social Media Awareness",
    subtitle: "MINDFUL TECHNOLOGY USE",
    description: "Help students use technology mindfully instead of being consumed by it.",
    price: "₹20,000",
    keyModules: ["Digital Detox", "Social Media Awareness"],
    gains: [
      "Awareness of screen addiction and its impact",
      "Safer, more mindful use of social media",
      "Critical thinking to navigate information overload",
    ],
    image: "https://images.unsplash.com/photo-1586579315888-2cb8f92c6a2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbG9va2luZyUyMGF0JTIwcGhvbmUlMjBmb2N1c2VkJTIwb3IlMjBkaWdpdGFsJTIwZGV0b3glMjBuYXR1cmV8ZW58MXx8fHwxNzY1Nzk3MjU0fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    shortTitle: "Health & Respect",
    badge: "Sex Education",
    badgeColor: "bg-rose-500 text-white",
    iconColor: "text-rose-500",
    icon: <HeartPulse className="w-6 h-6" />,
    title: "Sex Education",
    subtitle: "VALUES-SENSITIVE LEARNING",
    description: "Age-appropriate, scientifically accurate, and values-sensitive learning.",
    price: "₹20,000",
    keyModules: ["Menstrual Hygiene", "Handling Relationships", "Human Development", "Sex Education 101"],
    gains: [
      "Correct information about reproductive health and bodily changes",
      "Reduced stigma and myths around periods and sexuality",
      "Respectful attitudes towards self and others",
    ],
    image : "https://images.unsplash.com/photo-1707944746058-4da338d0f827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9sb2d5JTIwY2xhc3Nyb29tJTIwaGVhbHRoJTIwZWR1Y2F0aW9uJTIwZGl2ZXJzaXR5JTIwcmVzcGVjdHxlbnwxfHx8fDE3NjU3OTcyNTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
];

export const InstitutionalModules = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white relative overflow-hidden" id="services">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900 mb-4 font-[Poppins]">
            One Partner. <span className="text-blue-600">Multiple Modules.</span>
          </h2>
          <p className="text-lg text-slate-600 font-[Poppins]">
            We strengthen your institution's ecosystem through evidence-based programs and expert facilitators. Enhancing accreditation outcomes, student experience, and overall campus well-being.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <article
              key={index}
              className="group relative flex flex-col bg-slate-50 rounded-3xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={module.image}
                  alt={module.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${module.badgeColor}`}>
                  {module.shortTitle}
                </div>
                <div className={`absolute -bottom-5 left-5 bg-white rounded-full p-3 shadow-md ${module.iconColor}`}>
                  {module.icon}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 pt-8 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
                <p className={`text-xs uppercase ${module.iconColor} mt-1 font-medium tracking-wide`}>{module.subtitle}</p>
                <p className="mt-3 text-sm text-slate-600">{module.description}</p>

                {/* Pricing and Key Modules */}
                <div className="mt-4 grid grid-cols-2 gap-4 items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Pricing</p>
                    <div className="mt-2 rounded-md border bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                      {module.price}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Key Modules</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {module.keyModules.slice(0, 3).map((k, i2) => (
                        <span key={i2} className="text-xs inline-block bg-slate-200/60 text-slate-600 px-2 py-1 rounded-full">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* What Students Gain */}
                <div className="mt-4 flex-grow">
                  <p className="font-medium text-slate-900 text-sm">What Students Gain:</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    {module.gains.map((g, i3) => (
                      <li key={i3} className="flex items-start gap-3">
                        <span className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 ${module.iconColor}`}>
                          <CircleCheck className="w-3 h-3" />
                        </span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="mt-6">
                  <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-slate-200">
                    Inquire Now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstitutionalModules;
