// client/src/components/FeatureSlide.js
import React from 'react';

function FeatureSlide({ imageSrc, title, description }) {
  return (
    <div className="
      bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center
      border border-gray-200
      transition-all duration-300 hover:shadow-md hover:scale-[1.02] transform
    ">
      {}
      <img
        src={imageSrc}
        alt={title}
        className="w-32 h-32 object-contain mb-4 mx-auto"
      />

      {}
              <h3 className="text-xl font-bold text-blue-600 mb-2">{title}</h3>

      {}
        <p className="text-gray-700 text-sm">{description}</p>
    </div>
  );
}

export default FeatureSlide;