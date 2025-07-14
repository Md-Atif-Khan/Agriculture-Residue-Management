import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './AuctionRoom.css';

const AuctionRoom = () => {
  const { roomId } = useParams();
//   const [roomId, setRoomId] = useState(123);
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [socket, setSocket] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [formattedTimeRemaining, setFormattedTimeRemaining] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const timerRef = useRef(null);

  // Get the current user ID when the component loads
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        // Try to get the token
        const token = localStorage.getItem('token');
        if (!token) return;
        
        // Try to get user info from API
        const res = await axios.get('/api/auth/me', {
          headers: { 'x-auth-token': token }
        });
        
        if (res.data && res.data.user) {
          // Save the user ID for later comparison
          setCurrentUserId(res.data.user._id);          
        }
      } catch (err) {
        console.error("Error getting user info:", err);
      }
    };
    
    getUserInfo();
  }, []);
  
  // Function to format time remaining as days, hours, minutes, seconds
  const formatTimeRemaining = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return 'Auction Ended';
    
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };
  
  // Update timer every second
  useEffect(() => {
    if (timeRemaining && timeRemaining > 0) {
      // Set initial formatted time
      setFormattedTimeRemaining(formatTimeRemaining(timeRemaining));
      
      // Clear any existing interval
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Set up the interval to update every second
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1000) {
            clearInterval(timerRef.current);
            return 0;
          }
          const newTime = prev - 1000;
          setFormattedTimeRemaining(formatTimeRemaining(newTime));
          return newTime;
        });
      }, 1000);
    }
    
    // Clean up on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeRemaining]);
  
  // Function to check if a bid belongs to the current user
  const isCurrentUserBid = useCallback((bid) => {
    if (!bid || !currentUserId) return false;
    
    // Ensure both IDs are strings for comparison
    const bidUserId = String(bid.user);
    const myUserId = String(currentUserId);
        
    // Compare as strings to avoid type mismatches
    return bidUserId === myUserId;
  }, [currentUserId]);
  
  // Socket connection setup
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_AUCTION_SERVER_URL || 'http://localhost:8001');
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      setSocketConnected(true);
      newSocket.emit('join room', { code: roomId });
    });
    
    newSocket.on('connect_error', (err) => {
      console.error("Socket connection error:", err);
      setError(`Socket connection error: ${err.message}`);
    });
    
    newSocket.on('startDetails', (roomData) => {
      setAuction(roomData);
      setLoading(false);
      
      if (roomData.startBid) {
        setBidAmount((parseInt(roomData.startBid) + 10).toString());
      }
      
      // Initialize participant count if available
      if (roomData.participants) {
        setParticipantCount(roomData.participants);
      }
    });
    
    newSocket.on('receive_bid', (bid) => {
      setBids(prevBids => [bid, ...prevBids]);
      setAuction(prevAuction => ({
        ...prevAuction,
        currentBid: bid.bid
      }));
    });
    
    // Set timer from server
    newSocket.on('time_remaining', (timeLeft) => {
      setTimeRemaining(timeLeft);
      setFormattedTimeRemaining(formatTimeRemaining(timeLeft));
    });
    
    // Update participant count
    newSocket.on('participant_count', (count) => {
      setParticipantCount(count);
    });
    
    // Other socket event handlers...
    newSocket.on('curr_bid', (bidData) => {
      setAuction(prevAuction => ({
        ...prevAuction,
        currentBid: bidData.bid
      }));
    });
    
    newSocket.on('starting_bid', (startingBid) => {
      setAuction(prevAuction => ({
        ...prevAuction,
        startingBid: startingBid
      }));
    });
    
    newSocket.on('auction_ended', () => {
      setError('This auction has ended');
      setTimeRemaining(0);
      setFormattedTimeRemaining('Auction Ended');
    });
    
    newSocket.on('room_error', (code) => {
      setError(`Room not found with code: ${code}`);
      setLoading(false);
    });
    
    newSocket.on('error_bid', (errorData) => {
      setError(errorData.message);
    });
    
    newSocket.on('auth_error', (errorData) => {
      setError(errorData.msg);
    });
    
    newSocket.on('bids', (bidsData) => {
      setBids(bidsData);
    });
    
    return () => {
      newSocket.disconnect();
    };
  }, [roomId, currentUserId]);
  
  // Format date functions
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatBidTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    try {
      const bidDate = new Date(timestamp);
      if (isNaN(bidDate.getTime())) return 'Just now';
      
      // If date is today, just show time
      const today = new Date();
      if (bidDate.toDateString() === today.toDateString()) {
        return bidDate.toLocaleTimeString();
      }
      
      // If date is older, show date and time
      return bidDate.toLocaleString();
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Just now';
    }
  };
  
  // Render a bid in the history
  const renderBidItem = useCallback((bid) => {
    // Check if this bid belongs to the current user
    const isMine = isCurrentUserBid(bid);
    
    // Use "You" for current user's bids, otherwise show the name
    const displayName = isMine ? "You" : (bid.userName || bid.user || 'Anonymous');
    
    return (
      <li key={bid._id || Math.random()} className={`list-group-item ${isMine ? 'bg-light' : ''}`}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong className={isMine ? 'text-primary' : ''}>{displayName}</strong> bid
            <span className="text-success ml-2">₹{bid.bid}</span>
          </div>
          <small className="text-muted">
            {formatBidTime(bid.createdAt)}
          </small>
        </div>
      </li>
    );
  }, [isCurrentUserBid]);
  
  // Handle placing a bid
  const handleBid = async (e) => {
    e.preventDefault();
    setBidSuccess('');
    setError('');
    
    // Validation checks...
    if (!bidAmount || isNaN(bidAmount) || parseInt(bidAmount) <= 0) {
      setError('Please enter a valid bid amount');
      return;
    }
    
    if (auction.currentBid && parseInt(bidAmount) <= parseInt(auction.currentBid)) {
      setError('Bid must be higher than the current bid');
      return;
    }
    
    if (!auction.currentBid && parseInt(bidAmount) <= parseInt(auction.startingBid)) {
      setError('Bid must be higher than the starting bid');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to place a bid');
        return;
      }
      
      // Get user info for the bid
      let userId = currentUserId;
      let userName = '';
      
      // Try to get user info from API
      try {
        const userRes = await axios.get('/api/auth/me', {
          headers: { 'x-auth-token': token }
        });
        
        if (userRes.data && userRes.data.user) {
          userId = userRes.data.user._id;
          userName = userRes.data.user.name || userRes.data.user.email.split('@')[0]; // Fallback to email username
          setCurrentUserId(userId);
          
          // Store current user info in localStorage for future reference
          localStorage.setItem('currentUserName', userName);
        }
      } catch (err) {
        console.error('Error getting user info:', err);
        // Try to get name from localStorage as fallback
        userName = localStorage.getItem('currentUserName') || 'Anonymous';
      }
            
      // Send bid through socket
      socket.emit('send_bid', {
        bid: parseInt(bidAmount),
        user: userId,
        userName: userName,
        code: roomId
      });
      
      setBidSuccess('Bid placed successfully!');
      
      // Increase bid amount for next bid
      setBidAmount((parseInt(bidAmount) + 10).toString());
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to place bid');
      console.error(err);
    }
  };
  
  // Rest of component (loading states, JSX, etc.)...
  if (loading) {
    return (
      <div className="auction-loading">
        <div className="auction-spinner"></div>
        <p>Connecting to auction room...</p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="auction-error">
        <div className="auction-alert auction-alert-danger">
          <h2>Auction Room Error</h2>
          <p>{error || "Auction not found or has ended."}</p>
          <button onClick={() => navigate('/dashboard')} className="auction-btn auction-btn-primary">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isAuctionEnded = new Date(auction.endDate) < new Date();

  return (
    <div className="auction-main">
      <div className="auction-header">
        <h1 className="auction-title">{auction.title}</h1>
        <button onClick={() => navigate(-1)} className="auction-btn auction-btn-secondary">
          Back
        </button>
      </div>

      {error && <div className="auction-alert auction-alert-danger">{error}</div>}
      {bidSuccess && <div className="auction-alert auction-alert-success">{bidSuccess}</div>}

      <div className="auction-content">
        <div className="auction-details">
          <div className="auction-card">
            <div className="auction-card-body">
              <h2 className="auction-section-title">Auction Details</h2>

              {formattedTimeRemaining && !isAuctionEnded && (
                <div className="auction-alert auction-alert-info auction-timer-alert">
                  <div className="auction-timer-row">
                    <span><strong>Time Remaining:</strong></span>
                    <span className="auction-timer">{formattedTimeRemaining}</span>
                  </div>
                </div>
              )}

              <dl className="auction-info-list">
                <dt>Description:</dt>
                <dd>{auction?.description || 'No description provided.'}</dd>
                <dt>Company:</dt>
                <dd>{auction?.companyName}</dd>
                <dt>Starting Bid:</dt>
                <dd>₹{auction?.startingBid}/acre</dd>
                <dt>Current Bid:</dt>
                <dd>₹{auction?.currentBid || auction?.startingBid}/acre</dd>
                <dt>End Date:</dt>
                <dd>{auction?.endDate ? formatDate(auction.endDate) : 'N/A'}</dd>
                <dt>Status:</dt>
                <dd>{auction?.endDate && new Date(auction.endDate) < new Date() ? 'Ended' : 'Active'}</dd>
                <dt>Participants:</dt>
                <dd>{participantCount || 0}</dd>
              </dl>

              {!isAuctionEnded && (
                <div className="auction-bid-form">
                  <h3>Place Your Bid</h3>
                  <form onSubmit={handleBid} className="auction-bid-row">
                    <div className="auction-bid-input-group">
                      <span className="auction-bid-currency">₹</span>
                      <input
                        type="number"
                        className="auction-bid-input"
                        placeholder="Bid amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={(auction.currentBid ? parseInt(auction.currentBid) + 1 : parseInt(auction.startingBid) + 1).toString()}
                        required
                      />
                      <span className="auction-bid-unit">/acre</span>
                    </div>
                    <button type="submit" className="auction-btn auction-btn-primary auction-bid-btn">
                      Place Bid
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="auction-history">
          <div className="auction-card">
            <div className="auction-card-header">
              <h3>Bid History</h3>
              <span className="auction-badge">{bids.length} Bids</span>
            </div>
            <div className="auction-card-body auction-history-list">
              {bids.length === 0 ? (
                <p className="auction-no-bids">No bids yet. Be the first to bid!</p>
              ) : (
                <ul className="auction-bid-list">
                  {bids.map(renderBidItem)}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;