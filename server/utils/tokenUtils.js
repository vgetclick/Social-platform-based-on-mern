import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// 生成访问令牌
export const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      _id: user._id,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// 生成刷新令牌
export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// 计算刷新令牌过期时间（30天）
export const calculateRefreshTokenExpiry = () => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  return expiryDate;
};

// 验证访问令牌
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// 清理用户对象（移除敏感信息）
export const cleanUserObject = (user) => {
  const { password, refreshToken, refreshTokenExpiresAt, ...cleanUser } = user.toObject();
  return cleanUser;
}; 