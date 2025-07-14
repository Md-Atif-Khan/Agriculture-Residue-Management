import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import DeepContext from '../../../../context/DeepContext';
import './ClearReqForm.css'
const ClearReqForm = () => {
  const { showAlert, EndObject } = useContext(DeepContext);
  const navigate = useNavigate();
  const SerData = EndObject;
  const [ClearedList, setClearedList] = useState({
    email: SerData.email || "",
    tResidue: "",
    tgrain: "",
    sdate: ""
  });

  const ClearRequest = async (e) => {
    e.preventDefault();

    setClearedList({ email: SerData.email, tResidue: ClearedList.tResidue, tgrain: ClearedList.tgrain, sdate: ClearedList.sdate });
    const data = await axios.post('http://localhost:8000/ClearReqForm', {
      email: ClearedList.email,
      tResidue: ClearedList.tResidue,
      tgrain: ClearedList.tgrain,
      sdate: ClearedList.sdate
    });
    //   if( LoginA){
    if (data.data.success) {
      showAlert(data.data.message, 'success');
      // setClearedList(data.data.data);
      // localStorage.setItem("userLogin",JSON.stringify(data.data.data));
      navigate('/AdminHome');
    } else {
      showAlert(data.data.message, 'danger');
    }
    // }
  }

  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setClearedList({ ...ClearedList, email: SerData.email, [name]: value })
    e.preventDefault();
  }
  return (
    <>

      <div className="containerC">
        <h1 id='headq' className='headq'>Service Submission </h1>
        <form className='card12' method="POST">
          <div className="card-header12">
            <label>Total Residue collected :
              <input type="text" required name="tResidue" value={ClearedList.tResidue} onChange={handleInput} />
            </label>
          </div>
          <div className="card-header12">
            <label>Total Grains
              <input type="text" name="tgrain" required value={ClearedList.tgrain} onChange={handleInput} />
            </label>

          </div>
          <div className="card-header12">
            <label>FullFill Date
              <input type="date" required name="sdate" value={ClearedList.sdate} onChange={handleInput} />
            </label>
          </div>

          <input type="submit" value="Submit" onClick={ClearRequest} />
        </form>
      </div>
    </>
  )
}

export default ClearReqForm