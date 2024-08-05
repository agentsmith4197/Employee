import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, collection, getDocs } from '../clients/firebase'; // Import Firestore functions

const PayrollManagement = () => {
  const [payrollList, setPayrollList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayrollList = async () => {
      try {
        const payrollRef = collection(db, 'payrolls'); // Reference to the payrolls collection
        const payrollSnapshot = await getDocs(payrollRef);
        
        // Map through the documents and extract data
        const data = payrollSnapshot.docs.map((doc) => ({
          id: doc.id, // Get the document ID
          ...doc.data(), // Spread the document data
        }));
        
        setPayrollList(data); // Set the fetched data to state
      } catch (err) {
        setError('Failed to load payroll list.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollList();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Payroll Management</h2>
      <Link to="/dashboard/add-payroll" className="mb-4 inline-block bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
        Add New Payroll
      </Link>
      <table className="w-full border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-2 border border-gray-300 dark:border-gray-600">Staff Name</th>
            <th className="p-2 border border-gray-300 dark:border-gray-600">Salary</th>
            <th className="p-2 border border-gray-300 dark:border-gray-600">Month</th>
            <th className="p-2 border border-gray-300 dark:border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrollList.map((payroll) => (
            <tr key={payroll.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="p-2 border border-gray-300 dark:border-gray-600">{payroll.staffName}</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{`$${payroll.salary}`}</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{payroll.month}</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">
                <Link to={`/edit-payroll/${payroll.id}`} className="text-blue-500 hover:underline dark:text-blue-400">
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

export default PayrollManagement;
