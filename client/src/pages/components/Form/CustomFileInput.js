// CustomFileInput.js
import React from "react";

const CustomFileInput = ({ onFileSelected }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // 提取 base64 数据（去除前缀"data:image/png;base64,"）
        const base64 = event.target.result.split(",")[1]; 
        onFileSelected(base64); // 调用父组件回调
      };
      reader.readAsDataURL(file); // 读取文件为 base64
    }
  };

  return (
    <input
      type="file"
      accept="image/*" // 限制上传类型为图片（可改为 "*/*" 允许所有文件）
      style={{ display: "none" }} // 隐藏原生输入框
      id="custom-file-input" // 与按钮的 htmlFor 匹配
      onChange={handleFileChange} // 监听文件选择事件
    />
  );
};

export default CustomFileInput;