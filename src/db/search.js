const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'music',
  password: 'tester1234',
  port: 5432, // Default PostgreSQL port
});

// Function to search for artists
async function searchArtists(userEntry) {
    try {
      const query = `
        SELECT artist_name 
        FROM ARTISTS 
        WHERE artist_name ILIKE $1;
      `;
      const values = [`%${userEntry}%`];
      const res = await pool.query(query, values);
  
      if (res.rows.length === 0) {
        console.log(`No artists found matching "${userEntry}".`);
      } else {
        console.log(`Artists matching "${userEntry}":`);
        res.rows.forEach((row, index) => {
          console.log(`${index + 1}. ${row.artist_name}`);
        });
      }
    } catch (err) {
      console.error('Error executing query:', err);
    }
  }
  
  // Search for songs
  async function searchSongs(userEntry) {
    try {
      const query = `
        SELECT name 
        FROM SONGS 
        WHERE name ILIKE $1;
      `;
      const values = [`%${userEntry}%`];
      const res = await pool.query(query, values);
  
      if (res.rows.length === 0) {
        console.log(`No songs found matching "${userEntry}".`);
      } else {
        console.log(`Songs matching "${userEntry}":`);
        res.rows.forEach((row, index) => {
          console.log(`${index + 1}. ${row.name}`);
        });
      }
    } catch (err) {
      console.error('Error executing query:', err);
    }
  }
  
  // Search for albums
  async function searchAlbums(userEntry) {
    try {
      const query = `
        SELECT album_name 
        FROM ALBUMS 
        WHERE album_name ILIKE $1;
      `;
      const values = [`%${userEntry}%`];
      const res = await pool.query(query, values);
  
      if (res.rows.length === 0) {
        console.log(`No albums found matching "${userEntry}".`);
      } else {
        console.log(`Albums matching "${userEntry}":`);
        res.rows.forEach((row, index) => {
          console.log(`${index + 1}. ${row.album_name}`);
        });
      }
    } catch (err) {
      console.error('Error executing query:', err);
    }
  }
  
  // Handle user choice
  async function main() {
    const args = process.argv.slice(2);
    const [type, userInput] = args;
  
    if (!type || !userInput) {
      console.error('Usage: node search.js <type> <search_term>');
      console.error('<type> can be "artist", "song", or "album".');
      return;
    }
  
    if (type === 'artist') {
      await searchArtists(userInput);
    } else if (type === 'song') {
      await searchSongs(userInput);
    } else if (type === 'album') {
      await searchAlbums(userInput);
    } else {
      console.error('Invalid type. Use "artist", "song", or "album".');
    }
  
    await pool.end(); // Close db connection
  }
  
  main();
