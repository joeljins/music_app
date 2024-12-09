const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db"); // Import the pool

const userRouter = express.Router();

<<<<<<< HEAD
// Configure the PostgreSQL pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'music',
  password: '5436',
  port: 5432,
});

=======
>>>>>>> e5af95017a686db24ec8bdce7f3441e92e96c1a0
// Middleware to parse JSON
userRouter.use(express.json());

userRouter.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
  }

  try {
      const result = await pool.query('SELECT * FROM "users" WHERE username = $1', [username]);

      if (result.rows.length === 0) {
          return res.status(401).json({ error: "Invalid username or password." });
      }

      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return res.status(401).json({ error: "Invalid username or password." });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.username }, "mAS2tdG8v7SWZEL8jIMqrD9knuWHmKhPQaqCbTZPec4=", { expiresIn: "1h" });

      // Set the token in an HTTP-only cookie
      res.cookie("token", token, {
          httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
          sameSite: "strict", // Prevent CSRF
          maxAge: 3600000 // 1 hour
      });

      res.json({ message: "Authentication successful" });
  } catch (err) {
      console.error("Error during authentication:", err);
      res.status(500).json({ error: "Internal server error." });
  }
});

// Register a new user
userRouter.post("/register", async (req, res) => {
    const { username, password, preferred_name, email } = req.body;
  
    // Validate input
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Username, password, and email are required." });
    }
  
    try {
      // Check if the username or email already exists
      const existingUser = await pool.query('SELECT * FROM "users" WHERE username = $1 OR email = $2', [username, email]);
      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: "Username or email already exists." });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the new user into the database
      await pool.query(
        'INSERT INTO "users" (username, password, preferred_name, email) VALUES ($1, $2, $3, $4)',
        [username, hashedPassword, preferred_name || null, email]
      );
  
      res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  });

// Export the router
module.exports = userRouter;
