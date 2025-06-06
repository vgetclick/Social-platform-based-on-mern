import React, {useState}from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Container, Box, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../context/AuthContext';
import { getHome } from '../api/authApi';
import { useDispatch } from 'react-redux';
import { getPosts } from '../actions/posts.js';
import Posts from './components/Posts/Posts.js';
import Form from './components/Form/Form.js';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import NavBar from '../components/NavBar.jsx';
import LogoAndTitle from '../components/logoAndtitle.jsx';
import UsersAndMessages from '../components/usersAndmessages.jsx';
const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = React.useState('');
  const [currentId, setCurrentId] = React.useState(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // 小于 md(960px) 视为小屏

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('token not found');
      navigate('/login');
      return;
    }
    getHome(token)
      .then(res => {
        setMessage(res.data.message);
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  React.useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" disableGutters sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航 */}
      <AppBar position="static" color="inherit" sx={{ boxShadow: '2px 0 5px rgb(248, 247, 247)', borderRadius: '20px' }}>
        <Toolbar sx={{ position: 'relative', height: 64 }}>
          <NavBar />
          {/* 中间标题+logo */}
          <LogoAndTitle />
          {/* 右侧 用户名 + 铃铛 */}
          <UsersAndMessages />
        </Toolbar>
      </AppBar>
      {/* 内容区 */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        height: 'calc(100vh - 64px)',
      }}>
        {/* 帖子列表 */}
        <Box sx={{ flex: 1, overflowY: 'auto', padding: 2, order: isSmallScreen ? 1 : 0 }}>
          <Posts setCurrentId={setCurrentId} />
        </Box>

        {/* 表单 */}
        <Box sx={{
          width: isSmallScreen ? '70%' : 400,
          height: isSmallScreen ? '40%' : 800,
          flexShrink: 0,
          overflowY: 'auto',
          padding: 2,
          order: isSmallScreen ? 0 : 1,
        }}>
          <Form currentId={currentId} setCurrentId={setCurrentId} />
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
