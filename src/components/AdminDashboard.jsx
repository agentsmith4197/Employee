import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../clients/firebase'; // Adjust the import based on your file structure

const AdminDashboard = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const staffCollection = collection(db, "staff");
        const staffSnapshot = await getDocs(staffCollection);
        const staffList = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStaffData(staffList);
      } catch (err) {
        setError("Failed to load staff data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Calculate statistics
  const totalStaff = staffData.length;
  const presentCount = staffData.filter(s => s.attendance === "Present").length;
  const absentCount = staffData.filter(s => s.attendance === "Absent").length;
  const staffOnLeave = staffData.filter(s => s.onLeave === true); // Assuming onLeave is a boolean

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h2>
        <Link
          to="/dashboard/add-staff"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Add Staff
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Total Staff</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalStaff}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-700 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Present</h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-100">{presentCount}</p>
        </div>
        <div className="bg-red-100 dark:bg-red-700 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Absent</h3>
          <p className="text-2xl font-bold text-red-800 dark:text-red-100">{absentCount}</p>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-200">Staff on Leave</h3>
        <ul className="list-disc list-inside">
          {staffOnLeave.length > 0 ? (
            staffOnLeave.map((staff) => (
              <li key={staff.id} className="mb-2 text-gray-900 dark:text-gray-300">
                {staff.name} - {staff.role}
              </li>
            ))
          ) : (
            <li className="text-gray-500 dark:text-gray-400">No staff on leave</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
