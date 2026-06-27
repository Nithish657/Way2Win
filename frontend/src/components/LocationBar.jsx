import React, { useEffect, useState } from "react";
import axios from "axios";

const LocationBar = () => {
  const [location, setLocation] = useState("Detecting location...");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const address = res.data.address;
          const finalLocation = `${address.city || address.town || address.village}, ${address.state}`;
          setLocation(finalLocation);
        } catch (err) {
          setLocation("Unable to fetch location");
        }
      },
      () => setLocation("Location permission denied")
    );
  }, []);

  const styles = {
    container: {
      position: "fixed",
      top: "100px",           // 👈 below header height
      left: 0,
      right: 0,
      height: "50px",
      backgroundColor: "#ffffff",
      padding: "20px 30px",
      display: "flex",
      alignItems: "center",
      fontSize: "16px",
      fontWeight: "500",
      zIndex: 999,
      boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
    },
    icon: {
      marginRight: "10px",
      fontSize: "18px",
    },
    text: {
      color: "#000",
    },
  };

  return (
    <div style={styles.container}>
      <span style={styles.icon}>📍</span>
      <span style={styles.text}>{location}</span>
    </div>
  );
};

export default LocationBar;
