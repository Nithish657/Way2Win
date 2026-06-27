const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
    db.query("SELECT * FROM ads", (err, result) => {
        if (err) return res.json({ success: false, ads: [] });

        const ads = result.map(ad => ({
            ...ad,
            // 🌟 THE MAGIC URL BUILDER 🌟
            // Automatically becomes localhost, 192.168.x.x, or way2win-backend.onrender.com
            image: `${req.protocol}://${req.get("host")}/uploads/${ad.image}`
        }));

        res.json({ success: true, ads });
    });
});

module.exports = router;