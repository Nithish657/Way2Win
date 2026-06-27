import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";

export default function Cart({ user_id = 1, refresh = 0, onCartChange }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image) => {
    if (!image || image === "null" || image === "undefined") {
      return "https://dummyimage.com/90x90/cccccc/000000&text=No+Image";
    }

    if (image.startsWith("http")) return image;

    return `${API_URL}/uploads/${image}`;
  };

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/cart/${user_id}`);

      if (res.data.success) {
        setCartItems(res.data.cart);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.log("Cart fetch error:", err.response?.data || err.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/cart/increase/${id}`);

      if (res.data.success) {
        await loadCart();
        if (onCartChange) onCartChange();
      }
    } catch (err) {
      console.log("Increase error:", err.response?.data || err.message);
    }
  };

  const decreaseQty = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/cart/decrease/${id}`);

      if (res.data.success) {
        await loadCart();
        if (onCartChange) onCartChange();
      }
    } catch (err) {
      console.log("Decrease error:", err.response?.data || err.message);
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/cart/${id}`);

      if (res.data.success) {
        await loadCart();
        if (onCartChange) onCartChange();
      }
    } catch (err) {
      console.log("Remove error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user_id, refresh]);

  const totalPrice = cartItems.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  if (loading) {
    return <h2 style={styles.centerText}>Loading cart...</h2>;
  }

  if (cartItems.length === 0) {
    return <h2 style={styles.centerText}>Your cart is empty</h2>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Cart</h2>

      <div style={styles.scrollArea}>
        {cartItems.map((item) => (
          <div key={item.id} style={styles.card}>
            <img
              src={getImageUrl(item.image)}
              alt={item.name || "Product"}
              style={styles.image}
              onError={(e) => {
                e.currentTarget.src =
                  "https://dummyimage.com/90x90/cccccc/000000&text=No+Image";
              }}
            />

            <div style={styles.details}>
              <h3 style={styles.name}>{item.name}</h3>

              <p style={styles.price}>Price: ₹{Number(item.price || 0)}</p>

              <div style={styles.qtyBox}>
                <button
                  style={styles.qtyBtn}
                  onClick={() => decreaseQty(item.id)}
                >
                  -
                </button>

                <span style={styles.qtyText}>{item.quantity || 1}</span>

                <button
                  style={styles.qtyBtn}
                  onClick={() => increaseQty(item.id)}
                >
                  +
                </button>
              </div>

              <p style={styles.subtotal}>
                Subtotal: ₹
                {Number(item.price || 0) * Number(item.quantity || 1)}
              </p>

              <button
                style={styles.removeBtn}
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 style={styles.total}>Total: ₹{totalPrice}</h3>
    </div>
  );
}

const styles = {
  centerText: { textAlign: "center", marginTop: "30px" },
  container: { height: "100%", display: "flex", flexDirection: "column", padding: "12px", background: "#f5f5f5" },
  heading: { textAlign: "center", marginBottom: "12px" },
  scrollArea: { flex: 1, overflowY: "auto", paddingRight: "8px" },
  card: { display: "flex", alignItems: "center", background: "#fff", padding: "12px", marginBottom: "12px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  image: { width: "90px", height: "90px", marginRight: "15px", borderRadius: "8px", objectFit: "contain", border: "1px solid #ddd", background: "#eee" },
  details: { flex: 1 },
  name: { margin: "0 0 6px 0", fontSize: "17px" },
  price: { margin: "4px 0", color: "#2874f0", fontWeight: "bold" },
  qtyBox: { display: "flex", alignItems: "center", gap: "12px", marginTop: "8px", marginBottom: "8px" },
  qtyBtn: { width: "30px", height: "30px", borderRadius: "50%", border: "none", background: "#2874f0", color: "#fff", fontSize: "20px", fontWeight: "bold", cursor: "pointer" },
  qtyText: { fontSize: "18px", fontWeight: "bold", minWidth: "20px", textAlign: "center" },
  subtotal: { margin: "4px 0", fontWeight: "bold" },
  removeBtn: { marginTop: "8px", padding: "8px 15px", border: "none", background: "red", color: "white", borderRadius: "5px", cursor: "pointer" },
  total: { marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #ddd", textAlign: "right", fontWeight: "bold", fontSize: "20px" },
};