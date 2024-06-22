import React, { useContext, useState } from 'react'
import "./style.css"
import SignUpCompany from '../SignupPage/SignUpCompany'
import Forget from './Forget'
import Navbar from '../Navbar/Navbar'; 
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import DeepContext from '../../context/DeepContext';

const LoginCompany = () => {
  const {showAlert,LoginC,user,setUser}=useContext(DeepContext);

  const navigate = useNavigate()
  
  const [Company,setCompany] = useState({
    email:"", password:""
  })
  
  const Companylogin = async (e) => {
    e.preventDefault();
    const data = await axios.post('http://localhost:5000/LoginCompany', {
      email: Company.email,
      password: Company.password
    })
    // console.log("inside company   ,"+data);
    if(data.data.success){
      showAlert(data.data.message,'success');
      // <submit/>
      // let Cname=data.data.data.name;
      localStorage.setItem("loginC",'true');
      setUser(data.data.data)
      LoginC(data.data.data.name,'true');
      localStorage.setItem('user',data.data.data.name);
      localStorage.setItem("userLogin",JSON.stringify(data.data.data));
   
      navigate('/CompanyHome')
    }else{
      showAlert(data.data.message,'danger');
    }
  }
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Regular expression for password validation (at least 8 characters long)
  const passwordRegex = /^.{8,}$/;
  let name,value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setCompany({...Company, [name]:value})
    e.preventDefault();


    if (name === 'email' && !emailRegex.test(value)) {
      showAlert('Please enter a valid email address', 'danger');
    }

    // Password validation
    if (name === 'password' && !passwordRegex.test(value)) {
      showAlert('Password must be at least 8 characters long', 'danger');
    }

    setCompany({ ...Company, [name]: value });
    e.preventDefault();
  }


 



  return (
    <>
    {/* <Navbar/> */}
      <div className="centerL">
      <h1>Login For Buyer</h1>
      <form  onSubmit={Companylogin} method="post">
        <div className="txt_field">  

          <input type="text" required name='email'  value={Company.email} onChange={handleInput}/>
          <label>BuyerName</label>
        </div>
        <div className="txt_field"> 

          <input type="password" required name='password'  value={Company.password} onChange={handleInput}/>
          <label>Password</label>
        </div>
        <div className="pass"><a href="Forget" >Forget Password?</a></div>

             <input type="submit" value="Login" className="Login" />
        <div className="signup_link">
          Not a member? <a href="SignUpCompany" >Signup</a>
        </div>
      </form>
    </div>
    </>
  )
}

export default LoginCompany