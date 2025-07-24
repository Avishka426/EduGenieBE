# 🎨 EduGenie Frontend Integration Guide

## 📋 Backend API Reference

Your EduGenie backend is running on `http://localhost:3000` with the following endpoints:

### 🔐 Authentication Endpoints

#### 1. User Registration
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "role": "student" // optional: "student", "instructor", "admin"
}

Response (201):
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f1b2b3c4d5e6f7a8b9c0d1",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

#### 2. User Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f1b2b3c4d5e6f7a8b9c0d1",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

#### 3. Get User Profile
```
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200):
{
  "user": {
    "id": "60f1b2b3c4d5e6f7a8b9c0d1",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "student",
    "profilePicture": null,
    "createdAt": "2025-07-24T05:40:55.188Z"
  }
}
```

### 🛠️ Utility Endpoints

#### Health Check
```
GET /health

Response (200):
{
  "message": "EduGenie Backend is running!",
  "timestamp": "2025-07-24T05:40:55.188Z",
  "environment": "development"
}
```

#### API Documentation
```
GET /api

Response (200):
{
  "message": "EduGenie API v1.0",
  "endpoints": { ... }
}
```

---

## 🚀 Frontend Implementation Examples

### 1. React/React Native with Axios

#### Install Dependencies
```bash
npm install axios
# For React Native also install:
npm install @react-native-async-storage/async-storage
```

#### API Service File (`services/api.js`)
```javascript
import axios from 'axios';
// For React Native:
// import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3000'; // Change for production
// For React Native on Android emulator: 'http://10.0.2.2:3000'
// For React Native on iOS simulator: 'http://localhost:3000'
// For React Native on physical device: 'http://YOUR_COMPUTER_IP:3000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authToken'); // For React
    // For React Native: const token = await AsyncStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('authToken');
      // For React Native: AsyncStorage.removeItem('authToken');
      window.location.href = '/login'; // For React
      // For React Native: navigation.navigate('Login');
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Auth Service (`services/authService.js`)
```javascript
import api from './api';

class AuthService {
  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // For React Native:
        // await AsyncStorage.setItem('authToken', response.data.token);
        // await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  }

  async login(email, password) {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // For React Native:
        // await AsyncStorage.setItem('authToken', response.data.token);
        // await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  }

  async getProfile() {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // For React Native:
    // AsyncStorage.removeItem('authToken');
    // AsyncStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    // For React Native: const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
    // For React Native: return !!(await AsyncStorage.getItem('authToken'));
  }
}

export default new AuthService();
```

### 2. React Component Examples

#### Login Component
```jsx
import React, { useState } from 'react';
import authService from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authService.login(email, password);
      console.log('Login successful:', response);
      
      // Navigate to home screen
      navigation.navigate('Home');
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login to EduGenie</h2>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};

export default LoginScreen;
```

#### Registration Component
```jsx
import React, { useState } from 'react';
import authService from '../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authService.register(formData);
      console.log('Registration successful:', response);
      
      // Navigate to home screen
      navigation.navigate('Home');
    } catch (error) {
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Join EduGenie</h2>
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      
      <input
        type="password"
        placeholder="Password (min 6 characters)"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
      
      <select
        value={formData.role}
        onChange={(e) => setFormData({...formData, role: e.target.value})}
      >
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
      </select>
      
      <button onClick={handleRegister} disabled={loading}>
        {loading ? 'Creating Account...' : 'Register'}
      </button>
    </div>
  );
};

export default RegisterScreen;
```

### 3. Context/State Management

#### Auth Context (React)
```jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentUser();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token: localStorage.getItem('authToken') }
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.login(email, password);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.user, token: response.token }
      });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

## 🔧 Environment Configuration

### Development vs Production

#### For Local Development:
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

#### For React Native:
```javascript
// Android Emulator
const API_BASE_URL = 'http://10.0.2.2:3000';

// iOS Simulator  
const API_BASE_URL = 'http://localhost:3000';

// Physical Device (replace with your computer's IP)
const API_BASE_URL = 'http://192.168.1.100:3000';
```

#### For Production:
```javascript
const API_BASE_URL = 'https://your-backend-domain.com';
```

---

## 🛡️ Security Best Practices

1. **Token Storage**:
   - Web: Use httpOnly cookies or secure localStorage
   - React Native: Use secure storage like Keychain (iOS) or KeyStore (Android)

2. **Input Validation**:
   - Validate email format on frontend
   - Ensure password meets requirements (min 6 chars)
   - Sanitize user inputs

3. **Error Handling**:
   - Don't expose sensitive error details to users
   - Log errors for debugging
   - Provide user-friendly error messages

4. **Network Security**:
   - Use HTTPS in production
   - Implement request timeouts
   - Handle network failures gracefully

---

## 🧪 Testing Your Frontend

### Test Registration Flow:
1. Fill registration form with valid data
2. Submit and verify user gets created
3. Check that token is stored
4. Verify automatic login after registration

### Test Login Flow:
1. Use existing credentials
2. Verify token storage
3. Check user data persistence
4. Test automatic logout on token expiry

### Test Protected Routes:
1. Try accessing profile without login
2. Verify redirect to login screen
3. Test token refresh if implemented

---

## 📱 Platform-Specific Notes

### React Web:
- Use React Router for navigation
- Store tokens in localStorage or cookies
- Handle browser refresh scenarios

### React Native:
- Use React Navigation
- Use AsyncStorage or secure storage
- Handle app backgrounding/foregrounding
- Test on both iOS and Android

### Flutter:
- Use http or dio package
- Store tokens with flutter_secure_storage
- Handle platform-specific navigation

---

Your backend is ready and waiting for frontend connections! 🚀

Test the backend with: `node quick-test.js`
Start the backend with: `npm run dev` or double-click `start.bat`
