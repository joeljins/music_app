const express = require("express");
const path = require("path");
const pool = require("../db"); // Import the pool
const router = express.Router();
const getUserIdFromToken = require("./middleware.js");

// Serve the main HTML file
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "login.html"));
});

// Handle the search route
router.post("/search", getUserIdFromToken, async (req, res) => {
  const userId = res.locals.user_id;
  const { type, query } = req.body;

  if (!type || !query) {
    return res.status(400).json({ error: "Type and query are required." });
  }

  let sql;
  if (type === "artist") {
    sql = "SELECT artist_name AS result FROM ARTISTS WHERE artist_name ILIKE $1;";
  } else if (type === "song") {
    sql = "SELECT name AS result FROM SONGS WHERE name ILIKE $1;";
  } else if (type === "album") {
    sql = "SELECT album_name AS result FROM ALBUMS WHERE album_name ILIKE $1;";
  } else {
    return res.status(400).json({ error: "Invalid search type." });
  }

  try {
    const results = await pool.query(sql, [`%${query}%`]);
    res.json(results.rows);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Database error." });
  }
});

module.exports = router;
