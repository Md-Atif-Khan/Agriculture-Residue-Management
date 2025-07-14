import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  return (
    <div>
      <h1 className="mb-4">Company Dashboard</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {joinSuccess && <div className="alert alert-success">{joinSuccess}</div>}
      
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="dashboard-stat bg-primary text-white">
            <h1>{activeRooms.length}</h1>
            <p>Active Auction Rooms</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="dashboard-stat bg-success text-white">
            <h1>{joinedRooms.length}</h1>
            <p>Joined Auction Rooms</p>
          </div>
        </div>
      </div>
      
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h2>My Auction Rooms</h2>
        <button onClick={toggleJoinRoomModal} className="btn btn-primary">
          <i className="fas fa-sign-in-alt mr-1"></i> Join Room by Code
        </button>
      </div>
      
      {joinedRooms.length === 0 ? (
        <div className="alert alert-info">
          You haven't joined any auction rooms yet. Join a room to start bidding!
        </div>
      ) : (
        <div className="row">
          {joinedRooms.map((room) => (
            <div className="col-md-6 mb-4" key={room._id}>
              <div className="card auction-container">
                <div className="card-body">
                  <h4 className="card-title">{room.name}</h4>
                  <p className="card-text">
                    <strong>Description:</strong> {room.description}<br />
                    <strong>Room Code:</strong> {room.code}<br />
                    <strong>Starting Bid:</strong> ₹{room.startBid}/acre<br />
                    <strong>Current Highest Bid:</strong> ₹{bidInfo[room.code]?.amount || room.startBid}/acre<br />
                    <strong>Highest Bidder:</strong> {bidInfo[room.code]?.bidder || 'No bids yet'}<br />
                    <strong>End Date:</strong> {formatDate(room.endDate)}
                  </p>
                  <Link to={`/auction/${room.code}`} className="btn btn-primary mt-2">
                    <i className="fas fa-gavel mr-1"></i> Enter Bidding Room
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <h2 className="mt-5 mb-4">Available Auction Rooms</h2>
      
      {activeRooms.length === 0 ? (
        <div className="alert alert-info">
          No auction rooms are currently available.
        </div>
      ) : (
        <div className="row">
          {activeRooms
            .filter(room => !isJoined(room.code))
            .map((room) => (
              <div className="col-md-6 mb-4" key={room._id}>
                <div className="card auction-container">
                  <div className="card-body">
                    <h4 className="card-title">{room.name}</h4>
                    <p className="card-text">
                      <strong>Description:</strong> {room.description}<br />
                      <strong>Room Code:</strong> {room.code}<br />
                      <strong>Starting Bid:</strong> ₹{room.startBid}/acre<br />
                      <strong>End Date:</strong> {formatDate(room.endDate)}
                    </p>
                    <button 
                      onClick={() => joinRoom(room.code)} 
                      className="btn btn-success mt-2"
                    >
                      <i className="fas fa-sign-in-alt mr-1"></i> Join Room
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      
      {/* Join Room Modal */}
      {joinRoomModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Join Auction Room</h5>
                <button type="button" className="close" onClick={toggleJoinRoomModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {joinError && <div className="alert alert-danger">{joinError}</div>}
                <form onSubmit={handleJoinRoom}>
                  <div className="form-group">
                    <label>Room Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                      placeholder="Enter room code"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Join Room</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard; 