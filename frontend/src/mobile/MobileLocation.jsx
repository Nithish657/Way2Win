import React, { useState, useEffect } from "react"; // Added missing hooks
import axios from "axios"; // Added missing axios import

export default function MobileLocation() {
  const [location, setLocation] = useState("Detecting location...");

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocation("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const address = res.data.address;
          // Clean up the location string
          const finalLocation = `${address.city || address.town || address.village || "Unknown Area"}, ${address.state || ""}`;
          setLocation(finalLocation);
        } catch (err) {
          setLocation("Unable to fetch location");
        }
      },
      () => setLocation("Permission denied") // Handles user denying access
    );
  }, []);

  return (
    <div style={styles.container}>
      <span style={styles.icon}>📍</span>
      <div style={styles.textGroup}>
        <span style={styles.deliverTo}>Deliver to</span>
        <span style={styles.address}>{location}</span>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", alignItems: "center", backgroundColor: "#1e5bb8", color: "white", padding: "8px 15px", fontSize: "13px" },
  icon: { fontSize: "16px", marginRight: "8px" },
  textGroup: { display: "flex", flexDirection: "row", gap: "5px", alignItems: "center" },
  deliverTo: { opacity: 0.8 },
  address: { fontWeight: "bold" }
};