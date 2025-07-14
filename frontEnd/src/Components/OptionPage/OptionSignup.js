import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Option.css";
const OptionSignup = () => {
  const navigate = useNavigate();
  const handleFarmer = () => {
    navigate('../SignUpFarmer');
  }
  const handleCompany = () => {
    navigate('../SignUpCompany');
  }
  const handleAdmin = () => {
    navigate('../SignUpAdmin');
  }
  return (
    <>
      {/* <Navbar/> */}
      <div className="he"> <button className='Option' id='card1' onClick={handleFarmer}>
        <div className="container1">
          <div className="card">
            Farmer
          </div>
        </div>
      </button>
        <button className='Option' id='card2' onClick={handleCompany}>
          <div className="container1">
            <div className="card">
              Buyer
            </div>
          </div>
        </button>
      </div>
    </>
  )
}

export default OptionSignup