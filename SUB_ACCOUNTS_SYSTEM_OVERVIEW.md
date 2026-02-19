# Sub-Accounts System - Complete Overview

## What Was Fixed

### Issue 1: Table Display (CSS)
The sub-accounts page had a CSS overflow issue that could potentially hide content.

**Fix:** `.tableContainer` from `overflow: hidden` to `overflow-x: auto; overflow-y: visible`

**Result:** All sub-accounts are displayed without being cut off

### Issue 2: Navigation Filtering (CRITICAL SECURITY FIX)
Sub-accounts with assigned permissions were not seeing any navigation items. The root cause was a logic error that treated empty permission arrays incorrectly.

**Problem:** The code couldn't distinguish between:
- Primary admin with empty permissions (should see everything)
- Sub-account with empty permissions (should see nothing)

**Fix Applied:**
1. `APP/src/utils/permissionUtils.js` - Check `userType` before returning all items
2. `APP/src/config/adminPermissions.js` - Add `userType` parameter to path permission check

**Result:**
- Primary admins (`userType === 'admin'`) see all navigation items
- Sub-accounts with permissions see only their permitted items
- Sub-accounts without permissions see nothing

**Security Impact:** This was a critical vulnerability where sub-accounts with empty permissions had full admin access. Now fixed.

## How the Sub-Accounts System Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Sub-Accounts System                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (React)          Backend (Node.js/Express)         │
│  ┌──────────────────┐     ┌──────────────────────────┐     │
│  │ AdminSubAccounts │────▶│ /api/admin/sub-accounts  │     │
│  │   Component      │     │      Routes              │     │
│  └──────────────────┘     └──────────────────────────┘     │
│         │                           │                        │
│         │                           ▼                        │
│         │                  ┌─────────────────┐              │
│         │                  │  Auth Middleware │              │
│         │                  │  - JWT Verify    │              │
│         │                  │  - Role Check    │              │
│         │                  └─────────────────┘              │
│         │                           │                        │
│         │                           ▼                        │
│         │                  ┌─────────────────┐              │
│         └─────────────────▶│   PostgreSQL    │              │
│                            │   Database      │              │
│                            └─────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

```sql
CREATE TABLE admin_sub_accounts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  permissions JSON NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_sub_accounts_username ON admin_sub_accounts(username);
CREATE INDEX idx_sub_accounts_email ON admin_sub_accounts(email);
CREATE INDEX idx_sub_accounts_is_active ON admin_sub_accounts(is_active);
```

### Core Features

#### 1. Account Management
- **Create**: Primary admin creates sub-accounts with name, email, username, password
- **Read**: View all sub-accounts with their details and permissions
- **Update**: Modify account details, permissions, or password
- **Delete**: Remove sub-accounts permanently
- **Toggle Status**: Activate/deactivate accounts without deletion

#### 2. Permission System
- Permissions stored as JSON array in database
- Each permission represents access to specific admin features
- Granular control over what each sub-account can access
- Permissions checked at both frontend (UI) and backend (API) levels

#### 3. Search & Filter
- Real-time search by name, email, or username
- Client-side filtering for instant results
- No pagination - displays all accounts

## Security Features

### 1. Authentication & Authorization

#### Multi-Layer Security
```
Request → JWT Token → Role Verification → Permission Check → Database
```

**JWT Token Authentication:**
- All API requests require valid JWT token
- Token contains user ID, role, and expiration
- Tokens expire and must be refreshed
- Invalid/expired tokens are rejected immediately

**Role-Based Access Control (RBAC):**
- Only users with 'admin' role can access sub-account management
- Super Admin has unrestricted access
- Sub-accounts cannot create other sub-accounts (prevents privilege escalation)

**Middleware Stack:**
```javascript
router.use(authenticateToken);      // Verify JWT
router.use(authorizeRoles('admin')); // Check role
```

### 2. Password Security

**Hashing with bcrypt:**
- Passwords never stored in plain text
- Uses bcrypt with 10 salt rounds
- Computationally expensive to crack
- Each password has unique salt

```javascript
const saltRounds = 10;
const passwordHash = await bcrypt.hash(password, saltRounds);
```

**Password Requirements:**
- Minimum 6 characters (enforced on frontend and backend)
- Can be updated without knowing old password (admin privilege)
- Optional update - leave blank to keep existing password

### 3. Input Validation & Sanitization

**Frontend Validation:**
- Required field checks
- Email format validation (regex)
- Password length validation
- Real-time error feedback

**Backend Validation:**
- Duplicate username/email detection
- Email format verification
- SQL injection prevention (parameterized queries)
- Input sanitization middleware

**Sanitization Middleware:**
```javascript
router.use(sanitizeInputs); // Applied to all routes
```

### 4. Database Security

**Parameterized Queries:**
```javascript
// SECURE - Uses parameterized query
await pool.query(
  'SELECT * FROM admin_sub_accounts WHERE username = $1',
  [username]
);

// NEVER DONE - String concatenation (SQL injection risk)
// await pool.query(`SELECT * FROM admin_sub_accounts WHERE username = '${username}'`);
```

**Unique Constraints:**
- Username must be unique (database constraint)
- Email must be unique (database constraint)
- Prevents duplicate accounts

**Indexes:**
- Fast lookups on username, email, is_active
- Improves query performance
- Prevents slow queries on large datasets

### 5. Account Status Control

**Active/Inactive Toggle:**
- Inactive accounts cannot log in
- Existing sessions remain valid until token expires
- Provides soft-delete functionality
- Can be reactivated without data loss

### 6. Audit Trail

**Timestamps:**
- `created_at`: When account was created
- `updated_at`: Last modification time
- `last_login`: Last successful login

**Logging:**
- All authentication attempts logged
- Failed login attempts tracked
- API errors logged to console

### 7. API Security Best Practices

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad request (validation error)
- 401: Unauthorized (no/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not found
- 409: Conflict (duplicate username/email)
- 500: Server error

**Error Handling:**
- Generic error messages to clients
- Detailed errors logged server-side
- No sensitive information in error responses
- Specific error codes for client handling

**CORS & Headers:**
- Proper CORS configuration
- Secure headers
- Token in Authorization header (not URL)

### 8. Frontend Security

**Token Storage:**
- JWT stored in memory or secure storage
- Not in localStorage (XSS vulnerability)
- Sent in Authorization header

**Password Visibility Toggle:**
- Show/hide password feature
- Prevents shoulder surfing
- User-controlled visibility

**Client-Side Validation:**
- Immediate feedback
- Reduces unnecessary API calls
- Does NOT replace server-side validation

## Data Flow Examples

### Creating a Sub-Account

```
1. User fills form → Frontend validates
2. POST /api/admin/sub-accounts
3. authenticateToken middleware → Verify JWT
4. authorizeRoles('admin') → Check role
5. sanitizeInputs → Clean input data
6. Check duplicate username/email
7. Hash password with bcrypt
8. Insert into database
9. Return success + account data
10. Frontend refreshes list
```

### Logging In as Sub-Account

```
1. Sub-account enters credentials
2. POST /api/admin/login
3. Query database for username
4. Compare password with bcrypt
5. Check is_active status
6. Generate JWT with permissions
7. Return token + user data
8. Frontend stores token
9. Navigation filtered by permissions
```

### Updating Permissions

```
1. Admin edits sub-account
2. Selects new permissions
3. PUT /api/admin/sub-accounts/:id
4. Verify admin token
5. Update permissions JSON
6. Update updated_at timestamp
7. Return updated account
8. Sub-account's next login loads new permissions
```

## Security Considerations

### ✅ What's Secure

1. **Password Storage**: Bcrypt hashed, never plain text
2. **SQL Injection**: Parameterized queries throughout
3. **Authentication**: JWT-based, expires automatically
4. **Authorization**: Role-based, checked on every request
5. **Input Validation**: Both frontend and backend
6. **Unique Constraints**: Database-level enforcement
7. **Audit Trail**: Timestamps for accountability
8. **Status Control**: Can disable without deletion

### ⚠️ Potential Improvements

1. **Password Complexity**: Currently only 6 chars minimum
   - Consider requiring uppercase, lowercase, numbers, symbols
   
2. **Rate Limiting**: No protection against brute force
   - Add rate limiting on login attempts
   - Lock account after X failed attempts

3. **Two-Factor Authentication**: Not implemented
   - Consider adding 2FA for sensitive accounts

4. **Password Expiration**: Passwords never expire
   - Consider forcing password changes every 90 days

5. **Session Management**: No active session tracking
   - Consider tracking active sessions
   - Add "logout all devices" feature

6. **Audit Logging**: Basic timestamps only
   - Consider detailed audit log table
   - Track who made what changes

7. **Permission Validation**: Permissions not validated
   - Ensure permissions array contains valid values only

8. **HTTPS**: Ensure production uses HTTPS
   - Tokens sent over HTTP are vulnerable

## Performance Characteristics

### Current Implementation

- **No Pagination**: Loads all accounts at once
- **Client-Side Search**: Filters in browser
- **Indexed Queries**: Fast database lookups
- **JSON Permissions**: Flexible but not normalized

### Scalability

**Good for:**
- Up to 1000 sub-accounts (typical use case)
- Fast search and filter
- Simple permission management

**Consider Changes If:**
- More than 1000 sub-accounts
- Complex permission hierarchies
- Need detailed audit trails
- Require advanced reporting

## Conclusion

The sub-accounts system is **secure for typical use cases** with:
- Strong password hashing
- Proper authentication/authorization
- SQL injection protection
- Input validation
- Role-based access control

The fix ensures all accounts display properly without UI limitations. The system follows security best practices and is production-ready for small to medium-scale deployments.

For high-security environments, consider implementing the suggested improvements (2FA, rate limiting, password complexity, audit logging).
