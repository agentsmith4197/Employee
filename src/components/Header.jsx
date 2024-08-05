// src/components/Header.js
import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">NNPC Staff Management</h1>
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden p-2 rounded-md focus:outline-none focus:bg-gray-700"
          aria-label="Toggle Sidebar"
        >        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
};
export default Header;
