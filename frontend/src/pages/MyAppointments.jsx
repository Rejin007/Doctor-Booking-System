import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentsAPI } from '../services/api';
import Navbar from '../components/Navbar';

export default function MyAppointments() {
  const navigate = useNavigate();
  const [contactNumber, setContactNumber] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!contactNumber.trim()) {
      setError('Please enter your contact number');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(false);

    try {
      const data = await appointmentsAPI.getMyAppointments(contactNumber.trim());
      setAppointments(data);
      setSearched(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
      setAppointments([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          label: 'Confirmed',
          message: 'Your appointment is confirmed!',
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          label: 'Pending',
          message: 'Waiting for confirmation',
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          label: 'Cancelled',
          message: 'This appointment has been cancelled',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          label: status,
          message: '',
        };
    }
  };

  const isUpcoming = (date, time) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    return appointmentDateTime > new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Common Navbar */}
      <Navbar variant="public" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-4">
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Find Your Appointments
            </h2>
            <p className="text-gray-600">
              Enter the contact number you used when booking
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Searching...
                </span>
              ) : (
                'View My Appointments'
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {searched && (
          <div>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  No Appointments Found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any appointments with this contact number.
                </p>
                <button
                  onClick={() => navigate('/doctors')}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book an Appointment
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    Your Appointments ({appointments.length})
                  </h3>
                </div>

                <div className="space-y-4">
                  {appointments.map((appointment) => {
                    const statusConfig = getStatusConfig(appointment.status);
                    const upcoming = isUpcoming(
                      appointment.appointment_date,
                      appointment.appointment_time
                    );

                    return (
                      <div
                        key={appointment.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
                      >
                        {/* Status Header */}
                        <div
                          className={`px-6 py-3 border-b flex items-center justify-between ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-50 border-green-200'
                              : appointment.status === 'pending'
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full border ${statusConfig.color}`}
                            >
                              <span>{statusConfig.icon}</span>
                              {statusConfig.label}
                            </span>
                            {upcoming && appointment.status !== 'cancelled' && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                                Upcoming
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            Booked: {new Date(appointment.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Doctor Info */}
                            <div>
                              <div className="flex items-center gap-3 mb-4">
                                <div>
                                  <p className="text-xs text-gray-500 font-medium uppercase">
                                    Doctor
                                  </p>
                                  <p className="text-lg font-bold text-gray-900">
                                    Dr. {appointment.doctor.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {appointment.doctor.specialization}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-700">
                                  <span className="text-sm font-medium">
                                    {appointment.patient_name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                  <span className="text-sm font-medium">
                                    {appointment.patient_contact}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Appointment Details */}
                            <div>
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                <div className="flex items-center gap-2 mb-3">
                                  <p className="text-xs font-bold text-gray-600 uppercase">
                                    Appointment Details
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <div>
                                    <p className="text-xs text-gray-600">Date</p>
                                    <p className="text-sm font-bold text-gray-900">
                                      {formatDate(appointment.appointment_date)}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-gray-600">Time</p>
                                    <p className="text-sm font-bold text-gray-900">
                                      {formatTime(appointment.appointment_time)}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-gray-600">Type</p>
                                    <span className="inline-flex items-center gap-1 mt-1 px-3 py-1 bg-white text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                                      <span>
                                        {appointment.consultation_type === 'online'
                                         }
                                      </span>
                                      <span className="capitalize">
                                        {appointment.consultation_type}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {statusConfig.message && (
                                <p className="mt-3 text-xs text-gray-600 italic">
                                  {statusConfig.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}