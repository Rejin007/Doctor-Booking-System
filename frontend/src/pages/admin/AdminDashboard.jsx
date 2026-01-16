import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAppointmentsAPI } from '../../services/api';
import Navbar from '../../components/Navbar';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminAppointmentsAPI.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Common Navbar */}
      <Navbar variant="admin" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Monitor your booking system performance</p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-b-4 border-blue-400 opacity-20"></div>
            </div>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Appointments */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                
                <div className="text-right">
                  <p className="text-blue-100 text-sm font-medium">Total</p>
                  <p className="text-4xl font-bold">{stats.total_appointments}</p>
                </div>
              </div>
              <p className="text-blue-100 font-medium">Total Appointments</p>
            </div>

            {/* Pending */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                
                <div className="text-right">
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-4xl font-bold">{stats.pending}</p>
                </div>
              </div>
              <p className="text-yellow-100 font-medium">Awaiting Confirmation</p>
            </div>

            {/* Confirmed */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                
                <div className="text-right">
                  <p className="text-green-100 text-sm font-medium">Confirmed</p>
                  <p className="text-4xl font-bold">{stats.confirmed}</p>
                </div>
              </div>
              <p className="text-green-100 font-medium">Confirmed Bookings</p>
            </div>

            {/* Today */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                
                <div className="text-right">
                  <p className="text-purple-100 text-sm font-medium">Today</p>
                  <p className="text-4xl font-bold">{stats.today_appointments}</p>
                </div>
              </div>
              <p className="text-purple-100 font-medium">Today's Appointments</p>
            </div>
          </div>
        ) : null}

        {/* Quick Actions */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/admin/doctors"
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-300 transform hover:-translate-y-1"
            >
              <div className="p-8">
                <div className="flex items-center gap-6 mb-6">
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Manage Doctors</h3>
                    <p className="text-gray-600">Add, edit, or remove doctors</p>
                  </div>
                </div>
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
                  Go to Doctors 
                  <span className="ml-2 group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/appointments"
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-green-300 transform hover:-translate-y-1"
            >
              <div className="p-8">
                <div className="flex items-center gap-6 mb-6">
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Manage Appointments</h3>
                    <p className="text-gray-600">View and update appointments</p>
                  </div>
                </div>
                <div className="flex items-center text-green-600 font-semibold group-hover:gap-3 transition-all">
                  Go to Appointments 
                  <span className="ml-2 group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}