import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AuctionList from './AuctionList';
import "./Chat.css"

const ENDPOINT = 'http://localhost:8001';
const socket = io(ENDPOINT, {
  transports: ['websocket', 'polling'],
});

function Auction() {
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState('');
  const [Code, setCode] = useState('');
  const [bids, setBids] = useState([]);
  const [Start, setStart] = useState(0);
  const [user, setUser] = useState('');
  const [Cuser, setCuser] = useState('');
  const [sDate, setSDate] = useState('');
  const [cDate, setCDate] = useState(new Date());
  const [Hig, setHig] = useState(0);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isAuctionEnded) {
      alert("The auction has ended. No more bids can be placed.");
      return;
    }
    if (Hig < amount) {
      setPrice(amount);
      socket.emit('send_bid', { bid: amount, Code, user });
    } else {
      alert("Please enter a valid bid");
    }
    setAmount('');
  };

  const SubmitCode = (event) => {
    event.preventDefault();
    socket.emit('join room', { Code: Code });
  };

  useEffect(() => {
    const user1 = localStorage.getItem('user');
    setUser(user1);

    socket.on("auth_error", (data) => {
      alert(data.msg);
    });

    socket.on("room_error", (data) => {
      alert("Cannot find room with this id");
    });

    socket.on("starting_bid", (data) => {
      setStart(data);
    });

    socket.on("startDetails", (data) => {
      setSDate(new Date(data.endDate).toLocaleString());
    });

    socket.on("curr_bid", (data) => {
      setHig(data.Bid);
      setCuser(data.User);
    });

    socket.on("bids", (data) => {
      setBids((prevBids) => {
        const newBids = data.filter(bid => !prevBids.some(prevBid => prevBid._id === bid._id));
        return [...prevBids, ...newBids];
      });
    });

    socket.on("receive_bid", (data) => {
      setBids((prevBids) => [...prevBids, data]);
      setHig(data.Bid);
      setCuser(data.User);
    });

    socket.on("auction_ended", () => {
      setIsAuctionEnded(true);
      alert("The auction has ended.");
    });

    const checkAuctionEnd = () => {
      const endTime = new Date(sDate).getTime();
      const currentTime = new Date().getTime();
      if (currentTime >= endTime) {
        setIsAuctionEnded(true);
      }
    };

    const timer = setInterval(checkAuctionEnd, 1000);
    const dateTimer = setInterval(() => setCDate(new Date()), 1000);

    return () => {
      clearInterval(timer);
      clearInterval(dateTimer);
      socket.off("receive_bid");
      socket.off("auth_error");
      socket.off("room_error");
      socket.off("starting_bid");
      socket.off("startDetails");
      socket.off("curr_bid");
      socket.off("bids");
      socket.off("auction_ended");
    };
  }, [sDate]);

  return (
    <div className="container mx-2">
      <h1>Enter Code</h1>
      <form onSubmit={SubmitCode}>
        <input className='AuctionField'
          type="text"
          value={Code}
          onChange={(event) => setCode(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h1 className="text-center">Auction</h1>
          <h3 className="text-center">Intial Bid : {Start} || Highest Bid : {Hig}</h3>
          <h3 className="text-center">End Date : {sDate} || Current Date : {cDate.toLocaleString()}</h3>
          {isAuctionEnded ? (
            <h1 className='text-center'>
              {Cuser === user ? "You Win" : `${Cuser} wins the Auction`}
            </h1>
          ) : (
            <>
              <div className="chat-container">
                <AuctionList bids={bids} user={user} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="chat-input">
                  <div className="input-group">
                    <input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className="form-control" placeholder="Enter your bid..." />
                    <div className="input-group-append">
                      <button type="submit" className="btn btn-primary">Place Bid</button>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auction;