import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

let openai = null;

// Only initialize OpenAI if API key is available
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
}

const systemPrompt = `你是一个专业的客服代表，名叫"小美"。你的工作是帮助用户解决问题，回答他们的疑问。
请遵循以下准则：
1. 保持友好和专业的态度
2. 给出简洁明确的答案
3. 如果不确定答案，诚实地表示不知道
4. 使用礼貌的语气
5. 回答要简短，不超过100个字
6. 如果用户问题涉及敏感信息，建议他们联系人工客服`;

export const generateAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.isCustomer ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI response generation error:', error);
    return '抱歉，我现在无法回答。请稍后再试或联系人工客服。';
  }
};

// 用于检查消息是否需要人工客服介入
export const needsHumanIntervention = (message) => {
  const keywords = [
    '人工',
    '真人',
    '转接',
    '投诉',
    '退款',
    '账号安全',
    '密码',
    '支付问题',
    '充值'
  ];

  return keywords.some(keyword => message.includes(keyword));
};

export const chatWithAI = async (message) => {
    if (!openai) {
        return { 
            response: "AI chat is currently unavailable. Please contact support for assistance.",
            error: "OpenAI API key not configured"
        };
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "gpt-3.5-turbo",
        });

        return {
            response: completion.choices[0].message.content,
            error: null
        };
    } catch (error) {
        console.error('Error in AI chat:', error);
        return {
            response: "Sorry, I encountered an error. Please try again later.",
            error: error.message
        };
    }
}; 