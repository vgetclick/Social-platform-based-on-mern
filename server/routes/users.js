import express from 'express';
import User from '../models/User.js';
import authenticateToken from '../middlewares/authMiddleware.js';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/user_profile.js';
const router = express.Router();

// 获取用户信息
router.get('/:id', authenticateToken, getUserProfile);

// 更新用户信息
router.put('/:id', authenticateToken, updateUserProfile);

// 删除用户
router.delete('/:id', authenticateToken, deleteUserProfile);

export default router;
