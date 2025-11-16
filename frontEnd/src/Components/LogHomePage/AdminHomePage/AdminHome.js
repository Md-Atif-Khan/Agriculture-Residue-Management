import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import './AdminHome.css';
import axios from 'axios';
import DeepContext from '../../../context/DeepContext';

const AdminHome = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const { FullfillRequest } = useContext(DeepContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/dashboard');
        setRooms(res.data.rooms || []);
        setServices(res.data.services || []);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const copyRoomCode = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
      })
      .catch(err => console.error('Failed to copy:', err));
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p className="admin-loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const showForm = () => {
    navigate('/CreateRoom');
  }

  const handleDeleteRequest = (ele) => {
    FullfillRequest(ele);
    navigate('/CompleteRequest');
  }
  const handleAuctionResult = (ele) => {
    FullfillRequest(ele);
    navigate('/ShowAuction');
  }


  // return (
  //   <>
  //     <div className="list-container">
  //       <label className='list-container'> <h2>Available Room's :</h2>
  //          <ul className="list d-flex flex-row cardReq">
  //           {
  //             rooms ?
  //               rooms.map((ele) => {
  //                 return <button onClick={() => { handleAuctionResult(ele) }}><li>{ele.Name}</li></button>
  //               })
  //               : <></>
  //           }
  //        </ul> 
  //       </label>
  //     </div>


  //     {/* <div className="center">
  //       <label className='list-container'> <h2>Pending Services :</h2>
  //         <ul className="list d-flex flex-row cardReq ">
  //           {
  //             services ?
  //               services.map((ele => {
  //                 return <button onClick={() => { handleDeleteRequest(ele) }}><li>{ele.email}</li></button>
  //               }))
  //               : <></>
  //           }
  //         </ul>
  //       </label>
  //     </div> */}


  //     <button className='CreateRoom' onClick={showForm}>CreateRoom</button>
  //   </>
  // );
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-subtitle">Manage auction rooms and service requests</p>
      </div>

      <div className="admin-content">
        <div className="admin-main">
          <div className="admin-card">
            <div className="admin-card-header">
              <h5 className="admin-card-title">Active Auction Rooms</h5>
            </div>
            <div className="admin-card-body">
              {error && <div className="admin-alert admin-alert-danger">{error}</div>}

              {rooms.length === 0 ? (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon">📋</div>
                  <p className="admin-empty-text">No active auction rooms found.</p>
                </div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Starting Bid</th>
                        <th>Room Code</th>
                        <th>End Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map(room => (
                        <tr key={room._id}>
                          <td>{room.name}</td>
                          <td>₹{room.startBid}/acre</td>
                          <td>
                            <div className="room-code-display">
                              <span className="room-code-text">{room.code}</span>
                              <button
                                className={`btn-copy ${copiedCode === room.code ? 'copied' : ''}`}
                                onClick={() => copyRoomCode(room.code)}
                                title="Copy room code"
                              >
                                {copiedCode === room.code ? '✓ Copied!' : 'Copy'}
                              </button>
                            </div>
                          </td>
                          <td>{formatDate(room.endDate)}</td>
                          <td>
                            <Link
                              to={`/auction/${room.code}`}
                              className="btn-primary btn-view"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Service Requests Section */}
          <div className="admin-card">
            <div className="admin-card-header header-success">
              <h5 className="admin-card-title">Service Requests</h5>
            </div>
            <div className="admin-card-body">
              {services.length === 0 ? (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon">✉️</div>
                  <p className="admin-empty-text">No pending service requests.</p>
                </div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Acres</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map(service => (
                        <tr key={service._id}>
                          <td>{service.email}</td>
                          <td>{service.acre}</td>
                          <td>{service.pType}</td>
                          <td>{formatDate(service.date1)}</td>
                          <td>
                            <button className="btn-action" onClick={() => { handleDeleteRequest(service) }}>
                              Process
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="admin-sidebar">
          <div className="admin-card">
            <div className="admin-card-header header-info">
              <h5 className="admin-card-title">Admin Actions</h5>
            </div>
            <div className="admin-card-body">
              <div className="admin-action-list">
                <Link to="/CreateRoom" className="admin-action-item">
                  <span className="admin-action-icon">➕</span> Create New Auction Room
                </Link>
                <Link to="/manage-users" className="admin-action-item">
                  <span className="admin-action-icon">👥</span> Manage Users
                </Link>
                <Link to="/reports" className="admin-action-item">
                  <span className="admin-action-icon">📊</span> View Reports
                </Link>
              </div>
            </div>
          </div>

          <div className="admin-info-box">
            <div className="admin-info-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
              How to Share Room Codes
            </div>
            <p className="admin-info-text">To invite companies to an auction:</p>
            <ol className="admin-info-list">
              <li>Copy the room code from the table</li>
              <li>Share the code with companies via email or messaging</li>
              <li>Companies will use this code to join the auction</li>
            </ol>
            <div className="admin-warning">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              <span>Room codes should only be shared with authorized companies.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
