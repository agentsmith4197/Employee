import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage, db, ref, uploadBytes, getDownloadURL, auth, onAuthStateChanged, setDoc, doc, collection } from '../clients/firebase';

const AddStaff = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email address is invalid';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!image) newErrors.image = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user) {
        setError('User is not authenticated. Please log in.');
        return;
    }

    setLoading(true);
    try {
        const imageRef = ref(storage, `staffImages/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image); // Upload the image
        const imageUrl = await getDownloadURL(imageRef); // Get the image URL

        // Create a new document reference with a unique ID
        const staffDocRef = doc(collection(db, 'staff')); // Creates a reference to a new document in the 'staff' collection
        await setDoc(staffDocRef, {
            name: formData.name,
            email: formData.email,
            position: formData.position,
            department: formData.department,
            imageUrl,
            createdAt: new Date(),
        });

        // Clear the form
        setFormData({
            name: '',
            email: '',
            position: '',
            department: '',
        });
        setImage(null);
        setPreviewUrl(null);
        navigate('/dashboard/staff-list'); // Navigate to staff list
    } catch (err) {
        console.error('Error adding staff:', err); // Log the error for debugging
        setError('Failed to add staff. Please try again.'); // Show a generic error message
    } finally {
        setLoading(false);
    }
};
  const handleCancel = () => {
    navigate('/dashboard/staff-list');
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Add New Staff</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
        <div>
          <label htmlFor="image" className="block text-gray-700 dark:text-gray-200">Upload Image</label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
        </div>
        {previewUrl && (
          <div className="mt-4">
            <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-md" />
          </div>
        )}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-blue-300"
          >
            {loading ? 'Adding...' : 'Add Staff'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;
