import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../api";

export default function MobileItemsList({ addToCart, title, category }) {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!category) return;
    axios.get(`${API_URL}/items/${category}`)
      .then((res) => setItems(res.data.success ? res.data.items : []))
      .catch(() => setItems([]));
  }, [category]);

  const getImageUrl = (image) => {
    if (!image) return "https://dummyimage.com/150/ccc/000&text=No+Img";
    return image.startsWith("http") ? image : `${API_URL}/uploads/${image}`;
  };

  if (items.length === 0) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}><h2 style={styles.title}>{title}</h2></div>
      <div style={styles.listWrapper}>
        <div style={styles.scrollList} ref={scrollRef}>
          {items.map((product) => (
            <div key={product.id} style={styles.card}>
              <div style={styles.imgWrapper}>
                <img 
                  src={getImageUrl(product.image)} 
                  alt={product.name} 
                  style={styles.img} 
                  onError={(e) => { e.target.src = "https://dummyimage.com/150/ccc/000"; }}
                />
              </div>
              <div style={styles.details}>
                <h3 style={styles.itemTitle}>{product.name}</h3>
                <div style={styles.priceRow}>
                  <p style={styles.price}>₹{product.price}</p>
                  <button style={styles.addBtn} onClick={() => addToCart(product.id, category)}>Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { marginBottom: "10px" },
  header: { marginBottom: "12px", padding: "0 10px" },
  title: { fontSize: "18px", fontWeight: "bold", margin: 0 },
  listWrapper: { position: "relative", display: "flex" },
  scrollList: { display: "flex", overflowX: "auto", gap: "12px", padding: "5px 10px", scrollbarWidth: "none" },
  card: { minWidth: "120px", maxWidth: "120px", height: "180px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #eee", display: "flex", flexDirection: "column" },
  imgWrapper: { width: "100%", paddingTop: "100%", position: "relative", backgroundColor: "#f9f9f9" },
  img: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", padding: "0px" },
  details: { padding: "10px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" },
  itemTitle: { fontSize: "12px", margin: "0 0 4px 0", height: "10px", overflow: "hidden" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" },
  price: { fontSize: "12px", fontWeight: "bold", color: "#0f1111", margin: 0 },
  addBtn: { padding: "4px 12px", backgroundColor: "#ffd814", border: "1px solid #fcd200", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }
};