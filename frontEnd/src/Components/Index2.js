import React, { useContext } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from './HomePage/Home';
import Navbar from './Navbar/Navbar';
import Research from './homeComponent/ResearchPage/Research'
import OptionSignup from './OptionPage/OptionSignup';
import OptionLogin from './OptionPage/OptionLogin';
import Login from './LoginPage/Login';
import Forget from './LoginPage/Forget';
import Profile from './ProfilePage/Profile';
import Register from './SignupPage/Register';
import FarmerHome from './LogHomePage/FarmerHome';
import CompanyHomeNew from './LogHomePage/CompanyHomeNew';
import AdminHome from './LogHomePage/AdminHomePage/AdminHome';
import Service from './ServicePage/Service';
import AuctionRoom from './NewAuction/AuctionRoom';
import CompleteRequest from './LogHomePage/AdminHomePage/FulfillRequestForm/CompleteRequest'
import ClearReqForm from './LogHomePage/AdminHomePage/FulfillRequestForm/ClearReqForm'
import CreateRoom from './LogHomePage/AdminHomePage/Roomform';
import SuccessPage from './ServicePage/SuccessPage';
import Alert from './Alert';
import DeepContext from '../context/DeepContext';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';


// Set default axios settings
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// // Add a response interceptor for global error handling
// axios.interceptors.response.use(
//   response => response,
//   error => {
//     // Handle authentication errors globally
//     if (error.response && error.response.status === 401) {
//       console.log('Authentication error detected, clearing token');
//       localStorage.removeItem('token');
//       delete axios.defaults.headers.common['x-auth-token'];
//       // We'll let the component handle the redirect
//     }
//     return Promise.reject(error);
//   }
// );

const Index2 = () => {
  const { user, loading } = useContext(DeepContext);

  const PrivateRoute = ({ children, userType }) => {
    if (loading) {
      return (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Verifying authentication...</p>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/Login" />;
    }

    // For other routes, maintain strict type checking
    if (userType && user.type !== userType) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <>
      <Router>
        {/* <DeepState> */}
          <Navbar />
          <Alert />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/OptionSignup' element={<OptionSignup />} />
            <Route path='/OptionLogin' element={<OptionLogin />} />

            <Route path='/LoginFarmer' element={<Login />} />
            <Route path='/LoginCompany' element={<Login />} />
            <Route path='/LoginAdmin' element={<Login />} />
            <Route path='/Login' element={<Login />} />

            <Route path='/SignUpFarmer' element={<Register />} />
            <Route path='/SignUpCompany' element={<Register />} />
            <Route path='/SignUpAdmin' element={<Register />} />

            <Route path='/CompanyHome' element={<PrivateRoute userType="Company"><CompanyHomeNew /></PrivateRoute>} />
            <Route path='/FarmerHome' element={<PrivateRoute userType="Farmer"><FarmerHome /></PrivateRoute>} />
            <Route path='/AdminHome' element={<PrivateRoute userType="Admin"><AdminHome /></PrivateRoute>} />


            <Route path='/CompleteRequest' element={<CompleteRequest />} />
            <Route path='/ClearReqForm' element={<ClearReqForm />} />


            {/* This route is for the admin to see auction details which is not required any more as is taken care by the AuctionRoom component */}
            {/* <Route path='/ShowAuction' element={<ShowAuction />} />  */}

            {/* <Route path='/Auction' element={<Auction />} />
            <Route path='/AuctionList' element={<AuctionList />} /> */}

            <Route
              path="/auction/:roomId"
              element={
                <PrivateRoute>
                  <AuctionRoom />
                </PrivateRoute>
              }
            />
            <Route
              path="/service" element={
                <PrivateRoute userType="Farmer">
                  <Service />
                </PrivateRoute>
              }
            />
            {/* <Route path='/Service' element={<Service />} /> */}

            <Route path='/CreateRoom' element={<CreateRoom />} />

            <Route path='/Profile' element={<Profile />} />
            <Route path='/SuccessPage' element={<SuccessPage />} />
            <Route path='/Forget' element={<Forget />} />
            <Route path='/Research' element={<Research />} />
          </Routes>
        {/* </DeepState> */}
      </Router>
    </>
  )
}

export default Index2