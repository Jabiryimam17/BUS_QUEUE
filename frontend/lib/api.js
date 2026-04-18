import { api_client, build_upload_url } from './api_client';

// Auth APIs
export const authAPI = {
  login: async (email, password) => {
    const response = await api_client.post('/auth/login', {
      email,
      password
    }, false);
    
    return response.data;
  },

  register: async (form_data) => {
    const response = await api_client.post('/auth/register', form_data, false, true);
    return response.data;
  },

  getStatus: async () => {
    const response = await api_client.get('/auth/status');
    return response.data;
  },

  requestPasswordReset: async (email) => {
    const response = await api_client.post('/auth/forgot-password', { email }, false);
    return response.data;
  },

  resetPassword: async (email, code, newPassword) => {
    const response = await api_client.post('/auth/reset-password', {
      email,
      code,
      new_password: newPassword
    }, false);
    return response.data;
  }
};

// Student/Bus APIs
export const studentAPI = {
  getUpcomingBuses: async () => {
    const response = await api_client.get('/buses/upcoming', false);
    const buses = Array.isArray(response.data) ? response.data : [];
    return buses.map(bus => {
      const now = new Date();
      const window_open = new Date(bus.ticket_window_open);
      const window_close = new Date(bus.ticket_window_close);
      const is_window_open = now >= window_open && now <= window_close;
      
      return {
        id: bus.id,
        route: bus.route,
        scheduledTime: bus.scheduled_time,
        ticketWindowOpen: bus.ticket_window_open,
        ticketWindowClose: bus.ticket_window_close,
        availableTickets: bus.available_tickets || (bus.total_tickets - (bus.booked_tickets || 0)),
        totalTickets: bus.total_tickets,
        isWindowOpen: is_window_open
      };
    });
  },

  bookTicket: async (bus_id) => {
    const response = await api_client.post('/tickets/book', { bus_id });
    return {
      success: true,
      ticketNumber: response.data.ticket_number,
      busId: bus_id,
      bookedAt: new Date().toISOString(),
      position: response.data.position
    };
  },

  getMyTicket: async () => {
    const response = await api_client.get('/tickets/my-ticket');
    
    if (!response.data) {
      return null;
    }
    
    return {
      ticketNumber: response.data.ticket_number,
      busId: response.data.bus_id,
      busRoute: response.data.bus_route,
      scheduledTime: response.data.scheduled_time,
      bookedAt: response.data.booked_at,
      position: response.data.position
    };
  }
};

// Admin APIs
export const adminAPI = {
  getPendingRegistrations: async () => {
    const response = await api_client.get('/users/pending');
    return response.data.map(reg => ({
      id: reg.id,
      universityId: reg.university_id,
      name: reg.name,
      email: reg.email,
      department: reg.department,
      facePhoto: build_upload_url(reg.face_photo_path),
      idPhoto: build_upload_url(reg.id_photo_path),
      photo: build_upload_url(reg.face_photo_path),
      submittedAt: reg.created_at,
      status: reg.status
    }));
  },

  approveRegistration: async (registration_id) => {
    const response = await api_client.post(`/users/${registration_id}/approve`, {});
    return response.data;
  },

  rejectRegistration: async (registration_id) => {
    const response = await api_client.post(`/users/${registration_id}/reject`, {});
    return response.data;
  },

  announceBus: async (bus_data) => {
    const response = await api_client.post('/buses', {
      route: bus_data.route,
      scheduled_time: bus_data.scheduledTime,
      ticket_window_open: bus_data.ticketWindowOpen,
      ticket_window_close: bus_data.ticketWindowClose,
      total_tickets: bus_data.totalTickets
    });
    return response.data;
  },

  getBuses: async () => {
    const response = await api_client.get('/buses');
    return response.data.map(bus => ({
      id: bus.id,
      route: bus.route,
      scheduledTime: bus.scheduled_time,
      ticketWindowOpen: bus.ticket_window_open,
      ticketWindowClose: bus.ticket_window_close,
      totalTickets: bus.total_tickets,
      bookedTickets: bus.booked_tickets || 0
    }));
  },

  getBusQueue: async (bus_id) => {
    const response = await api_client.get(`/tickets/queue/${bus_id}`);
    return response.data.map(student => ({
      ticketId: student.ticket_id,
      ticketNumber: student.ticket_number,
      studentId: student.user_id,
      name: student.name,
      photo: build_upload_url(student.photo),
      universityId: student.university_id,
      isLateArrival: student.is_late_arrival || false,
      displayPosition: student.display_position,
      penalty: student.penalty || 0
    }));
  },

  penalizeTicket: async (ticket_id, current_queue_position) => {
    const response = await api_client.post(`/tickets/${ticket_id}/penalize`, {
      current_queue_position: current_queue_position
    });
    return response.data;
  },

  markLateArrival: async (ticket_id) => {
    const response = await api_client.post(`/tickets/${ticket_id}/mark-late`, {});
    return response.data;
  },

  rearrangeQueue: async (bus_id) => {
    const response = await api_client.post(`/tickets/queue/${bus_id}/rearrange`, {});
    return response.data;
  }
};

// User profile APIs
export const userAPI = {
  getMyProfile: async () => {
    const response = await api_client.get('/users/me/profile');
    return response.data;
  },

  updateMyProfile: async (form_data) => {
    const response = await api_client.put('/users/me/profile', form_data, true, true);
    return response.data;
  }
};