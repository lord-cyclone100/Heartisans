import React from 'react';

export const StoryCard = ({ name, role, image, story }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 md:p-8 lg:p-10 border-2 border-green-100 hover:border-green-200 w-full group">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 lg:mb-8">
        <div className="relative mb-4 sm:mb-0">
          <img 
            src={image} 
            alt={name}
            className="w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 rounded-full object-cover border-4 border-green-200 group-hover:border-green-300 transition-all duration-300 shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-6 md:w-8 h-6 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs md:text-sm">✓</span>
          </div>
        </div>
        <div className="sm:ml-6 lg:ml-8">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 md:mb-2">{name}</h3>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <p className="text-base md:text-lg lg:text-xl text-green-700 font-semibold">{role}</p>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute top-0 left-0 text-4xl md:text-5xl lg:text-6xl text-green-200 leading-none">"</div>
        <p className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl italic pl-6 md:pl-8 lg:pl-10 pr-4 md:pr-6 lg:pr-8 relative z-10">
          {story}
        </p>
        <div className="absolute bottom-0 right-0 text-4xl md:text-5xl lg:text-6xl text-green-200 leading-none transform rotate-180">"</div>
      </div>
      
      <div className="mt-6 lg:mt-8 flex justify-end">
        <div className="text-sm md:text-base lg:text-lg text-green-600 font-medium bg-green-50 px-3 md:px-4 py-1 md:py-2 rounded-full">
          Verified Review
        </div>
      </div>
    </div>
  );
};
