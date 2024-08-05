import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md focus:outline-none focus:ring"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m8.66-10.66l-.87.87M4.93 19.07l-.87.87M21 12h-1M4 12H3m14.66 4.66l-.87.87M6.34 6.34l-.87.87M12 4a8 8 0 100 16 8 8 0 000-16z"></path>
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.293 13.293a8 8 0 01-11.032-11.032A10 10 0 1117.293 13.293z"></path>
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
