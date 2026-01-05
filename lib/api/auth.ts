const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1';

// Get auth headers
export function getAuthHeaders(locale: string = 'uz') {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': locale,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Generic API request with auth
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  locale: string = 'uz'
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(locale),
        ...options.headers,
      },
    });

    const data = await response.json();

    // Handle unauthorized
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return { error: 'Session expired. Please login again.', status: 401 };
    }

    // Handle forbidden
    if (response.status === 403) {
      return { error: 'Access denied.', status: 403 };
    }

    // Handle validation errors
    if (response.status === 422) {
      const errors = data.errors ? Object.values(data.errors).flat().join(', ') : data.message;
      return { error: errors as string, status: 422 };
    }

    // Handle server errors
    if (response.status >= 500) {
      return { error: 'Server error. Please try again later.', status: response.status };
    }

    if (!response.ok) {
      return { error: data.message || 'Request failed', status: response.status };
    }

    return { data, status: response.status };
  } catch (error) {
    console.error('API request error:', error);
    return { error: 'Network error. Please check your connection.', status: 0 };
  }
}

// Login
export async function login(email: string, password: string) {
  return apiRequest<{ token: string; user: any }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// Logout
export async function logout() {
  return apiRequest('/logout', { method: 'POST' });
}

// Get current user
export async function getCurrentUser() {
  return apiRequest<{ user: any }>('/user');
}

const authApi = {
  login,
  logout,
  getCurrentUser,
  apiRequest,
  getAuthHeaders,
};

export default authApi;
