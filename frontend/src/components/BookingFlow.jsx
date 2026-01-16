import React, { useEffect, useState } from "react";
import { appointmentsAPI } from "../services/api";

export default function BookingFlow({ doctor, onClose }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [time, setTime] = useState("");
  const [consultationType, setConsultationType] = useState(
    doctor.consultation_modes?.[0] || "online"
  );

  const [patientName, setPatientName] = useState("");
  const [patientContact, setPatientContact] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  // Fetch available slots
  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      try {
        const res = await appointmentsAPI.getAvailableSlots(
          doctor.id,
          date
        );
        setAvailableSlots(res.available_slots || []);
      } catch (err) {
        setError(err.message || "Failed to load slots");
      }
    };

    fetchSlots();
  }, [date, doctor.id]);

  // Submit booking
  const submitBooking = async () => {
    setError("");
    setLoading(true);

    try {
      const payload = {
        doctor: doctor.id,
        patient_name: patientName,
        patient_contact: patientContact,
        consultation_type: consultationType, 
        appointment_date: date,              
        appointment_time: time,             
      };

      const res = await appointmentsAPI.create(payload);
      setSuccess(res.appointment);
    } catch (err) {
        console.error("BOOKING ERROR:", err);

        if (err?.data) {
          setError(
            typeof err.data === "string"
              ? err.data
              : JSON.stringify(err.data, null, 2)
          );
        } else {
          setError(err.message || "Server error. Please try again.");
        }
      }
  };

  // SUCCESS SCREEN
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-green-600">
            Appointment Booked
          </h2>

          <p className="mb-2"><b>Doctor:</b> Dr. {doctor.name}</p>
          <p className="mb-2"><b>Date:</b> {success.appointment_date}</p>
          <p className="mb-2"><b>Time:</b> {success.appointment_time}</p>
          <p className="mb-4"><b>Status:</b> {success.status}</p>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // UI
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">
          Book Appointment - Dr. {doctor.name}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-300 p-3 mb-4 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {/* STEP 1: DATE */}
        {step === 1 && (
          <>
            <label className="block mb-2 font-semibold">Select Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded mb-4"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button
              disabled={!date}
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Next
            </button>
          </>
        )}

        {/* STEP 2: TIME */}
        {step === 2 && (
          <>
            <label className="block mb-2 font-semibold">
              Select Time Slot
            </label>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`border p-2 rounded ${
                    time === slot
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border py-2 rounded"
              >
                Back
              </button>
              <button
                disabled={!time}
                onClick={() => setStep(3)}
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* STEP 3: DETAILS */}
        {step === 3 && (
          <>
            <label className="block mb-2 font-semibold">
              Consultation Type
            </label>
            <select
              className="w-full border p-2 rounded mb-4"
              value={consultationType}
              onChange={(e) => setConsultationType(e.target.value)}
            >
              {doctor.consultation_modes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>

            <label className="block mb-2 font-semibold">Your Name</label>
            <input
              className="w-full border p-2 rounded mb-3"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />

            <label className="block mb-2 font-semibold">Contact</label>
            <input
              className="w-full border p-2 rounded mb-4"
              value={patientContact}
              onChange={(e) => setPatientContact(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border py-2 rounded"
              >
                Back
              </button>
              <button
                disabled={loading}
                onClick={submitBooking}
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
