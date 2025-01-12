const {
  fetchPokemonFromApi,
  fetchAllPokemonFromApi,
  fetchSpeciesFromApi,
} = require("../services/pokemonService");
const {
  CACHE_CONFIG,
  setCacheHeaders,
  getFromCache,
  setInCache,
} = require("../utils/cache");
const { getFuzzySearchResults } = require("../utils/search");
const { processResponse } = require("../utils/processResponse");
const { logger } = require("../middleware/logger");

/**
 * Retrieves Pokemon details from the API and caches the response
 * @param {Request} req  request object with params containing the name of the pokemon
 * @param {Response} res
 * @param {NextFunction} next
 * @returns  {Promise<Response>} returns the details of the Pokemon
 */
const getPokemon = async (req, res, next) => {
  try {
    const { name } = req.params;
    if (!name || typeof name !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Invalid Pokémon name",
      });
    }

    const formattedName = name.toLowerCase();
    if (formattedName === "allpokemon") {
      return res.status(400).json({
        ok: false,
        message: "Invalid Pokémon name",
      });
    }

    const pokemonCacheKey = `pokemon:${formattedName}`;
    const cachedData = await getFromCache(pokemonCacheKey);

    if (cachedData) {
      logger.info(`Cache hit for ${pokemonCacheKey}`);
      setCacheHeaders(res, true);
      return res.json({
        ok: true,
        data: cachedData,
      });
    }

    logger.info(`Cache miss for ${pokemonCacheKey}`);

    const pokemonData = await fetchPokemonFromApi(formattedName);

    // Check and fetch species data
    const speciesCacheKey = `species:${pokemonData.id}`;
    let speciesData = await getFromCache(speciesCacheKey);
    logger.info(`Cache hit for ${speciesCacheKey}`);

    if (!speciesData) {
      logger.info(`Cache miss for ${speciesCacheKey}`);
      try {
        speciesData = await fetchSpeciesFromApi(pokemonData.id);
        await setInCache(
          speciesCacheKey,
          speciesData,
          CACHE_CONFIG.REDIS_CACHE_EXPIRY
        );
      } catch (error) {
        logger.warn(
          `Species data not found for ${pokemonData.name}, using default`
        );
        speciesData = "N/A";
      }
    }

    const processedData = processResponse(pokemonData, speciesData);
    await setInCache(
      pokemonCacheKey,
      processedData,
      CACHE_CONFIG.REDIS_CACHE_EXPIRY
    );

    setCacheHeaders(res, false);
    return res.json({
      ok: true,
      data: processedData,
    });
  } catch (err) {
    logger.error(`Error fetching pokemon ${req.params.name}:`, err);

    if (err.response?.status === 404) {
      return res.status(404).json({
        ok: false,
        message: "Pokemon not found",
      });
    }
    next(err);
  }
};

/**
 * Suggest Pokemon based on search query
 * @param {Request} req request object with query containing the search term
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<Response>} returns a list of suggested Pokemon
 */
const suggestPokemon = async (req, res, next) => {
  try {
    const formattedName = req.query.q?.toLowerCase();

    if (!formattedName) {
      return res.status(400).json({
        ok: false,
        message: "Search query is required",
      });
    }

    const cachedPokemon = await getFromCache("allPokemon");

    if (cachedPokemon) {
      logger.info("Cache hit for allPokemon");
      const suggestions = getFuzzySearchResults(cachedPokemon, formattedName);

      return res.json({
        ok: true,
        data: suggestions,
      });
    }

    logger.info("Cache miss for allPokemon");
    const { results: pokemonList } = await fetchAllPokemonFromApi();
    const allPokemon = pokemonList.map((pokemon) => pokemon.name);

    await setInCache("allPokemon", allPokemon, CACHE_CONFIG.NAMECACHE_EXPIRY);
    const suggestions = getFuzzySearchResults(allPokemon, formattedName);

    return res.json({
      ok: true,
      data: suggestions,
    });
  } catch (err) {
    logger.error("Error in suggestPokemon:", err);
    next(err);
  }
};

module.exports = { getPokemon, suggestPokemon };
