import React, { useContext, useState } from 'react'
import "./style.css"
import SignUpFarmer from '../SignupPage/SignUpFarmer'
import Forget from './Forget'
import Navbar from '../Navbar/Navbar';
// import Home from '../HomePage/Home'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import DeepContext from '../../context/DeepContext';
const LoginFarmer = () => {
  const { showAlert, LoginF, user, setUser } = useContext(DeepContext);
  const navigate = useNavigate()

  const [user1, setuser] = useState({
    email: "", password: ""
  })

  const userlogin = async (e) => {
    e.preventDefault();
    const data = await axios.post('http://localhost:8000/LoginFarmer', {
      email: user1.email,
      password: user1.password
    })
    console.log(data);
    if (data.data.success) {
      showAlert(data.data.message, 'success');
      setUser(data.data.data)
      // localStorage.setItem("userLogin", JSON.stringify(data.data.data));
      LoginF('true');
      navigate('/FarmerHome')
    } else {
      showAlert(data.data.message, 'danger');
    }
  }
  const emailRegex = /^[0-9]{10}$/;


  // Regular expression for password validation (at least 8 characters long)
  const passwordRegex = /^.{8,}$/;
  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setuser({ ...user1, [name]: value })

    if (name === 'email' && !emailRegex.test(value)) {
      showAlert('Please enter a valid mobile number ', 'danger');
    }

    if (name === 'password' && !passwordRegex.test(value)) {
      showAlert('Password must be at least 8 characters long', 'danger');
    }
    e.preventDefault();
  }

  return (
    <>
      {/* <Navbar/> */}
      <div className="centerL">
        <h1>Login for Farmer</h1>
        <form onSubmit={userlogin} method="post">
          <div className="txt_field">

            <input type="text" required name='email' value={user1.email} onChange={handleInput} />
            <label>Email Id</label>
          </div>
          <div className="txt_field">

            <input type="password" required name='password' value={user1.password} onChange={handleInput} />
            <label>Password</label>
          </div>
          <div className="pass"><a href="Forget" >Forget Password?</a></div>

          <input type="submit" value="Login" className="Login" />
          <div className="signup_link">
            Not a member? <a href="SignUpFarmer" >Signup</a>
          </div>
        </form>
      </div>
    </>
  )
}

export default LoginFarmer