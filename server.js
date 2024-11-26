const express = require('express')
const app = express()
const port = 3000
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:3000/`)
})

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'your_database_name',
  password: '',
  port: 5432,
});

const CLIENT_ID = "d421abe938034ab483a6d54a4bfcbc50";
const CLIENT_SECRET = "d7bfb048e7e84be38a6470fc4259aa2b";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";

async function getAccessToken() {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to get access token");
  }

  const data = await response.json();
  return data.access_token;
}

async function searchSpotify(query, type = "track", limit = "1", artist = null) {
  const token = await getAccessToken();

  let searchQuery;
  if (type === "album" && artist) {
    searchQuery = `artist:${artist} album:${query}`;
  } else {
    searchQuery = query;
  }

  const url = `${SPOTIFY_SEARCH_URL}?q=${encodeURIComponent(searchQuery)}&type=${type}&limit=${limit}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data from Spotify API");
  }

  const data = await response.json();
  return data;
}

async function processAlbums() {
  const albums = [
    ["The Beatles", "Abbey Road"],
    ["Adele", "30"],
    ["Taylor Swift", "1989"]
  ];

  const insertPromises = albums.map(async (item) => {
    try {
      const albumData = await searchSpotify(item[1], "album", "1", item[0]);
      const albumDetails = albumData.albums.items[0];
      const albumName = albumDetails.name;
      const releaseDate = albumDetails.release_date;

      const query = `
        INSERT INTO ALBUMS (album_name, release_date, artist_name) 
        VALUES ($1, $2, $3)
      `;
      await pool.query(query, [albumName, releaseDate, item[0]]);
      console.log(`Data for ${albumName} by ${item[0]} inserted successfully.`);
    } catch (error) {
      console.error("Error:", error.message);
    }
  });

  await Promise.all(insertPromises);
}

// Run the process
processAlbums().then(() => {
  console.log("All albums processed and inserted.");
  pool.end(); // Close the connection pool when done
}).catch((err) => {
  console.error("Error processing albums:", err);
  pool.end(); // Ensure the connection pool is closed in case of an error
});
