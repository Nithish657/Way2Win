import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";

export default function MobileSearchResults() {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (query) {
      axios.get(`${API_URL}/items/search?q=${query}`)
        .then((res) => setResults(res.data.success ? res.data.items : []))
        .catch(() => setResults([]));
    }
  }, [query]);

  const getImageUrl = (img) => (!img || img === "null") ? "https://dummyimage.com/150" : (img.startsWith("http") ? img : `${API_URL}/uploads/${img}`);

  // NEW: The missing logic to actually add searched items to the cart!
  const addToCart = async (product) => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      alert("Please login to add items to your cart.");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/cart/add`, {
        user_id: 1, // Your hardcoded test user
        product_id: product.id,
        category: product.category || "search", 
      });
      if (res.data.success) {
        alert("Added to cart successfully! Check your cart tab.");
      }
    } catch (err) {
      console.log("Error adding to cart:", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <h3 style={styles.title}>Results for "{query}"</h3>
      </div>
      <div style={styles.content}>
        {results.length === 0 ? (
          <p style={styles.emptyText}>No products found.</p>
        ) : (
          <div style={styles.grid}>
            {results.map((product) => (
              <div key={product.id} style={styles.card}>
                <div style={styles.imgWrapper}>
                  <img src={getImageUrl(product.image)} alt={product.name} style={styles.image} />
                </div>
                <div style={styles.details}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.price}>₹{product.price}</p>
                  {/* NEW: Attached the onClick event to the button */}
                  <button style={styles.addBtn} onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f5f5f5" },
  header: { display: "flex", alignItems: "center", backgroundColor: "#2874f0", color: "white", padding: "15px", position: "fixed", top: 0, width: "100%", zIndex: 100 },
  backBtn: { background: "none", border: "none", color: "white", fontSize: "24px", marginRight: "15px", fontWeight: "bold" },
  title: { margin: 0, fontSize: "18px" },
  content: { paddingTop: "100px", padding: "10px", flex: 1, overflowY: "auto" },
  emptyText: { textAlign: "center", marginTop: "50px", fontSize: "16px", color: "#666" },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  card: { backgroundColor: "#fff", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column" },
  imgWrapper: { width: "100%", paddingTop: "100%", position: "relative" },
  image: { position: "absolute", top: 10, left: 0, width: "100%", height: "100%", objectFit: "contain", padding: "10px" },
  details: { padding: "10px", display: "flex", flexDirection: "column", flex: 1 },
  productName: { fontSize: "14px", margin: "0 0 5px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  price: { fontSize: "16px", fontWeight: "bold", color: "#2874f0", margin: "0 0 10px 0" },
  addBtn: { width: "100%", padding: "8px 0", backgroundColor: "#2874f0", color: "#fff", border: "none", borderRadius: "6px", marginTop: "auto", fontWeight: "bold" }
};