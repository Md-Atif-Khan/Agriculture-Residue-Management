import React, { useEffect, useState,useContext } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import './AdminHome.css';
import axios from 'axios';
// import ShowAuction from './ShowAuctionDetails/ShowAuction';
// import CompleteRequest from './FulfillRequestForm/CompleteRequest'
// import Carousel2 from './Carousel2';
import DeepContext from '../../../context/DeepContext';
const AdminHome = () => {

  const {showAlert,EndObject,FullfillRequest}=useContext(DeepContext);

  const navigate = useNavigate()

  const showForm = () => {
    navigate('/CreateRoom');
  }

  const [room, setRoom] = useState();
  const [service, setService] = useState();

  const getData = async () => {
    const data = await axios.post("http://localhost:8000/AdminHome")

    if (data?.data?.room && data?.data?.service1) {
      setRoom(data?.data?.room);
      setService(data?.data?.service1);
    } else {
      alert(data?.data?.message);
    }
  }

  useEffect(() => {
    getData();
  }, [])

  useEffect(() => {
      // console.log("Room->", room)
      // console.log("Service->", service)
  }, [room || service])
const handleDeleteRequest=(ele)=>{
  // console.log()
  // localStorage.setItem("request",request);
{/* <CompleteRequest /> */}
FullfillRequest(ele);

  navigate('/CompleteRequest');
  // navigate('/CompleteRequest');
  
}
const handleAuctionResult=(ele)=>{
  FullfillRequest(ele);
  navigate('/ShowAuction');

}
let request;
  return (
    <>
    {/* <div className="centerA"> */}
      {/* <div className="center"> */}
      <div className="list-container">
        {/* <div className="heading"> */}
         <label className='list-container'> <h2>Available Room's :</h2>
        {/* </div> */}
      <ul className="list d-flex flex-row cardReq">
        {
          room ?

            room.map((ele) => {
              // request=ele;
              // return <li className='p-2'><ShowAuction data={ele}/></li>
              return <button onClick={()=>{handleAuctionResult(ele)}}><li>{ele.Name}</li></button>
            })

            :<></>
        }
       </ul>
       </label>
    </div>
    {/* </div> */}
    <div className="center">
    <label className='list-container'> <h2>Pending Services :</h2>
      {/* <div className="list-container"> */}
      <ul className="list d-flex flex-row cardReq ">
        {
          service ?

            service.map((ele => {
              // return <li><CompleteRequest data={ele}/></li>
              return <button onClick={()=>{handleDeleteRequest(ele)}}><li>{ele.email}</li></button>
            }))

            :<></>
        }
       </ul>
       </label>
       {/* </div> */}
        </div>

        <button className='CreateRoom' onClick={showForm}>CreateRoom</button>
        {/* </div> */}
    </>
  );
}

export default AdminHome;
