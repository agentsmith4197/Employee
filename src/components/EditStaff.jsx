import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, doc, getDoc, updateDoc } from '../clients/firebase';

const EditStaff = () => {
  const { id } = useParams(); // Get staff ID from URL parameters
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const staffDoc = doc(db, 'staff', id);
        const staffSnapshot = await getDoc(staffDoc);
        if (staffSnapshot.exists()) {
          setFormData(staffSnapshot.data());
        } else {
          setError('Staff not found.');
        }
      } catch (err) {
        setError('Failed to fetch staff data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email address is invalid';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.department) newErrors.department = 'Department is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const staffDoc = doc(firestore, 'staff', id);
      await updateDoc(staffDoc, formData);
      navigate('/dashboard/staff-list');
    } catch (err) {
      setError('Failed to update staff. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Edit Staff</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-200">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-200">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="position" className="block text-gray-700 dark:text-gray-200">Position</label>
          <input
            id="position"
            name="position"
            type="text"
            value={formData.position}
            onChange={handleChange}
            className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 ${errors.position ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
        </div>
        <div>
          <label htmlFor="department" className="block text-gray-700 dark:text-gray-200">Department</label>
          <input
            id="department"
            name="department"
            type="text"
            value={formData.department}
            onChange={handleChange}
            className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-blue-300"
          >
            {loading ? 'Updating...' : 'Update Staff'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStaff;
