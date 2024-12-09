const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Load database configuration from env.json
const envConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "env.json"), "utf-8"));
const dbConfig = envConfig;

// Configure the PostgreSQL pool
const pool = new Pool(dbConfig);

module.exports = pool;
