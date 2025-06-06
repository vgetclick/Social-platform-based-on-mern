import express from 'express';
import { getComments, createComment, deleteComment } from '../controllers/commentController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// 获取所有评论
router.get('/', getComments);

// 创建新评论 (需要登录)
router.post('/', authenticateToken, createComment);

// 删除评论 (需要登录)
router.delete('/:id', authenticateToken, deleteComment);

export default router; 