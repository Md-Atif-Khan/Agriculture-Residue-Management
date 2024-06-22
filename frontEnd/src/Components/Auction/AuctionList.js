import React, { useEffect, useState } from 'react';
// const socket = io('http://localhost:3001');
import"./Chat.css"
function AuctionList(props) {

  const [newArr , setnewArr] = useState([]);
  const {bids,user} = props;
  // bids.reverse();
  //    useEffect(()=>{
      // const x  = bids;
      // x.reverse();
      // setnewArr([...x.slice(0,3)])
      // let x = bids;
      // console.log("new bids " ,x.reverse());
    // },[]);
  // const [bids, setBids] = useState([]);

  // useEffect(() => {
  //   socket.on('recieve_bid', (data) => {
  //     console.log("hello this is bids from auctionlist " ,data);
  //     setBids((bids) => [...bids, data]);
  //   });
  //   console.log("Hello from inside llist")
  //   return () => {
  //       socket.off('bid');
  //     };
  // }, [socket]);

  return (
    // <div className={bid.User===user?'Float-right':'Float-left'}>
<div>
    <ul>
      {bids.map((bid,idx) => (
        
        <>
        
        <div className="chat-message" key={idx}>
        {/* <div className="float-right" > */}
          <div className={bid.User===user?'float-right':'float-left'}>
          <span className="sender">{bid.User}</span>
          <span className="message">{bid.Bid}</span>
          &nbsp;
          &nbsp;
          <span className="timestamp">12:35 PM</span>
        </div>
        </div>
        </>
      ))}
    </ul>
    {/* </div></div></div> */}
  </div>
  );
}

export default AuctionList;