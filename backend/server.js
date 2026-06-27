require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// 👇 ADD THIS NEW ROUTE 👇
app.get("/", (req, res) => {
  res.send("✅ Backend is successfully running on Render!");
});

// Routes
app.use("/auth", require("./routes/auth")); //[cite: 5]
app.use("/items", require("./routes/items")); //[cite: 5]
app.use("/ads", require("./routes/ads")); //[cite: 5]
app.use("/cart", require("./routes/cart")); //[cite: 5]

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`)); //[cite: 5]
