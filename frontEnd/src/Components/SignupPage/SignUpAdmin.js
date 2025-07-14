import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "./style1.css"
import DeepContext from '../../context/DeepContext';

const SignUpAdmin = () => {
  const { showAlert } = useContext(DeepContext);

  const navigate = useNavigate()

  const [Admin, setAdmin] = useState({
    name: "", mobileNo: "", email: "", password: "", cpassword: ""
  })

  const Adminsignup = async (e) => {
    e.preventDefault();
    if (Admin.password === Admin.cpassword) {
      const data = await axios.post('http://localhost:8000/SignUpAdmin', {
        name: Admin.name,
        mobileNo: Admin.mobileNo,
        email: Admin.email,
        password: Admin.password,
      })
      
      console.log(data.data);
      if (data.data.success) {
        showAlert(data.data.msg, 'success');
        navigate('/LoginAdmin')
      } else {
        showAlert(data.data.msg, 'danger');
      }
    }
    else {
      alert("Password Not Matching");
    }

  }

  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setAdmin({ ...Admin, [name]: value })
    e.preventDefault();
  }

  return (
    <>
      {/* <Navbar style="background-color:#1a4664;"> */}
      {/* </Navbar> */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <div id='Xbox' className="centerS">
        <h1>SignUp for Admin
        </h1>
        <form onSubmit={Adminsignup} method="post">
          <div className="txt_field">
            <input type="text" required name='name' value={Admin.name} onChange={handleInput} />

            <label>Name</label>
          </div>
          <div className="txt_field">
            <input type="text" required name='email' value={Admin.email} onChange={handleInput} />

            <label>Email</label>
          </div>
          <div className="txt_field">
            <input type="text" required name='mobileNo' value={Admin.mobileNo} onChange={handleInput} />

            <label>Phone no.</label>
          </div>
          <div className="txt_field">
            <input type="text" required name='password' value={Admin.password} onChange={handleInput} />

            <label>Password</label>
          </div>
          <div className="txt_field">
            <input type="password" required name='cpassword' value={Admin.cpassword} onChange={handleInput} />

            <label>Confirm Password</label>
          </div>
          <input type="submit" value="Create account" className="Create" />
          <div className="login_link">
            already have account? <a href="LoginAdmin">Login</a>
          </div>
        </form>
      </div>
    </>
  )
}

export default SignUpAdmin