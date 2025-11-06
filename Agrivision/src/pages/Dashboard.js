import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

// Sample crop list for static thumbnails (add all crops as needed)
const cropList = ["corn", "rice", "wheat", "tomato" /* ...etc. */];

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("alphabetical");
  const [images, setImages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/images/");
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  // Group images by unique crop name, case-insensitive
  const cropMap = {};
  images.forEach(img => {
    const name = img.name.trim().toLowerCase();
    if (!cropMap[name]) cropMap[name] = [];
    cropMap[name].push(img);
  });

  // Filter and sort crops
  let crops = Object.keys(cropMap);
  if (searchQuery) {
    crops = crops.filter(crop => crop.includes(searchQuery.toLowerCase()));
  }
  if (filter === "alphabetical") crops.sort();
  if (filter === "newest") crops.sort((a, b) => {
    const latestA = Math.max(...cropMap[a].map(img => new Date(img.created_at)));
    const latestB = Math.max(...cropMap[b].map(img => new Date(img.created_at)));
    return latestB - latestA;
  });
  if (filter === "oldest") crops.sort((a, b) => {
    const earliestA = Math.min(...cropMap[a].map(img => new Date(img.created_at)));
    const earliestB = Math.min(...cropMap[b].map(img => new Date(img.created_at)));
    return earliestA - earliestB;
  });

  return (
    <div className="dashboard">
      <header className="header">
        <Link to="/">
          <img src="/logo.png" alt="AgriVision" className="logo" />
        </Link>
        <nav className="nav">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/about">About</Link>
          <Link className="nav-link" to="/contact">Contact</Link>
          {isLoggedIn && (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          )}
        </nav>
      </header>

      <div className="title-section">
        <h2 className="title">Crop Images</h2>
        <p className="subtitle">High-quality crop images collected from verified sources</p>
      </div>

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search crop name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">Search</button>
        </div>
      </div>

      <div className="browse-section">
        <h2>Browse by</h2>
        <div className="browse-buttons">
          {["Alphabetical", "Newest", "Oldest"].map(option => (
            <button
              key={option}
              onClick={() => setFilter(option.toLowerCase())}
              className={`browse-btn ${filter === option.toLowerCase() ? "active" : ""}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="gallery">
        {crops.length > 0 ? (
          <div className="image-grid">
            {crops.map((crop) => (
              <div
                key={crop}
                className="image-card"
                onClick={() => navigate(`/crop/${crop}`)}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/crop-thumbnails/${crop}.jpg`}
                  alt={crop}
                  className="crop-img"
                  onError={e => e.target.src = `${process.env.PUBLIC_URL}/crop-thumbnails/placeholder.jpg`}
                />
                <p className="crop-name">{crop.charAt(0).toUpperCase() + crop.slice(1)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No crops available.</p>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {isLoggedIn ? (
          <button className="upload-btn" onClick={() => navigate("/upload")}>
            Upload Image
          </button>
        ) : (
          <button className="upload-btn" onClick={() => navigate("/login")}>
            Login to Upload
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
