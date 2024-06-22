import React, { useContext, useState } from 'react'
// import LoginCompany from '../LoginPage/LoginCompany' 
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
// import Navbar from '../Navbar/Navbar';
import "./style1.css"
import DeepContext from '../../context/DeepContext';

const SignUpCompany = () => {
  const {showAlert}=useContext(DeepContext);

  const navigate = useNavigate()

  const [company, setCompany] = useState({
    name: "", mobileno: "", email: "", password: "", cpassword: ""
  })

  const Companysignup = async (e) => {
    e.preventDefault();
    if (company.password === company.cpassword) {
      const data = await axios.post('http://localhost:5000/SignUpCompany', {
        name: company.name,
        mobileno: company.mobileno,
        email: company.email,
        password: company.password,
      })
      // console.log(data.data);
      if (data.data.success) {
        showAlert(data.data.msg,'success');
        navigate('/LoginCompany')
      } else {
        showAlert(data.data.msg,'danger');
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
    setCompany({ ...company, [name]: value })
    e.preventDefault();
  }


  return (
    <>
      {/* <Navbar style="background-color:#1a4664;"> */}
      {/* </Navbar> */}
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta> */}
      <div id='Xbox' className="centerS">
        <h1>SignUp for Buyer
        </h1>
        <form onSubmit={Companysignup} method="post">
          <div className="txt_field">
            <input type="text" required name='name' value={company.name} onChange={handleInput} />

            <label>Name</label>
          </div>
          <div className="txt_field">
            <input type="text" required name='email' value={company.email} onChange={handleInput} />

            <label>Email</label>
          </div>
          <div className="txt_field">
            <input type="text" required name='mobileno' value={company.mobileno} onChange={handleInput} />

            <label>Phone no.</label>
          </div>
          <div className="txt_field">
            <input type="text" required name='password' value={company.password} onChange={handleInput} />

            <label>Password</label>
          </div>
          <div className="txt_field">
            <input type="password" required name='cpassword' value={company.cpassword} onChange={handleInput} />

            <label>Confirm Password</label>
          </div>
          <input type="submit" value="Create account" className="Create"/>
          <div className="login_link">
            already have account? <a href="LoginCompany">Login</a>
          </div>
        </form>
      </div>
    </>
  )
}

export default SignUpCompany