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
  sql = "SELECT artist_name AS result, 'artist' AS type FROM ARTISTS WHERE artist_name ILIKE $1;";
} else if (type === "song") {
  sql = "SELECT s.name AS result, 'song' AS type, a.album_name FROM SONGS s JOIN ALBUMS a ON s.album_id = a.album_id WHERE s.name ILIKE $1;";
} else if (type === "album") {
  sql = "SELECT album_name AS result, 'album' AS type FROM ALBUMS WHERE album_name ILIKE $1;";
}


  try {
    const results = await pool.query(sql, [`%${query}%`]);
    res.json(results.rows);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Database error." });
  }
});

router.get("/artist_songs", getUserIdFromToken, async (req, res) => {
  const artistName = req.query.query;
  if (!artistName) {
    return res.status(400).json({ error: "No artist name provided." });
  }

  const sql = `
    SELECT s.song_id, s.name AS song_name,
           s.year,
           s.duration,
           a.album_name
    FROM SONGS s
    JOIN ALBUMS a ON s.album_id = a.album_id
    JOIN SONG_ARTISTS sa ON s.song_id = sa.song_id
    JOIN ARTISTS ar ON sa.artist_id = ar.artist_id
    WHERE ar.artist_name ILIKE $1
    ORDER BY a.album_name, s.year, s.name;
  `;

  try {
    const { rows } = await pool.query(sql, [artistName]);
    res.json(rows);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Database error." });
  }
});


router.get("/album_songs", getUserIdFromToken, async (req, res) => {
  const albumName = req.query.query;

  if (!albumName) {
    return res.status(400).json({ error: "No album name provided." });
  }

  const sql = `
    SELECT s.song_id, s.name AS song_name, s.year, s.duration, a.album_name, ar.artist_name
    FROM SONGS s
    JOIN ALBUMS a ON s.album_id = a.album_id
    JOIN ARTISTS ar ON a.artist_id = ar.artist_id
    WHERE a.album_name ILIKE $1
    ORDER BY s.year, s.name;
  `;

  try {
    const { rows } = await pool.query(sql, [albumName]);
    res.json(rows);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Database error." });
  }
});

// Get all songs with their artists and albums
router.get("/all_songs", getUserIdFromToken, async (req, res) => {
    try {
        const query = `
            SELECT
                s.song_id,
                s.name AS song_name,
                s.year,
                s.duration,
                a.album_name,
                string_agg(ar.artist_name, ', ') AS artist_name
            FROM SONGS s
            LEFT JOIN ALBUMS a ON s.album_id = a.album_id
            LEFT JOIN SONG_ARTISTS sa ON s.song_id = sa.song_id
            LEFT JOIN ARTISTS ar ON sa.artist_id = ar.artist_id
            GROUP BY s.song_id, s.name, s.year, s.duration, a.album_name
            ORDER BY s.name;
        `;
        const results = await pool.query(query);
        res.json(results.rows);
    } catch (err) {
        console.error("Error fetching all songs:", err);
        res.status(500).json({ error: "Database error." });
    }
});

// Get all artists
router.get("/all_artists", getUserIdFromToken, async (req, res) => {
    try {
        const query = `
            SELECT artist_id, artist_name
            FROM ARTISTS
            ORDER BY artist_name;
        `;
        const results = await pool.query(query);
        res.json(results.rows);
    } catch (err) {
        console.error("Error fetching all artists:", err);
        res.status(500).json({ error: "Database error." });
    }
});

// Get all albums
router.get("/all_albums", getUserIdFromToken, async (req, res) => {
    try {
        const query = `
            SELECT album_id, album_name, release_date
            FROM ALBUMS
            ORDER BY album_name;
        `;
        const results = await pool.query(query);
        res.json(results.rows);
    } catch (err) {
        console.error("Error fetching all albums:", err);
        res.status(500).json({ error: "Database error." });
    }
});

// Get songs by album with artist information
router.get("/songs_by_album", getUserIdFromToken, async (req, res) => {
    const { album_id } = req.query;

    if (!album_id) {
        return res.status(400).json({ error: "Album ID is required." });
    }

    try {
        const query = `
            SELECT
                s.song_id,
                s.name AS song_name,
                s.year,
                s.duration,
                string_agg(ar.artist_name, ', ') AS artist_name
            FROM SONGS s
            LEFT JOIN SONG_ARTISTS sa ON s.song_id = sa.song_id
            LEFT JOIN ARTISTS ar ON sa.artist_id = ar.artist_id
            WHERE s.album_id = $1
            GROUP BY s.song_id, s.name, s.year, s.duration
            ORDER BY s.name;
        `;
        const { rows } = await pool.query(query, [album_id]);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching songs for album:", err);
        res.status(500).json({ error: "Database error." });
    }
});





module.exports = router;
