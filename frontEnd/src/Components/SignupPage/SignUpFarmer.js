import React, { useContext,useState } from 'react'
import LoginFarmer from '../LoginPage/LoginFarmer'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar';
import "./style1.css"
import DeepContext from '../../context/DeepContext';
const SignUpFarmer = () => {
  const {showAlert}=useContext(DeepContext);

  const navigate = useNavigate()

  const [user, setUser] = useState({
    name: "", mobileno: "", email: "", password: "", cpassword: ""
  })

  const usersignup = async (e) => {
    e.preventDefault();
    if (user.password === user.cpassword) {
      const data = await axios.post('http://localhost:5001/SignUpFarmer', {
        name: user.name,
        mobileno: user.mobileno,
        email: user.email,
        password: user.password,
      })
      console.log("focus here",data.data);
      if (data.data.success) {
        showAlert(data.data.message,'success');
        navigate('/LoginFarmer')
      } else {
        showAlert(data.data.message,'danger');
      }
    }
    else{
      alert("Password Not Matching");
    }

  }


  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value })
    e.preventDefault();
  }


  return (
    <>
      {/* <Navbar style="background-color:#1a4664;"> */}
      {/* </Navbar> */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <div id='Xbox' className="centerS">
        <h1>SignUp for Farmer</h1>
        <form onSubmit={usersignup} method="post">
          <div className="txt_field">
            <input type="text" required name='name' value={user.name} onChange={handleInput} />

            <label>Name</label>
          </div>
          <div className="txt_field">
            <input type="text" required name='email' value={user.email} onChange={handleInput} />

            <label>Email</label>
          </div>
          <div className="txt_field">
            <input type="text" required name='mobileno' value={user.mobileno} onChange={handleInput} />

            <label>Phone no.</label>
          </div>
          <div className="txt_field">
            <input type="text" required name='password' value={user.password} onChange={handleInput} />

            <label>Password</label>
          </div>
          <div className="txt_field">
            <input type="password" required name='cpassword' value={user.cpassword} onChange={handleInput} />

            <label>Confirm Password</label>
          </div>
          <input type="submit" value="Create account" className="Create" />
          <div className="login_link">
            already have account? <a href="/LoginFarmer">Login</a>
          </div>
        </form>
      </div>
    </>
  )
}

export default SignUpFarmer






