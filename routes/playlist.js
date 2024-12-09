const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const playlistRouter = express.Router();
const getUserIdFromToken = require("./middleware.js");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'music',
  password: '5436',
  port: 5432,
});

playlistRouter.post("/insert", getUserIdFromToken, async (req, res) => {
  const userId = res.locals.user_id;
  const { query_1, query_2 } = req.body;
  console.log(userId, req.body.query_1, req.body.query_2)

  if (!query_1 || !query_2) {
    return res.status(400).json({ error: "All queries are required." });
  }

  let sql = `SELECT COUNT(*) FROM PLAYLISTS WHERE username = $1`;
  try {
    const result = await pool.query(sql, [userId]);
    console.log( result )
    //const playlistCount = parseInt(result.rows[0].count, 10);
    let playlistCount = 0;
    console.log(result, playlistCount)

    if (playlistCount >= 0) {
      return res.status(400).json({ error: "You can only have up to three playlists." });
    }

    // Insert the new playlist
    const newPlaylistId = `${userId}_${playlistCount}`;
    sql = `INSERT INTO PLAYLISTS (playlist_id, name, description, username, visibility)
           VALUES ($1, $2, $3, $4, $5)`;
    await pool.query(sql, [newPlaylistId, query_1, query_2, userId, true]);

    res.status(201).json({ message: "Playlist created successfully." });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Database error." });
  }
});


playlistRouter.get("/display", getUserIdFromToken, async (req, res) => {
    const userId = res.locals.user_id;
    if (!userId){
        return res.status(400).json({ error: "User not logged in." });
    }
    let sql = `SELECT * FROM PLAYLISTS WHERE username = $1`;

    try {
        const results = await pool.query(sql, [userId]);
        console.log(results);
        res.json(results.rows);
      } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Database error." });
      }

});

playlistRouter.get("/songs", getUserIdFromToken, async (req, res) => {
    const userId = res.locals.user_id;
    if (!userId){
        return res.status(400).json({ error: "User not logged in." });
    }
    let sql = `SELECT * FROM PLAYLISTS WHERE username = $1`;

    try {
        const results = await pool.query(sql, [userId]);
        console.log(results);
        res.json(results.rows);
      } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Database error." });
      }

});

playlistRouter.delete("/delete", getUserIdFromToken, async (req, res) => {
    const userId = res.locals.user_id;
    if (!userId){
        return res.status(400).json({ error: "User not logged in." });
    }
    let sql = `DELETE * FROM PLAYLISTS WHERE username = $1 AND name = $2 `;

    try {
        const results = await pool.query(sql, [userId]);
        console.log(results);
        res.json(results.rows);
      } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Database error." });
      }

});

module.exports = playlistRouter;
