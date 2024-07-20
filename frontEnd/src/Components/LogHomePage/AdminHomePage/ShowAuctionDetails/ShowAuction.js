import React, { useEffect, useState,useContext } from 'react';
import './ShowAuction.css';
import { useNavigate } from 'react-router-dom'
import DeepContext from '../../../../context/DeepContext';
import axios from 'axios';
const ListContainer = () => {
  const {showAlert,EndObject}=useContext(DeepContext);
  const data= EndObject;
    const navigate = useNavigate()
    const handleBack=()=>{
            navigate('/AdminHome')
    }
    // const handleRequest=()=>{
    //   navigate('')
    // }
    // const [service, setService] = useState();
//     const getData = async () => {
//       const request=localStorage.getItem("request");
//       const data = await axios.post("http://localhost:5000/AuctionHome")
//   // console.log("requesttttttttt ",request)
//       if (request) {
//         // setRoom(data?.data?.room);
//         setService(request);
//       } else {
//         showAlert(data?.data?.message);
//       }
//     }
  
//     useEffect(() => {
//       getData();
//     }, [])
//     useEffect(() => {
//       // console.log("Room->", room)
//       console.log("Service->", service)
//     }, [service])
  return (
    <>
    <div class="cardforlist1">
    <div class="tools1">
      <div class="circle1">
        <button onClick={handleBack}><span class="red1 box1">Back</span></button>
      </div>
    </div>
    {/* <div class="card__content1"> */}
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
    {/* <div class="card13"> */}
  <div class="header1">{data.Name}</div>
  <div class="body1">
    <div class="req1">
      <div class="req-name1"><p>Description: {data.description}</p></div>
     
    </div>
    <div class="req1">
      <div class="req-name1"><p>Unique Code: {data.Code}</p></div>
     
    </div>
    <div class="req1">
      <div class="req-name1"><p>Starting Bid: {data.StartBid}</p></div>
     
    </div>
    <div class="req1">
      <div class="req-name1"><p>Start Date: {data.startDate}</p></div>
      
    </div>
    <div class="req1">
      <div class="req-name1"><p>End Date: {data.endDate}</p></div>
      
    </div>    
    </div>
  </div>
    {/* </div> */}  
  {/* </div> */}
  </>
  );
};

export default ListContainer;
