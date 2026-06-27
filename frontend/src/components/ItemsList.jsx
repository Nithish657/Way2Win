import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";

export default function ItemsList({ addToCart, title, category }) {
  const [items, setItems] = useState([]);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!category) return;

    axios
      .get(`${API_URL}/items/${category}`)
      .then((res) => {
        if (res.data.success) {
          setItems(res.data.items);
          setTimeout(checkScrollButtons, 200);
        } else {
          setItems([]);
        }
      })
      .catch((err) => {
        console.log("Items API Error:", err.response?.data || err.message);
        setItems([]);
      });
  }, [category]);

  const checkScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -500,
      behavior: "smooth",
    });

    setTimeout(checkScrollButtons, 400);
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 500,
      behavior: "smooth",
    });

    setTimeout(checkScrollButtons, 400);
  };

  const getImageUrl = (image) => {
    if (!image || image === "null" || image === "undefined") {
      return "https://dummyimage.com/150x150/cccccc/000000&text=No+Image";
    }

    if (image.startsWith("http")) return image;

    return `${API_URL}/uploads/${image}`;
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>{title}</h2>

      <div style={styles.sliderWrapper}>
        {showLeft && (
          <button style={styles.arrowLeft} onClick={scrollLeft}>
            ❮
          </button>
        )}

        <div
          ref={scrollRef}
          style={styles.container}
          onScroll={checkScrollButtons}
        >
          {items.map((product) => (
            <div key={`${category}-${product.id}`} style={styles.card}>
              <img
                src={getImageUrl(product.image)}
                alt={product.name || "Product"}
                style={styles.image}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://dummyimage.com/150x150/cccccc/000000&text=No+Image";
                }}
              />

              <h3 style={styles.name}>{product.name}</h3>
              <p style={styles.price}>₹{product.price}</p>

              <button
                style={styles.button}
                onClick={() => addToCart(product.id, category)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {showRight && (
          <button style={styles.arrowRight} onClick={scrollRight}>
            ❯
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { marginTop: "5px", position: "relative" },
  title: { fontSize: "24px", fontWeight: "bold", margin: "10px 20px" },
  sliderWrapper: { position: "relative", display: "flex", alignItems: "center" },
  arrowLeft: { position: "absolute", left: "5px", zIndex: 20, width: "45px", height: "45px", borderRadius: "50%", border: "none", background: "#ffffff", boxShadow: "0 2px 10px rgba(0,0,0,0.2)", cursor: "pointer", fontSize: "24px", fontWeight: "bold" },
  arrowRight: { position: "absolute", right: "5px", zIndex: 20, width: "45px", height: "45px", borderRadius: "50%", border: "none", background: "#ffffff", boxShadow: "0 2px 10px rgba(0,0,0,0.2)", cursor: "pointer", fontSize: "24px", fontWeight: "bold" },
  container: { display: "flex", overflowX: "auto", gap: "16px", padding: "10px 60px", scrollBehavior: "smooth", width: "100%", scrollbarWidth: "none" },
  card: { minWidth: "220px", maxWidth: "220px", backgroundColor: "#fff", borderRadius: "12px", padding: "12px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", flexShrink: 0 },
  image: { width: "150px", height: "150px", objectFit: "contain", marginBottom: "10px" },
  name: { fontSize: "17px", fontWeight: "bold", minHeight: "45px" },
  price: { fontWeight: "bold", color: "#2874f0", fontSize: "18px" },
  button: { marginTop: "10px", padding: "10px 24px", background: "#2874f0", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "bold" },
};