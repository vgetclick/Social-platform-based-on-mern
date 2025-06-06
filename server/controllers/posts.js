/**
 * posts.js - 帖子相关的控制器
 * 
 * 这个文件包含了所有与帖子相关的业务逻辑处理函数：
 * - 获取所有帖子
 * - 创建新帖子
 * - 更新帖子
 * - 删除帖子
 * - 点赞/取消点赞
 * 
 * 所有函数都包含了适当的错误处理和权限验证
 */

import mongoose from 'mongoose';
import PostMessage from '../models/PostMessage.js';

/**
 * 获取所有帖子
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

/**
 * 创建新帖子
 * @param {Object} req - Express请求对象，包含帖子数据
 * @param {Object} res - Express响应对象
 */
export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage({ 
    ...post, 
    creator: req.user.username,
    creatorId: req.user._id.toString(),  // 确保ID是字符串格式
    createdAt: new Date()
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(409).json({ message: error.message });
  }
};

/**
 * 更新帖子
 * @param {Object} req - Express请求对象，包含帖子ID和更新数据
 * @param {Object} res - Express响应对象
 */
export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  // 验证帖子ID是否有效
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send('没有这个id的帖子');
  }

  try {
    // 先检查帖子是否存在
    const existingPost = await PostMessage.findById(_id);
    if (!existingPost) {
      return res.status(404).send('帖子不存在');
    }

    // 检查是否是帖子创建者
    if (existingPost.creatorId !== req.user._id.toString()) {
      return res.status(403).send('只有帖子创建者才能编辑帖子');
    }

    // 更新帖子
    const updatedPost = await PostMessage.findByIdAndUpdate(
      _id, 
      { ...post, _id }, 
      { new: true }  // 返回更新后的文档
    );
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * 删除帖子
 * @param {Object} req - Express请求对象，包含帖子ID
 * @param {Object} res - Express响应对象
 */
export const deletePost = async (req, res) => {
  const { id } = req.params;
  
  // 验证帖子ID是否有效
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('没有这个id的帖子');
  }

  try {
    // 先检查帖子是否存在
    const post = await PostMessage.findById(id);
    if (!post) {
      return res.status(404).send('帖子不存在');
    }

    // 检查是否是帖子创建者
    if (post.creatorId !== req.user._id.toString()) {
      return res.status(403).send('只有帖子创建者才能删除帖子');
    }

    // 删除帖子
    await PostMessage.findByIdAndDelete(id);
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * 处理帖子点赞/取消点赞
 * @param {Object} req - Express请求对象，包含帖子ID
 * @param {Object} res - Express响应对象
 */
export const likePost = async (req, res) => {
  const { id } = req.params;
  
  // 验证帖子ID是否有效
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('没有这个id的帖子');
  }

  try {
    const post = await PostMessage.findById(id);
    if (!post) return res.status(404).send('帖子不存在');

    // 检查用户是否已经点赞
    const userId = req.user._id.toString();
    const index = post.likes.findIndex((id) => id === userId);
    
    if (index === -1) {
      // 如果没有点赞，添加点赞
      post.likes.push(userId);
      post.likeCount = post.likes.length;
    } else {
      // 如果已经点赞，取消点赞
      post.likes = post.likes.filter((id) => id !== userId);
      post.likeCount = post.likes.length;
    }

    // 更新帖子
    const updatedPost = await PostMessage.findByIdAndUpdate(
      id, 
      post,
      { new: true }  // 返回更新后的文档
    );
    
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
