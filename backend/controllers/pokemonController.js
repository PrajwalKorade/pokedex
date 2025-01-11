const {
  fetchPokemonFromApi,
  fetchAllPokemonFromApi,
  fetchSpeciesFromApi,
} = require("../services/pokemonService");
const { processResponse } = require("../utils/processResponse");
const { logger } = require("../middleware/logger");
const redisClient = require("../config/redis");
const Fuse = require("fuse.js");

const CACHE_EXPIRY = 60 * 10;
const PUBLIC_CACHE_EXPIRY = CACHE_EXPIRY - 60;
const NAMECACHE_EXPIRY = 60 * 60 * 24 * 7;

const getPokemon = async (req, res, next) => {
  try {
    const { name } = req.params;
    const formattedName = name.toLowerCase();
    // key should not be allPokemon
    if (formattedName === "allpokemon") {
      return res.status(400).json({
        ok: false,
        error: "Invalid Pokémon name",
      });
    }
    const cachedData = await redisClient.get(formattedName);

    if (cachedData) {
      logger.info(`Cache hit for ${formattedName}`);
      res.set({
        "Cache-Control": `public, max-age=${PUBLIC_CACHE_EXPIRY}`,
        "X-Cache": "HIT",
        "X-Cache-Expires-In": `${PUBLIC_CACHE_EXPIRY} seconds`,
      });
      return res.json({
        ok: true,
        data: JSON.parse(cachedData),
      });
    }

    logger.info(`Cache miss for ${formattedName}`);
    const data = await fetchPokemonFromApi(formattedName);
    const speciesData = await fetchSpeciesFromApi(data.id);
    const processedData = processResponse(data, speciesData);

    // console.log(`Fetched data for ${formattedName}`, processedData);

    await redisClient.set(formattedName, JSON.stringify(processedData), {
      EX: CACHE_EXPIRY,
    });

    res.set({
      "Cache-Control": `public, max-age=${PUBLIC_CACHE_EXPIRY}`,
      "X-Cache": "MISS",
      "X-Cache-Expires-In": `${PUBLIC_CACHE_EXPIRY} seconds`,
    });

    return res.json({
      ok: true,
      data: processedData,
    });
  } catch (err) {
    if (err.message.includes("404")) {
      return res.status(404).json({
        ok: false,
        error: {
          message: "Pokemon not found",
          status: 404,
        },
      });
    }
    next(err);
  }
};

const suggestPokemon = async (req, res, next) => {
  try {
    const { q } = req.query;

    console.log(`Suggesting Pokémon for ${q}`);

    if (!q || typeof q !== "string") {
      return res.json({
        ok: true,
        data: [],
      });
    }
    const formattedName = q.toLowerCase();
    logger.info(`Suggesting Pokemon for ${formattedName}`);

    const cachedData = await redisClient.get("allPokemon");

    if (cachedData) {
      logger.info("Cache hit for allPokemon");
      const allPokemon = JSON.parse(cachedData);
      const fuse = new Fuse(allPokemon, { includeScore: true, threshold: 0.4 });
      const results = fuse.search(formattedName).map((result) => result.item);
      const limitResults = results.slice(0, 5);

      return res.json({
        ok: true,
        data: limitResults,
      });
    }
    logger.info("Cache miss for allPokemon");
    const { results: pokemonList } = await fetchAllPokemonFromApi();
    const allPokemon = pokemonList.map((pokemon) => pokemon.name);
    await redisClient.set("allPokemon", JSON.stringify(allPokemon), {
      EX: NAMECACHE_EXPIRY,
    });
    const fuse = new Fuse(allPokemon, { includeScore: true, threshold: 0.4 });
    const results = fuse.search(formattedName).map((result) => result.item);

    const limitResults = results.slice(0, 5);

    return res.json({
      ok: true,
      data: limitResults,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPokemon, suggestPokemon };
