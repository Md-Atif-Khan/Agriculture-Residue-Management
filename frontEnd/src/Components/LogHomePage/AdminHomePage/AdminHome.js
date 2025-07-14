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
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading dashboard...</p>
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
    <div className="container py-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Active Auction Rooms</h5>
              <Link to="/CreateRoom" className="btn btn-sm btn-light">
                + Create New Room
              </Link>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              {rooms.length === 0 ? (
                <div className="alert alert-info">No active auction rooms found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
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
                            <div className="d-flex align-items-center">
                              <span className="mr-2 font-weight-bold">{room.code}</span>
                              <button
                                className="btn btn-sm btn-outline-secondary ml-2"
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
                              className="btn btn-sm btn-primary mr-2"
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
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Service Requests</h5>
            </div>
            <div className="card-body">
              {services.length === 0 ? (
                <div className="alert alert-info">No pending service requests.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
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
                            <button onClick={() => { handleDeleteRequest(service) }}><li>{service.email}</li></button>
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

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Admin Actions</h5>
            </div>
            <div className="card-body">
              <div className="list-group">
                <Link to="/CreateRoom" className="list-group-item list-group-item-action">
                  <i className="fas fa-plus-circle mr-2"></i> Create New Auction Room
                </Link>
                <Link to="/manage-users" className="list-group-item list-group-item-action">
                  <i className="fas fa-users-cog mr-2"></i> Manage Users
                </Link>
                <Link to="/reports" className="list-group-item list-group-item-action">
                  <i className="fas fa-chart-bar mr-2"></i> View Reports
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header bg-warning text-dark py-2 px-3">
              <h6 className="mb-0" style={{ fontWeight: 600, fontSize: '1.1rem' }}>How to Share Room Codes</h6>
            </div>
            <div className="card-body py-3 px-3">
              <p className="mb-2" style={{ fontSize: '0.98rem' }}>To invite companies to an auction:</p>
              <ol className="pl-3" style={{ fontSize: '0.98rem' }}>
                <li>Copy the room code from the table</li>
                <li>Share the code with companies via email or messaging</li>
                <li>Companies will use this code to join the auction</li>
              </ol>
              <div className="alert alert-warning mt-3 py-2 px-2" style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-exclamation-triangle mr-2" style={{ fontSize: '1.1rem' }}></i>
                <span>Room codes should only be shared with authorized companies.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
