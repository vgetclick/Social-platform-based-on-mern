import express from 'express';
import { generateAIResponse, needsHumanIntervention } from '../utils/aiChat.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  const { message, conversationHistory } = req.body;

  try {
    // 检查是否需要人工客服
    if (needsHumanIntervention(message)) {
      return res.json({
        needsHuman: true
      });
    }

    // 生成AI回复
    const reply = await generateAIResponse(message, conversationHistory);
    
    res.json({
      needsHuman: false,
      reply
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: '聊天服务暂时不可用' });
  }
});

export default router; 