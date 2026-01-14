import React, { useState } from "react";
import './Research.css'

const Research = () => {
    const [input, setInput] = useState('');
    const [box1, setBox] = useState('');
    const [residue1, setResidue] = useState('');
    const [price1, setPrice] = useState('');
    const [calculated, setCalculated] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const inq = parseFloat(document.getElementById("input").value);

        if (isNaN(inq) || inq <= 0) {
            alert('Please enter a valid positive number');
            return;
        }

        setInput(inq);
        const nbox = 120 * inq;
        setBox(nbox);
        const residue = 10 * nbox;
        setResidue(residue);
        const nPrice = 5 * residue;
        setPrice(nPrice);
        setCalculated(true);
    }

    const handleReset = () => {
        setInput('');
        setBox('');
        setResidue('');
        setPrice('');
        setCalculated(false);
        document.getElementById("input").value = "";
    }

    return (
        <div className="research-page">
            {/* Hero Section */}
            <section className="research-hero">
                <div className="research-hero-content">
                    <h1 className="research-hero-title">AI-Powered Residue Prediction</h1>
                    <p className="research-hero-subtitle">
                        Advanced GIS-based analysis using Punjab satellite imagery to estimate agricultural residue generation
                    </p>
                </div>
            </section>

            {/* Calculator Section */}
            <section className="calculator-section">
                <div className="calculator-container">
                    <div className="calculator-card">
                        <div className="calculator-header">
                            <h2 className="calculator-title">Calculate Your Residue</h2>
                            <p className="calculator-description">
                                Enter your farm size to get instant estimates on residue volume and potential revenue
                            </p>
                        </div>

                        <form className="calculator-form" onSubmit={handleSubmit}>
                            <div className="form-group-research">
                                <label htmlFor="input" className="form-label-research">
                                    Farm Size (hectares)
                                </label>
                                <input
                                    type="number"
                                    id="input"
                                    className="form-input-research"
                                    name="input"
                                    placeholder="Enter size in hectares"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="button-group">
                                <button type="submit" className="btn-submit">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Calculate
                                </button>
                                {calculated && (
                                    <button type="button" className="btn-reset" onClick={handleReset}>
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Reset
                                    </button>
                                )}
                            </div>
                        </form>

                        {calculated && (
                            <div className="results-container">
                                <h3 className="results-title">Prediction Results</h3>
                                <div className="results-grid">
                                    <div className="result-card">
                                        <div className="result-icon">
                                            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <div className="result-content">
                                            <span className="result-label">Boxes Generated</span>
                                            <span className="result-value">{box1.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="result-card">
                                        <div className="result-icon">
                                            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                            </svg>
                                        </div>
                                        <div className="result-content">
                                            <span className="result-label">Total Residue Generated</span>
                                            <span className="result-value">{residue1.toLocaleString()} kg</span>
                                        </div>
                                    </div>

                                    <div className="result-card highlight">
                                        <div className="result-icon">
                                            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="result-content">
                                            <span className="result-label">Expected Revenue</span>
                                            <span className="result-value">₹{price1.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="results-note">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Based on {input} hectares of farmland. Calculations use regional averages from Punjab GIS data.</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section className="technology-section">
                <div className="technology-container">
                    <h2 className="section-heading">Our Technology</h2>
                    <p className="section-subheading">
                        Powered by advanced Geographic Information Systems and satellite imagery analysis
                    </p>

                    <div className="tech-card">
                        <div className="tech-badge">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span>GIS Technology</span>
                        </div>

                        <h3 className="tech-title">Semi-Automatic Classification Plugin (SCP)</h3>
                        <p className="tech-description">
                            We utilize the industry-leading QGIS software with the Semi-Automatic Classification (SCP) plugin—a powerful, open-source tool designed for supervised classification of remote sensing imagery. Our system provides comprehensive tools for download, preprocessing, and postprocessing of satellite images.
                        </p>

                        <div className="tech-features">
                            <div className="tech-feature-item">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Automated raster processing workflow for efficient land cover classification</span>
                            </div>
                            <div className="tech-feature-item">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Multi-satellite support: ASTER, GOES, Landsat, MODIS, Sentinel-1/2/3</span>
                            </div>
                            <div className="tech-feature-item">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Advanced algorithms with GDAL, OGR, NumPy, SciPy, and Matplotlib integration</span>
                            </div>
                            <div className="tech-feature-item">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>ESA SNAP platform compatibility for enhanced processing capabilities</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Analysis Section */}
            <section className="analysis-section">
                <div className="analysis-container">
                    <h2 className="section-heading">Satellite Image Analysis</h2>
                    <p className="section-subheading">
                        Real-time processing of Punjab region satellite data for accurate residue estimation
                    </p>

                    <div className="image-grid">
                        <div className="image-card">
                            <div className="image-header">
                                <h3>Raw Satellite Image</h3>
                                <span className="image-badge">Original Data</span>
                            </div>
                            <div className="image-wrapper">
                                <img src="../images/raw.png" alt="Raw satellite imagery" />
                            </div>
                        </div>

                        <div className="image-card">
                            <div className="image-header">
                                <h3>Processed Image</h3>
                                <span className="image-badge processed">AI Enhanced</span>
                            </div>
                            <div className="image-wrapper">
                                <img src="../images/processed.png" alt="Processed satellite imagery" />
                            </div>
                        </div>

                        <div className="image-card">
                            <div className="image-header">
                                <h3>Classification Key</h3>
                                <span className="image-badge analysis">Analysis</span>
                            </div>
                            <div className="image-wrapper">
                                <img src="../images/label.png" alt="Classification legend" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Visualization Section */}
            <section className="data-section">
                <div className="data-container">
                    <h2 className="section-heading">Data Analysis Results</h2>
                    <p className="section-subheading">
                        Comprehensive statistical breakdown of agricultural residue distribution
                    </p>

                    <div className="data-card">
                        <img src="../images/csv.png" alt="Data analysis results" className="data-image" />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Research;
