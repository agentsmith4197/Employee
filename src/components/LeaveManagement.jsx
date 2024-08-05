import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db, collection, getDocs, updateDoc, doc } from '../clients/firebase'; // Import Firestore functions

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]); // State to hold leave requests
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(''); // State to manage error messages

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const leaveCollectionRef = collection(db, 'leaveRequests'); // Reference to the leaveRequests collection
        const snapshot = await getDocs(leaveCollectionRef); // Fetch documents from the collection

        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLeaveRequests(requests); // Set the leave requests to state
      } catch (error) {
        setError('Error fetching leave requests.'); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchLeaveRequests(); // Call the function to fetch leave requests
  }, []);

  const handleApproval = async (id) => {
    try {
      const leaveDocRef = doc(db, 'leaveRequests', id); // Reference to the specific leave request
      await updateDoc(leaveDocRef, { status: 'Approved' }); // Update the status to Approved

      setLeaveRequests((requests) =>
        requests.map((request) =>
          request.id === id ? { ...request, status: 'Approved' } : request
        )
      );
    } catch (error) {
      setError('Error approving leave request.'); // Handle errors during approval
    }
  };

  const handleRejection = async (id) => {
    try {
      const leaveDocRef = doc(db, 'leaveRequests', id); // Reference to the specific leave request
      await updateDoc(leaveDocRef, { status: 'Rejected' }); // Update the status to Rejected

      setLeaveRequests((requests) =>
        requests.map((request) =>
          request.id === id ? { ...request, status: 'Rejected' } : request
        )
      );
    } catch (error) {
      setError('Error rejecting leave request.'); // Handle errors during rejection
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Leave Management</h2>
      {loading && <p className="text-gray-500 dark:text-gray-400">Loading leave requests...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <Link
          to="/dashboard/leave-request"
          className="inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Request Leave
        </Link>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">Leave Requests</h3>
        {leaveRequests.length > 0 ? (
          <ul className="list-disc list-inside">
            {leaveRequests.map((request) => (
              <li key={request.id} className="mb-2 dark:text-gray-200">
                {request.name} requested {request.days} days - Status: {request.status}
                <button
                  onClick={() => handleApproval(request.id)}
                  className="ml-4 bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition duration-300 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejection(request.id)}
                  className="ml-2 bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition duration-300 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Reject
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No leave requests found.</p>
        )}
      </div>
    </div>
  );
};

export default LeaveManagement;
