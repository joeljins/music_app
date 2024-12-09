const express = require("express");
const path = require("path");
const pool = require("../db"); // Import the pool
const playlistRouter = express.Router();
const getUserIdFromToken = require("./middleware.js");

// Insert playlist into database
playlistRouter.post("/insert", getUserIdFromToken, async (req, res) => {
  const userId = res.locals.user_id;
  const { query_1, query_2 } = req.body;

  if (!query_1 || !query_2) {
    return res.status(400).json({ error: "All queries are required." });
  }

  // 'SELECT' SQL query to check if playlist count is less than 3
  let sql = `SELECT COUNT(*) FROM PLAYLISTS WHERE username = $1`;
  try {
    const result = await pool.query(sql, [userId]);
    console.log( result )
    const playlistCount = parseInt(result.rows[0].count, 10);
    console.log(result, playlistCount)

    if (playlistCount >= 3) {
      return res.status(400).json({ error: "You can only have up to three playlists." });
    }

    // 'INSERT' SQL query to insert playlist
    sql = `INSERT INTO PLAYLISTS (name, description, username, visibility)
           VALUES ($1, $2, $3, $4)`;
    await pool.query(sql, [query_1, query_2, userId, true]);

    res.status(201).json({ message: "Playlist created successfully." });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Database error." });
  }
});

// Return playlists to be displayed
playlistRouter.get("/display", getUserIdFromToken, async (req, res) => {
    const userId = res.locals.user_id;
    if (!userId){
        return res.status(400).json({ error: "User not logged in." });
    }
    let sql = `SELECT * FROM PLAYLISTS WHERE username = $1`;

    try {
        const results = await pool.query(sql, [userId]);
        res.json(results.rows);
      } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Database error." });
      }

});

playlistRouter.get("/songs", getUserIdFromToken, async (req, res) => {
    const userId = res.locals.user_id;
    if (!userId) {
        return res.status(400).json({ error: "User not logged in." });
    }

    const sql = `
        SELECT p.playlist_id, p.name AS playlist_name, s.name AS song_name, s.song_id
        FROM PLAYLISTS p
        LEFT JOIN CONTAINS c ON p.playlist_id = c.playlist_id
        LEFT JOIN SONGS s ON c.song_id = s.song_id
        WHERE p.username = $1;
    `;

    try {
        const results = await pool.query(sql, [userId]);

        let html = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 20px;
                }
                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 20px;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                li {
                    background-color: #fff;
                    margin: 5px 0;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                li strong {
                    font-size: 18px;
                    color: #555;
                }
                li ul {
                    padding-left: 20px;
                }
                li ul li {
                    background-color: #e9ecef;
                    margin-top: 5px;
                    padding: 10px;
                    border-radius: 4px;
                }
                li:hover {
                    background-color: #f1f1f1;
                }
                li ul li:hover {
                    background-color: #dcdcdc;
                }
            </style>
        </head>
        <body>
            <h1>Your Playlists</h1>
            <ul>
        `;

        const playlists = {};
        results.rows.forEach((row) => {
            if (!playlists[row.playlist_id]) {
                playlists[row.playlist_id] = {
                    name: row.playlist_name,
                    songs: []
                };
            }
            if (row.song_name) {
                playlists[row.playlist_id].songs.push({
                    name: row.song_name,
                    song_id: row.song_id
                });
            }
        });

        for (let playlistId in playlists) {
            html += `<li><strong>${playlists[playlistId].name}</strong><ul>`;
            playlists[playlistId].songs.forEach((song) => {
                html += `<li><a href="/playSong.html?song_id=${encodeURIComponent(song.song_id)}">${song.name}</a></li>`;
            });
            html += '</ul></li>';
        }

        html += '</ul></body></html>';

        res.send(html);
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Database error." });
    }
});

playlistRouter.post("/add", getUserIdFromToken, async (req, res) => {
    const userId = res.locals.user_id;
    const playlistName = req.body.playlist_name;
    const songs = req.body.songs;

    if (!userId) {
        return res.status(400).json({ error: "User not logged in." });
    }

    let checkPlaylistSql = `SELECT * FROM playlists WHERE username = $1 AND name = $2`;
    let checkSongSql = `SELECT * FROM songs WHERE name = $1`;
    let insertContainsSql = `INSERT INTO contains (playlist_id, song_id) VALUES ($1, $2)`;

    try {
        // Check if playlist exists
        const playlistResult = await pool.query(checkPlaylistSql, [userId, playlistName]);
        console.log(playlistResult);

        if (playlistResult.rows.length === 0) {
            return res.status(400).json({ error: "Playlist doesn't exist." });
        }
        let playlist_id = playlistResult.rows[0].playlist_id;

        // Loop through the songs
        for (let song of songs) {
            const songResult = await pool.query(checkSongSql, [song]);

            if (songResult.rows.length === 0) {
                return res.status(400).json({ error: `Song "${song}" does not exist.` });
            }
            let songId = songResult.rows[0].song_id;

            // Insert song into playlist
            await pool.query(insertContainsSql, [playlist_id, songId]);
        }

        res.json({ message: "Playlist and songs added successfully!" });
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Database error." });
    }
});

// Delete playlist from database
playlistRouter.post("/delete", getUserIdFromToken, async (req, res) => {
    const userId = res.locals.user_id;
    const { playlist_name } = req.body;
    console.log( req.body.playlist_name );
    let playlist = req.body.playlist_name;
    
    if (!userId) {
        return res.status(400).json({ error: "User not logged in." });
    }
    if (!playlist) {
        return res.status(400).json({ error: "Playlist name is required." });
    }

    let sql = `DELETE FROM PLAYLISTS WHERE username = $1 AND name = $2`;

    try {
        const results = await pool.query(sql, [userId, playlist]);
        console.log(results);
        if (results.rowCount > 0) {
            res.json({ message: "Playlist deleted successfully." });
        } else {
            res.status(404).json({ error: "Playlist not found." });
        }
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Database error." });
    }
});

module.exports = playlistRouter;
