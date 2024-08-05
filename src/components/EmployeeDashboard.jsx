import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db, collection, getDocs } from '../clients/firebase'; // Import Firestore functions

const EmployeeDashboard = () => {
  const [staffData, setStaffData] = useState([]); // State to hold staff data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const staffCollectionRef = collection(db, 'staff'); // Reference to the staff collection
        const snapshot = await getDocs(staffCollectionRef); // Fetch documents from the collection

        const staffList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStaffData(staffList); // Set the staff data to state
      } catch (error) {
        console.error('Error fetching staff data:', error); // Log any errors
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchStaffData(); // Call the function to fetch staff data
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show loading message while data is being fetched
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Employee Dashboard</h2>
        <Link
          to="/dashboard/add-staff"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Add Staff
        </Link>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        {staffData.map((staff) => (
          <div key={staff.id} className="mb-4">
            <p className="mb-2 dark:text-gray-200"><strong>Name:</strong> {staff.name}</p>
            <p className="mb-2 dark:text-gray-200"><strong>Email:</strong> {staff.email}</p>
            <p className="mb-2 dark:text-gray-200"><strong>Position:</strong> {staff.position}</p>
            <p className="mb-2 dark:text-gray-200"><strong>Department:</strong> {staff.department}</p>
            <img src={staff.imageUrl} alt={`${staff.name}'s avatar`} className="w-16 h-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
