import { Star, ChevronDown } from "lucide-react";

const individualAvatars = [
  "https://i.pravatar.cc/100?img=21",
  "https://i.pravatar.cc/100?img=22",
  "https://i.pravatar.cc/100?img=23",
  "https://i.pravatar.cc/100?img=24",
];

export const IndividualHero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-slate-50 isolate">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden bg-slate-50">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-emerald-100/30 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-24 md:py-32 lg:py-40 md:pt-48 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-2xl mx-auto lg:mx-0 space-y-6 md:space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-100 text-blue-700 text-xs md:text-sm font-semibold shadow-sm mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              Accepting New Students for Fall 2025
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15] md:leading-[1.1] font-[Poppins]">
              Feeling lost, overwhelmed, or <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                unsure where to start?
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-[Poppins]">
              You don't have to figure it all out alone. STEM for Society, we bring together experts, mentors, and counsellors to Support you take charge of your journey — mindfully and confidently.
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-8 bg-white/40 backdrop-blur-sm p-5 rounded-2xl border border-white/60 shadow-sm w-fit">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3 sm:-space-x-4">
                  {individualAvatars.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt="Student"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white shadow-sm"
                    />
                  ))}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-900 text-base sm:text-lg">30,000+</span>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wide">Active Students</span>
                </div>
              </div>
              <div className="hidden sm:block h-10 w-px bg-slate-200/60" />
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-100 shadow-sm text-yellow-500">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" aria-hidden="true" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-900 text-base sm:text-lg">4.9/5</span>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wide">Average Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[450px] sm:h-[550px] lg:h-[600px] w-full flex items-center justify-center lg:justify-end perspective-[2000px] group mt-8 lg:mt-0 px-[80px] py-[0px]">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1565598494553-5685d762031c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwY2FyZWVyJTIwY291bnNlbGluZyUyMG9uZSUyMG9uJTIwb25lfGVufDF8fHx8MTc2NTgwMjc1N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Individual Growth"
                className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 pointer-events-none">
        <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" aria-hidden="true" />
      </div>
    </section>
  );
};

export default IndividualHero;
