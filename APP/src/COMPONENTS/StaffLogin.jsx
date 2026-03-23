import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import styles from './StaffLogin.module.css';

const StaffLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (lockoutSeconds > 0) {
      timerRef.current = setInterval(() => {
        setLockoutSeconds(s => {
          if (s <= 1) {
            clearInterval(timerRef.current);
            setMessage('');
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [lockoutSeconds]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;
    if (!credentials.username || !credentials.password) {
      setMessage('Please enter both username and password');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.post('/api/staff/login', credentials);
      if (response.data.message === 'Login successful') {
        if (response.data.token) localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('staffUser', JSON.stringify(response.data.user));
        localStorage.setItem('staffProfile', JSON.stringify(response.data.profile));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', 'staff');
        navigate('/app/staff');
      }
    } catch (error) {
      if (error.response?.status === 429) {
        const seconds = error.response?.data?.retryAfter || 60;
        setLockoutSeconds(seconds);
        setMessage(`Too many attempts. Please wait ${seconds} seconds.`);
      } else {
        setMessage(error.response?.data?.error || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isLocked = lockoutSeconds > 0;

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={styles.loginCard}
      >
        <img src="/skoolific-icon.png" alt="Skoolific" className={styles.logo} />
        <h2 className={styles.title}>Staff Portal Login</h2>
        <p className={styles.subtitle}>Access your staff profile and resources</p>
        
        {message && (
          <div className={`${styles.message} ${isLocked ? styles.error : message.includes('successful') ? styles.success : styles.error}`}>
            {message}
            {isLocked && (
              <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#dc2626' }}>
                {lockoutSeconds}s
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              <FiUser style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your username"
              disabled={isLoading || isLocked}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              <FiLock style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your password"
              disabled={isLoading || isLocked}
            />
          </div>
          
          <motion.button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading || isLocked}
            whileHover={{ scale: isLocked ? 1 : 1.05 }}
            whileTap={{ scale: isLocked ? 1 : 0.95 }}
            style={isLocked ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          >
            <FiLogIn style={{ fontSize: '1.2rem' }} />
            {isLocked ? `Wait ${lockoutSeconds}s` : isLoading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        
        <div className={styles.footer}>
          <p>Need help? Contact your administrator</p>
        </div>
      </motion.div>
    </div>
  );
};

export default StaffLogin;

