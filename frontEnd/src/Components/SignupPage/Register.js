import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style1.css'; 

const Register = ({ setUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNo: '',
        password: '',
        password2: '',
        userType: 'Farmer'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { name, email, mobileNo, password, password2, userType } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== password2) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const registerData = {
                name,
                email,
                mobileNo,
                password,
                userType
            };

            const res = await axios.post('/api/auth/register', registerData);
            setSuccess(res.data.msg);
            // Don't automatically log in the user
            // Instead, show success message and redirect to login
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.errors?.[0]?.msg ||
                err.response?.data?.msg ||
                'Registration failed. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="centerS">
            <h1>Register</h1>
            {error && <div className="login_link" style={{ color: 'red' }}>{error}</div>}
            {success && <div className="login_link" style={{ color: 'green' }}>{success}</div>}
            <form onSubmit={onSubmit}>
                <div className="txt_field">
                    <input
                        type="text"
                        required
                        name="name"
                        value={name}
                        onChange={onChange}
                        placeholder=" "
                    />
                    <span></span>
                    <label>Name</label>
                </div>
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
                    <label>Email Address</label>
                </div>
                <div className="txt_field">
                    <input
                        type="text"
                        required
                        name="mobileNo"
                        value={mobileNo}
                        onChange={onChange}
                        placeholder=" "
                    />
                    <span></span>
                    <label>Mobile Number</label>
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
                    <input
                        type="password"
                        required
                        name="password2"
                        value={password2}
                        onChange={onChange}
                        minLength="6"
                        placeholder=" "
                    />
                    <span></span>
                    <label>Confirm Password</label>
                </div>
        <div className="txt_field">
          <select
            name="userType"
            value={userType}
            onChange={onChange}
            className="custom-select"
          >
            <option value="Farmer">Farmer</option>
            <option value="Company">Company</option>
          </select>
          <span></span>
          <label>User Type</label>
        </div>
                <input
                    type="submit"
                    value={loading ? 'Loading...' : 'Create account'}
                    className="Create"
                    disabled={loading}
                />
                <div className="login_link">
                    Already have an account? <Link to="/OptionLogin">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;