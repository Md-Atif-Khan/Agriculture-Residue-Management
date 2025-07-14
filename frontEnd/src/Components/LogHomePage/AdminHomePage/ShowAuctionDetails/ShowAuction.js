import React, { useEffect, useState, useContext } from 'react';
import './ShowAuction.css';
import { useNavigate } from 'react-router-dom'
import DeepContext from '../../../../context/DeepContext';
import axios from 'axios';
const ListContainer = () => {
  const { EndObject } = useContext(DeepContext);
  const data = EndObject;
  const navigate = useNavigate()
  const handleBack = () => {
    navigate('/AdminHome')
  }

  return (
    <>
      <div className="cardforlist1">
        <div className="tools1">
          <div className="circle1">
            <button onClick={handleBack}><span className="red1 box1">Back</span></button>
          </div>
        </div>

        <div className="header1">{data.Name}</div>
        <div className="body1">
          <div className="req1">
            <div className="req-name1"><p>Description: {data.description}</p></div>

          </div>
          <div className="req1">
            <div className="req-name1"><p>Unique Code: {data.Code}</p></div>

          </div>
          <div className="req1">
            <div className="req-name1"><p>Starting Bid: {data.StartBid}</p></div>

          </div>
          <div className="req1">
            <div className="req-name1"><p>Start Date: {data.startDate}</p></div>

          </div>
          <div className="req1">
            <div className="req-name1"><p>End Date: {data.endDate}</p></div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ListContainer;
