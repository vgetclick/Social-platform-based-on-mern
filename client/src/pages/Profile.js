import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Avatar } from '@mui/material';

const Profile = () => {
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = JSON.parse(localStorage.getItem('userInfo'))?._id;  // 改成userInfo
  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }
  
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setUsername(res.data.username);
        setAvatar(res.data.avatar);
        // 顺便更新一下 localStorage
        localStorage.setItem('userInfo', JSON.stringify(res.data));
      } catch (error) {
        console.error(error);
        // token失效或者用户不存在，跳登录
        navigate('/login');
      }
    };
  
    fetchUser();
  }, [userId, token, navigate]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1]; // 去掉 data:image/... 前缀
      setAvatar(reader.result);
      try {
        const res = await axios.put(
          `http://localhost:5000/users/${userId}`,
          { avatar: base64Data },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // 更新本地存储
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        alert('头像更新成功！');
      } catch (error) {
        console.error('头像更新失败:', error);
        alert('头像更新失败，请重试');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        username: username,
      };
      if (password) {
        updateData.password = password;
      }
      
      const res = await axios.put(
        `http://localhost:5000/users/${userId}`, 
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // 更新本地存储
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      alert('个人信息已更新');
      window.location.reload();
    } catch (error) {
      console.error('更新失败:', error);
      alert('更新失败，请重试');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('确定要注销账号吗？')) {
      await axios.delete(`http://localhost:5000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    navigate('/home');
  };
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>个人资料</Typography>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Avatar 
          src={user.avatar ? `data:image/jpeg;base64,${user.avatar}` : null}
          alt="头像" 
          sx={{ width: 100, height: 100, margin: 'auto' }} 
        />
        <Button component="label" variant="outlined" sx={{ mt: 1 }}>
          上传头像
          <input type="file" hidden onChange={handleAvatarChange} />
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <TextField
          label="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="新密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Typography variant="body1">注册时间: {new Date(user.createdAt).toLocaleString()}</Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleUpdate}>保存</Button>
          <Button variant="contained" onClick={handleLogout}>返回</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>注销账号</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
