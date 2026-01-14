import React from 'react';
import { useNavigate } from 'react-router-dom';
import Contact from '../HomeComponents/ContactUsPage/Contact'
import Aboutus from '../HomeComponents/AboutUs/Aboutus'
import Carousel from '../HomeComponents/CarouselPage/Carousel';
import { countries } from '../HomeComponents/CarouselPage/Data';
import Piechart from '../HomeComponents/Piechart/Piechart';
import './HomeStyle.css'

const Home = () => {
    const navigate = useNavigate();
    const HandleResearch = () => {
        navigate('/Research');
    }

    return (
        <>
            <div className='main' id="HOME">
                {/* Carousel Section */}
                <Carousel images={countries} />

                {/* Hero Stats Section */}
                <section className="hero-stats">
                    <div className="hero-container">
                        <h2 className="hero-title">Transforming Agricultural Waste into Economic Value</h2>
                        <p className="hero-subtitle">
                            Leading the sustainable revolution in agricultural residue management through innovative marketplace solutions
                        </p>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-number">500M+</div>
                                <div className="stat-label">Tons of Residue Annually</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">92M</div>
                                <div className="stat-label">Tons Currently Burned</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">35%</div>
                                <div className="stat-label">Air Quality Impact</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">₹5000Cr</div>
                                <div className="stat-label">Potential Market Value</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problem Statement Section */}
                <section className="info-section">
                    <div className="section-container">
                        <div className="content-card">
                            <div className="content-text">
                                <h2 className="section-title">The Environmental Challenge</h2>
                                <p className="section-description">
                                    Agricultural residue burning contributes significantly to air pollution, particularly in North India during harvest seasons. The practice releases harmful pollutants including particulate matter (PM2.5, PM10), carbon monoxide, nitrogen oxides, and volatile organic compounds, severely degrading air quality in urban and rural areas alike.
                                </p>
                                <ul className="feature-list">
                                    <li>Annual crop residue generation exceeds 500 million tons across India</li>
                                    <li>Approximately 92 million tons are burned in-field each year</li>
                                    <li>Contributes to 40% of air pollution during peak agricultural seasons</li>
                                    <li>Results in loss of valuable organic matter and soil nutrients</li>
                                </ul>
                            </div>
                            <div className="content-image">
                                <img src="../images/farm2.jpg" alt="Agricultural burning pollution" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Economic Problem Section */}
                <section className="info-section alternate">
                    <div className="section-container">
                        <div className="content-card reverse">
                            <div className="content-image">
                                <img src="../images/farmer1.jpeg" alt="Farmer challenges" />
                            </div>
                            <div className="content-text">
                                <h2 className="section-title">The Economic Barrier</h2>
                                <p className="section-description">
                                    Farmers face significant economic constraints in residue management. With short harvest-to-sowing windows and high labor costs, burning becomes the most economically viable option despite its environmental consequences.
                                </p>
                                <div className="challenge-grid">
                                    <div className="challenge-item">
                                        <div className="challenge-icon">💰</div>
                                        <h4>High Costs</h4>
                                        <p>Mechanical removal equipment costs ₹50,000-₹5 lakhs per unit</p>
                                    </div>
                                    <div className="challenge-item">
                                        <div className="challenge-icon">⏱️</div>
                                        <h4>Time Pressure</h4>
                                        <p>15-20 day window between harvest and next sowing cycle</p>
                                    </div>
                                    <div className="challenge-item">
                                        <div className="challenge-icon">👷</div>
                                        <h4>Labor Shortage</h4>
                                        <p>Manual clearing requires 15-20 workers per acre</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Impact Section */}
                <section className="info-section">
                    <div className="section-container">
                        <div className="content-card">
                            <div className="content-text">
                                <h2 className="section-title">Environmental & Health Impact</h2>
                                <p className="section-description">
                                    The combustion of agricultural residue releases a complex mixture of pollutants that affect air quality, climate, soil health, and human well-being across multiple dimensions.
                                </p>
                                <div className="impact-grid">
                                    <div className="impact-box">
                                        <h4>Air Pollutants Released</h4>
                                        <ul>
                                            <li>Particulate Matter (PM2.5 & PM10)</li>
                                            <li>Carbon Monoxide (CO) & Carbon Dioxide (CO₂)</li>
                                            <li>Nitrogen Oxides (NOₓ) & Sulfur Oxides (SOₓ)</li>
                                            <li>Volatile Organic Compounds (VOCs)</li>
                                        </ul>
                                    </div>
                                    <div className="impact-box">
                                        <h4>Soil Degradation</h4>
                                        <ul>
                                            <li>Loss of 25% nitrogen content</li>
                                            <li>50-60% reduction in organic carbon</li>
                                            <li>Destruction of beneficial microorganisms</li>
                                            <li>Long-term fertility decline</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="content-image">
                                <img src="../images/farm1.jpeg" alt="Environmental impact" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Prediction Tool Section */}
                <section className="prediction-section">
                    <div className="prediction-container">
                        <div className="prediction-content">
                            <div className="prediction-chart">
                                <Piechart />
                            </div>
                            <div className="prediction-info">
                                <h2 className="prediction-title">AI-Powered Residue Prediction</h2>
                                <p className="prediction-description">
                                    Leverage our advanced prediction model to estimate agricultural residue generation based on your land size, crop type, and regional parameters. Make informed decisions about residue management and discover potential revenue opportunities.
                                </p>
                                <div className="prediction-features">
                                    <div className="feature-item">
                                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Accurate residue volume estimation</span>
                                    </div>
                                    <div className="feature-item">
                                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Market value projections</span>
                                    </div>
                                    <div className="feature-item">
                                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Customized recommendations</span>
                                    </div>
                                </div>
                                <button className="cta-button" onClick={HandleResearch}>
                                    Try Prediction Tool
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact us page */}
                <div id="contact">
                    <Contact />
                </div>

                {/* AboutUs Page */}
                <div id="about">
                    <Aboutus />
                </div>
            </div>
        </>
    )
}

export default Home
