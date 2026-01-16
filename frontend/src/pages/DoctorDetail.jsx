import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorsAPI } from '../services/api';
import BookingFlow from '../components/BookingFlow';
import Navbar from '../components/Navbar';

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await doctorsAPI.getById(id);
      setDoctor(data);
    } catch (err) {
      setError(err.message || 'Failed to load doctor details');
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar variant="public" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin h-14 w-14 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Loading doctor profile…</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar variant="public" />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md text-center">
            <h2 className="text-2xl font-bold mb-3">Doctor Not Found</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/doctors')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Doctors
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Booking Screen
  if (showBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar variant="public" />
        <BookingFlow doctor={doctor} onClose={() => setShowBooking(false)} />
      </div>
    );
  }

  // Main UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Common Navbar */}
      <Navbar variant="public" />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 flex items-center gap-6">
           

            <div>
              <h1 className="text-4xl font-bold text-white">
                Dr. {doctor.name}
              </h1>
              <p className="text-blue-100 text-xl">{doctor.specialization}</p>

              {doctor.is_available === true ? (
                <span className="inline-block mt-3 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold">
                  Available
                </span>
              ) : (
                <span className="inline-block mt-3 px-4 py-2 bg-gray-500 text-white rounded-full text-sm font-bold">
                  Currently Unavailable
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Experience */}
              <div className="bg-blue-50 rounded-xl p-6 border">
                <h3 className="font-semibold text-gray-700 mb-2">Experience</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {doctor.years_of_experience} years
                </p>
              </div>

              {/* Consultation Modes */}
              <div className="bg-green-50 rounded-xl p-6 border">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Consultation Options
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.consultation_modes?.map((mode) => (
                    <span
                      key={mode}
                      className="px-4 py-2 bg-white border rounded-lg font-semibold"
                    >
                      {mode === 'online' ? ' Online' : ' In-Person'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio */}
            {doctor.bio && (
              <div className="bg-gray-50 p-6 rounded-xl border mb-8">
                <h3 className="text-xl font-bold mb-3">
                  About Dr. {doctor.name}
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {doctor.bio}
                </p>
              </div>
            )}

            {/* Booking */}
            <div className="border-t pt-6">
              {doctor.is_available === true ? (
                <>
                  <h3 className="text-xl font-bold mb-4">
                    Ready to book an appointment?
                  </h3>
                  <button
                    onClick={() => setShowBooking(true)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:scale-105 transition"
                  >
                     Book Appointment
                  </button>
                </>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="font-semibold text-yellow-800">
                    This doctor is currently unavailable for booking.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}