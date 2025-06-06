/**
 * 应用程序主入口组件
 * 配置路由和认证上下文
 */

import React from 'react';
import { Container } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 页面组件导入
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Help from './pages/Help';
import Video from './pages/Video';
import MyPosts from './pages/MyPosts/MyPosts';

// 上下文和路由保护组件
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 默认重定向到登录页 */}
          <Route
            path="/"
            element={<Navigate to="/home" />}
          />

          {/* 公开路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 受保护路由 - 需要登录才能访问 */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />

          <Route
            path="/video"
            element={
              <ProtectedRoute>
                <Video />
              </ProtectedRoute>
            }
          />

          <Route
            path="/myposts"
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
