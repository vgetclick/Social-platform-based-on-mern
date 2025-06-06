/**
 * authMiddleware.js - 认证中间件
 * 
 * 这个中间件负责处理用户认证，主要功能包括：
 * 1. 验证请求中的JWT token
 * 2. 解析token获取用户信息
 * 3. 验证用户是否存在
 * 4. 将用户信息添加到请求对象中
 * 
 * 使用方式：
 * 在需要认证的路由中添加这个中间件，例如：
 * router.post('/posts', authenticateToken, createPost);
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

// 加载环境变量
dotenv.config();

/**
 * 认证中间件函数
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next函数
 */
const authenticateToken = async (req, res, next) => {
  try {
    // 从请求头中获取token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token格式
    
    // 检查token是否存在
    if (!token) {
      return res.status(401).json({ message: '缺少token' });
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 从数据库获取完整的用户信息
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    // 处理不同类型的错误
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'token无效' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'token已过期' });
    }
    
    // 处理其他错误
    console.error('认证中间件错误:', error);
    return res.status(500).json({ message: '服务器错误' });
  }
};

export default authenticateToken;

