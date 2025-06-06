import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

// 根容器样式 - 使用 styled 组件替代 makeStyles
export const RootContainer = styled('div')(({ theme }) => ({
  '& .MuiTextField-root': {
    margin: theme.spacing(1), // 使用 theme.spacing 保持一致性
  },
}));

// Paper 组件样式 - 直接扩展 MUI 组件
export const  CustomPaper = styled(Paper)(({ theme }) => ({
  margin: '0 auto', // 让容器在页面水平居中（可选，保持美观）
  //margin: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { // 小屏幕及以上
    maxWidth: 300,
  },
  [theme.breakpoints.up('md')]: { // 中屏幕及以上
    maxWidth: 400,
  },
  padding: theme.spacing(2),
  
}));

// Form 容器 - 使用 sx 属性或 styled 均可
export const CustomForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.spacing(2), // 组件间间距（16px）
  maxWidth: '500px', // 最大宽度
  padding: theme.spacing(3), // 内边距（24px）
}));

// 文件输入框 - 使用 styled 自定义元素
export const FileInput = styled('div')(({ theme }) => ({ // 接收 theme 参数
  width: '100%',
  margin: theme.spacing(1.25), // 10px = 1.25 * 8px（MUI 默认为 8px/unit）
  display: 'flex',           // 添加 flex 布局
  justifyContent: 'flex-start',  // 左对齐
  
}));

// 提交按钮 - 使用 styled 自定义元素
export const SubmitButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(1.25), // 与 FileInput 保持一致
}));