import { Navigate, useLocation } from 'react-router-dom';
import { hasPathPermission } from '../utils/permissionUtils';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');
  
  // Get permissions from localStorage
  let permissions = [];
  try {
    const storedPermissions = localStorage.getItem('userPermissions');
    if (storedPermissions) {
      permissions = JSON.parse(storedPermissions);
    }
  } catch (e) {
    console.error('❌ ProtectedRoute - Error parsing permissions:', e);
  }

  // Debug logging
  console.log('🛡️ ProtectedRoute Check:', {
    isLoggedIn,
    userType,
    currentPath: location.pathname,
    permissionCount: permissions.length
  });

  if (!isLoggedIn) {
    // Redirect to login page, but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Primary admins and staff have full access - no permission checking needed
  if (userType === 'admin' || userType === 'staff') {
    console.log('✅ Admin/Staff user - full access granted');
    return children;
  }

  // If userType is not set but user is logged in, assume primary admin (backward compatibility)
  if (!userType) {
    console.log('⚠️ No userType found, assuming primary admin');
    return children;
  }

  // Check permission for sub-accounts ONLY
  if (userType === 'sub-account') {
    const currentPath = location.pathname;
    
    console.log('🔒 Sub-account permission check:', {
      currentPath,
      permissions,
      permissionCount: permissions.length
    });
    
    // Always allow access to root path
    if (currentPath === '/' || currentPath === '') {
      console.log('✅ Root path - access granted');
      return children;
    }
    
    // Check if user has permission for this path
    const hasAccess = hasPathPermission(permissions, currentPath, userType);
    console.log(`${hasAccess ? '✅' : '❌'} Permission check result:`, hasAccess);
    
    if (!hasAccess) {
      console.log('❌ Access denied for sub-account');
      // Show access denied and offer to go back to login
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '60vh',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h2 style={{ color: '#d93025', marginBottom: '16px' }}>Access Denied</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            You don't have permission to access this page.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a 
              href="/" 
              style={{ 
                color: '#667eea', 
                textDecoration: 'none',
                padding: '10px 20px',
                border: '1px solid #667eea',
                borderRadius: '6px',
                background: 'white'
              }}
            >
              Go to Home
            </a>
            <a 
              href="/login" 
              onClick={() => {
                localStorage.clear();
              }}
              style={{ 
                color: 'white',
                background: '#667eea',
                textDecoration: 'none',
                padding: '10px 20px',
                border: '1px solid #667eea',
                borderRadius: '6px'
              }}
            >
              Back to Login
            </a>
          </div>
        </div>
      );
    }
    
    console.log('✅ Sub-account has permission');
  }

  return children;
};

export default ProtectedRoute;
