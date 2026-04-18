// API client utility for making authenticated requests

const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_VERCEL_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3001';

const API_BASE = `${String(BACKEND_ORIGIN).replace(/\/+$/, '')}/api`;

export const build_upload_url = (relative_path) => {
  if (!relative_path) return null;
  return `${String(BACKEND_ORIGIN).replace(/\/+$/, '')}/uploads/${relative_path}`;
};

const get_token = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const get_headers = (include_auth = true, is_form_data = false) => {
  const headers = {};
  
  if (!is_form_data) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (include_auth) {
    const token = get_token();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

const handle_response = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
};

export const api_client = {
  get: async (endpoint, include_auth = true) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: get_headers(include_auth)
    });
    return handle_response(response);
  },

  post: async (endpoint, data, include_auth = true, is_form_data = false) => {
    const body = is_form_data ? data : JSON.stringify(data);
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: get_headers(include_auth, is_form_data),
      body: body
    });
    return handle_response(response);
  },

  put: async (endpoint, data, include_auth = true, is_form_data = false) => {
    const body = is_form_data ? data : JSON.stringify(data);
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: get_headers(include_auth, is_form_data),
      body: body
    });
    return handle_response(response);
  },

  delete: async (endpoint, include_auth = true) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: get_headers(include_auth)
    });
    return handle_response(response);
  }
};
