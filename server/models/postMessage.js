/**
 * postMessage.js - 帖子数据模型
 * 
 * 定义了帖子在MongoDB中的数据结构，包含以下字段：
 * - title: 帖子标题
 * - message: 帖子内容
 * - creator: 创建者用户名
 * - creatorId: 创建者ID
 * - tags: 帖子标签
 * - selectedFile: 帖子图片（Base64格式）
 * - likes: 点赞用户ID列表
 * - likeCount: 点赞数量
 * - createAt: 创建时间
 */

import mongoose from'mongoose';
// 创建帖子模型
const postSchema = new mongoose.Schema({
    // 帖子标题
    title: {
        type: String,
        required: true
    },

    // 帖子内容
    message: {
        type: String,
        required: true
    },

    // 创建者用户名（用于显示）
    creator: {
        type: String,
        required: true
    },

    // 创建者ID（用于权限验证）
    creatorId: {
        type: String,
        required: true
    },

    // 帖子标签（数组）
    tags: {
        type: [String],
        default: []
    },

    // 帖子图片（Base64格式）
    selectedFile: {
        type: String,
        required: true
    },

    // 点赞用户ID列表
    likes: {
        type: [String],
        default: []
    },

    // 点赞数量（自动根据likes数组长度更新）
    likeCount: { 
        type: Number, 
        default: 0 
    },

    // 创建时间（自动设置为当前时间）
    createAt: { 
        type: Date, 
        default: new Date()
    },
});
// 导出帖子模型
const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;