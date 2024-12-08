const jwt = require("jsonwebtoken");

const JWT_SECRET = "mAS2tdG8v7SWZEL8jIMqrD9knuWHmKhPQaqCbTZPec4=";

const getUserIdFromToken = (req, res, next) => {
  const token = req.cookies?.token;
  console.log("Cookies:", req.cookies);

  if (!token) {
      console.log("Token is missing in cookies");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Decoded token:", decoded);

      if (!decoded.userId) {
          console.error("userId missing in token");
          return res.status(400).json({ error: "Invalid token: userId not found" });
      }

      res.locals.user_id = decoded.userId;
      next();
  } catch (err) {
      console.error("Failed to authenticate token:", err.message);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};


module.exports = getUserIdFromToken;
