# Fix All Hardcoded localhost:5000 URLs

## Problem
Many frontend files have hardcoded `http://localhost:5000` URLs that need to use the environment variable instead.

## Files That Still Need Fixing

Based on the search results, these files still have hardcoded URLs:

1. `APP/src/Guardian/GuardianWards/GuardianWards.jsx` - 3 instances
2. `APP/src/COMPONENTS/Chat/ChatWindow.jsx` - 1 instance
3. `APP/src/PAGE/List/ListStaff/ListStaff.jsx` - 5 instances
4. `APP/src/PAGE/List/ListStaff/EditStaff.jsx` - 2 instances
5. `APP/src/PAGE/StudentFaults/StudentFaultsS.jsx` - 8 instances
6. `APP/src/PAGE/Setting/Setting.jsx` - 2 instances
7. `APP/src/PAGE/Post/Post.jsx` - 2 instances
8. And many more...

## Quick Fix Strategy

Instead of fixing each file individually, we should:

1. **Use the existing `api` utility** from `APP/src/utils/api.js` which already handles the environment variable
2. **Replace direct axios calls** with the api utility
3. **For image URLs**, use the `getFileUrl` function from `fileUtils.js` which we already fixed

## Immediate Solution

For now, the main pages are fixed:
- ✅ Student List
- ✅ Create Register Student  
- ✅ Create Register Staff

Other pages will show CORS errors until fixed. Let me know which pages you use most and I'll prioritize fixing those.

## Alternative: Global Fix

We could also add a global axios interceptor to automatically replace localhost URLs, but that's a workaround. The proper fix is to update each file to use the api utility or environment variables.
