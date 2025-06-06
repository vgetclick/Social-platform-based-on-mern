import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储中的token
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (token && refreshToken) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      setUser(userInfo);
      
      // 验证token是否有效
      api.get('/auth/verify')
        .catch(async (error) => {
          if (error.response?.status === 401) {
            try {
              // 尝试刷新token
              const response = await api.post('/auth/refresh-token', { refreshToken });
              const { token: newToken } = response.data;
              localStorage.setItem('token', newToken);
            } catch (refreshError) {
              // 如果刷新失败，清除所有认证信息
              logout();
            }
          }
        });
    }
    setLoading(false);
  }, []);

  const login = (userData, token, refreshToken) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 