import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, addDoc, updateDoc, doc } from '../clients/firebase'; // Import Firestore functions

const AddPayroll = () => {
  const [formData, setFormData] = useState({
    staffName: '',
    salary: '',
    month: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.staffName) newErrors.staffName = 'Staff Name is required';
    if (!formData.salary) newErrors.salary = 'Salary is required';
    if (!formData.month) newErrors.month = 'Month is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop form submission if validation fails

    setLoading(true);
    try {
      // Add payroll data to Firestore
      const payrollRef = collection(db, 'payrolls'); // Reference to the payrolls collection
      const newPayrollDoc = await addDoc(payrollRef, {
        staffName: formData.staffName,
        salary: parseFloat(formData.salary), // Ensure salary is a number
        month: formData.month,
        createdAt: new Date(), // Optional: Add a timestamp
      });

      // Update the staff member's payment record in the staff collection (assuming there's a payment field)
      const staffDocRef = doc(db, 'staff', formData.staffName); // Reference to the staff document
      await updateDoc(staffDocRef, {
        availablePayment: firebase.firestore.FieldValue.increment(parseFloat(formData.salary)), // Increment the available payment
      });

      // Clear form data and navigate to another page
      setFormData({
        staffName: '',
        salary: '',
        month: '',
      });
      navigate('/dashboard/payroll-list'); // Redirect to the payroll list page or another page after successful submission
    } catch (err) {
      setError('Failed to add payroll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/payroll-list'); // Redirect to the payroll list page or another page
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Add New Payroll</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="staffName" className="block text-gray-700 dark:text-gray-200">Staff Name</label>
          <input
            id="staffName"
            name="staffName"
            type="text"
            value={formData.staffName}
            onChange={handleChange}
            className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 ${errors.staffName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.staffName && <p className="text-red-500 text-sm">{errors.staffName}</p>}
        </div>
        <div>
          <label htmlFor="salary" className="block text-gray-700 dark:text-gray-200">Salary</label>
          <input
            id="salary"
            name="salary"
            type="text"
            value={formData.salary}
            onChange={handleChange}
            className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 ${errors.salary ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
        </div>
        <div>
          <label htmlFor="month" className="block text-gray-700 dark:text-gray-200">Month</label>
          <input
            id="month"
            name="month"
            type="text"
            value={formData.month}
            onChange={handleChange}
            className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 ${errors.month ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.month && <p className="text-red-500 text-sm">{errors.month}</p>}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-blue-300"
          >
            {loading ? 'Adding...' : 'Add Payroll'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPayroll;
