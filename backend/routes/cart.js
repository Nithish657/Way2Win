const express = require("express");
const router = express.Router();
const db = require("../db");

const TABLES = {
  men: "products",
  women: "products1",
  kids: "products2",
};

// 1. ADD TO CART
router.post("/add", (req, res) => {
  const { user_id, product_id, category } = req.body;
  const tableName = TABLES[category];

  if (!user_id || !product_id || !category || !tableName) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  const checkQuery = "SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND category = ?";

  db.query(checkQuery, [user_id, product_id, category], (err, existing) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (existing.length > 0) {
      return db.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE id = ?",
        [existing[0].id],
        (err) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.json({ success: true, message: "Quantity updated" });
        }
      );
    }

    db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [product_id], (err, data) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (data.length === 0) return res.status(404).json({ success: false, message: "Product not found" });

      const product = data[0];
      const insertQuery = `
        INSERT INTO cart (user_id, product_id, name, price, image, quantity, category)
        VALUES (?, ?, ?, ?, ?, 1, ?)
      `;

      db.query(
        insertQuery,
        [user_id, product_id, product.name, product.price, product.image, category],
        (err) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.json({ success: true, message: "Item added to cart" });
        }
      );
    });
  });
});

// 2. GET CART
router.get("/:user_id", (req, res) => {
  db.query(
    "SELECT * FROM cart WHERE user_id = ? ORDER BY id DESC",
    [req.params.user_id],
    (err, data) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, cart: data });
    }
  );
});

// 3. INCREASE QUANTITY
router.put("/increase/:id", (req, res) => {
  db.query(
    "UPDATE cart SET quantity = quantity + 1 WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: "Quantity increased" });
    }
  );
});

// 4. DECREASE QUANTITY
router.put("/decrease/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT quantity FROM cart WHERE id = ?", [id], (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (data.length === 0) return res.status(404).json({ success: false, message: "Item not found" });

    if (Number(data[0].quantity) <= 1) {
      db.query("DELETE FROM cart WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Item removed" });
      });
    } else {
      db.query(
        "UPDATE cart SET quantity = quantity - 1 WHERE id = ?",
        [id],
        (err) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.json({ success: true, message: "Quantity decreased" });
        }
      );
    }
  });
});

// 5. REMOVE ITEM COMPLETELY
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM cart WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "Item removed successfully" });
  });
});

module.exports = router;