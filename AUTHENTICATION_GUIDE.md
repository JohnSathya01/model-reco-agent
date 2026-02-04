# Authentication System Guide

## Overview
The application now includes a role-based authentication system with a login page and protected routes.

---

## Demo Credentials

Use these credentials to test different user roles:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Specialisation Head / Admin** | admin@test.com | admin123 | Full system access, all features |
| **Engineer** | engineer@test.com | engineer123 | Generate recommendations, ML features, code generation |
| **Solution Architect** | arch@test.com | arch123 | Architecture design, deployment planning, cost estimation |
| **Project Manager** | pm@test.com | pm123 | View-only access, cost tracking, reports |
| **Viewer** | viewer@test.com | viewer123 | Read-only access to shared recommendations |

---

## Features Implemented

### 1. Login Page (`/login`)
- Email and password authentication
- Show/hide password toggle
- Remember me checkbox
- Loading states during authentication
- Error handling with user-friendly messages
- Demo credentials displayed for easy testing
- Responsive design with gradient background

### 2. Authentication Context
- Manages user authentication state
- Stores user session in localStorage
- Provides authentication methods (login, logout)
- Checks for existing sessions on app load

### 3. Route Protection
- **AuthGuard Component**: Protects routes requiring authentication
- Redirects unauthenticated users to login page
- Shows loading state while checking authentication
- Automatic redirect to home after successful login

### 4. Header Updates
- Displays logged-in user name and role
- Logout button with red icon
- User info visible on desktop (hidden on mobile)
- Smooth logout with redirect to login page

---

## File Structure

```
src/
├── pages/
│   └── LoginPage.tsx              # Login page component
├── contexts/
│   └── AuthContext.tsx            # Authentication context and provider
├── components/
│   ├── auth/
│   │   └── AuthGuard.tsx          # Route protection component
│   └── layout/
│       └── Header.tsx             # Updated with logout functionality
└── main.tsx                       # Updated with routing and auth provider
```

---

## How It Works

### 1. Application Flow
```
User visits app
    ↓
Check authentication (AuthContext)
    ↓
Not authenticated → Redirect to /login
    ↓
User enters credentials
    ↓
Validate against dummy credentials
    ↓
Store user info in localStorage
    ↓
Redirect to main app (/)
    ↓
AuthGuard allows access
    ↓
User can access protected features
```

### 2. Session Management
- User info stored in localStorage as JSON
- Session persists across page refreshes
- Logout clears localStorage and redirects to login
- No expiration (will be added with backend integration)

### 3. Dummy Authentication Logic
Located in `LoginPage.tsx`:
```typescript
const dummyCredentials = {
  'admin@test.com': { password: 'admin123', role: 'admin', name: 'Specialisation Head' },
  'engineer@test.com': { password: 'engineer123', role: 'engineer', name: 'Engineer' },
  'arch@test.com': { password: 'arch123', role: 'solution-architect', name: 'Solution Architect' },
  'pm@test.com': { password: 'pm123', role: 'project-manager', name: 'Project Manager' },
  'viewer@test.com': { password: 'viewer123', role: 'viewer', name: 'Viewer User' },
};
```

---

## Usage

### Testing the Login System

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the app:**
   - Open http://localhost:5173
   - You'll be redirected to `/login` if not authenticated

3. **Login with any demo credential:**
   - Example: `admin@test.com` / `admin123`
   - Click "Sign In"

4. **Explore the app:**
   - See your name and role in the header
   - All existing features work as before

5. **Logout:**
   - Click the red logout button in the header
   - You'll be redirected back to login page

---

## Next Steps: Backend Integration

When ready to integrate with a real backend, update these areas:

### 1. Replace Dummy Authentication
In `LoginPage.tsx`, replace the dummy credential check with an API call:

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    // Replace with actual API call
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    
    // Store JWT token and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    navigate('/');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 2. Add Token Management
Update `AuthContext.tsx` to handle JWT tokens:

```typescript
// Add token refresh logic
// Add token expiration checking
// Add automatic logout on token expiry
```

### 3. Add API Interceptors
Create an axios/fetch interceptor to:
- Attach JWT token to all API requests
- Handle 401 responses (logout user)
- Refresh tokens automatically

### 4. Implement Firebase Authentication
If using Firebase:

```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const handleLogin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  // Get user role from Firestore
  // Store in context
};
```

### 5. Add Role-Based UI Rendering
Create a `RoleGuard` component:

```typescript
// src/components/auth/RoleGuard.tsx
interface RoleGuardProps {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ roles, children, fallback }) => {
  const { user } = useAuth();
  
  if (!user || !roles.includes(user.role)) {
    return fallback || null;
  }
  
  return <>{children}</>;
};
```

Usage:
```typescript
<RoleGuard roles={['admin', 'ml-engineer']}>
  <CodeGeneratorButton />
</RoleGuard>
```

---

## Security Considerations

### Current Implementation (Development Only)
⚠️ **WARNING**: The current implementation is for development/demo purposes only:
- Passwords are stored in plain text in the code
- No encryption or hashing
- No token-based authentication
- Session stored in localStorage (vulnerable to XSS)
- No CSRF protection

### Production Requirements
Before deploying to production, implement:

1. **Backend Authentication**
   - Secure password hashing (bcrypt, argon2)
   - JWT token generation and validation
   - Refresh token mechanism
   - Rate limiting on login attempts

2. **Secure Storage**
   - Use httpOnly cookies for tokens (not localStorage)
   - Implement CSRF tokens
   - Use secure, sameSite cookie flags

3. **Session Management**
   - Token expiration (15-30 minutes)
   - Refresh token rotation
   - Logout on all devices functionality
   - Session timeout warnings

4. **Additional Security**
   - Two-factor authentication (2FA)
   - Email verification
   - Password reset flow
   - Account lockout after failed attempts
   - Audit logging

---

## Troubleshooting

### Issue: Stuck on login page after entering credentials
- Check browser console for errors
- Verify credentials match exactly (case-sensitive)
- Clear localStorage: `localStorage.clear()`

### Issue: Redirected to login after refresh
- Check if localStorage has user data
- Verify AuthContext is properly loading stored user
- Check browser console for parsing errors

### Issue: Logout button not working
- Check if useAuth hook is properly imported
- Verify navigate function from react-router-dom
- Check browser console for errors

---

## Testing Checklist

- [ ] Can access login page at `/login`
- [ ] Can login with admin credentials
- [ ] Can login with ml-engineer credentials
- [ ] Can login with other role credentials
- [ ] Invalid credentials show error message
- [ ] User info displays in header after login
- [ ] Session persists after page refresh
- [ ] Logout button redirects to login
- [ ] Cannot access main app without authentication
- [ ] Remember me checkbox is visible (not functional yet)
- [ ] Password show/hide toggle works
- [ ] Loading state shows during login
- [ ] Responsive design works on mobile

---

## Future Enhancements

1. **Forgot Password Flow**
   - Password reset email
   - Reset token validation
   - New password form

2. **Sign Up Page**
   - User registration
   - Email verification
   - Organization selection

3. **Social Login**
   - Google OAuth
   - Microsoft Azure AD
   - GitHub authentication

4. **User Management**
   - Admin panel for user management
   - Role assignment
   - User activation/deactivation

5. **Enhanced Security**
   - Two-factor authentication
   - Biometric authentication
   - Security questions

---

**Status**: ✅ Basic authentication system implemented and working  
**Next Step**: Integrate with backend API for production-ready authentication
