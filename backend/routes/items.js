const express = require("express");
const router = express.Router();
const db = require("../db");

const TABLES = {
  men: "products",
  women: "products1",
  kids: "products2",
};

// SEARCH ALL ITEMS
// 🚨 FIX: Changed from "/search/all" to "/search" to match the frontend
router.get("/search", (req, res) => {
  const q = req.query.q || "";

  const query = `
    SELECT id, name, price, image, 'men' AS category FROM products WHERE name LIKE ?
    UNION ALL
    SELECT id, name, price, image, 'women' AS category FROM products1 WHERE name LIKE ?
    UNION ALL
    SELECT id, name, price, image, 'kids' AS category FROM products2 WHERE name LIKE ?
  `;

  const searchValue = `%${q}%`;

  db.query(query, [searchValue, searchValue, searchValue], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      items: data,
    });
  });
});

// CATEGORY ITEMS
// Because "/search" is physically above this line, Express won't get confused anymore!
router.get("/:category", (req, res) => {
  const category = req.params.category;

  if (!TABLES[category]) {
    return res.status(400).json({
      success: false,
      message: "Invalid category",
    });
  }

  const query = `SELECT * FROM ${TABLES[category]}`;

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      items: data,
    });
  });
});

module.exports = router;