import Comment from '../models/Comment.js';

// 获取所有评论
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 创建新评论
export const createComment = async (req, res) => {
  const { text } = req.body;
  
  try {
    // 确保用户已登录
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: '请先登录' });
    }

    const newComment = new Comment({
      text,
      user: req.user._id // 使用经过身份验证的用户ID
    });

    const savedComment = await newComment.save();
    
    // 获取包含用户信息的完整评论
    const populatedComment = await Comment.findById(savedComment._id)
      .populate('user', 'username avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('创建评论错误:', error);
    res.status(500).json({ message: error.message });
  }
};

// 删除评论
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    // 确保用户已登录
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: '请先登录' });
    }

    // 检查是否是评论作者
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '没有权限删除此评论' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: '评论已删除' });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({ message: error.message });
  }
}; 