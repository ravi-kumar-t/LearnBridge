// client/src/components/CategoryTile.js
import React from 'react';

function CategoryTile({ imageSrc, title, onClick }) { 
  return (
    <div
      onClick={onClick}
      className="block p-4 md:p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group flex flex-col items-center justify-center text-center border border-gray-200 cursor-pointer" // Added cursor-pointer
    >
      <div className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full mb-4 shadow-md group-hover:from-blue-200 group-hover:to-teal-200 transition-all duration-300">
        <img
          src={imageSrc}
          alt={`${title} category icon`}
          className="w-12 h-12 md:w-16 md:h-16 object-contain filter drop-shadow"
        />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
        {title}
      </h3>
    </div>
  );
}

export default CategoryTile;