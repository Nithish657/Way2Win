import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";
import Login from "../pages/Login";

import MobileAdsSlider from "./MobileAdsSlider";
import MobileItemsList from "./MobileItemsList";
import MobileCart from "./MobileCart";
import MobileLocation from "./MobileLocation";

export default function MobileHome() {
  const [cartCount, setCartCount] = useState(0);
  const [activeTab, setActiveTab] = useState("home");
  const [showLogin, setShowLogin] = useState(false);
  const [cartRefresh, setCartRefresh] = useState(0);
  const [search, setSearch] = useState("");
  
  const navigate = useNavigate();
  const user_id = 1;

  const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

  const loadCart = async () => {
    if (!isLoggedIn()) return setCartCount(0);
    try {
      const res = await axios.get(`${API_URL}/cart/${user_id}`);
      if (res.data.success) setCartCount(res.data.cart.length);
    } catch (err) { console.log(err); }
  };

  const addToCart = async (product_id, category) => {
    if (!isLoggedIn()) return setShowLogin(true);
    try {
      const res = await axios.post(`${API_URL}/cart/add`, { user_id, product_id, category });
      if (res.data.success) {
        await loadCart();
        setCartRefresh(prev => prev + 1);
      }
    } catch (err) { console.log(err); }
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("phone");
    setCartCount(0);
    setActiveTab("home");
    window.location.reload();
  };

  const goSearch = () => {
    if (search.trim() !== "") navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  useEffect(() => { loadCart(); }, []);

  return (
    <div style={styles.appContainer}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      {/* 1. TOP HEADER */}
      <div style={styles.headerBox}>
        <div style={styles.header}>
          <h2 style={styles.logo}>MyShop</h2>
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="Search products..."
              style={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goSearch()}
            />
            <button style={styles.searchBtn} onClick={goSearch}>🔍</button>
          </div>
        </div>
        <MobileLocation /> 
      </div>

      {/* 2. SCROLLABLE MIDDLE CONTENT */}
      <div style={styles.scrollArea}>
        {activeTab === "home" && (
          <div style={styles.fadeAnim}>
            <MobileAdsSlider />
            <div style={styles.listContainer}>
              <MobileItemsList title="Men's Fashion" category="men" addToCart={addToCart} />
              <MobileItemsList title="Women's Fashion" category="women" addToCart={addToCart} />
              <MobileItemsList title="Kids Corner" category="kids" addToCart={addToCart} />
            </div>
          </div>
        )}

        {activeTab === "cart" && (
          <div style={{ ...styles.fadeAnim, height: "100%" }}>
            {isLoggedIn() ? (
              <MobileCart user_id={user_id} refresh={cartRefresh} onCartChange={loadCart} />
            ) : (
              <div style={styles.centerPrompt}>
                <h2 style={styles.promptIcon}>🛍️</h2>
                <h2>Your Cart is Empty</h2>
                <p style={styles.promptText}>Please login to view and add items to your cart.</p>
                <button style={styles.loginBtn} onClick={() => setShowLogin(true)}>Login to Continue</button>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div style={{ ...styles.fadeAnim, padding: "15px" }}>
            {isLoggedIn() ? (
              <div style={styles.profileCard}>
                <h2 style={{ marginTop: 0 }}>My Account</h2>
                <p style={styles.phoneText}>📞 +91 {localStorage.getItem("phone")}</p>
                <div style={styles.menuList}>
                  <div style={styles.menuItem}><span>📦</span> My Orders <span style={styles.arrow}>›</span></div>
                  <div style={styles.menuItem}><span>📍</span> Saved Addresses <span style={styles.arrow}>›</span></div>
                </div>
                <button style={styles.logoutBtn} onClick={logout}>Sign Out</button>
              </div>
            ) : (
              <div style={styles.centerPrompt}>
                <h2 style={styles.promptIcon}>👤</h2>
                <h2>Hello Guest</h2>
                <p style={styles.promptText}>Login to manage your orders and addresses.</p>
                <button style={styles.loginBtn} onClick={() => setShowLogin(true)}>Login / Sign Up</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. BOTTOM NAV BAR */}
      <div style={styles.bottomNav}>
        <div style={activeTab === "home" ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab("home")}>
          <span style={styles.navIcon}>🏠</span>
          <span style={styles.navText}>Home</span>
        </div>
        <div style={activeTab === "cart" ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab("cart")}>
          <div style={{ position: "relative" }}>
            <span style={styles.navIcon}>🛒</span>
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </div>
          <span style={styles.navText}>Cart</span>
        </div>
        <div style={activeTab === "profile" ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab("profile")}>
          <span style={styles.navIcon}>👤</span>
          <span style={styles.navText}>Profile</span>
        </div>
      </div>

      {/* 4. LOGIN MODAL */}
      {showLogin && (
        <div style={styles.overlay}>
          <div style={styles.loginBox}>
            <button style={styles.closeBtn} onClick={() => setShowLogin(false)}>✕</button>
            <Login onLoginSuccess={() => { setShowLogin(false); loadCart(); }} />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  appContainer: { display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f5f5f5", overflow: "hidden", fontFamily: "sans-serif" },
  fadeAnim: { animation: "fadeIn 0.3s" },
  headerBox: { zIndex: 100, boxShadow: "0 2px 10px rgba(255, 255, 255, 0.1)" },
  header: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 15px", backgroundColor: "#2874f0", color: "white" },
  logo: { margin: 10, fontSize: "25px", fontWeight: "bold", fontStyle: "normal" },
  
  searchBox: { 
    flex: 1, 
    height: "30px", 
    width: "100px", 
    display: "flex", 
    alignItems: "center", 
    backgroundColor: "white", 
    borderRadius: "8px", 
    overflow: "hidden" 
  },
  searchInput: { flex: 1, border: "none", outline: "none", padding: "8px 10px", fontSize: "14px", width: "100%" },
  searchBtn: { border: "none", background: "#f0f8ff", color: "#2874f0", padding: "8px 12px", cursor: "pointer", fontSize: "14px" },
  
  scrollArea: { flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: "70px" },
  listContainer: { padding: "15px" },
  bottomNav: { position: "fixed", bottom: 0, left: 0, right: 0, height: "65px", backgroundColor: "white", display: "flex", justifyContent: "space-around", alignItems: "center", borderTop: "1px solid #e0e0e0", zIndex: 1000, paddingBottom: "env(safe-area-inset-bottom)" },
  navItem: { display: "flex", flexDirection: "column", alignItems: "center", color: "#888", cursor: "pointer", width: "33%" },
  navItemActive: { display: "flex", flexDirection: "column", alignItems: "center", color: "#2874f0", cursor: "pointer", width: "33%", transform: "scale(1.05)" },
  navIcon: { fontSize: "22px", marginBottom: "4px" },
  navText: { fontSize: "12px", fontWeight: "600" },
  badge: { position: "absolute", top: "-4px", right: "-8px", backgroundColor: "#ff5252", color: "white", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "10px", border: "2px solid white" },
  centerPrompt: { textAlign: "center", backgroundColor: "white", padding: "40px 20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", margin: "15px" },
  promptIcon: { fontSize: "40px", margin: "10px" },
  promptText: { color: "#666" },
  profileCard: { backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
  phoneText: { fontSize: "18px", fontWeight: "bold", color: "#333", borderBottom: "1px solid #eee", paddingBottom: "15px", margin: "0 0 15px 0" },
  menuList: { display: "flex", flexDirection: "column" },
  menuItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0", borderBottom: "1px solid #eee", fontSize: "16px", color: "#444", fontWeight: "500" },
  arrow: { color: "#ccc", fontSize: "20px" },
  loginBtn: { background: "#ff9f00", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", marginTop: "15px", width: "100%" },
  logoutBtn: { background: "#fff", color: "#ff5252", border: "1px solid #ff5252", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", marginTop: "25px", width: "100%" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(3px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 },
  loginBox: { background: "white", padding: "10px", borderRadius: "16px", position: "relative", width: "90%", maxWidth: "400px" },
  closeBtn: { position: "absolute", top: "15px", right: "20px", background: "none", border: "none", fontSize: "22px", fontWeight: "bold", color: "#666", zIndex: 10 }
};