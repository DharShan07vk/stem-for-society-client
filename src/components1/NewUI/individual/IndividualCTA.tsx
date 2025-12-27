export const IndividualCTA = () => {
  return (
    <section className="py-24 md:py-32 lg:py-40 bg-slate-900 text-white text-center relative overflow-hidden isolate">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />

      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10 max-w-4xl">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-tight font-[Poppins]">
          Looking for a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Tailored Plan?
          </span>
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-12 text-lg md:text-xl leading-relaxed font-light">
          If you want a custom service or a package tailored to your specific goals, please contact us. We're here to build the perfect path for you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="group bg-white text-slate-900 hover:bg-slate-100 text-lg px-10 h-16 rounded-full font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all duration-300 transform hover:-translate-y-1">
            Request Custom Plan
          </button>
          <button className="border border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:border-slate-600 text-lg px-10 h-16 rounded-full font-medium backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
            Contact Support
          </button>
        </div>
        <p className="mt-12 text-sm text-slate-500 font-medium tracking-wide uppercase">
          Free 15-minute discovery call included
        </p>
      </div>
    </section>
  );
};

export default IndividualCTA;
