import React, {useState}from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Container, Box, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../context/AuthContext';
import { getHome } from '../api/authApi';
import { useDispatch } from 'react-redux';
import { getPosts } from '../actions/posts.js';
import useStyles from '../components/userAndmessagesStyles.js';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
const UsersAndMessages = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
  
    const handleLogout = () => {
      logout();
      navigate('/login');
    };
  
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    const [message, setMessage] = React.useState('');
    const [currentId, setCurrentId] = React.useState(null);
    const classes = useStyles();
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
<Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ marginRight: 1 }}>
              用户: {user?.username}
            </Typography>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <NotificationsIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>个人资料</MenuItem>
              {/* 没写完 */}
              {/* <MenuItem onClick={() => { handleMenuClose(); navigate('/'); }}>消息</MenuItem> */}
              <MenuItem onClick={handleLogout}>退出登录</MenuItem>
            </Menu>
          </Box>)};

export default UsersAndMessages;