// 导入必要的依赖
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

// 导入路由和中间件
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import authenticateToken from './middlewares/authMiddleware.js';
import videoRoutes from './routes/video.js';
import chatRoutes from './routes/chat.js';
import commentRoutes from './routes/comments.js';

// 加载环境变量
dotenv.config();

// 初始化Express应用
const app = express();

// 配置中间件
app.use(bodyParser.json({ limit: '30mb', extended: true })); // 处理JSON请求体，限制大小为30mb
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true })); // 处理URL编码的请求体
app.use(cors()); // 启用跨域请求

// API路由配置
app.use('/auth', (req, res, next) => {
  console.log('访问了 /auth 路由', req.method, req.url);
  next();
}, authRoutes); // 认证相关路由

app.use('/posts', authenticateToken, postRoutes); // 帖子相关路由，需要token验证
app.use('/users', authenticateToken, userRoutes); // 用户相关路由，需要token验证
app.use('/videos', authenticateToken,videoRoutes);
app.use('/chat', authenticateToken,chatRoutes);
app.use('/comments', authenticateToken,commentRoutes);

// 服务器配置
const PORT = process.env.PORT || 5000;

// 数据库连接和服务器启动
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  app.listen(PORT, () => console.log(`✅ 服务器成功运行在端口: ${PORT}`));
})
.catch((error) => {
  console.error('❌ 数据库连接失败:', error.message);
});








