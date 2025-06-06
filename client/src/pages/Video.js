import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  CircularProgress,
  Divider
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import VideoComments from '../components/VideoComments';

const Video = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    file: null
  });

  // 示例视频数据
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: '如何使用我们的平台',
      description: '新手教程：详细介绍平台的基本功能和使用方法',
      thumbnail: 'https://picsum.photos/300/200?random=1',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '5:30'
    },
    {
      id: 2,
      title: '创建精美帖子的技巧',
      description: '学习如何创建引人注目的帖子，提高互动率',
      thumbnail: 'https://picsum.photos/300/200?random=2',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '7:15'
    },
    {
      id: 3,
      title: '个人资料设置指南',
      description: '如何设置和优化你的个人资料页面',
      thumbnail: 'https://picsum.photos/300/200?random=3',
      duration: '4:45',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 4,
      title: '社区互动最佳实践',
      description: '如何更好地与社区成员互动，建立良好的关系',
      thumbnail: 'https://picsum.photos/300/200?random=4',
      duration: '6:20',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 5,
      title: '内容创作指南',
      description: '学习如何创作优质内容，吸引更多关注',
      thumbnail: 'https://picsum.photos/300/200?random=5',
      duration: '8:10',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 6,
      title: '平台新功能介绍',
      description: '了解平台最新推出的功能和使用方法',
      thumbnail: 'https://picsum.photos/300/200?random=6',
      duration: '5:55',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
  ]);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.title) return;

    setIsUploading(true);
    setUploadProgress(0);

    // 模拟上传进度
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // 模拟上传完成
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);

      // 创建新视频对象
      const newVideo = {
        id: Date.now(),
        title: uploadData.title,
        description: uploadData.description,
        thumbnail: URL.createObjectURL(uploadData.file),
        videoUrl: URL.createObjectURL(uploadData.file),
        duration: '0:00'
      };

      // 添加到视频列表
      setVideos(prev => [newVideo, ...prev]);

      // 重置上传表单
      setUploadData({
        title: '',
        description: '',
        file: null
      });
      setIsUploadDialogOpen(false);
    }, 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          视频教程
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/home')}>
          返回首页
        </Button>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索视频..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 2 }}
          InputProps={{
            endAdornment: <SearchIcon />
          }}
        />
      </Box>

      {selectedVideo && (
        <Box sx={{ mb: 4 }}>
          <VideoPlayer
            url={selectedVideo.videoUrl}
            title={selectedVideo.title}
          />
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            {selectedVideo.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {selectedVideo.description}
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Box>
      )}

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {filteredVideos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={video.thumbnail}
                  alt={video.title}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 1,
                    fontSize: '0.875rem'
                  }}
                >
                  {video.duration}
                </Box>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.8)'
                    }
                  }}
                  onClick={() => handleVideoClick(video)}
                >
                  <PlayArrowIcon sx={{ color: 'white', fontSize: 40 }} />
                </IconButton>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {video.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 页面底部的评论区 */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          页面评论区
        </Typography>
        <VideoComments />
      </Box>

      {/* 上传视频按钮 */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setIsUploadDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* 上传视频对话框 */}
      <Dialog
        open={isUploadDialogOpen}
        onClose={() => !isUploading && setIsUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          上传新视频
          {!isUploading && (
            <IconButton
              sx={{ position: 'absolute', right: 8, top: 8 }}
              onClick={() => setIsUploadDialogOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleUpload} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="视频标题"
              required
              value={uploadData.title}
              onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
              sx={{ mb: 2 }}
              disabled={isUploading}
            />
            <TextField
              fullWidth
              label="视频描述"
              multiline
              rows={3}
              value={uploadData.description}
              onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 2 }}
              disabled={isUploading}
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
              disabled={isUploading}
            >
              选择视频文件
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={handleFileSelect}
              />
            </Button>
            {uploadData.file && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                已选择: {uploadData.file.name}
              </Typography>
            )}
            {isUploading && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CircularProgress variant="determinate" value={uploadProgress} sx={{ mr: 2 }} />
                <Typography variant="body2">
                  上传进度: {uploadProgress}%
                </Typography>
              </Box>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!uploadData.file || !uploadData.title || isUploading}
            >
              {isUploading ? '上传中...' : '开始上传'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Video; 