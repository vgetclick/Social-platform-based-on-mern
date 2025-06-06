/**
 * NavBar.jsx - 导航栏组件
 * 
 * 提供应用的主要导航功能，包括：
 * - 首页导航
 * - 视频页面导航
 * - 个人中心导航
 * - 帮助页面导航
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Tooltip } from '@mui/material';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 获取用户信息
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .catch(console.error);
    }
  }, []);

  // 处理"我的"按钮点击
  const handleMyPostsClick = () => {
    if (!user) {
      //alert('请先登录');
      //navigate('/login');
      return;
    }
    navigate('/myposts');
  };

  return (
    <Box 
      sx={{ 
        position: 'absolute', 
        left: 0, 
        top: 0, 
        bottom: 0, 
        display: 'flex', 
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '0 16px',
        borderRadius: '20px',
      }}
    >
      <Tooltip title={user ? "首页" : "请先登录"}>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/home" 
          sx={{ marginRight: 2 }}
        >
          首页
        </Button>
      </Tooltip>

      <Tooltip title={user ? "视频" : "请先登录"}>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/video" 
          sx={{ marginRight: 2 }}
        >
        视频
        </Button>
      </Tooltip>
      <Tooltip title={user ? "查看我的帖子" : "请先登录"}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleMyPostsClick}
          sx={{ marginRight: 2 }}
        >
          我的
        </Button>
      </Tooltip>

      <Tooltip title={user ? "帮助" : "请先登录"}>
        <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/help" 
        sx={{ marginRight: 2 }}
      >
          帮助
        </Button>
      </Tooltip>
    </Box>
  );
};

export default NavBar;