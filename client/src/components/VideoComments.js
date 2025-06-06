import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  Divider,
  IconButton,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const VideoComments = () => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 获取当前用户信息
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 验证token是否有效
      fetch('http://localhost:5000/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
        } else {
          console.log('Token验证失败:', data.message);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      })
      .catch(err => {
        console.error('验证token失败:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // 获取评论列表
  const fetchComments = async () => {
    try {
      const response = await fetch('http://localhost:5000/comments');
      if (!response.ok) {
        throw new Error('获取评论失败');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('获取评论失败:', error);
    }
  };

  // 初始加载评论
  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newComment })
      });

      if (response.ok) {
        const savedComment = await response.json();
        setComments(prev => [savedComment, ...prev]);
        setNewComment('');
      } else {
        const error = await response.json();
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          navigate('/login');
        } else {
          alert(error.message || '发表评论失败');
        }
      }
    } catch (error) {
      console.error('发表评论失败:', error);
      alert('发表评论失败');
    }
  };

  const handleDelete = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
      } else {
        const error = await response.json();
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          navigate('/login');
        } else {
          alert(error.message || '删除评论失败');
        }
      }
    } catch (error) {
      console.error('删除评论失败:', error);
      alert('删除评论失败');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      {user ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="写下你的评论..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newComment.trim()}
          >
            发表评论
          </Button>
        </Box>
      ) : (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            请登录后发表评论
          </Typography>
          <Button variant="outlined" onClick={handleLogin}>
            去登录
          </Button>
        </Box>
      )}

      <List>
        {comments.map((comment, index) => (
          <React.Fragment key={comment._id}>
            {index > 0 && <Divider component="li" />}
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                user && user._id === comment.user._id && (
                  <IconButton edge="end" onClick={() => handleDelete(comment._id)}>
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemAvatar>
                <Avatar src={comment.user.avatar} alt={comment.user.username} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography component="span" variant="subtitle2">
                      {comment.user.username}
                    </Typography>
                    <Typography component="span" variant="caption" color="text.secondary">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: zhCN })}
                    </Typography>
                  </Box>
                }
                secondary={comment.text}
              />
            </ListItem>
          </React.Fragment>
        ))}
        {comments.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            还没有评论，来发表第一条评论吧！
          </Typography>
        )}
      </List>
    </Paper>
  );
};

export default VideoComments; 