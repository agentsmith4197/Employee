import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, collection, getDocs } from '../clients/firebase';

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        // Reference to the 'staff' collection in db
        const staffCollection = collection(db, 'staff');
        // Fetch all documents in the 'staff' collection
        const staffSnapshot = await getDocs(staffCollection);
        // Map through the snapshot and extract data
        const staffData = staffSnapshot.docs.map(doc => ({
          id: doc.id, // Include the document ID
          ...doc.data(),
        }));
        // Update state with the fetched data
        setStaffList(staffData);
      } catch (err) {
        setError('Failed to load staff list.');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffList();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Staff List</h2>
      <Link to="/dashboard/add-staff" className="mb-4 inline-block bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
        Add New Staff
      </Link>
      <table className="w-full border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-2 border border-gray-300 dark:border-gray-600">Name</th>
            <th className="p-2 border border-gray-300 dark:border-gray-600">Email</th>
            <th className="p-2 border border-gray-300 dark:border-gray-600">Position</th>
            <th className="p-2 border border-gray-300 dark:border-gray-600">Department</th>
            <th className="p-2 border border-gray-300 dark:border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="p-2 border border-gray-300 dark:border-gray-600">{staff.name}</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{staff.email}</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{staff.position}</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{staff.department}</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">
                <Link to={`/edit-staff/${staff.id}`} className="text-blue-500 hover:underline dark:text-blue-400">
                  Edit
                </Link>
                {' | '}
                <button className="text-red-500 hover:underline dark:text-red-400">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffList;
