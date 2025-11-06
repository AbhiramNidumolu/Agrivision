// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VerifyOTP from "./pages/VerifyOTP";
import Upload from "./pages/Upload";
import CropDetail from "./pages/CropDetail";
import LandingPage from './pages/LandingPage';
import "./App.css";

function App() {
  return (
    <Router>

      {/* ✅ Page Routing */}
      <main className="page-wrapper">
        <Routes>
          {/* Default route → Dashboard (public access) */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth pages */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* OTP Verification */}
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* Other pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/about" element={<div><h2>About Page</h2></div>} />
          <Route path="/contact" element={<div><h2>Contact Page</h2></div>} />
          <Route path="/crop/:name" element={<CropDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
