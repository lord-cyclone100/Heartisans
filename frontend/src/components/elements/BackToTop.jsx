import React, { useState, useEffect } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-opacity-50"
          style={{
            backgroundColor: '#479626',
            color: 'white',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'bounce-gentle 2s infinite'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#3a7a1f';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#479626';
          }}
          aria-label="Back to top"
          title="Back to top"
        >
          <svg
            className="w-6 h-6 transition-transform duration-300 group-hover:translate-y-[-2px]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
      
      <style>
        {`
          @keyframes bounce-gentle {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-3px);
            }
            60% {
              transform: translateY(-2px);
            }
          }
        `}
      </style>
    </>
  );
};

export default BackToTop;
