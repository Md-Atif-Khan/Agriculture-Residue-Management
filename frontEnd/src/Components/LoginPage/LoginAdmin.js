import React, { useContext, useState } from 'react'
import "./style.css"
import SignUpAdmin from '../SignupPage/SignUpAdmin'
// import Forget from './Forget'
// import Navbar from '../Navbar/Navbar'; 
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import DeepContext from '../../context/DeepContext';
const LoginAdmin = () => {
  const { showAlert, LoginA, user, setUser } = useContext(DeepContext);
  const navigate = useNavigate()

  const [Admin, setAdmin] = useState({
    email: "", password: ""
  })

  const Adminlogin = async (e) => {
    e.preventDefault();
    const data = await axios.post('http://localhost:8000/LoginAdmin', {
      email: Admin.email,
      password: Admin.password
    })
    if (data.data.success) {
      showAlert(data.data.message, 'success');
      setUser(data.data.data)

      localStorage.setItem("userLogin", JSON.stringify(data.data.data));
      LoginA('true');
      navigate('/AdminHome')
    } else {
      showAlert(data.data.message, 'danger');
    }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Regular expression for password validation (at least 8 characters long)
  const passwordRegex = /^.{8,}$/;
  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;


    if (name === 'email' && !emailRegex.test(value)) {
      showAlert('Please enter a valid email address', 'danger');
    }

    // Password validation
    if (name === 'password' && !passwordRegex.test(value)) {
      showAlert('Password must be at least 8 characters long', 'danger');
    }
    setAdmin({ ...Admin, [name]: value })
    e.preventDefault();
  }

  return (
    <>
      {/* <Navbar/> */}
      <div className="centerL">
        <h1>Login For Admin</h1>
        <form method="post">
          <div className="txt_field">

            <input type="text" required name='email' value={Admin.email} onChange={handleInput} />
            <label>Admin email</label>
          </div>
          <div className="txt_field">

            <input type="password" required name='password' value={Admin.password} onChange={handleInput} />
            <label>Password</label>
          </div>
          <div className="pass"><a href="Forget" >Forget Password?</a></div>

          <input type="submit" value="Login" className="Login" onClick={Adminlogin} />
          <div className="signup_link">
            Not a member? <a href="SignUpAdmin" >Signup</a>
          </div>
        </form>
      </div>
    </>
  )
}

export default LoginAdmin