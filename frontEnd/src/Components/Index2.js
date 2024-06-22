import React from 'react'
import { BrowserRouter as Router,Route, Routes } from "react-router-dom";
import Home from './HomePage/Home';
import Navbar from './Navbar/Navbar';
import Research from './homeComponent/ResearchPage/Research'
import OptionSignup from './OptionPage/OptionSignup';
import OptionLogin from './OptionPage/OptionLogin';
import LoginFarmer from './LoginPage/LoginFarmer';
import LoginCompany from './LoginPage/LoginCompany';
import LoginAdmin from './LoginPage/LoginAdmin';
import Forget from './LoginPage/Forget';
import Profile from './ProfilePage/Profile';
import SignUpFarmer from './SignupPage/SignUpFarmer';
import SignUpCompany from './SignupPage/SignUpCompany';
import SignUpAdmin from './SignupPage/SignUpAdmin';
import FarmerHome from './LogHomePage/FarmerHome';
import CompanyHome from './LogHomePage/CompanyHome';
import AdminHome from './LogHomePage/AdminHomePage/AdminHome';
import Service from './ServicePage/Service';
import Auction from './Auction/Auction';
import ShowAuction from './LogHomePage/AdminHomePage/ShowAuctionDetails/ShowAuction'
import AuctionList from './Auction/AuctionList';
import CompleteRequest from './LogHomePage/AdminHomePage/FulfillRequestForm/CompleteRequest'
import ClearReqForm from './LogHomePage/AdminHomePage/FulfillRequestForm/ClearReqForm'
import CreateRoom from './LogHomePage/AdminHomePage/Roomform';
import SuccessPage from './ServicePage/SuccessPage';
import Alert from './Alert';
import DeepState from '../context/DeepState';
const Index2 = () => {
  return (
    <>
       <Router>
    <DeepState>
      <Navbar/>
      <Alert/>
       <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/OptionSignup' element={<OptionSignup/>}/>
        <Route path='/OptionLogin' element={<OptionLogin/>}/>

        <Route path='/LoginFarmer' element={<LoginFarmer/>}/>
        <Route path='/LoginCompany' element={<LoginCompany/>}/>
        <Route path='/LoginAdmin' element={<LoginAdmin/>}/>

        <Route path='/SignUpFarmer' element={<SignUpFarmer/>}/>
        <Route path='/SignUpCompany' element={<SignUpCompany/>}/>
        <Route path='/SignUpAdmin' element={<SignUpAdmin/>}/>

        <Route path='/CompanyHome' element={<CompanyHome/>}/>
        <Route path='/FarmerHome' element={<FarmerHome/>}/>


        <Route path='/AdminHome' element={<AdminHome/>}/>


        <Route path='/CompleteRequest' element={<CompleteRequest/>}/>
        <Route path='/ClearReqForm' element={<ClearReqForm/>}/>


        <Route path='/ShowAuction' element={<ShowAuction/>}/>

        <Route path='/Auction' element={<Auction/>}/>
        <Route path='/AuctionList' element={<AuctionList/>}/>
        <Route path='/CreateRoom' element={<CreateRoom/>}/>
        
        <Route path='/Profile' element={<Profile/>}/>
        
        <Route path='/Service' element={<Service/>}/>
        <Route path='/SuccessPage' element={<SuccessPage/>}/>

        <Route path='/Forget' element={<Forget/>}/>
       
        <Route path='/Research' element={<Research/>}/>
       </Routes>
    </DeepState>
    </Router>
   
    </>
  )
}

export default Index2