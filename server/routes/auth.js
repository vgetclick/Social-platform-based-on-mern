/**
 * 认证相关路由配置
 * 包含注册、登录、token验证等功能
 */

import express from 'express';
import { login, refreshToken, verifyToken, logout } from '../controllers/login.js';
import { register } from '../controllers/register.js';
import authenticateToken from '../middlewares/authMiddleware.js'; // token验证中间件
const router = express.Router();

/**
 * 用户注册路由
 * POST /auth/register
 * @body {username, password, email} - 用户注册信息
 */
router.post('/register', register);

/**
 * 用户登录路由
 * POST /auth/login
 * @body {username, password} - 用户登录凭证
 */
router.post('/login', login);

/**
 * 首页访问路由 - 需要token验证
 * GET /auth/home
 * @header {Authorization} - Bearer Token
 */
router.get('/home', authenticateToken, (req, res) => {
  res.json({ message: `欢迎回来，${req.user.username}`, user: req.user });
});

/**
 * Token验证路由 - 用于验证用户token是否有效
 * GET /auth/verify
 * @header {Authorization} - Bearer Token
 */
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user,
    message: 'Token验证成功'
  });
});

export default router;
