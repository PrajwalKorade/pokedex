const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("connect", () => {
  console.log("[REDIS] Connected to Redis");
});

client.on("error", (err) => {
  console.error("[REDIS] Redis error:", err);
  console.error("[REDIS] Exiting server...");
  process.exit(1);
});

client.connect();

module.exports = client;
