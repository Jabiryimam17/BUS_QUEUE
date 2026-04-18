// Authentication utilities

export const get_token = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const get_user = () => {
  if (typeof window !== 'undefined') {
    const user_str = localStorage.getItem('user');
    return user_str ? JSON.parse(user_str) : null;
  }
  return null;
};

export const get_user_type = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userType');
  }
  return null;
};

export const is_authenticated = () => {
  return !!get_token();
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export const require_auth = (router) => {
  if (!is_authenticated()) {
    router.push('/login');
    return false;
  }
  return true;
};
