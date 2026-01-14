import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CompanyHome.css';

const CompanyDashboard = () => {
  const [activeRooms, setActiveRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joinRoomModal, setJoinRoomModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [bidInfo, setBidInfo] = useState({});
  const [joinSuccess, setJoinSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        // Get all active auction rooms
        const allRoomsRes = await axios.get('/api/rooms/all', config);
        
        // Get rooms the company has joined
        const joinedRoomsRes = await axios.get('/api/rooms/joined', config);
        
        setActiveRooms(allRoomsRes.data?.rooms || []);
        setJoinedRooms(joinedRoomsRes.data?.rooms || []);
        
        // Fetch highest bid for each room
        const bidPromises = allRoomsRes.data?.rooms.map(async (room) => {
          try {
            const bidRes = await axios.get(`/api/rooms/${room.code}/bids/highest`, config);
            return { roomCode: room.code, highestBid: bidRes.data };
          } catch (err) {
            console.error(`Error fetching bid for room ${room.code}:`, err);
            return { roomCode: room.code, highestBid: null };
          }
        }) || [];
        
        const bidResults = await Promise.all(bidPromises);
        
        // Convert array of bid info to object keyed by room code
        const bidInfoObj = bidResults.reduce((acc, info) => {
          acc[info.roomCode] = info.highestBid;
          return acc;
        }, {});
        
        setBidInfo(bidInfoObj);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleJoinRoomModal = () => {
    setJoinRoomModal(!joinRoomModal);
    setRoomCode('');
    setJoinError('');
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setJoinError('');
    setJoinSuccess('');
    
    if (!roomCode) {
      setJoinError('Please enter a room code');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.post('/api/rooms/join', { code: roomCode }, config);
      
      if (res.data.success) {
        // Refresh the rooms lists
        const allRoomsRes = await axios.get('/api/rooms/all', config);
        const joinedRoomsRes = await axios.get('/api/rooms/joined', config);
        
        setActiveRooms(allRoomsRes.data?.rooms || []);
        setJoinedRooms(joinedRoomsRes.data?.rooms || []);
        
        setJoinSuccess(`Successfully joined auction room: ${res.data.room.name}`);
        toggleJoinRoomModal();
        
        // Scroll to My Auction Rooms section
        window.scrollTo(0, 0);
      }
    } catch (err) {
      setJoinError(err.response?.data?.msg || 'Failed to join room');
      console.error(err);
    }
  };

  const isJoined = (roomCode) => {
    return joinedRooms.some(room => room.code === roomCode);
  };

  const joinRoom = async (roomCode) => {
    try {
      setError('');
      setJoinSuccess('');
      
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.post('/api/rooms/join', { code: roomCode }, config);
      
      if (res.data.success) {
        setJoinSuccess(`Successfully joined auction room: ${res.data.room.name}`);
        
        // Refresh the rooms lists
        const allRoomsRes = await axios.get('/api/rooms/all', config);
        const joinedRoomsRes = await axios.get('/api/rooms/joined', config);
        
        setActiveRooms(allRoomsRes.data?.rooms || []);
        setJoinedRooms(joinedRoomsRes.data?.rooms || []);
        
        // Scroll to the top to show success message
        window.scrollTo(0, 0);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to join room');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="company-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Company Dashboard</h1>
        <p className="dashboard-subtitle">Manage your auction participation and place bids</p>
      </div>

      <div className="dashboard-alerts">
        {error && <div className="alert alert-danger">{error}</div>}
        {joinSuccess && <div className="alert alert-success">{joinSuccess}</div>}
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h2>{activeRooms.length}</h2>
          <p>Active Auction Rooms</p>
        </div>
        <div className="stat-card stat-success">
          <h2>{joinedRooms.length}</h2>
          <p>My Joined Rooms</p>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">My Auction Rooms</h2>
        <button onClick={toggleJoinRoomModal} className="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          Join Room by Code
        </button>
      </div>
      
      {joinedRooms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No Joined Rooms Yet</h3>
          <p className="empty-state-text">You haven't joined any auction rooms yet. Join a room to start bidding!</p>
        </div>
      ) : (
        <div className="auction-grid">
          {joinedRooms.map((room) => (
            <div className="auction-card" key={room._id}>
              <div className="auction-card-header">
                <h3 className="auction-card-title">{room.name}</h3>
              </div>
              <div className="auction-card-body">
                <div className="auction-info">
                  <div className="auction-info-item">
                    <span className="auction-info-label">Description</span>
                    <span className="auction-info-value">{room.description}</span>
                  </div>
                  <div className="auction-info-item">
                    <span className="auction-info-label">Room Code</span>
                    <span className="auction-info-value">{room.code}</span>
                  </div>
                  <div className="auction-info-item">
                    <span className="auction-info-label">Starting Bid</span>
                    <span className="auction-info-value">₹{room.startBid}/acre</span>
                  </div>
                  <div className="auction-info-item">
                    <span className="auction-info-label">Current Highest</span>
                    <span className="auction-info-value highlight">₹{bidInfo[room.code]?.amount || room.startBid}/acre</span>
                  </div>
                  <div className="auction-info-item">
                    <span className="auction-info-label">Highest Bidder</span>
                    <span className="auction-info-value">{bidInfo[room.code]?.bidder || 'No bids yet'}</span>
                  </div>
                  <div className="auction-info-item">
                    <span className="auction-info-label">End Date</span>
                    <span className="auction-info-value">{formatDate(room.endDate)}</span>
                  </div>
                </div>
              </div>
              <div className="auction-card-footer">
                <Link to={`/auction/${room.code}`} className="btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2zm8 6a.75.75 0 1 0-1.5 0a.75.75 0 0 0 1.5 0z"/>
                </svg>
                  Enter Bidding Room
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="section-header mt-5">
        <h2 className="section-title">Available Auction Rooms</h2>
      </div>

      {activeRooms.filter(room => !isJoined(room.code)).length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">No Available Rooms</h3>
          <p className="empty-state-text">All auction rooms have been joined or there are no active auctions.</p>
        </div>
      ) : (
        <div className="auction-grid">
          {activeRooms
            .filter(room => !isJoined(room.code))
            .map((room) => (
              <div className="auction-card" key={room._id}>
                <div className="auction-card-header">
                  <h3 className="auction-card-title">{room.name}</h3>
                </div>
                <div className="auction-card-body">
                  <div className="auction-info">
                    <div className="auction-info-item">
                      <span className="auction-info-label">Description</span>
                      <span className="auction-info-value">{room.description}</span>
                    </div>
                    <div className="auction-info-item">
                      <span className="auction-info-label">Room Code</span>
                      <span className="auction-info-value">{room.code}</span>
                    </div>
                    <div className="auction-info-item">
                      <span className="auction-info-label">Starting Bid</span>
                      <span className="auction-info-value highlight">₹{room.startBid}/acre</span>
                    </div>
                    <div className="auction-info-item">
                      <span className="auction-info-label">End Date</span>
                      <span className="auction-info-value">{formatDate(room.endDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="auction-card-footer">
                  <button
                    onClick={() => joinRoom(room.code)}
                    className="btn-success"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                    Join Room
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      
      {/* Join Room Modal */}
      {joinRoomModal && (
        <div className="modal-overlay" onClick={toggleJoinRoomModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Join Auction Room</h2>
              <button type="button" className="modal-close" onClick={toggleJoinRoomModal}>
                <span>×</span>
              </button>
            </div>
            <div className="modal-body">
              {joinError && <div className="alert alert-danger">{joinError}</div>}
              <form onSubmit={handleJoinRoom}>
                <div className="form-group">
                  <label className="form-label">Room Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="Enter room code (e.g., ABC123)"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                  </svg>
                  Join Room
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard; 