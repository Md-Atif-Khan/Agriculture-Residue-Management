import React, { useState } from 'react';
import './Aboutus.css';

const Aboutus = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <div className="about-section">
        <div className="about-container">
          <div className="about-header">
            <h1 className="about-title">About AgroResidue Solutions</h1>
            <p className="about-subtitle">Leading the way in sustainable agricultural residue management</p>
          </div>

          <div className="about-content">
            <div className="about-mission">
              <div className="mission-card">
                <div className="mission-icon">🌾</div>
                <h3>Our Mission</h3>
                <p>To revolutionize agricultural waste management through innovative technology solutions that benefit farmers, businesses, and the environment. We bridge the gap between agricultural residue producers and industrial consumers through our intelligent marketplace platform.</p>
              </div>
            </div>

            <div className="about-grid">
              <div className="about-card">
                <div className="card-icon">💼</div>
                <h3>Enterprise Solutions</h3>
                <p>Our platform connects farmers with industries seeking biomass for energy production, manufacturing, and sustainable material sourcing. We facilitate seamless transactions through our advanced auction system and service matching technology.</p>
              </div>

              <div className="about-card">
                <div className="card-icon">🎯</div>
                <h3>Industry Leadership</h3>
                <p>With cutting-edge predictive analytics and real-time marketplace capabilities, we serve agricultural enterprises, biomass energy companies, and environmental solution providers across multiple regions.</p>
              </div>

              <div className="about-card">
                <div className="card-icon">🌱</div>
                <h3>Sustainability Impact</h3>
                <p>We've prevented thousands of tons of agricultural residue from being burned, reducing air pollution and carbon emissions while creating economic value for farming communities and industries.</p>
              </div>
            </div>

            {!showMore && (
              <button className="show-more-btn" onClick={() => setShowMore(true)}>
                <span>Learn More About Us</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {showMore && (
              <div className="about-details">
                <div className="detail-section">
                  <h3>Our Technology</h3>
                  <p>Our platform leverages advanced technologies including real-time auction systems, predictive analytics for residue generation, and intelligent matching algorithms. We provide secure, scalable solutions that handle thousands of transactions while maintaining enterprise-grade security and compliance.</p>
                </div>

                <div className="detail-section">
                  <h3>Industry Partnerships</h3>
                  <p>We work with leading biomass energy producers, cement manufacturers, paper mills, and sustainable material companies. Our B2B marketplace facilitates strategic partnerships between agricultural producers and industrial consumers, creating value chains that benefit all stakeholders.</p>
                </div>

                <div className="detail-section">
                  <h3>Our Commitment</h3>
                  <p>We are committed to building a sustainable future by transforming agricultural waste into valuable resources. Our dedicated team of agricultural experts, technology specialists, and business professionals ensures that every transaction creates environmental and economic value.</p>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-number">500M+</div>
                    <div className="stat-label">Tons Managed Annually</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">1000+</div>
                    <div className="stat-label">Active Partners</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">24/7</div>
                    <div className="stat-label">Platform Availability</div>
                  </div>
                </div>

                <button className="show-less-btn" onClick={() => setShowMore(false)}>
                  <span>Show Less</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Aboutus;
