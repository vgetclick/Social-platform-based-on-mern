import React, { useState, useEffect } from "react";
import { 
  TextField, 
  Button, 
  //Paper, 
  Typography, 
  Grid, // MUI 布局组件
  //Box,  // MUI 容器组件
} from "@mui/material";
import { AttachFile } from "@mui/icons-material";
import CustomFileInput from "./CustomFileInput";
import MuiBackgroundCarousel from "./MuiImageCarousel.js";

// 引入 MUI 样式组件（根据你的 style.js 调整）
import { 
  CustomPaper, 
  CustomForm, 
  FileInput, 
  SubmitButton 
} from './styles';
// 引入 MUI 轮播组件
import MuiImageCarousel from './MuiImageCarousel'; 

import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost, getPosts } from "../../../actions/posts.js";

const Form = ({currentId, setCurrentId}) => {
  // 原有 state 和方法保持不变
  const [postData, setPostData] = useState({
    //creator: '',
    title: '',
    message: '',
    tags: '',
    selectedFile: ''
  });
  // 获取用户信息, 从localStorage(登录的时候存储的)中获取
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const post = useSelector((state) => currentId? state.posts.find((p)=>p._id===currentId) : null);

  const handleFileSelect = (base64) => {
    setPostData({ ...postData, selectedFile: base64 });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if(post){
      setPostData(post);
    }
  },[post]);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('提交数据:', postData);
    if (!user) {
      alert('请先登录！');
      return;
    }
    // 刷新页面
    //window.location.reload();
    const finalPostData = {
      ...postData,
      creator: user.username
    };
    if (currentId) {
      dispatch(updatePost(currentId, finalPostData)).then(() => {
        dispatch(getPosts());
        clear();
      });
    } else {
      dispatch(createPost(finalPostData)).then(() => {
        dispatch(getPosts());
        clear();
      });
    }
  };

  const clear = () => {
    setPostData({
      creator: '',
      title: '',
      message: '',
      tags: '',
      selectedFile: ''
    });
    
    setCurrentId(null);//点击清空按钮,直接清空当前Id,改变表单的标题
  };

  return (
    <>
      <MuiBackgroundCarousel />
        <Grid container spacing={4} justifyContent="center" >
        {/* 左侧：轮播组件，占 4 列（总 12 列） */}
        <Grid item xs={12} md={4}> 
            <MuiImageCarousel />
        </Grid>

        {/* 右侧：原有表单，占 8 列（md 及以上屏幕） */}
        <Grid item xs={12} md={8} > 
            <CustomPaper>
            <CustomForm autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                { currentId ? '编辑':'创建'}一个新帖子
                </Typography>
                <TextField 
                name="creator" 
                variant="outlined" 
                label="创建人" 
                fullWidth
                value={user?.username || ''}
                disabled
                onChange={(e) => setPostData({ ...postData, creator: e.target.value })} 
                sx={{ mb: 2 }}
                />
                <TextField 
                name="title" 
                variant="outlined" 
                label="标题" 
                fullWidth
                value={postData.title}
                onChange={(e) => setPostData({ ...postData, title: e.target.value })} 
                sx={{ mb: 2 }}
                />
                <TextField 
                name="message" 
                variant="outlined" 
                label="消息" 
                fullWidth
                value={postData.message}
                onChange={(e) => setPostData({ ...postData, message: e.target.value })} 
                sx={{ mb: 2 }}
                />
                <TextField 
                name="tags" 
                variant="outlined" 
                label="标签" 
                fullWidth
                value={postData.tags}
                onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} 
                sx={{ mb: 2 }}
                />
                <FileInput>
                <Button
                    variant="outlined"
                    component="label"
                    htmlFor="custom-file-input"
                    startIcon={<AttachFile />}
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    选择文件
                    {postData.selectedFile && (
                    <span sx={{ ml: 1, color: "text.secondary" }}>已选择文件</span>
                    )}
                </Button>
                <CustomFileInput onFileSelected={handleFileSelect} />
                </FileInput>
                <SubmitButton 
                variant="contained" 
                color="primary" 
                type="submit" 
                fullWidth
                sx={{ mb: 2 }}
                >
                { currentId ? '编辑':'创建'}
                </SubmitButton>
                <Button 
                variant="contained" 
                color="secondary" 
                size="small" 
                onClick={clear} 
                fullWidth
                >
                清空
                </Button>
            </CustomForm>
            </CustomPaper>
        </Grid>
        </Grid>
    </>
    
  );
};

export default Form;