import React, { useContext } from 'react';
import './Navbar.css';
import DeepContext from '../../context/DeepContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
    const { user, setUser } = useContext(DeepContext);
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        delete axios.defaults.headers.common['x-auth-token'];
        navigate('/');
    };
    const navigate = useNavigate();
    const handleSignup = () => {
        navigate('OptionSignup');
    }
    const handleLogin = () => {
        navigate('OptionLogin');
    }
    const ProfileFun = () => {
        navigate('Profile');
    }

    const HomePage = () => {
        navigate('/');
    }

    return (
        <>
            <div className="navbar-container">
                <div className="navbar-logo" onClick={HomePage} style={{ cursor: 'pointer' }}>
                    <img src="../images/v914-ning-21a.jpg" className="company-logo" alt="" />
                    <strong className="Companyname">
                        AgricultureTank
                    </strong>
                </div>
                <div className="navbar-right">
                    <div className="navbar-options">
                        <span className="navbar-options-btn">
                            <a href="#about">About</a>
                        </span>

                        <span className="navbar-options-btn">
                            <a href="#contact">Contact</a>
                        </span>
                    </div>
                    <div className="signin btn" id="log-btn">
                        {
                            user ?
                                <>
                                    <button className="button-name" onClick={ProfileFun}>{user.name}</button>
                                    <button className="button-name" onClick={logout}>LogOut</button>
                                </>
                                :
                                <>

                                    <button className="button-name" onClick={handleSignup}>Register</button>
                                    <button className="button-name" onClick={handleLogin}>LogIn</button>
                                </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar