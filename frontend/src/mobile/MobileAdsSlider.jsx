import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../api";

export default function MobileAdsSlider() {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get(`${API_URL}/ads`).then(res => { 
      if (res.data.success) setAds(res.data.ads); 
    });
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;
    const int = setInterval(() => setCurrentIndex(prev => (prev === ads.length - 1 ? 0 : prev + 1)), 3000);
    return () => clearInterval(int);
  }, [ads]);

  if (ads.length === 0) return null;

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.track, transform: `translateX(-${currentIndex * 100}%)` }}>
        {ads.map((ad, i) => (
          <div key={i} style={styles.slide}>
            <img src={ad.image} alt="Ad" style={styles.image} />
          </div>
        ))}
      </div>
      <div style={styles.dotsContainer}>
        {ads.map((_, i) => (
          <div 
            key={i} 
            style={{ ...styles.dot, backgroundColor: currentIndex === i ? "#2874f0" : "#ccc" }} 
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { 
    width: "100%", 
    height: "180px", 
    overflow: "hidden", 
    position: "relative", 
    backgroundColor: "#fff", 
    paddingBottom: "20px" 
  },
  track: { 
    display: "flex", 
    width: "100%", 
    height: "100%", 
    transition: "transform 0.5s ease-in-out" 
  },
  slide: { 
    minWidth: "100%", 
    height: "100%", 
    padding: "5px",
    boxSizing: "border-box" // Critical: Ensures padding doesn't push width over 100%
  },
  image: { 
    width: "100%",           // Fixed: Changed from 120% to keep it inside the container
    height: "120%",          // Fixed: Changed from 120%
    objectFit: "cover", 
    borderRadius: "12px", 
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)" 
  },
  dotsContainer: { 
    position: "absolute", 
    bottom: "5px", 
    width: "100%", 
    display: "flex", 
    justifyContent: "center", 
    gap: "6px" 
  },
  dot: { 
    width: "8px", 
    height: "8px", 
    borderRadius: "50%", 
    transition: "0.3s" 
  }
};