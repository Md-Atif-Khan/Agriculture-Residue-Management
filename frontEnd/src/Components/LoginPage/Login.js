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

//   const requestVerificationEmail = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.post('/api/auth/resend-verification', { email });
//       setEmailNotVerified(false);
//       setError('');
//       setDebugInfo(`Verification email sent to ${email}. Please check your inbox.`);
//     } catch (err) {
//       setError('Failed to send verification email. Please try again later.');
//       console.error('Verification email error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

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
      // Check for email verification error (401 status)
    //   if (err.response?.status === 401 && err.response?.data?.needsVerification) {
    //     setEmailNotVerified(true);
    //     setError('Email not verified. Please check your inbox for verification link or request a new one.');
        
    //     // Check the verification status
    //     try {
    //       const verificationCheck = await axios.get(
    //         `http://localhost:8000/api/auth/check-verification?email=${email}&type=${userType}`
    //       );
    //       console.log('Verification status:', verificationCheck.data);
          
    //       if (verificationCheck.data.isEmailVerified) {
    //         setDebugInfo(
    //           `Your account appears to be verified in the database, but the login system is not recognizing it. 
    //           Please try refreshing the page and logging in again.`
    //         );
    //       } else {
    //         setDebugInfo(
    //           `Your email ${email} needs verification. Verification token expires: 
    //           ${new Date(verificationCheck.data.tokenExpiry).toLocaleString()}`
    //         );
    //       }
    //     } catch (checkErr) {
    //       console.error('Error checking verification status:', checkErr);
    //     }
    //   } else {
        // Enhanced error message with more details
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

//   const handleGoogleSuccess = (response) => {
//     console.log('Google login success:', response);
//     if (response.token) {
//       localStorage.setItem('token', response.token);
//       axios.defaults.headers.common['x-auth-token'] = response.token;
//       setUser(response.user);
//       navigate('/dashboard');
//     }
//   };

//   const handleGoogleError = (error) => {
//     console.error('Google login error:', error);
//     // Ensure error is a string
//     setError(typeof error === 'string' ? error : 'Google login failed');
//   };

//   return (
//     <div className="auth-container">
//       <h1 className="text-primary mb-4">Login</h1>
//       {error && <div className="alert alert-danger">{error}</div>}
//       {/* {emailNotVerified && (
//         <div className="alert alert-warning">
//           <p>Your email has not been verified. Please check your inbox for a verification link.</p>
//           <button 
//             className="btn btn-sm btn-outline-primary mt-2" 
//             onClick={requestVerificationEmail}
//             disabled={loading}
//           >
//             {loading ? 'Sending...' : 'Resend Verification Email'}
//           </button>
//         </div>
//       )} */}
//       {debugInfo && <div className="alert alert-info">{debugInfo}</div>}
      
//       <form onSubmit={onSubmit}>
//         <div className="form-group">
//           <label>Email Address</label>
//           <input
//             type="email"
//             className="form-control"
//             name="email"
//             value={email}
//             onChange={onChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             className="form-control"
//             name="password"
//             value={password}
//             onChange={onChange}
//             required
//             minLength="6"
//           />
//         </div>
//         <div className="form-group">
//           <label>User Type</label>
//           <select
//             className="form-control"
//             name="userType"
//             value={userType}
//             onChange={handleUserTypeChange}
//           >
//             <option value="Farmer">Farmer</option>
//             <option value="Company">Company</option>
//             <option value="Admin">Admin</option>
//           </select>
//         </div>
//         <button
//           type="submit"
//           className="btn btn-primary btn-block"
//           disabled={loading}
//         >
//           {loading ? 'Loading...' : 'Login'}
//         </button>
//       </form>

//       {/* <div className="mt-3 text-center">
//         <p>Or login with</p>
//         <div className="google-signin-container">
//           <GoogleSignIn
//             onSuccess={handleGoogleSuccess}
//             onError={handleGoogleError}
//             userType={userType}
//           />
//           <p className="text-muted small mt-2">
//             By signing in with Google, you'll create an account if you don't have one already.
//           </p>
//         </div>
//       </div> */}

//       <p className="mt-3">
//         Don't have an account? <Link to="/OptionSignup">Register</Link>
//       </p>
      
//       {/* <p className="mt-2">
//         <Link to="/forgot-password">Forgot Password?</Link>
//       </p> */}
//     </div>
//   );

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