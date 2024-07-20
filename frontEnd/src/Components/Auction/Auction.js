// import React, { useState, useEffect } from 'react';
// import socketIOClient from 'socket.io-client';

// const ENDPOINT = 'http://localhost:5000';

// function Auction() {
//   const [auctions, setAuctions] = useState([]);
//   const [newBid, setNewBid] = useState({ itemId: '', bid: 0 });
//   const [newComment, setNewComment] = useState({ itemId: '', username: '', comment: '' });

//   useEffect(() => {
//     const socket = socketIOClient(ENDPOINT);
//     socket.on('auctions', (data) => {
//       setAuctions(data);
//     });
//     return () => socket.disconnect();
//   }, []);

//   const handleBidChange = (event) => {
//     setNewBid({ ...newBid, [event.target.name]: event.target.value });
//   };

//   const handleCommentChange = (event) => {
//     setNewComment({ ...newComment, [event.target.name]: event.target.value });
//   };

//   const handleBidSubmit = (event) => {
//     event.preventDefault();
//     const socket = socketIOClient(ENDPOINT);
//     socket.emit('newBid', newBid);
//     setNewBid({ itemId: '', bid: 0 });
//   };

//   const handleCommentSubmit = (event) => {
//     event.preventDefault();
//     const socket = socketIOClient(ENDPOINT);
//     socket.emit('newComment', newComment);
//     setNewComment({ itemId: '', username: '', comment: '' });
//   };
//   console.log(auctions);
//   return (
//     <div>
//       {auctions.map((auction) => (
//         <div key={auction._id}>
//           <h2>{auction.name}</h2>
//           <p>{auction.description}</p>
//           <p>Current bid: {auction.currentBid}</p>
//           <form onSubmit={handleBidSubmit}>
//             <label htmlFor="bid">Bid:</label>
//             <input type="number" id="bid" name="bid" value={newBid.bid} onChange={handleBidChange} />
//             <button type="submit">Submit bid</button>
//           </form>
//           <form onSubmit={handleCommentSubmit}>
//             <label htmlFor="comment">Comment:</label>
//             <input type="text" id="comment" name="comment" value={newComment.comment} onChange={handleCommentChange} />
//             <label htmlFor="username">Username:</label>
//             <input type="text" id="username" name="username" value={newComment.username} onChange={handleCommentChange} />
//             <button type="submit">Submit comment</button>
//           </form>
//           <hr />
//           {auction.comments.map((comment, index) => (
//             <div key={index}>
//               <p>{comment.username}: {comment.comment}</p>
//             </div>
//           ))}
//         </div>
//       ))}
//       <form onSubmit={handleBidSubmit}>
//             <label htmlFor="bid">Bid:</label>
//             <input type="number" id="bid" name="bid" value={newBid.bid} onChange={handleBidChange} />
//             <button type="submit">Submit bid</button>
//           </form>
//     </div>
//   );
// }

// export default Auction;

import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import AuctionList from './AuctionList';
import { nanoid } from 'nanoid';
import DeepContext from '../../context/DeepContext';
import "./Chat.css"
const socket = io('http://localhost:3001');

function Auction(props) {
  // const {user} = props;
  // console.log("heorweoroew ", props);
  // localStorage.setItem('username',username);
  const [price, setprice] = useState(0);
  const [amount, setAmount] = useState('');
  const [Code, setCode] = useState('');
  const [bids, setbids] = useState([]);
  const [h, setH] = useState([]);
  const [Start, setStart] = useState(0);
  const [user, setUser] = useState('');
  const [Cuser, setCuser] = useState('');
  const [sDate, setSDate] = useState('');
  const [cDate, setCDate] = useState(new Date());
  // const {user,setUser}=useContext(DeepContext);
  const [Hig, setHig] = useState(0);
  const handleSubmit = (event) => {
    event.preventDefault();
    // setUser("qq");

    // console.log("hii i am msg",user);
    // console.log(Hig,amount);
    if (Hig < amount) {
      setprice(amount);
      // console.log(user);
      socket.emit('send_bid', { bid: amount, Code, user });
      socket.on("error_bid", (data) => {
        // console.log("Hello from inside");
        alert("Invalid bid for User");
      })
    }
    else {
      alert("Please Enter valid bid");
    }
    setAmount('');
  };

  const SubmitCode = (event) => {
    event.preventDefault();
    socket.emit('join room', { Code: Code });
    socket.on("room_error", (data) => {
      alert("can not find room with this id");
    })
    socket.on("starting_bid", (data) => {
      // console.log("data is here",data);
      setStart(data);
    })
    socket.on("startDetails", (data) => {
      console.log("This is details", cDate.getTime(), new Date(data.endDate).getTime());

      setSDate(new Date(data.endDate).toLocaleString());

    })

    socket.on("curr_bid", (data) => {
      setHig(data.Bid);
      setCuser(data.User);
    })
    socket.on("bids", (data) => {
      // console.log("kya mast mossam hai",[...data]);
      setbids((bids) => {
        if (bids && !bids.includes(data)) {
          setbids([...bids, ...data]);
        }
      })
    })


  }
  useEffect(() => {
    const user1 = localStorage.getItem('user');
    console.log(user1);
    setUser(user1);
    socket.on("auth_error", (data) => {
      alert(data.msg);

    })

    socket.on("receive_bid", (data) => {
      console.log(data);
      setH((h) => [...h, data]);
      console.log(h);
      setbids((bids) => {
        if (bids && !bids.includes(data)) {
          setbids([...bids, data]);
        }
      })
      socket.on("curr_bid", (data) => {
        // console.log(data,"mast chhe j chhe e");
        setHig(data.Bid);
        setCuser(data.User);
      })

    });
    setCDate(new Date());
    // console.log(user);

  }, [socket, Cuser, bids])

  return (
    <>

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
            <h3 className="text-center">Intial Bid : {Start}
              || Highest Bid : {Hig}</h3>
            <h3 className="text-center">End Date : {sDate} || Curr Date : {cDate.toLocaleString()}</h3>
            {(new Date(sDate).getTime() < new Date(cDate).getTime()) ?
              <>{(Cuser === user) ? <h1 className='text-center'>You Win</h1> : <h1 className='text-center'>{Cuser} wins the Auction</h1>}</> :
              <>
                <div className="chat-container">
                  <AuctionList bids={bids} user={user} />
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="chat-input">
                    <div className="input-group">
                      <input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className="form-control" placeholder="Type your message..." />
                      <div className="input-group-append">
                        <button type="submit" className="btn btn-primary">Send</button>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            }


          </div>
        </div>

      </div>
    </>
  );
}

export default Auction;