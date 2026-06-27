require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", require("./routes/auth")); // 👈 NEW: Connects your auth logic!
app.use("/items", require("./routes/items"));
app.use("/ads", require("./routes/ads"));
app.use("/cart", require("./routes/cart"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));