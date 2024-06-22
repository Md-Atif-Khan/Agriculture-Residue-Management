import React, { useContext, useState, useEffect } from 'react';
// import axios from 'axios';
import './Navbar.css';
// import Home from '../HomePage/Home';

// import OptionSignup from '../OptionPage/OptionSignup';
import DeepContext from '../../context/DeepContext';
// import OptionLogin from '../OptionPage/OptionLogin';
import { useNavigate } from 'react-router-dom';
function Navbar() {
   const [user1, setUser1] = useState("");
    const { loggedinC, LoginC, loggedinF, LoginF, loggedinA, LoginA, user, setUser } = useContext(DeepContext);
    // const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        // console.log("User-->", user);
    }, [user])
    useEffect(() => {
        let u = JSON.parse(localStorage.getItem("userLogin"));
        u ? setUser(u) : setUser(null)
    }, [])
    useEffect(() => {
        // axios.get('/')
        //     .then(res => setLoggedIn(res.data.loggedIn))
        //     .catch(err => console.log(err));
        const user2 = localStorage.getItem("user");
        // console.log(user1);
        setUser1(user2);
        // console.log("hehehehhe",loggedinF , "dfsd",loggedinA,"dfsd",loggedinC);
    }, [loggedinA, loggedinC, loggedinF]);

    const Logout = () => {
        // axios.post('/')
        //     .then(() => setLoggedIn(false))
        //     .catch(err => console.log(err));
        // localStorage.setItem("user",'');
        localStorage.setItem("user", false);
        localStorage.setItem("loginA", false);
        localStorage.setItem("loginF", false);
        localStorage.removeItem("user");
        setUser(null);
        setUser1(null);
        LoginC(null, 'false');
        LoginA('false');
        LoginF('false');
        navigate('/')
        // console.log("jenish",user);
    };


    const navigate = useNavigate();
    const handleSignup = () => {
        navigate('OptionSignup');
        // setIsLoggedIn(false);
    }
    const handleLogin = () => {
        navigate('OptionLogin');
        // setIsLoggedIn(true);
    }

    const ProfileFun = () => {
        navigate('Profile');
    }


    return (
        <>
            <div className="navbar-container">
                <div className="navbar-logo">
                    <img src="../images/v914-ning-21a.jpg" className="company-logo" alt="" />
                    <strong className="Companyname">
                        AgricultureTank
                    </strong>
                </div>
                <div className="navbar-right">
                    <div className="navbar-options">
                        <span className="navbar-options-btn">
                            {loggedinF === 'true' && <a href='/FarmerHome'>Home</a>}
                            {loggedinC === 'true' && <a href='/CompanyHome'>Home</a>
                            }
                            {loggedinA === 'true' && <a href='/AdminHome'>Home</a>
                            }
                            {loggedinA === 'false' && loggedinF === 'false' && loggedinC === 'false' && <a href='/'>Home</a>
                            }
                        </span>
                        <span className="navbar-options-btn">
                            <a href="#about">About</a>
                        </span>
                        {/* <span className="navbar-options-btn">
                            <a href="#Research">Survey</a>
                        </span> */}
                        <span className="navbar-options-btn">
                            <a href="#contact">Contact</a>
                        </span>
                    </div>
                    <div className="signin btn" id="log-btn">


                        {/* <button role="button" className="button-name" onClick={handleLogin}>
                            SIGN IN</button> */}
                        {

                        }
                        {
                            user ?
                                <>
                                    <button role="button" className="button-name" onClick={ProfileFun}>{user.name}</button>
                                    <button role="button" className="button-name" onClick={Logout}>LogOut</button>
                                </>
                                :
                                <>

                                    <button role="button" className="button-name" onClick={handleSignup}>REGISTER</button>
                                    <button role="button" className="button-name" onClick={handleLogin}>LogIn</button>
                                </>

                        }


                    </div>

                </div>
            </div>

        </>
    )
}

export default Navbar