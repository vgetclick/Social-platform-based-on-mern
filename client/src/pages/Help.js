import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Box, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';
import LiveChat from '../components/LiveChat';

const Help = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: '如何创建新帖子？',
      answer: '在首页右侧的表单中，填写标题、内容、标签（可选），并可以上传图片，然后点击创建按钮即可发布新帖子。'
    },
    {
      question: '如何编辑个人资料？',
      answer: '点击导航栏中的"我的"按钮，进入个人资料页面，您可以在那里更改用户名、上传头像等。'
    },
    {
      question: '如何给帖子点赞？',
      answer: '在每个帖子的底部都有一个点赞按钮，点击即可为该帖子点赞。'
    },
    {
      question: '忘记密码怎么办？',
      answer: '目前您可以通过联系我们的客服邮箱来重置密码。我们会在24小时内回复您的请求。'
    },
    {
      question: '如何删除我的帖子？',
      answer: '在您发布的帖子下方有一个删除按钮，点击即可删除该帖子。请注意，删除操作不可撤销。'
    }
  ];

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            帮助中心
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/home')}>
            返回首页
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          常见问题
        </Typography>

        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            联系我们
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <EmailIcon sx={{ mr: 1 }} />
            <Typography>
              客服邮箱：暂时没有
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            工作时间：周一至周五 10:00-18:00
          </Typography>
        </Box>
      </Container>
      
      {/* 添加在线客服聊天组件 */}
      <LiveChat />
    </>
  );
};

export default Help; 