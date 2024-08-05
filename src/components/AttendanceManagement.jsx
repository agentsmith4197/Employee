import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, collection, getDocs } from '../clients/firebase'; // Import Firestore functions

const AttendanceManagement = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]); // State to hold attendance records
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(''); // State to manage error messages
  const [searchTerm, setSearchTerm] = useState(''); // State to manage search term

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const attendanceCollectionRef = collection(db, 'attendance'); // Reference to the attendance collection
        const snapshot = await getDocs(attendanceCollectionRef); // Fetch documents from the collection

        const records = await Promise.all(snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const employeeDoc = await getDocs(collection(db, 'staff')); // Fetch staff data to get names and positions
          const employeeData = employeeDoc.docs.find(emp => emp.id === data.employeeId)?.data(); // Find the corresponding employee data

          return {
            id: doc.id,
            ...data,
            employeeName: employeeData ? employeeData.name : 'Unknown', // Get employee name
            employeePosition: employeeData ? employeeData.position : 'Unknown', // Get employee position
          };
        }));

        setAttendanceRecords(records); // Set the attendance records to state
      } catch (error) {
        setError('Error fetching attendance records.'); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchAttendanceRecords(); // Call the function to fetch attendance records
  }, []);

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Filter attendance records based on the search term
  const filteredRecords = attendanceRecords.filter(record =>
    record.employeeName.toLowerCase().includes(searchTerm) ||
    record.employeePosition.toLowerCase().includes(searchTerm) ||
    new Date(record.timestamp.seconds * 1000).toLocaleDateString().includes(searchTerm)
  );

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Attendance Management</h2>
      {loading && <p className="text-gray-500 dark:text-gray-400">Loading attendance records...</p>}
      {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
      <input
        type="text"
        placeholder="Search attendance..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200"
      />
      <div>
        <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">Attendance Records</h3>
        {filteredRecords.length > 0 ? (
          <ul className="list-disc list-inside mb-4 dark:text-gray-200">
            {filteredRecords.map((record) => (
              <li key={record.id} className="mb-2">
                {new Date(record.timestamp.seconds * 1000).toLocaleDateString()} - {record.employeeName} ({record.employeePosition}): {record.status}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No attendance records found.</p>
        )}
        <Link
          to="/dashboard/take-attendance"
          className="inline-block py-2.5 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Take Attendance
        </Link>
      </div>
    </div>
  );
};

export default AttendanceManagement;
