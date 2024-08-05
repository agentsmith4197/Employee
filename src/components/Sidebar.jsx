import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signOut } from '../clients/firebase'; // Adjust the import based on your actual file path

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Sign out the user
      await signOut(auth); // Use auth instance from Firebase config

      // Redirect to login page
      navigate('/login'); // Update this path based on your routing configuration
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle any errors that occur during logout
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white space-y-6 py-7 px-2 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out dark:bg-gray-900 flex flex-col`}
    >
      <button
        onClick={toggleSidebar}
        className="md:hidden absolute top-4 right-4 p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Close Sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <nav aria-label="Sidebar" className="flex-1">
        <Link
          to="/dashboard"
          className="block py-2.5 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-800"
          onClick={toggleSidebar}
        >
          Dashboard
        </Link>
        <Link
          to="/dashboard/employee-dashboard"
          className="block py-2.5 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-800"
          onClick={toggleSidebar}
        >
          Employees
        </Link>
        <Link
          to="/dashboard/attendance-management"
          className="block py-2.5 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-800"
          onClick={toggleSidebar}
        >
          Attendance
        </Link>
        <Link
          to="/dashboard/leave-management"
          className="block py-2.5 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-800"
          onClick={toggleSidebar}
        >
          Leave Management
        </Link>
        <Link
          to="/dashboard/payroll-list"
          className="block py-2.5 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-800"
          onClick={toggleSidebar}
        >
          Payroll Management
        </Link>
      </nav>
      <button
        onClick={handleLogout}
        className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800 mb-4"
        aria-label="Logout"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
