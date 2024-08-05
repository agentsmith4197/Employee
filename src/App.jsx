import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./components/Signup";
import Login from "./components/Login";
import EmployeeDashboard from "./components/EmployeeDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AttendanceManagement from "./components/AttendanceManagement";
import LeaveManagement from "./components/LeaveManagement";
import StaffList from "./components/StaffList";
import AddStaff from "./components/AddStaff";
import PayrollManagement from "./components/PayrollManagement";
import AddPayroll from "./components/AddPayroll";
import LeaveRequest from "./components/LeaveRequest";
import MainLayout from "./Layout";
import PublicLayout from "./PublicLayout";
import EditStaff from "./components/EditStaff";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import { ThemeProvider } from "./contexts/ThemeContext";
import TakeAttendance from "./components/TakeAttendance"

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<SignUp />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Protected routes */}
        <Route path="dashboard" element={<PrivateRoute element={<MainLayout />} />}>
          <Route index element={<AdminDashboard />} />
          <Route path="employee-dashboard" element={<EmployeeDashboard />} />
          
          <Route path="attendance-management"  element={<AttendanceManagement />}  />
          <Route path="leave-management"  element={<LeaveManagement />} />
          <Route path="staff-list"  element={<StaffList />} />
          <Route path="add-staff"  element={<AddStaff />} />
          <Route path="payroll-list"  element={<PayrollManagement />} />
          <Route path="add-payroll"  element={<AddPayroll />} />
          <Route path="leave-request"  element={<LeaveRequest />} />
          <Route path="take-attendance"  element={<TakeAttendance />} />
          <Route path="edit-staff/:id"  element={<EditStaff />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
