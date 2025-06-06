import axiosInstance from './axiosInstance';

export const register = (userData) => axiosInstance.post('/auth/register', userData);

export const login = (userData) => axiosInstance.post('/auth/login', userData);

export const getHome = () => axiosInstance.get('/auth/home');  
