import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// 用于存储等待中的请求
let refreshTokenPromise = null;

// 刷新token的函数
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken,
    });
    const { token } = response.data;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
    return Promise.reject(error);
  }
};

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 如果是401错误且不是刷新token的请求，且没有重试过
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('refresh-token')) {
      originalRequest._retry = true;

      try {
        // 如果已经有刷新请求在进行中，就等待它完成
        if (refreshTokenPromise) {
          const newToken = await refreshTokenPromise;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }

        // 开始新的刷新token请求
        refreshTokenPromise = refreshToken();
        const newToken = await refreshTokenPromise;
        refreshTokenPromise = null;

        // 使用新token重试原始请求
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 