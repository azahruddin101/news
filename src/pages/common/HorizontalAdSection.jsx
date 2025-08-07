import React from "react";

const ads = [
  {
    title: "Summer Sale!",
    description: "Up to 50% off on all products. Shop now.",
  }
];

function HorizontalAdSection() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:gap-4">
        {ads.map((ad, idx) => (
          <div
            key={idx}
            className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-center min-h-[120px] hover:shadow-md transition-shadow"
          >
            <h3 className="text-base font-semibold text-gray-800 truncate">
              {ad.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ad.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HorizontalAdSection;
