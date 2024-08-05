import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, addDoc } from '../clients/firebase'; // Import Firestore functions

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateDates = () => {
    const { startDate, endDate } = formData;
    return new Date(startDate) <= new Date(endDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDates()) {
      setError('End date must be after start date.');
      return;
    }

    setLoading(true);
    setError(''); // Clear previous error messages
    try {
      // Save leave request to Firestore
      await addDoc(collection(db, 'leaveRequests'), {
        ...formData,
        submittedAt: new Date(),
      });

      // Clear form data
      setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
      });
      navigate('/dashboard/leave-management'); // Redirect to the leave list page after successful submission
    } catch (err) {
      setError('Failed to submit leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Navigate to the previous page or change this to a specific route
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Leave Request</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="leaveType" className="block text-gray-700 dark:text-gray-200">Leave Type</label>
          <select
            id="leaveType"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="">Select Leave Type</option>
            <option value="sick">Sick Leave</option>
            <option value="vacation">Vacation Leave</option>
            <option value="personal">Personal Leave</option>
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className="block text-gray-700 dark:text-gray-200">Start Date</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-gray-700 dark:text-gray-200">End Date</label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div>
          <label htmlFor="reason" className="block text-gray-700 dark:text-gray-200">Reason</label>
          <textarea
            id="reason"
            name="reason"
            rows="4"
            value={formData.reason}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="w-1/2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`w-1/2 ml-2 p-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequest;
