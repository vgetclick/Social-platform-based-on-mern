import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Fab,
  Slide,
  IconButton,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import axios from 'axios';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '您好！我是客服，很高兴为您服务。请问有什么可以帮您的吗？',
      isCustomer: false,
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [needsHuman, setNeedsHuman] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      text: message,
      isCustomer: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      // 发送消息到后端AI服务
      const response = await axios.post('http://localhost:5000/chat', {
        message: userMessage.text,
        conversationHistory: messages
      });

      // 如果需要人工客服
      if (response.data.needsHuman) {
        setNeedsHuman(true);
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: '您的问题可能需要人工客服处理。我们的人工客服工作时间是周一至周五 9:00-18:00，您可以发送邮件到 support@example.com 或在工作时间内致电 400-123-4567。',
          isCustomer: false,
          timestamp: new Date(),
        }]);
      } else {
        // 添加AI回复
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: response.data.reply,
          isCustomer: false,
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: '抱歉，我暂时无法回答。请稍后再试或联系人工客服。',
        isCustomer: false,
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setIsOpen(true)}
      >
        <ChatIcon />
      </Fab>

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            width: 360,
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}
        >
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SupportAgentIcon sx={{ mr: 1 }} />
              <Typography>在线客服</Typography>
            </Box>
            <IconButton color="inherit" onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {needsHuman && (
            <Alert severity="info" sx={{ mx: 2, mt: 2 }}>
              您的问题已转交人工客服处理
            </Alert>
          )}

          <List sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {messages.map((msg) => (
              <ListItem
                key={msg.id}
                sx={{
                  flexDirection: msg.isCustomer ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  mb: 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: msg.isCustomer ? 'primary.main' : 'secondary.main' }}>
                    {msg.isCustomer ? 'Me' : 'CS'}
                  </Avatar>
                </ListItemAvatar>
                <Paper
                  sx={{
                    maxWidth: '70%',
                    p: 1,
                    bgcolor: msg.isCustomer ? 'primary.light' : 'grey.100',
                    color: msg.isCustomer ? 'white' : 'text.primary',
                  }}
                >
                  <ListItemText
                    primary={msg.text}
                    secondary={
                      <Typography variant="caption" sx={{ color: msg.isCustomer ? 'white' : 'text.secondary' }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </Typography>
                    }
                  />
                </Paper>
              </ListItem>
            ))}
            {isTyping && (
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>CS</Avatar>
                </ListItemAvatar>
                <Paper sx={{ p: 1, bgcolor: 'grey.100' }}>
                  <Typography>正在输入...</Typography>
                </Paper>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>

          <Box
            component="form"
            onSubmit={handleSend}
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              gap: 1,
            }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="输入消息..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={needsHuman}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={!message.trim() || isTyping || needsHuman}
              endIcon={<SendIcon />}
            >
              发送
            </Button>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default LiveChat; 