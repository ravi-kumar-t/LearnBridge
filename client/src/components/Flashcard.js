// client/src/components/Flashcard.js
import React from 'react';

function Flashcard({ title, description, iconSrc }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl border border-blue-100 cursor-pointer">
      {iconSrc && (
        <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full mb-6 shadow-lg">
          <img
            src={iconSrc}
            alt={`${title} icon`}
            // REMOVED: filter brightness-0 invert
            className="h-10 w-10 md:h-12 md:w-12 object-contain" // Icons will now show in their original colors
          />
        </div>
      )}

      <h4 className="text-2xl font-extrabold text-gray-900 mb-3 leading-snug">{title}</h4>
      <p className="text-gray-700 text-base leading-relaxed">{description}</p>
    </div>
  );
}

export default Flashcard;