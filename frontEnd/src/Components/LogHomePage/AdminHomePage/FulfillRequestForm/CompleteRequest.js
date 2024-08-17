import React, { useEffect, useState, useContext } from 'react';
import './CompleteRequest.css';
import { useNavigate } from 'react-router-dom'
import DeepContext from '../../../../context/DeepContext';
import axios from 'axios';
const ListContainer = () => {

  const { showAlert,user, EndObject,FullfillRequest } = useContext(DeepContext);
  // console.log(EndObject+"this is end object");
  const data = EndObject;
  // console.log("test print",user);
  const navigate = useNavigate()
  const handleBack = () => {
    navigate('/AdminHome')
  }
  const handleRequest = () => {
    FullfillRequest(data);
    navigate('/ClearReqForm');
  }
  //   const [service, setService] = useState();
  //   const getData = async () => {
  //     const request=localStorage.getItem("request");
  //     const data = await axios.post("http://localhost:8000/AuctionHome")
  // // console.log("requesttttttttt ",request)
  //     if (request) {
  //       // setRoom(data?.data?.room);
  //       setService(request);
  //     } else {
  //       showAlert(data?.data?.message);
  //     }
  //   }

  //   useEffect(() => {
  //     getData();
  //   }, [])
  //   useEffect(() => {
  //     // console.log("Room->", room)
  //     console.log("Service->", service)
  //   }, [service])
  return (
    <>
      <div class="cardforlist">
        <div class="tools">
          <div class="circle">
            <button onClick={handleBack}><span class="red box">Back</span></button>
          </div>
        </div>
        {/* <div class="card__content"> */}
        {/*   <div className="oneline"> <h2>Email: {service.email}</h2></div> */}
        {/* <div className="oneline"><p>Mobile No: {service.mobileno}</p></div>
      <div className="oneline"><p>Acre: {service.acre}</p></div>
      <div className="oneline"><p>Property Type: {service.ptype}</p></div>
      <div className="oneline"><p>Date 1: {service.date1}</p></div>
      <div className="oneline"><p>DU1: {service.du1}</p></div>
      <div className="oneline">
      <p>DU2: {service.du2}</p>
      </div>
      <div className="oneline">
      <p>Type: {service.type}</p>
      </div>
      <div className="oneline">
      <p>MType: {service.mtype}</p>
      </div>
    */}
        {/* <div class="card14"> */}
        <div class="header2">{data.email}</div>
        <div class="body2">
          <div class="req">
            <div class="req-name"><p>Mobile No: {data.mobileno}</p></div>

          </div>
          <div class="req">
            <div class="req-name"><p>Size of Farm (in Acre): {data.acre}</p></div>

          </div>
          <div class="req">
            <div class="req-name"><p>Type of Grains: {data.ptype}</p></div>

          </div>
          <div class="req">
            <div class="req-name"><p>Planting Date: {data.date1}</p></div>

          </div>
          <div class="req">
            <div class="req-name"><p>Start Date: {data.du1}</p></div>

          </div>
          <div class="req">
            <div class="req-name"><p>End Date: {data.du2}</p></div>

          </div>
          <div class="req">
            <div class="req-name"><p>service Type: {data.type}</p></div>

          </div>
          <div class="req">
            <div class="req-name"><p>Machines Required: {data.mtype}</p></div>

          </div>
          <div className="req">
            <button className='Fulfill' onClick={handleRequest}> Fullfill Request
            </button>
          </div>
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default ListContainer;
