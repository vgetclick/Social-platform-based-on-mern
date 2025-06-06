import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String }, // 新增头像
  createdAt: {
    type: Date,
    default: new Date(),
  },
  refreshToken: { type: String },
  refreshTokenExpiresAt: { type: Date }
}, {
  timestamps: true // 添加 createdAt 和 updatedAt 字段
});

// 添加方法来检查 refresh token 是否过期
UserSchema.methods.isRefreshTokenExpired = function() {
  return !this.refreshTokenExpiresAt || this.refreshTokenExpiresAt < new Date();
};

const User = mongoose.model('User', UserSchema);
export default User;
