const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const pool = require("./db"); // Import the pool from db.js
const router = require("./routes/router");
const userRouter = require("./routes/user");
const playlistRouter = require("./routes/playlist");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

// Function to initialize the database connection
async function initializeDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log("Connected to the PostgreSQL database successfully.");
    client.release();
  } catch (error) {
    console.error("Error connecting to the PostgreSQL database:", error);
    process.exit(1);
  }
}

// Initialize database connection and start the server
async function startServer() {
  await initializeDatabaseConnection();

  // Register routes
  app.use("/", router);
  app.use("/user", userRouter);
  app.use("/playlist", playlistRouter);

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

// Start the server
startServer();
