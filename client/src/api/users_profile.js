import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getUserProfile = (id) => API.get(`/users/${id}`);
export const updateUserProfile = (id, updatedProfile) => API.put(`/users/${id}`, updatedProfile);
export const deleteUserProfile = (id) => API.delete(`/users/${id}`);
