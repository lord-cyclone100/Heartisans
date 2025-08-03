import { useEffect } from 'react';

/**
 * Custom hook to scroll to top of page when component mounts
 * This ensures that when navigating between pages, the new page always starts from the top
 */
export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};
