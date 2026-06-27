import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../api";

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get(`${API_URL}/ads`);
        if (res.data.success) setAds(res.data.ads);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAds();
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [ads, currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === ads.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? ads.length - 1 : prevIndex - 1
    );
  };

  if (ads.length === 0) return null;

  return (
    <div style={styles.sliderContainer}>
      <div
        ref={sliderRef}
        style={{
          ...styles.slider,
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {ads.map((ad, index) => (
          <div key={index} style={styles.slide}>
            <img src={ad.image} alt={ad.title} style={styles.image} />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button style={styles.left} onClick={prevSlide}>❮</button>

      {/* Right Arrow */}
      <button style={styles.right} onClick={nextSlide}>❯</button>

      {/* Dots */}
      <div style={styles.dots}>
        {ads.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              ...styles.dot,
              background: currentIndex === index ? "white" : "gray",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Ads;

const styles = {
  sliderContainer: { width: "100%", height: "500px", overflow: "hidden", position: "relative", borderRadius: "12px", marginTop: "200px" },
  slider: { display: "flex", width: "100%", height: "100%", transition: "transform 0.8s ease" },
  slide: { minWidth: "100%", height: "100%" },
  image: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" },
  left: { position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", padding: "10px 15px", fontSize: "24px", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", color: "white", cursor: "pointer" },
  right: { position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)", padding: "10px 15px", fontSize: "24px", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", color: "white", cursor: "pointer" },
  dots: { position: "absolute", bottom: "10px", width: "100%", display: "flex", justifyContent: "center", gap: "8px" },
  dot: { width: "10px", height: "10px", borderRadius: "50%", cursor: "pointer", transition: "0.3s" },
};