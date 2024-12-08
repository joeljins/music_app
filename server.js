const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const cookieParser = require("cookie-parser");
const router = require("./routes/router");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

// Configure the PostgreSQL pool
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "music",
  password: "11032002",
  port: 5432,
});

// Function to initialize the database connection
async function initializeDatabaseConnection() {
  try {
    // Test the database connection
    const client = await pool.connect();
    console.log("Connected to the PostgreSQL database successfully.");
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error("Error connecting to the PostgreSQL database:", error);
    process.exit(1); // Exit the process if the database connection fails
  }
}

// Initialize database connection and start the server
async function startServer() {
  await initializeDatabaseConnection();

  // Register routes
  app.use("/", router);
  app.use("/user", userRouter);

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

// Start the server
startServer();
