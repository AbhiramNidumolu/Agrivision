import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
//import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Student");
  const [otpStage, setOtpStage] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1: Signup user & send OTP
  const handleSignup = async (e) => {
    e.preventDefault();

    // Check for campus email
    if (!form.email.endsWith("@vitapstudent.ac.in")) {
      alert("Please use your campus email ID to register.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/signup/", {
        ...form,
        role,
      });
      if (response.status === 201) {
        alert("OTP sent to your campus email. Please verify.");
        setOtpStage(true);
      }
    } catch (err) {
      alert(
        "Signup failed: " + (err.response?.data?.error || err.message)
      );
    }
  };

  // Step 2: Verify OTP
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/verify-otp/", {
        email: form.email,
        otp,
      });

      if (response.status === 200) {
        alert("Account verified successfully! Please login now.");
        navigate("/login");
      }
    } catch (err) {
      alert(
        "OTP verification failed: " + (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-image">
        <img src="/crops.png" alt="Crop Illustration" />
      </div>

      <div className="container signup-form">
        {!otpStage ? (
          <>
            <h1>Sign Up</h1>

            {/* Role Selection */}
            <div className="role-buttons">
  {["Student", "Staff", "Admin"].map((r) => (
    <button
      key={r}
      type="button"
      onClick={() => setRole(r)}
      className={`role-btn ${role === r ? "active" : ""}`}
    >
      {r}
    </button>
  ))}
</div>


            {/* Signup Form */}
            <form onSubmit={handleSignup}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Campus Email (e.g., user@college.edu)"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button type="submit">Sign Up</button>
            </form>

            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </>
        ) : (
          <>
            <h1>Verify Your Email</h1>
            <p>Enter the OTP sent to your registered campus email ID.</p>
            <form onSubmit={handleOtpVerify}>
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit">Verify OTP</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Signup;
