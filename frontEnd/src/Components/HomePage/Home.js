import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import Login from '../LoginPage/Login'
// import FarmerHome from '../LogHomePage/FarmerHome';
// import Navbar from '../Navbar/Navbar';
// import Auction from '../Auction/Auction'
import Contact from '../homeComponent/ContactUsPage/Contact'
import Aboutus from '../homeComponent/AboutUs/Aboutus'
import Carousel from '../homeComponent/CarouselPage/Carousel';
import { countries } from '../homeComponent/CarouselPage/Data';
import Piechart from '../homeComponent/piechart/Piechart';
import Research from '../homeComponent/ResearchPage/Research';
// import Service from '../ServicePage/Service';
import './HomeStyle.css'
const Home = () => {

    //     const [userType, setUserType] = useState('');
    //   const [isLoading, setIsLoading] = useState(true);

    //   useEffect(() => {
    //     axios.get('/')
    //       .then(response => {
    //         setUserType(response.data);
    //         setIsLoading(false);
    //       })
    //       .catch(error => {
    //         console.error(error);
    //         setIsLoading(false);
    //       });
    //   }, []);

    //   if (isLoading) {
    //     return <div>Loading...</div>;
    //   }
    // let isemailExist=
    const navigate = useNavigate();
    const HandleResearch = () => {
        navigate('/Research');
        // setIsLoggedIn(false);
    }

    return (
        <>
            {/* {userType === 'admin' && <AdminHomePage />} */}
            {/* {userType === 'User' && <FarmerHome/>} */}
            {/* <Navbar/> */}
            <div className='main' id="HOME">
                <div className="bodymain">
                    <div className="carousel"> <Carousel images={countries} /></div>

                    {/* <div className="main-image">
                        <img src="../images/agricultural-waste.jpg" className="Main-img" alt="" />
                    </div> */}

                    {/* <div className="space"></div>
                    <div className="service navbar-container">
                            <button className="button service button-name">
                               <a href="Service">service</a> </button>
                               <button className="button service Auction button-name">
                               <a href="Auction">Auction</a> </button>
                    </div> */}
                    {/* <div className="Auction navbar-container">
                            <button className="button service button-name">
                            
                    </div> */}
                    <div className="space"></div>
                    <div className="datacontainer">
                        <div className="text-container">
                            <h3 className="text-head">Pollution Because of Burning of Residue </h3>
                            <p className="text-contant">While more than 80% of Indian cities struggle with unhealthy air quality, the landlocked capital of New Delhi in the northern part of the country suffers the most toxic air—and it’s at its worst every year from October through December. During these months, a grayish-yellow haze hangs over the city, leading government agencies and the Environment Pollution Prevention and Control Authority to declare public health emergencies, shut down schools, halt construction work and ground flights due to poor visibility. Studies estimated that each year tens of thousands of citizens die from respiratory illnesses due to air pollution.</p>
                        </div>
                        <div className="image-contianer">
                            <img src="../images/farm2.jpg" className="image1" alt="" />
                        </div>
                    </div>
                    <div className="space"></div>
                    <div className="datacontainer">
                        <div className="image-contianer">
                            <img src="../images/farmer1.jpeg" className="image2" alt="" />
                        </div>
                        <div className="text-container">
                            <h3 className="text-head">The Problem ???</h3>
                            <p className="text-contant">-One report states that about 500 million Tons of Agriculture Residue( plant material remaining after harvesting, including leaves, stalks, roots etc.) is produced Every year & from that 92 million Tons of crop residue is burnt..<br></br>
                                -Stubble burning is a huge problem, Especially in a northern part of India and leads to huge environmental damage.<br />
                                -Machinery to clear the residue is expensive & manually cleaning is very time consuming, that's why farmers resorted it to burning down stubble.</p>
                        </div>
                    </div>
                    <div className="space"></div>
                    <div className="datacontainer">
                        <div className="text-container">
                            <h3 className="text-head">side-effects Of Stubble Burning</h3>
                            <p className="text-contant">Crop residue burning significantly increases the quantity of air pollutants such as CO2, CO, NH3, NOX, SOX, Non-methane hydrocarbon , volatile organic compounds (VOCs), semi volatile organic compounds (SVOCs) and PM. This basically accounts for the loss of organic carbon, nitrogen, and other nutrients, which would otherwise have retained in soil </p>
                        </div>
                        <div className="image-contianer">
                            <img src="../images/farm1.jpeg" className="image3" alt="" />
                        </div>
                    </div>
                </div>

                <div className="space"></div>
                <div className="datacontainer">
                    <div className="image-container">
                        <div className='space'>
                            <Piechart className='piechartcss' /></div>
                    </div>
                    <div className="text-container">
                        <h3 className="text-head">You Want To See Our Prediction of Howmuch Residue will be generated according to the size of your land?</h3>
                        <div className="space"></div>
                        <button class="learn-more" onClick={HandleResearch}>
                            <span class="circle" aria-hidden="true">
                                <span class="icon arrow"></span>
                            </span>
                            <span class="button-text">Learn More</span>
                        </button>
                    </div>
                </div>
                <div className="space"></div>
                {/* Contact us page */}
                <div id="contact"> <Contact /></div>


                <div className="space"></div>


                {/* AboutUs Page */}
                <div id="about"> <Aboutus /></div>

            </div>


        </>
    )
}

export default Home