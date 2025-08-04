import React, { useState, useEffect, useRef } from 'react';

const GoogleTranslateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reinitialize Google Translate when dropdown opens
  useEffect(() => {
    if (isOpen && window.reinitializeGoogleTranslate) {
      window.reinitializeGoogleTranslate();
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Translate Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg transition-all duration-200 text-white text-sm font-medium"
      >
        <span className="text-lg">🌐</span>
        <span className="hidden sm:inline">Translate</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 transform transition-all duration-200 origin-top-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3">
            <div className="flex items-center space-x-2 text-white">
              <span className="text-lg">🌐</span>
              <div>
                <h3 className="font-semibold text-sm">Select Language</h3>
                <p className="text-xs text-blue-100">Choose your preferred language</p>
              </div>
            </div>
          </div>

          {/* Google Translate Widget Container */}
          <div className="p-4">
            <div className="text-gray-700 text-sm mb-3">
              Translate this page to:
            </div>
            
            {/* Container for Google Translate */}
            <div id="google_translate_element_dropdown" className="w-full">
              {/* This will be populated by Google Translate */}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Powered by Google Translate</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleTranslateButton;
