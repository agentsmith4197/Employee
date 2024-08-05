import React, { useEffect, useState } from 'react';
import { db, collection, getDocs, setDoc, doc } from '../clients/firebase';

const TakeAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('Present');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesCollectionRef = collection(db, 'staff');
        const snapshot = await getDocs(employeesCollectionRef);

        const employeeList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEmployees(employeeList);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setError('Please select an employee.');
      return;
    }
    setError('');

    const employeeName = employees.find(emp => emp.id === selectedEmployee).name;

    try {
      await setDoc(doc(db, 'attendance', `${Date.now()}_${selectedEmployee}`), {
        employeeId: selectedEmployee,
        employeeName,
        status: attendanceStatus,
        timestamp: new Date(),
      });

      setSuccessMessage(`Attendance for ${employeeName} marked as ${attendanceStatus}.`);
      setSelectedEmployee('');
      setAttendanceStatus('Present');
    } catch (err) {
      setError('Failed to mark attendance. Please try again.');
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Take Attendance</h2>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="employee" className="block text-gray-700 dark:text-gray-200">Select Employee</label>
          <select
            id="employee"
            name="employee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="">--Select Employee--</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-gray-700 dark:text-gray-200">Attendance Status</label>
          <select
            id="status"
            name="status"
            value={attendanceStatus}
            onChange={(e) => setAttendanceStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Mark Attendance
        </button>
      </form>
    </div>
  );
};

export default TakeAttendance;
