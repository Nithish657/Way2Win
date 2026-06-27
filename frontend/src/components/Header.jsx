import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ cartCount = 0, openCart }) {
  const [search, setSearch] = useState("");
  const [showAccount, setShowAccount] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  const navigate = useNavigate();

  const goSearch = () => {
    if (search.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div style={styles.header}>
        <h2 style={styles.logo} onClick={() => navigate("/home")}>
          MyShop
        </h2>

        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search for products"
            style={styles.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goSearch()}
          />

          <button style={styles.searchBtn} onClick={goSearch}>
            Search
          </button>
        </div>

        <div style={styles.rightSection}>
          <div style={styles.cart} onClick={openCart}>
            🛒 ({cartCount})
          </div>

          <div style={styles.user} onClick={() => setShowAccount(true)}>
            👤
          </div>
        </div>
      </div>

      {showAccount && (
        <div style={styles.accountOverlay}>
          <div style={styles.accountBox}>
            <button
              style={styles.closeBtn}
              onClick={() => setShowAccount(false)}
            >
              ✕
            </button>

            <div style={styles.sidebar}>
              <div style={styles.phone}>+919398866469</div>

              <div
                style={
                  activeTab === "address" ? styles.activeMenu : styles.menuItem
                }
                onClick={() => setActiveTab("address")}
              >
                📍 My Addresses
              </div>

              <div
                style={
                  activeTab === "orders" ? styles.activeMenu : styles.menuItem
                }
                onClick={() => setActiveTab("orders")}
              >
                📦 My Orders
              </div>

              <div style={styles.menuItem}>📄 My Prescriptions</div>
              <div style={styles.menuItem}>🎁 E-Gift Cards</div>
              <div style={styles.menuItem}>🔒 Account Privacy</div>

              <div style={styles.menuItem} onClick={logout}>
                👤 Logout
              </div>
            </div>

            <div style={styles.accountContent}>
              {activeTab === "orders" && (
                <div style={styles.orderCard}>
                  <div style={styles.orderTop}>
                    <div style={styles.check}>✓</div>

                    <div>
                      <h3 style={styles.orderTitle}>Arrived in 9 minutes</h3>
                      <p style={styles.orderSub}>₹221 • 02 Jun 2025</p>
                    </div>

                    <div style={styles.arrow}>→</div>
                  </div>

                  <div style={styles.products}>
                    <div style={styles.productBox}>🛍️</div>
                    <div style={styles.productBox}>🥛</div>
                  </div>
                </div>
              )}

              {activeTab === "address" && (
                <div style={styles.addressCard}>
                  <h2 style={{ marginTop: 0 }}>My Addresses</h2>

                  <div style={styles.addressBox}>
                    <h3>Current Address</h3>
                    <p>Sangareddy, Telangana, India</p>
                  </div>

                  <button style={styles.addAddressBtn}>
                    + Add New Address
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "90px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px 40px",
    backgroundColor: "#2874f0",
    color: "white",
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },

  logo: {
    cursor: "pointer",
    fontSize: "28px",
    fontWeight: "bold",
  },

  searchBox: {
    display: "flex",
    width: "45%",
    background: "white",
    borderRadius: "6px",
    overflow: "hidden",
  },

  search: {
    flex: 1,
    padding: "12px",
    border: "none",
    outline: "none",
    fontSize: "15px",
  },

  searchBtn: {
    padding: "0 18px",
    border: "none",
    background: "#ff9f00",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  cart: {
    cursor: "pointer",
    backgroundColor: "#ffffff",
    color: "#2874f0",
    padding: "8px 14px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "18px",
  },

  user: {
    cursor: "pointer",
    fontSize: "26px",
    background: "#fff",
    color: "#2874f0",
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  accountOverlay: {
    position: "fixed",
    top: "100px",
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.25)",
    zIndex: 3000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  accountBox: {
    width: "950px",
    height: "550px",
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    position: "relative",
    boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
  },

  closeBtn: {
    position: "absolute",
    right: "15px",
    top: "15px",
    width: "35px",
    height: "35px",
    border: "none",
    borderRadius: "50%",
    background: "#ff3f3f",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "18px",
    zIndex: 10,
  },

  sidebar: {
    width: "240px",
    borderRight: "1px solid #eee",
    background: "#fff",
  },

  phone: {
    padding: "35px 20px",
    textAlign: "center",
    borderBottom: "1px solid #eee",
    color: "#333",
  },

  menuItem: {
    padding: "18px 20px",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
    color: "#333",
    fontSize: "15px",
  },

  activeMenu: {
    padding: "18px 20px",
    borderBottom: "1px solid #eee",
    background: "#eef4ff",
    color: "#2874f0",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },

  accountContent: {
    flex: 1,
    background: "#f5f6fb",
    padding: "55px 35px 25px",
  },

  orderCard: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #ddd",
    overflow: "hidden",
  },

  orderTop: {
    display: "flex",
    alignItems: "center",
    padding: "18px",
    borderBottom: "1px solid #eee",
    gap: "12px",
  },

  check: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#dff8e6",
    color: "green",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "24px",
  },

  orderTitle: {
    margin: 0,
    color: "#111",
    fontSize: "20px",
  },

  orderSub: {
    margin: "4px 0 0",
    color: "#333",
    fontSize: "14px",
  },

  arrow: {
    marginLeft: "auto",
    fontSize: "24px",
    color: "#222",
  },

  products: {
    display: "flex",
    gap: "12px",
    padding: "20px",
  },

  productBox: {
    width: "90px",
    height: "60px",
    border: "1px solid #eee",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    background: "#fafafa",
  },

  addressCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "25px",
    border: "1px solid #ddd",
    color: "#111",
  },

  addressBox: {
    marginTop: "20px",
    padding: "18px",
    border: "1px solid #eee",
    borderRadius: "10px",
    background: "#fafafa",
  },

  addAddressBtn: {
    marginTop: "20px",
    padding: "12px 20px",
    border: "none",
    background: "#2874f0",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};