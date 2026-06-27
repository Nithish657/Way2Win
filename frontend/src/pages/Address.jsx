import React, { useState } from "react";
import Header from "../components/Header";

export default function Address() {
  const [address, setAddress] = useState(
    localStorage.getItem("userAddress") || ""
  );

  const saveAddress = () => {
    localStorage.setItem("userAddress", address);
    alert("Address saved");
  };

  return (
    <div>
      <Header />

      <div style={styles.container}>
        <h2>My Address</h2>

        <div style={styles.card}>
          <textarea
            placeholder="Enter your current address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.textarea}
          />

          <button style={styles.button} onClick={saveAddress}>
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingTop: "130px",
    paddingLeft: "30px",
    paddingRight: "30px",
  },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "15px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
  },
  button: {
    marginTop: "15px",
    padding: "12px 25px",
    background: "#2874f0",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};