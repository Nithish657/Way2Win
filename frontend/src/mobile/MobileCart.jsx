import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";

export default function MobileCart({ user_id, refresh, onCartChange }) {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/cart/${user_id}`);
      if (res.data.success) {
        setCartItems(res.data.cart);
        setTotal(res.data.cart.reduce((acc, item) => acc + item.price * item.quantity, 0));
      } else { 
        setCartItems([]); 
      }
    } catch (err) { 
      console.log(err); 
    }
  };

  useEffect(() => { 
    fetchCart(); 
  }, [refresh]);

  // 🚨 FIXED: Now exactly matches your backend PUT routes
  const updateQty = async (id, action) => {
    try {
      if (action === "increase") {
        await axios.put(`${API_URL}/cart/increase/${id}`);
      } else if (action === "decrease") {
        await axios.put(`${API_URL}/cart/decrease/${id}`);
      }
      fetchCart(); 
      if (onCartChange) onCartChange();
    } catch (err) {
      console.log("Update Quantity Error:", err);
    }
  };

  // 🚨 FIXED: Now exactly matches your backend DELETE route
  const removeItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/cart/${id}`);
      fetchCart(); 
      if (onCartChange) onCartChange();
    } catch (err) {
      console.log("Remove Item Error:", err);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Order Summary</h2>
      <div style={styles.list}>
        {cartItems.map((item) => (
          <div key={item.id} style={styles.itemCard}>
            <img 
              src={item.image?.startsWith("http") ? item.image : `${API_URL}/uploads/${item.image}`} 
              alt={item.name} 
              style={styles.itemImg} 
              onError={(e) => { e.currentTarget.src = "https://dummyimage.com/150/ccc/000"; }}
            />
            <div style={styles.itemDetails}>
              <h4 style={styles.itemTitle}>{item.name}</h4>
              <p style={styles.itemPrice}>₹{item.price}</p>
              <div style={styles.controls}>
                <button style={styles.btn} onClick={() => updateQty(item.id, "decrease")}>-</button>
                <span style={styles.qty}>{item.quantity}</span>
                <button style={styles.btn} onClick={() => updateQty(item.id, "increase")}>+</button>
                <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={styles.footer}>
        <div>
          <p style={styles.totalLabel}>Total Amount</p>
          <h3 style={styles.totalAmount}>₹{total}</h3>
        </div>
        <button style={styles.checkoutBtn}>Checkout</button>
      </div>
    </div>
  );
}

// STYLES
const styles = {
  container: { paddingBottom: "80px" },
  title: { fontSize: "18px", padding: "0 10px", color: "#333" },
  list: { display: "flex", flexDirection: "column", gap: "10px", padding: "10px" },
  itemCard: { display: "flex", backgroundColor: "#fff", padding: "10px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
  itemImg: { width: "80px", height: "80px", objectFit: "contain", borderRadius: "8px", backgroundColor: "#f9f9f9" },
  itemDetails: { marginLeft: "15px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  itemTitle: { margin: "0 0 5px 0", fontSize: "14px", color: "#333", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  itemPrice: { margin: 0, fontSize: "16px", fontWeight: "bold", color: "#2874f0" },
  controls: { display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" },
  btn: { width: "30px", height: "30px", borderRadius: "15px", border: "1px solid #ddd", background: "#fff", fontWeight: "bold", cursor: "pointer" },
  qty: { fontSize: "14px", fontWeight: "bold" },
  removeBtn: { marginLeft: "auto", background: "none", border: "none", fontSize: "18px", color: "red", cursor: "pointer" },
  footer: { position: "fixed", bottom: "65px", left: 0, right: 0, backgroundColor: "#fff", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee", boxShadow: "0 -2px 10px rgba(0,0,0,0.05)", zIndex: 100 },
  totalLabel: { margin: 0, fontSize: "12px", color: "#666" },
  totalAmount: { margin: 0, fontSize: "20px", color: "#111" },
  checkoutBtn: { padding: "12px 30px", backgroundColor: "#ff9f00", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }
};  