import React, { useState, useEffect } from 'react';
import { adminDoctorsAPI } from '../../services/api';
import Navbar from '../../components/Navbar';

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    bio: '',
    years_of_experience: '',
    consultation_modes: [],
    is_active: true,
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await adminDoctorsAPI.getAll();
      setDoctors(data);
    } catch (err) {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        specialization: doctor.specialization,
        bio: doctor.bio,
        years_of_experience: doctor.years_of_experience,
        consultation_modes: doctor.consultation_modes ?? [],
        is_active: doctor.is_active ?? true,
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '',
        specialization: '',
        bio: '',
        years_of_experience: '',
        consultation_modes: [],
        is_active: true,
      });
    }
    setShowModal(true);
    setError('');
    setSuccessMessage('');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDoctor(null);
    setError('');
  };

  const handleConsultationModeToggle = (mode) => {
    setFormData((prev) => ({
      ...prev,
      consultation_modes: prev.consultation_modes.includes(mode)
        ? prev.consultation_modes.filter((m) => m !== mode)
        : [...prev.consultation_modes, mode],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.consultation_modes.length === 0) {
      setError('Please select at least one consultation mode');
      return;
    }

    try {
      if (editingDoctor) {
        await adminDoctorsAPI.update(editingDoctor.id, formData);
        setSuccessMessage('Doctor updated successfully!');
      } else {
        await adminDoctorsAPI.create(formData);
        setSuccessMessage('Doctor added successfully!');
      }
      closeModal();
      fetchDoctors();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save doctor');
    }
  };

  const toggleActive = async (doctor) => {
    try {
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === doctor.id ? { ...d, is_active: !doctor.is_active } : d
        )
      );
      await adminDoctorsAPI.toggleActive(doctor.id, !doctor.is_active);
    } catch (err) {
      setError('Failed to update doctor status');
      fetchDoctors();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Common Navbar */}
      <Navbar variant="admin" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Manage Doctors</h2>
            <p className="text-gray-600 mt-1">Add, edit, and manage healthcare professionals</p>
          </div>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add Doctor
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-b-4 border-blue-400 opacity-20"></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-xl">
                            <span>
                              {doctor?.name?.charAt(0).toUpperCase()}
                            </span>

                          </div>
                          <div className="font-semibold text-gray-900">Dr. {doctor.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                          {doctor.specialization}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {doctor.years_of_experience} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doctor.is_active === true ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openModal(doctor)}
                          className="text-blue-600 hover:text-blue-900 font-semibold mr-4 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive(doctor)}
                          className={`font-semibold transition-colors ${
                            doctor.is_active === true
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {doctor.is_active === true ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">
                {editingDoctor ? ' Edit Doctor' : ' Add New Doctor'}
              </h2>
              <button 
                onClick={closeModal} 
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter doctor's full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Specialization *</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Cardiologist, Dermatologist"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience *</label>
                <input
                  type="number"
                  min="0"
                  max="70"
                  value={formData.years_of_experience}
                  onChange={(e) => setFormData({ ...formData, years_of_experience: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter years of experience"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bio *</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Brief description about the doctor..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Consultation Modes *</label>
                <div className="space-y-3">
                  {['online', 'in-person'].map((mode) => (
                    <label 
                      key={mode} 
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.consultation_modes.includes(mode)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.consultation_modes.includes(mode)}
                        onChange={() => handleConsultationModeToggle(mode)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-900 font-semibold capitalize flex items-center gap-2">
                        <span className="text-xl">{mode === 'online'}</span>
                        {mode}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all"
                >
                  {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}