import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  thumbnail: { type: String },
  category: { type: String, required: true, enum: ['tutorial', 'guide', 'news', 'entertainment', 'other'] },
  duration: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// 添加虚拟字段
VideoSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

VideoSchema.virtual('favoritesCount').get(function() {
  return this.favorites.length;
});

VideoSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// 确保虚拟字段包含在JSON中
VideoSchema.set('toJSON', { virtuals: true });
VideoSchema.set('toObject', { virtuals: true });

const Video = mongoose.model('Video', VideoSchema);
export default Video; 