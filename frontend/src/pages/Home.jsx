import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import LocationBar from "../components/LocationBar";
import AdsSlider from "../components/AdsSlider";
import ItemsList from "../components/ItemsList";
import Cart from "../components/cart";
import Login from "./Login";
import axios from "axios";
import { API_URL } from "../api";

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [cartRefresh, setCartRefresh] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  const user_id = 1;

  const isLoggedIn = () => {
    return localStorage.getItem("isLoggedIn") === "true";
  };

  const loadCart = async () => {
    if (!isLoggedIn()) {
      setCartCount(0);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/cart/${user_id}`);

      if (res.data.success) {
        setCartCount(res.data.cart.length);
      }
    } catch (err) {
      console.log("Load cart error:", err);
    }
  };

  const addToCart = async (product_id, category) => {
    if (!isLoggedIn()) {
      setShowLogin(true);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/cart/add`, {
        user_id,
        product_id,
        category,
      });

      if (res.data.success) {
        await loadCart();
        setCartRefresh((prev) => prev + 1);
      }
    } catch (err) {
      console.log("Add to cart error:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("phone");
    setCartCount(0);
    window.location.reload();
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <div style={styles.page}>
      <Header
        cartCount={cartCount}
        openCart={() => setShowCart(!showCart)}
      />

      <LocationBar />
      <AdsSlider />

      <div style={styles.userBar}>
        {isLoggedIn() ? (
          <>
            <span style={styles.phoneText}>
              {localStorage.getItem("phone")}
            </span>

            <button
              style={styles.logoutBtn}
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            style={styles.loginBtn}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
        )}
      </div>

      <div style={styles.content}>
        <ItemsList
          title="Men"
          category="men"
          addToCart={addToCart}
        />

        <ItemsList
          title="Women"
          category="women"
          addToCart={addToCart}
        />

        <ItemsList
          title="Kids"
          category="kids"
          addToCart={addToCart}
        />
      </div>

      <div style={styles.cartWrapper(showCart)}>
        {showCart && isLoggedIn() && (
          <Cart
            user_id={user_id}
            refresh={cartRefresh}
            onCartChange={loadCart}
          />
        )}
      </div>

      {showLogin && (
        <div style={styles.overlay}>
          <div style={styles.loginBox}>
            <button
              style={styles.closeBtn}
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>

            <Login
              onLoginSuccess={() => {
                setShowLogin(false);
                loadCart();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f5f5f5" },
  content: { padding: "20px", maxWidth: "1600px", margin: "0 auto" },
  userBar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", padding: "10px 20px" },
  phoneText: { fontWeight: "600" },
  loginBtn: { background: "#0c831f", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", cursor: "pointer" },
  logoutBtn: { background: "#e53935", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", cursor: "pointer" },
  cartWrapper: (showCart) => ({
    width: showCart ? "320px" : "0px",
    transition: "0.3s ease",
    overflow: "hidden",
    backgroundColor: "#fff",
    borderLeft: showCart ? "1px solid #ddd" : "none",
    height: "calc(100vh - 80px)",
    position: "fixed",
    right: 0,
    top: "80px",
    boxShadow: showCart ? "-2px 0 8px rgba(0,0,0,0.1)" : "none",
    zIndex: 1000,
  }),
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 },
  loginBox: { position: "relative", background: "#fff", borderRadius: "12px", minWidth: "380px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)" },
  closeBtn: { position: "absolute", right: "12px", top: "8px", border: "none", background: "transparent", fontSize: "28px", cursor: "pointer", zIndex: 10 },
};