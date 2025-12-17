import { TbH1 } from "react-icons/tb";

const OurPrograms = () => {
  return (
    <section className="py-20 bg-white px-[120px]">
      <div className="max-w-screen-2xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-4xl font-instrument text-[#203D59] mb-10 text-center">
          Our Programs
        </h2>

        {/* Grid */}
        <div className="w-full flex justify-center">
          <div
  className="
    grid
    grid-cols-6
    grid-rows-6
    gap-6
    w-[1440px]
    h-[1080px]
    mx-auto
  "
>


            {/* 1. Skill Development */}
            <div
  style={{ backgroundColor: "#C6B7E2" }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.backgroundColor = "#B8A7D8")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.backgroundColor = "#C6B7E2")
  }
  className="group relative row-span-4 col-span-2 rounded-3xl p-6 overflow-hidden transition-all duration-300"
>
  {/* Background Image Layer */}
  <div
    className="absolute inset-0 bg-[url('/src/assets/asset1.png')] 
              bg-contain  bg-no-repeat bg-[position:20%_110%]

               opacity-80
               transition-transform duration-300
               group-hover:scale-105"
  />

  {/* Content */}
  <div className="relative z-10">
    <h3 className=" text-4xl font-instrument mb-3 text-[#472059] scale-y-[1.5] inline-block">
      Skill development
    </h3>
    <p className="text-2sm max-w-[85%]">
     Bridging academic learning with industrial skills for impactful career readiness.
    </p>
  </div>

  {/* Soft overlay (optional but recommended) */}
  <div className="absolute inset-0 bg-black/5 rounded-3xl pointer-events-none" />
</div>


            {/* 2. Finishing School */}
            <div
              style={{ backgroundColor: "#FF8FB0" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FF7FA4")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF8FB0")}
              className="group relative col-span-4 row-span-2 rounded-3xl p-6 overflow-hidden transition-all duration-300"
            >
              <div
    className="absolute inset-0 bg-[url('/src/assets/asset2.png')] 
              bg-contain bg-center bg-no-repeat bg-[position:115%_0%]
               opacity-80
               transition-transform duration-300
               group-hover:scale-105"
  />
              <div className="relative z-10">
                <h3 className="text-4xl font-instrument mb-3 text-[#582059] scale-y-[1.5] inline-block">
                  Finishing School
                </h3>
                <p className="text-2sm max-w-[45%]">
                 Where students/learns become confident achievers equipped with the essential soft skills, clarity, & professionalism employers expect in today’s competitive world.
                </p>
              </div>

              
            </div>

            {/* 3. Individuals */}
            <div
              style={{ backgroundColor: "#FFE07A" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFD65C")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFE07A")}
              className="group relative col-start-3 col-span-2  row-span-2 row-start-3 rounded-3xl p-6 overflow-hidden transition-all duration-300"
            >
              <div
    className="absolute inset-0 bg-[url('/src/assets/asset3.png')] 
               bg-contain  bg-no-repeat bg-[position:50%_20%]
               opacity-80
               transition-transform duration-300
               group-hover:scale-105 bg-[size:150%_160%]"
  />
              <div className="relative z-10">
                <h3 className="text-4xl font-instrument mb-3 text-[#594D20] scale-y-[1.5] inline-block">
                  Individuals
                </h3>
                <p className="text-2sm max-w-[85%]">
                Expert counselling to help you choose the right career path, strengthen emotional resilience, and unlock your highest personal potential.
                </p>
              </div>

             
            </div>

            {/* 4. Institutions */}
            <div
              style={{ backgroundColor: "#C8DD9A" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#B9D487")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C8DD9A")}
              className="group relative col-start-5 row-start-3 col-span-2 row-span-2 rounded-3xl p-6 overflow-hidden transition-all duration-300"
            >
              <div
    className="absolute inset-0 bg-[url('/src/assets/asset4.png')] 
               bg-contain  bg-no-repeat bg-[position:120%_510%]
               opacity-80
               transition-transform duration-300
               group-hover:scale-105"
  />
              <div className="relative z-10">
                <h3 className="text-4xl font-instrument mb-3 text-[#594D20] scale-y-[1.5] inline-block">
                  Institutions
                </h3>
                <p className="text-2sm max-w-[85%]">
                Holistic development solutions for edu institutions focusing on career readiness, well-being, and skill enhancement programs.
                </p>
              </div>

              
            </div>

            {/* 5. Founders Nest */}
            <div
              style={{ backgroundColor: "#FFB27D" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFA165")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFB27D")}
              className="group relative col-span-4 row-start-5 row-span-2 rounded-3xl p-6 overflow-hidden transition-all duration-300"
            >
              <div
    className="absolute inset-0 bg-[url('/src/assets/asset6.png')] 
               bg-contain bg-center bg-no-repeat bg-[position:100%_80%]
               opacity-80
               transition-transform duration-300
               group-hover:scale-105 bg-[size:70%_150%]"
  />
              <div className="absolute bottom-4">
                <h3 className="text-4xl font-instrument mb-3 text-[#592B20] scale-y-[1.5] inline-block  tracking-widest ">
                  Founders Nest
                </h3>
                <p className="text-2sm max-w-[40%] bottom ">
                  Empowering early-stage founders with clarity, leadership mindset, and investor-ready skills to build sustainable, scalable startups.
                </p>
              </div>

             
            </div>

            {/* 6. Join Community */}
            <div
              style={{ backgroundColor: "#C5D7E6" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#B5CADC")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C5D7E6")}
              className="group relative col-start-5 row-start-5 col-span-2 row-span-2 rounded-3xl p-6 overflow-hidden transition-all duration-300"
            >
              <div
    className="absolute inset-0 bg-[url('/src/assets/asset5.png')] 
               bg-cover bg-center bg-no-repeat
               opacity-80
               transition-transform duration-300
               group-hover:scale-105"
  />
              <div className="relative z-10">
                <h3 className="text-4xl font-instrument mb-3 text-[#203D59] h-[48px] scale-y-[1.5] inline-block">
                  Join Community
                </h3>
                
              </div>

              
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPrograms;
