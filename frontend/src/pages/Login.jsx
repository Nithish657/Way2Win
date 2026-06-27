import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../api";

export default function Login({ onLoginSuccess }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // 1. Ask the backend to generate an OTP
  const sendOtp = async () => {
    if (!phone || phone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/auth/send-otp`, { phone });
      
      if (res.data.success) {
        setOtpSent(true);
        // We alert the OTP here so you don't have to check the terminal every time while testing!
        alert(`OTP Sent successfully!\n\n(Dummy OTP is: ${res.data.otp})`);
      }
    } catch (error) {
      alert("Failed to send OTP");
      console.log("OTP Error:", error);
    }
  };

  // 2. Ask the backend to verify the OTP
  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, { phone, otp });
      
      if (res.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("phone", phone);
        alert("Login Successful");

        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login / Sign Up</h2>

      {!otpSent ? (
        <>
          <input
            type="tel"
            placeholder="Enter Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
          <button style={styles.button} onClick={sendOtp}>
            Continue
          </button>
        </>
      ) : (
        <>
          <p style={styles.text}>OTP sent to {phone}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.input}
          />
          <button style={styles.button} onClick={verifyOtp}>
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { width: "350px", padding: "30px", textAlign: "center" },
  title: { marginBottom: "20px", color: "#111" },
  text: { marginBottom: "15px", color: "#555" },
  input: { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd", outline: "none", fontSize: "15px", boxSizing: "border-box" },
  button: { width: "100%", padding: "12px", border: "none", borderRadius: "8px", backgroundColor: "#0c831f", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer" },
};