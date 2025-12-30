import innovationSvg from "../assets/Innovation.svg";
import agricultureSvg from "../assets/Agriculture.svg";
import veterinarySvg from "../assets/Health.svg";
import medicineSvg from "../assets/Medicine.svg";
import lifeScienceSvg from "../assets/LifeScience.svg";
import pharmacySvg from "../assets/Pharmacy.svg";
import entrepreneurshipSvg from "../assets/Enterpreneurship.svg";
import technologySvg from "../assets/Technology.svg";
import financeSvg from "../assets/Business.svg";
import climateSvg from "../assets/Climate.svg";
import environmentSvg from "../assets/environment.svg";
import alliedSvg from "../assets/Allied health science .svg";

const sectors = [
  { label: "Innovation", icon: innovationSvg },
  { label: "Agriculture", icon: agricultureSvg },
  { label: "Veterinary", icon: veterinarySvg },
  { label: "Medicine", icon: medicineSvg },
  { label: "Life science", icon: lifeScienceSvg },

  { label: "Pharmacy", icon: pharmacySvg },
  { label: "Entrepreneurship", icon: entrepreneurshipSvg },
  { label: "Technology", icon: technologySvg },
  { label: "Finance", icon: financeSvg },
  { label: "Climate Change", icon: climateSvg },

  { label: "Environmental Science", icon: environmentSvg },
  { label: "Allied health science", icon: alliedSvg },
];

const Sectors = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="relative w-full rounded-[2rem] sm:rounded-[3rem] overflow-hidden
                     bg-[linear-gradient(to_bottom,#DDFAFF_0%,#DDFAFF_70%,#FFFFFF_100%)]
                     py-12 sm:py-16 md:py-20 px-4 sm:px-6"
        >
          {/* Heading */}
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-instrument py-3 mb-8 sm:mb-10 md:mb-14 text-[#203D59]">
            Sectors that we focus
          </h2>

          {/* Pills wrapper */}
                         
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full max-w-5xl mx-auto">
          {sectors.map((sector, index) => {
            const isLastRow = index === 10 || index === 11;

            return (
              <div
                key={index}
                className={`
                  inline-flex items-center gap-3
                  px-6 py-3 rounded-full
                  bg-[#C3E3FF] text-[#2B4A66]
                  text-sm md:text-base font-medium
                  shadow-sm
                  whitespace-nowrap
                  ${isLastRow ? "lg:col-span-2 lg:justify-self-center" : ""}
                `}
              >
                <img
                  src={sector.icon}
                  alt={`${sector.label} icon`}
                  className="h-6 w-6 opacity-95 shrink-0"
                />
                <span>{sector.label}</span>
              </div>
            );
          })}
          </div>

          {/* Bottom fade */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-28
                          bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Sectors;
