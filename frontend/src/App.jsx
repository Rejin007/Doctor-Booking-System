import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import DoctorListing from './pages/DoctorListing';
import DoctorDetail from './pages/DoctorDetail';
import MyAppointments from './pages/MyAppointments';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorManagement from './pages/admin/DoctorManagement';
import AppointmentManagement from './pages/admin/AppointmentManagement';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/doctors" replace />} />
        <Route path="/doctors" element={<DoctorListing />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/my-appointments" element={<MyAppointments />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute>
              <DoctorManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute>
              <AppointmentManagement />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<Navigate to="/doctors" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;