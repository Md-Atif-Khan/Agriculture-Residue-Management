import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeepContext from '../../context/DeepContext';
import './style.css';
// import GoogleSignIn from '../GoogleSignIn';
// Set axios defaults for all requests
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Login = () => {
  const { setUser } = useContext(DeepContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'Farmer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
//   const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const { email, password, userType } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (e) => {
    setFormData({
      ...formData,
      userType: e.target.value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // setEmailNotVerified(false);
    setDebugInfo('');

    try {
      // For debugging
      setDebugInfo(`Attempting to log in with: ${email} as ${userType}`);
      
      // Make sure we're sending to the correct endpoint
      const res = await axios.post('/api/auth/login', formData);
            
      if (res.data && res.data.token) {
        // Set token to localStorage
        localStorage.setItem('token', res.data.token);
        
        // Set auth header for future requests
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
        
        // Set user state
        const currentUser = res.data.user;
        setUser(currentUser);
        
        setDebugInfo('Login successful, redirecting to dashboard...');
        // Redirect to dashboard
        setTimeout(() => {
          if(currentUser.type === 'Farmer') {
            navigate('/FarmerHome');
          } else if(currentUser.type === 'Company') {
            navigate('/CompanyHome');
          } else if(currentUser.type === 'Admin') {
            navigate('/AdminHome');
          }
        }, 500); // Small delay to ensure state updates
      }
    } catch (err) {      
        const errorMessage = err.response?.data?.msg || 'Login failed. Please try again.';
        const statusCode = err.response?.status || 'Unknown';
        
        setError(`${errorMessage} (Status: ${statusCode})`);
        
        // Show more debug info
        setDebugInfo(`Request failed with status ${statusCode}. Check console for details. Error: ${err.message}`);
      }
    // }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="centerL">
      <h1>Login</h1>
      <form method="post" onSubmit={onSubmit}>
        <div className="txt_field">
          <input
            type="email"
            required
            name="email"
            value={email}
            onChange={onChange}
            placeholder=" "
          />
          <span></span>
          <label>Email Id</label>
        </div>
        <div className="txt_field">
          <input
            type="password"
            required
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            placeholder=" "
          />
          <span></span>
          <label>Password</label>
        </div>
        <div className="txt_field">
          <select
            name="userType"
            value={userType}
            onChange={handleUserTypeChange}
            className="custom-select"
          >
            <option value="Farmer">Farmer</option>
            <option value="Company">Company</option>
            <option value="Admin">Admin</option>
          </select>
          <span></span>
          <label>User Type</label>
        </div>
        <div className="pass">
          <Link to="/forgot-password">Forget Password?</Link>
        </div>
        <input
          type="submit"
          value={loading ? 'Loading...' : 'Login'}
          className="Login"
          disabled={loading}
        />
        {error && <div className="signup_link" style={{ color: 'red' }}>{error}</div>}
        {/* {debugInfo && <div className="signup_link" style={{ color: 'blue' }}>{debugInfo}</div>} */}
        <div className="signup_link">
          Don't have an account? <Link to="/OptionSignup">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;