import express from 'express';
import fileUpload from 'express-fileupload';
import {
  getVideos,
  getVideo,
  uploadVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  favoriteVideo,
  addComment
} from '../controllers/videoController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// 配置文件上传中间件
router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 限制文件大小为50MB
}));

// 获取视频列表
router.get('/', authenticateToken, getVideos);

// 获取单个视频
router.get('/:id', authenticateToken, getVideo);

// 上传视频
router.post('/', authenticateToken, uploadVideo);

// 更新视频信息
router.put('/:id', authenticateToken, updateVideo);

// 删除视频
router.delete('/:id', authenticateToken, deleteVideo);

// 点赞/取消点赞视频
router.post('/:id/like', authenticateToken, likeVideo);

// 收藏/取消收藏视频
router.post('/:id/favorite', authenticateToken, favoriteVideo);

// 添加评论
router.post('/:id/comments', authenticateToken, addComment);

export default router;
