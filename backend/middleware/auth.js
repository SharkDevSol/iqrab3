const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Ensure JWT_SECRET is set
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('CRITICAL: JWT_SECRET must be set in .env and be at least 32 characters!');
  console.error('Current JWT_SECRET length:', JWT_SECRET ? JWT_SECRET.length : 0);
  process.exit(1);
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  console.log('\n🔐 Auth Middleware - Request:', req.method, req.path);
  console.log('Auth header present:', !!authHeader);
  console.log('Token present:', !!token);
  if (token) {
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 20) + '...');
  }

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  // ============================================
  // SUPER ADMIN API KEY SUPPORT
  // ============================================
  // Allow Super Admin API keys (they are long hex strings, typically 64+ characters)
  // This enables cross-system authentication from a central Super Admin system
  if (token.length > 60 && /^[a-f0-9]+$/i.test(token)) {
    // Additional validation: ensure it's not just repeated characters
    const uniqueChars = new Set(token.toLowerCase().split(''));
    if (uniqueChars.size < 10) {
      // Too few unique characters, likely not a valid API key
      return res.status(403).json({ error: 'Invalid API key format' });
    }
    
    // This is likely a Super Admin API key
    console.log('Super Admin API key detected, granting access');
    req.user = {
      id: 'super-admin',
      role: 'super_admin',
      username: 'Super Admin',
      isSuperAdmin: true,
      source: 'api_key'
    };
    return next();
  }

  // ============================================
  // STANDARD JWT VALIDATION
  // ============================================
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ JWT verification failed:', err.message);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }
    console.log('✅ JWT verified, user:', user);
    req.user = user; // { id, role, etc. }
    next();
  });
};

// Role-based authorization middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('\n🔒 Authorization Check');
    console.log('User:', req.user);
    console.log('User role:', req.user?.role);
    console.log('Allowed roles:', allowedRoles);
    
    if (!req.user || !req.user.role) {
      console.log('❌ No user or role found');
      return res.status(403).json({ error: 'Access denied: No role assigned' });
    }
    
    // Super Admin has access to everything
    if (req.user.isSuperAdmin || req.user.role === 'super_admin') {
      console.log('✅ Super Admin access granted');
      return next();
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      console.log('❌ Role not in allowed list');
      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }
    
    console.log('✅ Authorization passed');
    next();
  };
};

// Optional authentication - doesn't fail if no token, but attaches user if valid
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
};

module.exports = { authenticateToken, authorizeRoles, optionalAuth, JWT_SECRET };