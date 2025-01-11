const redis = require("redis");
const { logger } = require("../middleware/logger");
require("dotenv").config();

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("connect", () => {
  logger.info("[LOG] Connected to Redis");
});

client.on("error", (err) => {
  logger.error(" Redis Not Found Exiting server...");
  process.exit(1);
});

client.connect();

module.exports = client;
