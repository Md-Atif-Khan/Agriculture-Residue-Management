import React, { useEffect, useState } from 'react';
import "./Chat.css"
function AuctionList(props) {

  const [newArr, setnewArr] = useState([]);
  const { bids, user } = props;

  return (
    <div>
      <ul>
        {bids.map((bid, idx) => (
          <>
            <div className="chat-message" key={idx}>
              <div className={bid.User === user ? 'float-right' : 'float-left'}>
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