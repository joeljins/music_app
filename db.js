const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Load database configuration from env.json
const envConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "env.json"), "utf-8"));

// Map env.json keys
const dbConfig = {
  host: envConfig.PG_HOST,
  port: envConfig.PG_PORT,
  user: envConfig.PG_USER,
  password: envConfig.PG_PASSWORD,
  database: envConfig.PG_DATABASE,
};

// Configure the pool
const pool = new Pool(dbConfig);

module.exports = pool;
