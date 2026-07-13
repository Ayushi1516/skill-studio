import axios, { AxiosError } from 'axios';
import { API_URL } from '../constants';
import { Enrollment, User } from '../types/interfaces';
import { dispatchLogoutEvent } from './auth-events';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use an interceptor to dynamically add the Authorization header to requests
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      if (user?.token) {
        // Make sure headers object exists
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Use a response interceptor to handle errors globally
api.interceptors.response.use(
  // Forward successful responses
  (response) => response,
  // Handle errors
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;

      if (status === 401) {
        // If we get a 401, it means the user is not authenticated or the token is invalid.
        // We dispatch a logout event for the AuthProvider to handle.
        dispatchLogoutEvent();
        toast.error("Your session has expired. Please log in again.");
      } else {
        // For other errors, we can show a generic toast.
        // The 'data' object from the server might contain a 'message' property.
        const errorMessage = (data as { message?: string })?.message || 'An unexpected error occurred.';
        // Avoid showing duplicate toasts for handled errors.
        // Components can still catch the error and show a more specific message.
      }
    }
    // It's important to reject the promise so that individual .catch() blocks in components still work.
    return Promise.reject(error);
  }
);

export default api;

export const loginUser = (data: any) => {
  return api.post(`/login`, { email: data.email, password: data.password });
}

// Example of creating specific service functions
export const getEnrollmentsByUserId = (userId: string | number) => {
    return api.get<Enrollment[]>(`/enrollments?userId=${userId}`);
};

export const updateEnrollmentProgress = (enrollmentId: number, completedChapters: number[]) => {
    return api.patch(`/enrollments/${enrollmentId}`, { completedChapters });
};

export const getCourse = (courseId: string | undefined) => {
  return api.get(`/courses/${courseId}`);
}

export const checkEnrollment = (userId: string | number, courseId: string | undefined) => {
  return api.get<Enrollment[]>(`/enrollments?userId=${userId}&courseId=${courseId}`);
};

export const enrollInCourse = (userId: string | number, courseId: number) => {
  return api.post<Enrollment>('/enrollments', {
      userId,
      courseId,
      completedChapters: []
  });
};