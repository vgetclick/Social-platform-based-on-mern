import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  calculateRefreshTokenExpiry,
  cleanUserObject 
} from '../utils/tokenUtils.js';
dotenv.config();
// 登录接口
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: '用户不存在' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: '密码错误' });

        // 生成新的令牌
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();
        
        // 更新用户的refresh token
        user.refreshToken = refreshToken;
        user.refreshTokenExpiresAt = calculateRefreshTokenExpiry();
        await user.save();

        // 返回令牌和用户信息（不包含敏感数据）
        res.json({
            token: accessToken,
            refreshToken: refreshToken,
            user: cleanUserObject(user)
        });
    } catch (err) {
        console.error('登录错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
}

// 刷新令牌接口
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // 查找具有该刷新令牌的用户
        const user = await User.findOne({ refreshToken });
        
        if (!user || user.isRefreshTokenExpired()) {
            return res.status(401).json({ message: '无效的刷新令牌或令牌已过期' });
        }

        // 生成新的访问令牌
        const accessToken = generateAccessToken(user);
        
        // 生成新的刷新令牌
        const newRefreshToken = generateRefreshToken();
        user.refreshToken = newRefreshToken;
        user.refreshTokenExpiresAt = calculateRefreshTokenExpiry();
        await user.save();

        res.json({
            token: accessToken,
            refreshToken: newRefreshToken
        });
    } catch (err) {
        console.error('刷新令牌错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
}

// 验证令牌接口
export const verifyToken = async (req, res) => {
    try {
        // 认证中间件已经验证了令牌，所以如果代码执行到这里，令牌就是有效的
        res.json({ 
            valid: true,
            user: cleanUserObject(req.user)
        });
    } catch (err) {
        console.error('验证令牌错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
}

// 登出接口
export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        // 找到用户并清除其refresh token
        await User.findOneAndUpdate(
            { refreshToken },
            { 
                $set: { 
                    refreshToken: null,
                    refreshTokenExpiresAt: null
                }
            }
        );

        res.json({ message: '成功登出' });
    } catch (err) {
        console.error('登出错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
}