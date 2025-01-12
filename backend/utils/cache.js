const redisClient = require("../config/redis");

const CACHE_CONFIG = {
  PUBLIC_CACHE_EXPIRY: 3600, // 1 hour
  REDIS_CACHE_EXPIRY: 24 * 3600, // 1 day
  NAMECACHE_EXPIRY: 12 * 3600, // 12 hours
};

const setCacheHeaders = (res, isHit) => {
  res.set({
    "Cache-Control": `public, max-age=${CACHE_CONFIG.PUBLIC_CACHE_EXPIRY}`,
    "X-Cache": isHit ? "HIT" : "MISS",
    "X-Cache-Expires-In": `${CACHE_CONFIG.PUBLIC_CACHE_EXPIRY} seconds`,
  });
};

const getFromCache = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

const setInCache = async (
  key,
  data,
  expiry = CACHE_CONFIG.REDIS_CACHE_EXPIRY
) => {
  await redisClient.set(key, JSON.stringify(data), { EX: expiry });
};

module.exports = {
  CACHE_CONFIG,
  setCacheHeaders,
  getFromCache,
  setInCache,
};
