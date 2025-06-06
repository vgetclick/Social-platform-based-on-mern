import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });
      
      const { token, refreshToken, user: userData } = response.data;
      login(userData, token, refreshToken);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || '登录失败');
    }
  };

  return (
    <div className={styles.authContainer}>

      <div className={styles.authLight}></div>

      <div className={styles.authCard}>
        <h2>登录账号</h2>

        {error && <div className={styles.authError}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className={styles.authLabel}>用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.authInput}
              placeholder="请输入用户名"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className={styles.authLabel}>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.authInput}
              placeholder="请输入密码"
              required
            />
          </div>

          <button type="submit" className={styles.authButton}>登录</button>
        </form>

        <Link to="/register" className={styles.authLink}>没有账号？点击注册</Link>
      </div>
    </div>
  );
};

export default Login;
