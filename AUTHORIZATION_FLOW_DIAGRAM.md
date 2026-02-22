# Authorization Flow Diagram

## Database-Backed Authorization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LOGIN                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    User enters credentials
                              ↓
                    Backend verifies password
                              ↓
              ┌───────────────┴───────────────┐
              ↓                               ↓
      Found in admin_users          Found in admin_sub_accounts
              ↓                               ↓
    Generate JWT token                Generate JWT token
    { id: 1, role: 'admin' }         { id: 2, role: 'sub-account' }
              ↓                               ↓
    Store in localStorage              Store in localStorage
              ↓                               ↓
         Login Success                   Login Success


┌─────────────────────────────────────────────────────────────────┐
│              ACCESSING SUB-ACCOUNTS MANAGEMENT                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
              Frontend sends GET /api/admin/sub-accounts
              with Authorization: Bearer TOKEN
                              ↓
              Backend receives request
                              ↓
              authenticateToken middleware
              - Verifies JWT signature
              - Extracts user ID from token
                              ↓
              Authorization middleware
                              ↓
              Query: SELECT * FROM admin_users WHERE id = ?
                              ↓
              ┌───────────────┴───────────────┐
              ↓                               ↓
         User found                      User NOT found
         in admin_users                  in admin_users
              ↓                               ↓
         ✅ GRANT ACCESS              Query: SELECT * FROM 
         Return 200 OK                admin_sub_accounts WHERE id = ?
         with sub-accounts list                ↓
                                      ┌────────┴────────┐
                                      ↓                 ↓
                                 User found        User NOT found
                                 in sub_accounts   in any table
                                      ↓                 ↓
                                 ❌ DENY ACCESS   ❌ DENY ACCESS
                                 Return 403       Return 403
                                 "Only primary    "Invalid user"
                                 admins allowed"


┌─────────────────────────────────────────────────────────────────┐
│                    CROSS-DEVICE SCENARIO                        │
└─────────────────────────────────────────────────────────────────┘

Device A (Laptop)              Device B (Phone)           Device C (Tablet)
      ↓                              ↓                          ↓
  User logs in                   User logs in               User logs in
      ↓                              ↓                          ↓
  Gets JWT token                 Gets JWT token             Gets JWT token
  { id: 1 }                      { id: 1 }                  { id: 1 }
      ↓                              ↓                          ↓
  Accesses sub-accounts          Accesses sub-accounts      Accesses sub-accounts
      ↓                              ↓                          ↓
      └──────────────────────────────┴──────────────────────────┘
                                     ↓
                    ALL DEVICES QUERY SAME DATABASE
                                     ↓
                    SELECT * FROM admin_users WHERE id = 1
                                     ↓
                              User found (id: 1)
                                     ↓
                    ✅ ALL DEVICES GET ACCESS GRANTED


┌─────────────────────────────────────────────────────────────────┐
│              AFTER CLEARING BROWSER DATA                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    User clears localStorage
                    (Token deleted)
                              ↓
                    User logs in again
                              ↓
                    Gets NEW JWT token
                    { id: 1 }
                              ↓
                    Accesses sub-accounts
                              ↓
                    Backend queries database
                    SELECT * FROM admin_users WHERE id = 1
                              ↓
                    User found (id: 1)
                    (Database still has user record)
                              ↓
                    ✅ ACCESS GRANTED IMMEDIATELY


┌─────────────────────────────────────────────────────────────────┐
│                    VPS/PRODUCTION DEPLOYMENT                    │
└─────────────────────────────────────────────────────────────────┘

Local Development              VPS Production
      ↓                              ↓
PostgreSQL on localhost        PostgreSQL on VPS
      ↓                              ↓
admin_users table              admin_users table
- id: 1, username: admin       - id: 1, username: admin
      ↓                              ↓
Authorization check:           Authorization check:
SELECT * FROM admin_users      SELECT * FROM admin_users
WHERE id = 1                   WHERE id = 1
      ↓                              ↓
✅ Works locally               ✅ Works on VPS


┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY COMPARISON                          │
└─────────────────────────────────────────────────────────────────┘

❌ OLD WAY (Token-Based)
┌──────────────────────────┐
│ JWT Token                │
│ { id: 1,                 │
│   role: 'admin',         │
│   userType: 'admin' }    │ ← Can be inconsistent
└──────────────────────────┘
         ↓
   Check token fields
         ↓
   if (role === 'admin' && userType === 'admin')
         ↓
   Grant access
   
Problem: Token fields can be missing or inconsistent


✅ NEW WAY (Database-Backed)
┌──────────────────────────┐
│ JWT Token                │
│ { id: 1 }                │ ← Only need user ID
└──────────────────────────┘
         ↓
   Extract user ID
         ↓
   Query database
   SELECT * FROM admin_users WHERE id = 1
         ↓
   ┌─────────────────┐
   │ Database        │
   │ admin_users     │ ← Single source of truth
   │ - id: 1         │
   │ - username: ... │
   │ - role: admin   │
   └─────────────────┘
         ↓
   User found → Grant access
   
Benefit: Database is always consistent


┌─────────────────────────────────────────────────────────────────┐
│                    KEY BENEFITS                                 │
└─────────────────────────────────────────────────────────────────┘

1. NO localStorage DEPENDENCY
   ┌──────────────┐
   │ localStorage │ ← NOT used for authorization
   └──────────────┘
   
   ┌──────────────┐
   │ Database     │ ← ONLY source of truth
   └──────────────┘

2. WORKS EVERYWHERE
   Laptop ✅  Phone ✅  Tablet ✅  VPS ✅  Cloud ✅

3. SURVIVES DATA DELETION
   Clear browser data → Login again → Works immediately ✅

4. REAL-TIME REVOCATION
   UPDATE admin_users SET is_active = false WHERE id = 1
   → Next request denied immediately ✅

5. NO TOKEN TAMPERING
   Attacker modifies token → Database check fails → Access denied ✅
```

## Summary

The new authorization system:
- Queries database on every request
- Database is single source of truth
- Works on all devices and environments
- No localStorage dependency
- Secure and performant

**Status**: Production Ready 🚀
