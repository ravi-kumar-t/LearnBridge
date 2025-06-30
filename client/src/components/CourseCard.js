// client/src/components/CourseCard.js
import React from 'react';
import { Link } from 'react-router-dom';

function CourseCard({ imageUrl, title, description, instructor, rating, reviews, price, id }) { 
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 flex-grow">{description}</p>
        <div className="text-gray-500 text-xs mb-2">
          By <span className="font-semibold text-gray-700">{instructor}</span>
        </div>
        <div className="flex items-center text-sm mb-4">
          <span className="font-bold text-yellow-500 mr-1">{rating}</span>
          <span className="text-gray-600">({reviews})</span>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold text-gray-900">{price}</span>
          {}
          {}
          <Link
            to={`/course/${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 text-sm"
          >
            Go to Course
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;