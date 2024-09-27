import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Option.css";
const OptionLogin = () => {
  const navigate = useNavigate();
  const handleFarmer = () => {
    navigate('../LoginFarmer');
  }
  const handleCompany = () => {
    navigate('../LoginCompany');
  }
  const handleAdmin = () => {
    navigate('../LoginAdmin');
  }
  return (
    <>
      {/* <Navbar/> */}
      <div className="he"> <button className='Option' id='card1' onClick={handleFarmer}>
        <div class="container1">
          <div class="card">
            Farmer
          </div>
        </div>
      </button>
        <button className='Option' id='card2' onClick={handleCompany}>
          <div class="container1">
            <div class="card">
              Buyer
            </div>
          </div>
        </button>
        <button className='Option' id='card3' onClick={handleAdmin}>
          <div class="container1">
            <div class="card">
              Admin
            </div>
          </div>
        </button></div>
    </>
  )
}

export default OptionLogin