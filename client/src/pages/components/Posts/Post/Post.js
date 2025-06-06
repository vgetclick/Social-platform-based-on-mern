/**
 * Post.js - 帖子卡片组件
 * 
 * 这个组件负责显示单个帖子的内容，包括：
 * - 帖子的图片、标题和内容
 * - 创建者信息
 * - 点赞功能
 * - 编辑和删除功能（仅对创建者可见）
 * 
 * 组件实现了以下功能：
 * 1. 用户认证状态检查
 * 2. 创建者权限控制
 * 3. 点赞/取消点赞
 * 4. 帖子编辑和删除
 */

import React, { useState, useEffect } from "react";
import {
  Card,          // MUI卡片容器
  CardContent,   // 卡片内容区
  CardMedia,     // 卡片媒体区（用于显示图片）
  CardActions,   // 卡片操作区（底部按钮区）
  Button,        // 按钮组件
  Typography,    // 文字排版组件
  Box,          // 布局容器
  Tooltip,      // 工具提示
  IconButton    // 图标按钮
} from "@mui/material";
import { motion } from "framer-motion";  // 动画效果
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';          // 已点赞图标
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';    // 未点赞图标
import DeleteIcon from "@mui/icons-material/Delete";                   // 删除图标
import EditIcon from "@mui/icons-material/Edit";                      // 编辑图标
import moment from "moment";                                          // 时间格式化
import { useDispatch } from "react-redux";                           // Redux分发器
import { deletePost, likePost } from "../../../../actions/posts.js";  // 帖子相关actions

/**
 * Post组件 - 显示单个帖子
 * @param {Object} post - 帖子数据对象
 * @param {Function} setCurrentId - 设置当前选中帖子ID的函数（用于编辑）
 */
const Post = ({ post, setCurrentId }) => {
  // 状态管理
  const [user, setUser] = useState(null);         // 当前用户信息
  const [loading, setLoading] = useState(true);   // 加载状态
  const dispatch = useDispatch();                 // Redux dispatch函数

  /**
   * 用户认证效果
   * 在组件加载时验证用户token并获取用户信息
   */
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

  /**
   * 检查当前用户是否是帖子创建者
   * 确保ID比较时使用字符串格式
   */
  const isCreator = user?._id && post?.creatorId && user._id.toString() === post.creatorId;

  /**
   * 检查当前用户是否已对帖子点赞
   * 使用字符串格式的ID进行比较
   */
  const hasLiked = post.likes?.includes(user?._id?.toString());

  /**
   * 处理点赞事件
   * 需要用户登录才能点赞
   */
  const handleLike = () => {
    if (!user) {
      alert('请先登录后再点赞');
      return;
    }
    // 刷新页面
    //window.location.reload();
    dispatch(likePost(post._id));
  };

  /**
   * 处理删除事件
   * 只有创建者才能删除帖子
   */
  const handleDelete = () => {
    if (!isCreator) {
      alert('只有帖子创建者才能删除帖子');
      return;
    }
    if (window.confirm('确定要删除这个帖子吗？')) {
      dispatch(deletePost(post._id));
    }
  };

  // 调试信息
  console.log('Post Component Debug:', {
    userId: user?._id,
    postCreatorId: post?.creatorId,
    isCreator,
    post
  });

  // 组件渲染
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "400px",
        height: "400px",
        justifyContent: "space-between",
        borderRadius: "15px",
        height: "100%",
        position: "relative",
      }}
    >
      {/* 帖子图片展示区 */}
      <CardMedia
        component="div"
        image={`data:image/png;base64,${post.selectedFile}`}
        title={post.title}
        sx={{
          pt: "56.25%",  // 16:9宽高比
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backgroundBlendMode: "darken",
        }}
      />

      {/* 发布者信息 - 左上角显示 */}
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
        }}
      >
        <Typography variant="h6">{post.creator}</Typography>
        <Typography variant="body2">{moment(post.createAt).fromNow()}</Typography>
      </Box>

      {/* 编辑按钮 - 右上角显示（仅创建者可见） */}
      {isCreator && (
        <Box
          sx={{
            position: "absolute",
            top: "20px",
            right: "20px",
            color: "white",
          }}
        >
          <Tooltip title="编辑帖子">
            <IconButton 
              onClick={() => setCurrentId(post._id)}
              sx={{ 
                color: "white",
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* 帖子标签 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: "20px",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {post.tags.map((tag) => `#${tag} `)}
        </Typography>
      </Box>

      {/* 帖子标题 */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          padding: "0 16px",
        }}
      >
        {post.title}
      </Typography>

      {/* 帖子内容 */}
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          component={'p'}
          sx={{
            padding: "0 16px",
          }}
        >
          {post.message}
        </Typography>
      </CardContent>

      {/* 底部操作区 - 点赞和删除按钮 */}
      <CardActions
        sx={{
          padding: "0 16px 8px 16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* 点赞按钮 - 带动画效果 */}
        <motion.div whileTap={{ scale: 1.3 }}>
          <Tooltip title={user ? (hasLiked ? "取消点赞" : "点赞") : "请先登录"}>
            <Button
              size="small"
              onClick={handleLike}
              color={hasLiked ? "primary" : "inherit"}
            >
              {hasLiked ? <ThumbUpAltIcon fontSize="small" /> : <ThumbUpOffAltIcon fontSize="small" />}
              &nbsp;{post.likeCount}
            </Button>
          </Tooltip>
        </motion.div>

        {/* 删除按钮 - 仅创建者可见 */}
        {isCreator && (
          <Tooltip title="删除帖子">
            <Button 
              size="small" 
              onClick={handleDelete}
              color="error"
              startIcon={<DeleteIcon />}
            >
              删除
            </Button>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;