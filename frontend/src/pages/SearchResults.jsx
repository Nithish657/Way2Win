import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Cart from "../components/cart";
import { API_URL } from "../api";

export default function SearchResults() {
  const [items, setItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [cartRefresh, setCartRefresh] = useState(0);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const user_id = 1;

  const getImageUrl = (image) => {
    if (!image || image === "null" || image === "undefined") {
      return "https://dummyimage.com/150x150/cccccc/000000&text=No+Image";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_URL}/uploads/${image}`;
  };

  const loadCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/cart/${user_id}`);

      if (res.data.success) {
        const count = res.data.cart.reduce(
          (sum, item) => sum + Number(item.quantity || 1),
          0
        );
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.log("Cart count error:", err.response?.data || err.message);
      setCartCount(0);
    }
  };

  const loadSearchItems = async () => {
    try {
      const categories = ["men", "women", "kids"];

      const responses = await Promise.all(
        categories.map((cat) => axios.get(`${API_URL}/items/${cat}`))
      );

      let allItems = [];

      responses.forEach((res, index) => {
        if (res.data.success) {
          const category = categories[index];

          const itemsWithCategory = res.data.items.map((item) => ({
            ...item,
            category,
          }));

          allItems = [...allItems, ...itemsWithCategory];
        }
      });

      const searchValue = query.toLowerCase().trim();

      const filtered =
        searchValue === ""
          ? allItems
          : allItems.filter((item) => {
              return (
                item.name?.toLowerCase().includes(searchValue) ||
                item.category?.toLowerCase().includes(searchValue) ||
                String(item.price || "").includes(searchValue)
              );
            });

      setItems(filtered);
    } catch (err) {
      console.log("Search load error:", err.response?.data || err.message);
      setItems([]);
    }
  };

  const addToCart = async (product_id, category) => {
    try {
      const res = await axios.post(`${API_URL}/cart/add`, {
        user_id,
        product_id,
        category,
      });

      if (res.data.success) {
        await loadCart();
        setCartRefresh((prev) => prev + 1);
        setShowCart(true);
      } else {
        alert(res.data.message || "Add failed");
      }
    } catch (err) {
      console.log("Add cart error:", err.response?.data || err.message);
      alert("Add to cart failed");
    }
  };

  useEffect(() => {
    loadSearchItems();
    loadCart();
  }, [query]);

  return (
    <div style={styles.page}>
      <Header cartCount={cartCount} openCart={() => setShowCart(!showCart)} />

      <div style={styles.content}>
        <h2>Search results for: "{query}"</h2>

        {items.length === 0 ? (
          <h3 style={styles.empty}>No items found</h3>
        ) : (
          <div style={styles.grid}>
            {items.map((item) => (
              <div key={`${item.category}-${item.id}`} style={styles.card}>
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name || "Product"}
                  style={styles.image}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://dummyimage.com/150x150/cccccc/000000&text=No+Image";
                  }}
                />

                <h3 style={styles.name}>{item.name}</h3>
                <p style={styles.price}>₹{item.price}</p>

                <p style={styles.category}>Category: {item.category}</p>

                <button
                  style={styles.button}
                  onClick={() => addToCart(item.id, item.category)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.cartWrapper(showCart)}>
        {showCart && (
          <Cart
            user_id={user_id}
            refresh={cartRefresh}
            onCartChange={loadCart}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f5f5f5" },
  content: { paddingTop: "130px", paddingLeft: "25px", paddingRight: "25px", paddingBottom: "25px" },
  empty: { textAlign: "center", marginTop: "40px", color: "#555" },
  grid: { marginTop: "25px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" },
  card: { background: "#fff", borderRadius: "12px", padding: "15px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
  image: { width: "150px", height: "150px", objectFit: "contain" },
  name: { fontSize: "17px", minHeight: "45px" },
  price: { fontSize: "19px", fontWeight: "bold", color: "#2874f0" },
  category: { fontSize: "14px", color: "#666" },
  button: { padding: "10px 20px", background: "#2874f0", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" },
  cartWrapper: (showCart) => ({
    width: showCart ? "350px" : "0px",
    transition: "0.3s ease",
    overflow: "hidden",
    backgroundColor: "#fff",
    borderLeft: showCart ? "1px solid #ddd" : "none",
    height: "calc(100vh - 100px)",
    position: "fixed",
    right: 0,
    top: "100px",
    boxShadow: showCart ? "-2px 0 8px rgba(0,0,0,0.1)" : "none",
    zIndex: 1000,
  }),
};