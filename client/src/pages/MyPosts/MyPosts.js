/**
 * MyPosts.js - 个人帖子展示组件
 * 
 * 这个组件负责展示当前用户发布的所有帖子
 * 复用了现有的Post组件，但只显示用户自己的帖子
 */

import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, AppBar, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Post from '../components/Posts/Post/Post';
import { getPosts } from '../../actions/posts';
import NavBar from '../../components/NavBar';
const MyPosts = () => {
  const [currentId, setCurrentId] = useState(null);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);

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

  // 获取所有帖子
  useEffect(() => {
    dispatch(getPosts());
  }, [currentId, dispatch]);

  // 筛选出用户自己的帖子
  const myPosts = posts.filter(post => post.creatorId === user?._id?.toString());

  return (
    <Box>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1000, bgcolor: 'background.paper' }}>
        <NavBar />
      </Box>
      <Box>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ mt: 4, mb: 4 }} // 上下间距更清晰
          >
            我的帖子
          </Typography>

          {!posts.length ? (
            // 加载态居中
            <CircularProgress
              sx={{ display: 'block', margin: '0 auto' }}
            />
          ) : (
            <Grid
              container
              spacing={3}
              alignItems="stretch"
              justifyContent="center" // 卡片居中
            >
              {myPosts.map((post) => (
                <Grid key={post._id} item xs={12} sm={6} md={4}>
                  {/* md={4}：大屏下每行最多 3 个卡片，更美观 */}
                  <Post post={post} setCurrentId={setCurrentId} />
                </Grid>
              ))}
            </Grid>
          )}

          {myPosts.length === 0 && posts.length > 0 && (
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              sx={{ mt: 4, mb: 8 }} // 增加底部间距，避免贴底
            >
              你还没有发布任何帖子
            </Typography>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default MyPosts; 