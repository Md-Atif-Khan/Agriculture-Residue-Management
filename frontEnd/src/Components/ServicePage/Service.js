import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "./service.css"
import DeepContext from '../../context/DeepContext';

const Service = () => {
  const { showAlert } = useContext(DeepContext);

  const navigate = useNavigate()

  const [service, setService] = useState({
    email: "", mobileNo: "", acre: "", ptype: "", date1: "", du1: "", du2: "", type: [], mtype: ""
  })

  const Servicefun = async (e) => {
    e.preventDefault();

    const data1 = document.getElementsByName("radio1");
    let datatype = null;
    for (let i = 0; i < data1.length; i++) {
      if (data1[i].checked) {
        datatype = data1[i].value;
      }
    }
    const newValue = document.getElementsByClassName('myCheckBox');
    let arr = [];
    for (let i = 0; i < newValue.length; i++) {
      if (newValue[i].checked) {
        arr = [...arr, newValue[i].value];
      }
    }

    setService({ email: service.email, mobileNo: service.mobileNo, acre: service.acre, ptype: service.ptype, date1: service.date1, du1: service.du1, du2: service.du2, type: datatype, mtype: JSON.stringify(arr) });

    try {
      const res = await axios.post('http://localhost:8000/Service', {
        email: service.email,
        mobileNo: service.mobileNo,
        acre: service.acre,
        ptype: service.ptype,
        date1: service.date1,
        du1: service.du1,
        du2: service.du2,
        type: service.type,
        mtype: service.mtype
      });

      showAlert(res.data.msg, 'success');
      navigate('/FarmerHome');
    } catch (err) {
      if (err.response?.status === 409) {
        showAlert(err.response.data.msg, 'warning');
        navigate('/FarmerHome');
      } else if (err.response?.status === 401) {
        showAlert(err.response.data.msg, 'danger');
      } else {
        showAlert("Something went wrong!", 'danger');
      }
    }
  }

  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setService({ ...service, [name]: value })
    e.preventDefault();
  }

  return (
    <>
      {/* <Navbar>
      </Navbar> */}
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta> */}
      {/* <div className="space"></div> */}
      <div id='JB' className="center1">
        <h1>Service Form
        </h1>
        <form onSubmit={Servicefun} method="POST" id="myForm">
          <div className="txt_field">
            <input type="text" required name='email' value={service.email} onChange={handleInput} />

            <label>Email</label>
          </div>
          <div className="txt_field">
            <input type="text" required name='mobileNo' value={service.mobileNo} onChange={handleInput} />

            <label>Phone no.</label>
          </div>
          <div className="txt_field">
            <input type="text" name="acre" required value={service.acre} onChange={handleInput} />
            <span></span>
            <label>How much land you have?<small>(in acers*)</small></label>
          </div>
          <div className="txt_field">
            <input type="text" name="ptype" required value={service.ptype} onChange={handleInput} />
            <span></span>
            <label>Which crops are planted in your field?</label>
          </div>
          <span></span>
          <div className="txt_field">

            <input type="date" id="Date12" name="date1" value={service.date1} onChange={handleInput} />
            <label htmlFor="date12">When did you plant that crop?</label>
            {/* <span></span> */}
          </div>
          <div >

            <div className="txt_field">
              <input type="date" id="Du1" name="du1" value={service.du1} onChange={handleInput} />
              <label htmlFor="Du1">Approx duration of harvesting.</label>
              {/* <span></span> */}
            </div>

            <div className="txt_field">
              <input type="date" id="Du2" name="du2" value={service.du2} onChange={handleInput} />
              <label htmlFor="Du2">To</label>
              {/* <span></span> */}
            </div>  </div>

          <div className='jb' >

            <label>What do you want to give ? </label>
            <span></span>
          </div>

          <div className="radio-inputs jb1">
            <label className="radio">
              <input type="radio" name="radio1" value="Only Residue" />
              <div className="name" onClick={() => setService({ ...service, mtype: "Only Residue" })}>Only Residue</div>

            </label>
            <label className="radio">
              <input type="radio" name="radio1" value="Both Residue & Grains" />
              <div className="name" onClick={() => setService({ ...service, mtype: "Both Residue & Grains" })}>Both Residue & Grains</div>
            </label>
          </div>


          <div className='jb' >

            <label htmlFor="faq">Select Machine you need for harvesting</label>
            <span></span>
          </div>
          <div >
            <div className="jb2">
              <label className="conta">
                <input type="checkbox" value="Harvester" className='myCheckBox' />
                <div className="checkmark" onClick={() => setService({ ...service, type: "Harvester" })}></div>
              </label>
              <label className='jb3'>Harvester</label>
            </div>
            <div className="jb2">
              <label className="conta">
                <input type="checkbox" value="Tractor" className='myCheckBox' />
                <div className="checkmark" onClick={() => setService({ ...service, type: "Tractor" })}></div>
              </label>
              <label className='jb3'>Tractor</label>
            </div>
            <div className="jb2">
              <label className="conta">
                <input type="checkbox" value="Soil cultivator" className='myCheckBox' />
                <div className="checkmark" onClick={() => setService({ ...service, type: "Soil cultivator" })}></div>
              </label>
              <label className='jb3'>Soil cultivator</label>
            </div>
            <div className="jb2">
              <label className="conta">
                <input type="checkbox" value="Disc Plough" className='myCheckBox' />
                <div className="checkmark" onClick={() => setService({ ...service, type: "Disc Plough" })}></div>
              </label>
              <label className='jb3'>Disc Plough</label>
            </div>
            <div className="jb2">
              <label className="conta">
                <input type="checkbox" value="Thresher " className='myCheckBox' />
                <div className="checkmark" onClick={() => setService({ ...service, type: "Thresher" })}></div>
              </label>
              <label className='jb3'>Thresher</label>
            </div>
          </div>
          <div className="cen">
            <input type="submit" value="Request" />
          </div>
        </form>
      </div>
      <div className="space"></div>
    </>
  )
}

export default Service

