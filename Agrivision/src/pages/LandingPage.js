import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';  // import the css file

const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ images: 0, crops: 0 });

  useEffect(() => {
    // Replace '/api/stats' with your backend stats endpoint 
    fetch('/api/images/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats({ images: 0, crops: 0 }));
  }, []);

  return (
    <div className="landing-root">
      <header className="landing-header">
        {/* If you have a logo, add here: */}
        {/* <img src="/logo.png" alt="AgriVision" className="logo"/> */}
        <h1>AgriVision</h1>
        <p className="landing-subtitle">
          High Quality Crop Image Datasets for India
        </p>
      </header>
      <main className="landing-main">
        <section className="landing-stats">
          <h2>Platform Statistics</h2>
          <p>{stats.images} images across {stats.crops} crop varieties</p>
        </section>
        <div className="landing-buttons">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
          <button className="guest" onClick={() => navigate('/dashboard')}>Continue as Guest</button>
        </div>
        <section className="landing-about">
          <h3>About This Project</h3>
          <p>
            AgriVision makes it easy for horticulture students and agriculture professionals to browse, upload, and utilize crop images for machine learning and research.
          </p>
        </section>
      </main>
      <footer className="landing-footer">
        © {new Date().getFullYear()} AgriVision. All Rights Reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
