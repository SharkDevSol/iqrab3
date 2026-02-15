import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import styles from './StaffLogin.module.css';

const StaffLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setMessage('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/staff/login', credentials);
      
      if (response.data.message === 'Login successful') {
        // Store JWT token for API authentication
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        
        // Store user data in localStorage
        localStorage.setItem('staffUser', JSON.stringify(response.data.user));
        localStorage.setItem('staffProfile', JSON.stringify(response.data.profile));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', 'staff');
        
        // Navigate to profile page
        navigate('/app/staff');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={styles.loginCard}
      >
        <h2 className={styles.title}>Staff Portal Login</h2>
        <p className={styles.subtitle}>Access your staff profile and resources</p>
        
        {message && (
          <div className={`${styles.message} ${message.includes('successful') ? styles.success : styles.error}`}>
            {message}
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
              disabled={isLoading}
              aria-describedby="username-error"
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
              disabled={isLoading}
              aria-describedby="password-error"
            />
          </div>
          
          <motion.button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiLogIn style={{ fontSize: '1.2rem' }} />
            {isLoading ? 'Logging in...' : 'Login'}
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

