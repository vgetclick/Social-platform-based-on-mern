import React, { useState } from 'react';
import { register } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';
export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      alert('注册成功，去登录');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || '注册失败');
    }
  };

  return (
    <div className={styles.authContainer}>

      <div className={styles.authLight}></div>

      <div className={styles.authCard}>
        <h2>注册账号</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className={styles.authLabel}>用户名</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="请输入用户名"
              required
              className={styles.authInput}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className={styles.authLabel}>密码</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="请输入密码"
              required
              className={styles.authInput}
            />
          </div>

          <button type="submit" className={styles.authButton}>
            注册
          </button>
        </form>

        <Link to="/login" className={styles.authLink}>已有账号？点击登录</Link>

        {error && (
          <p className={styles.authError}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
