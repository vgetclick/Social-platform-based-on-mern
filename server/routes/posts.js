import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from '../controllers/posts.js';

const router = express.Router();

// 所有帖子相关接口都加鉴权中间件
router.get('/', authenticateToken, getPosts);
router.post('/', authenticateToken, createPost);
router.patch('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);
router.patch('/:id/likePost', authenticateToken, likePost);

export default router;
