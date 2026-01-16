import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminAuthAPI } from '../services/api';

export default function Navbar({ variant = 'public' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = variant === 'admin';
  const isAuthenticated = adminAuthAPI.isAuthenticated();

  const handleLogout = () => {
    adminAuthAPI.logout();
    navigate('/admin/login');
  };

  // Check if current route is active
  const isActive = (path) => location.pathname === path;

  // Public Navigation Links
  const publicLinks = [
    { path: '/doctors', label: 'Find Doctors' },
    { path: '/my-appointments', label: 'My Appointments' },
  ];

  // Admin Navigation Links
  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/doctors', label: 'Doctors' },
    { path: '/admin/appointments', label: 'Appointments'},
  ];

  const links = isAdmin ? adminLinks : publicLinks;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div 
            onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/doctors')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            
            <div>
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {isAdmin ? 'Admin Panel' : 'HealthCare'}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                {isAdmin ? 'Management System' : 'Booking System'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-lg transition-colors border border-red-200"
              >
                Logout
              </button>
            ) : !isAdmin ? (
              <button
                onClick={() => navigate('/admin/login')}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Admin Login
              </button>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {links.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </button>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                {isAdmin && isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-lg transition-colors border border-red-200"
                  >
                    Logout
                  </button>
                ) : !isAdmin ? (
                  <button
                    onClick={() => {
                      navigate('/admin/login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition-colors border border-gray-200"
                  >
                    Admin Login
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}