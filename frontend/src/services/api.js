// ===============================
// Base API URL (Vite compatible)
// ===============================
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// ===============================
// Helper function for API calls
// ===============================
async function apiCall(endpoint, options = {}) {
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Only add body if it exists and method is not GET
  if (options.body && config.method !== 'GET') {
    config.body = options.body;
  }

  // Add JWT token if exists
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    const contentType = response.headers.get('content-type');
    const data =
      contentType && contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    // Auto logout on unauthorized
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      window.location.href = '/admin/login';
    }

    if (!response.ok) {
      console.error('API RESPONSE ERROR:', data);
      throw {
        status: response.status,
        message: data?.detail || JSON.stringify(data),
        data,
      };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error.status
      ? error
      : {
          status: 0,
          message: 'Network error. Please check your connection.',
          data: null,
        };
  }
}

// ===============================
// Public API – Doctors
// ===============================
export const doctorsAPI = {
  getAll: (specialization = '') => {
    const params = specialization
      ? `?specialization=${encodeURIComponent(specialization)}`
      : '';
    return apiCall(`/doctors/${params}`);
  },

  getById: (id) => {
    return apiCall(`/doctors/${id}/`);
  },

  getSpecializations: () => {
    return apiCall('/doctors/specializations/');
  },
};

// ===============================
// Public API – Appointments
// ===============================
export const appointmentsAPI = {
  create: (appointmentData) => {
    return apiCall('/appointments/', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  getAvailableSlots: (doctorId, date) => {
    return apiCall(
      `/appointments/available-slots/?doctor_id=${doctorId}&date=${date}`
    );
  },

  // Get appointments by contact number (for patients)
  getMyAppointments: (contactNumber) => {
    return apiCall(
      `/appointments/my-appointments/?contact=${encodeURIComponent(contactNumber)}`
    );
  },
};

// ===============================
// Admin API – Authentication
// ===============================
export const adminAuthAPI = {
  login: (credentials) => {
    return apiCall('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    window.location.href = '/admin/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },

  saveTokens: (accessToken, refreshToken) => {
    localStorage.setItem('adminToken', accessToken);
    localStorage.setItem('adminRefreshToken', refreshToken);
  },
};

// ===============================
// Admin API – Doctors Management
// ===============================
export const adminDoctorsAPI = {
  getAll: () => apiCall('/doctors/admin/'),
  getById: (id) => apiCall(`/doctors/admin/${id}/`),
  create: (data) => apiCall('/doctors/admin/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/doctors/admin/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  toggleActive: (id, isActive) =>
    apiCall(`/doctors/admin/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    }),
};

// ===============================
// Admin API – Appointments Management
// ===============================
export const adminAppointmentsAPI = {
  // Get all appointments with optional filters
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.doctor) queryParams.append('doctor', params.doctor);
    if (params.date) queryParams.append('date', params.date);
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `/appointments/admin/appointments/?${queryString}`
      : '/appointments/admin/appointments/';
    
    return apiCall(endpoint);
  },

  // Get single appointment by ID
  getById: (id) => apiCall(`/appointments/admin/appointments/${id}/`),

  // Update appointment status
  updateStatus: (id, status) => 
    apiCall(`/appointments/admin/appointments/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Update entire appointment
  update: (id, data) =>
    apiCall(`/appointments/admin/appointments/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Get appointment statistics for dashboard
  getStats: () => apiCall('/appointments/admin/stats/'),
};

// ===============================
// Default Export (Optional)
// ===============================
export default {
  doctorsAPI,
  appointmentsAPI,
  adminAuthAPI,
  adminDoctorsAPI,
  adminAppointmentsAPI,
};