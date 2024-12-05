const express = require("express");
const path = require("path");
const router = express.Router();

// Configure the PostgreSQL client
const client = new Client({
    user: 'your-username',
    host: 'localhost',
    database: 'your-database',
    password: 'your-password',
    port: 5432,
  });
  
  client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

router.get("/getAlbum", (req, res) => {
  const query = `SELECT *
                FROM ALBUMS
                WHERE album_name LIKE '${req.query}';
                `; // Replace with your query logic

  client.query(query, (err, result) => {
    if (err) {
      console.error('Query error', err.stack);
      res.status(500).send('Error querying the database');
    } else {
      res.json(result.rows); // Send the query results as a JSON response
    }
  });
});
  

module.exports = router;
