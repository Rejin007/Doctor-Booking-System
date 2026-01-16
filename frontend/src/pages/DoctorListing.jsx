import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorsAPI } from '../services/api';
import Navbar from '../components/Navbar';

export default function DoctorListing() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecializations();
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialization]);

  const fetchSpecializations = async () => {
    try {
      const data = await doctorsAPI.getSpecializations();
      setSpecializations(data);
    } catch (err) {
      console.error('Error fetching specializations:', err);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await doctorsAPI.getAll(selectedSpecialization);
      setDoctors(data);
    } catch (err) {
      setError(err.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Common Navbar */}
      <Navbar variant="public" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Find Your Perfect Doctor
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book appointments with experienced healthcare professionals in just a few clicks
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                 Filter by Specialization
              </label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 font-medium"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            {selectedSpecialization && (
              <button
                onClick={() => setSelectedSpecialization('')}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors mt-auto"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-b-4 border-blue-400 opacity-20"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div>
                <h3 className="text-red-800 font-semibold">Error Loading Doctors</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Doctors Found</h3>
            <p className="text-gray-600">
              {selectedSpecialization 
                ? `No doctors available for ${selectedSpecialization}`
                : 'No doctors are currently available. Please check back later.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                Showing <span className="font-bold text-gray-900">{doctors.length}</span> {doctors.length === 1 ? 'doctor' : 'doctors'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() => navigate(`/doctors/${doctor.id}`)}
                  className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-300 transform hover:-translate-y-1"
                >
                  {/* Card Header with Status */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-2">
                        
                        {doctor.is_available ? (
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            Available
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-full shadow-md">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-white mt-3">
                        Dr. {doctor.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                        {doctor.specialization}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <span className="text-sm font-medium">
                          {doctor.years_of_experience} years experience
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Consultation Modes
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {doctor.consultation_modes?.map((mode) => (
                            <span
                              key={mode}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200"
                            >
                              <span>{mode === 'online'}</span>
                              {mode === 'online' ? 'Online' : 'In-Person'}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                      View Profile & Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © 2026 HealthCare Booking System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}