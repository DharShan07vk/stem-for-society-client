import React from "react";

const sectors = [
  "Agriculture",
  "Allied health science",
  "Climate Change",
  "Environmental Science",
  "Pharmacy",
  "Innovation",
  "Life science",
  "Medicine",
  "Entrepreneurship",
  "Technology",
  "Veterinary",
  "Finance",
];

export default function SectorsWeFocus() {
  return (
    <div className="flex flex-col gap-3 justify-center p-4 my-12">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800 font-instrument">
        Sectors we focus
      </h2>
      <div className="grid grid-rows-3 gap-5 lg:gap-8 text-center">
        <div className="flex justify-center lg:flex-row flex-col gap-5 lg:gap-24">
          {sectors.slice(0, 4).map((sector, index) => (
            <span
              key={index}
              className="text-white text-xl font-semibold rounded-full text-center px-5 py-2 bg-sky-500 hover:scale-105 hover:bg-sky-400 transition-all"
            >
              {sector}
            </span>
          ))}
        </div>
        <div className="flex justify-center lg:flex-row flex-col gap-5 lg:gap-32">
          {sectors.slice(4, 8).map((sector, index) => (
            <span
              key={index}
              className="text-white text-xl font-semibold rounded-full text-center px-5 py-2 bg-sky-500 hover:scale-105 hover:bg-sky-400 transition-all"
            >
              {sector}
            </span>
          ))}
        </div>
        <div className="flex justify-center lg:flex-row flex-col gap-5 lg:gap-20">
          {sectors.slice(8).map((sector, index) => (
            <span
              key={index}
              className="text-white text-xl font-semibold rounded-full text-center px-5 py-2 bg-sky-500 hover:scale-105 hover:bg-sky-400 transition-all"
            >
              {sector}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
