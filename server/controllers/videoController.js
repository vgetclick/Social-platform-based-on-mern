import Video from '../models/Video.js';
import { uploadToS3, deleteFromS3 } from '../utils/s3.js';
import { generateThumbnail } from '../utils/videoProcessing.js';

// 获取所有视频
export const getVideos = async (req, res) => {
  const { category, search } = req.query;
  try {
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const videos = await Video.find(query)
      .populate('creator', 'username avatar')
      .populate('comments.user', 'username avatar')
      .sort({ createdAt: -1 });
      
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取单个视频
export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('creator', 'username avatar')
      .populate('comments.user', 'username avatar');
      
    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }
    
    // 增加观看次数
    video.views += 1;
    await video.save();
    
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 上传视频
export const uploadVideo = async (req, res) => {
  const { title, description, category } = req.body;
  const videoFile = req.files?.video;
  
  if (!videoFile) {
    return res.status(400).json({ message: '请上传视频文件' });
  }

  try {
    // 上传视频到S3
    const videoUrl = await uploadToS3(videoFile, 'videos');
    
    // 生成缩略图
    const thumbnail = await generateThumbnail(videoFile);
    const thumbnailUrl = await uploadToS3(thumbnail, 'thumbnails');

    const video = new Video({
      title,
      description,
      url: videoUrl,
      thumbnail: thumbnailUrl,
      category,
      creator: req.user._id
    });

    await video.save();
    
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新视频
export const updateVideo = async (req, res) => {
  const { title, description, category } = req.body;
  
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }
    
    if (video.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '没有权限修改此视频' });
    }
    
    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;
    
    await video.save();
    
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 删除视频
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }
    
    if (video.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '没有权限删除此视频' });
    }
    
    // 从S3删除视频和缩略图
    await deleteFromS3(video.url);
    if (video.thumbnail) {
      await deleteFromS3(video.thumbnail);
    }
    
    await video.deleteOne();
    
    res.status(200).json({ message: '视频已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 点赞视频
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }
    
    const index = video.likes.indexOf(req.user._id);
    if (index === -1) {
      video.likes.push(req.user._id);
    } else {
      video.likes.splice(index, 1);
    }
    
    await video.save();
    
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 收藏视频
export const favoriteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }
    
    const index = video.favorites.indexOf(req.user._id);
    if (index === -1) {
      video.favorites.push(req.user._id);
    } else {
      video.favorites.splice(index, 1);
    }
    
    await video.save();
    
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 添加评论
export const addComment = async (req, res) => {
  const { text } = req.body;
  
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }
    
    video.comments.unshift({
      text,
      user: req.user._id
    });
    
    await video.save();
    
    // 重新获取带有用户信息的视频
    const updatedVideo = await Video.findById(req.params.id)
      .populate('comments.user', 'username avatar');
    
    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
