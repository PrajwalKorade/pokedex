const axios = require("axios");

const fetchPokemonFromApi = async (name) => {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );
    return response.data;
  } catch (err) {
    throw new Error(`Failed to fetch Pokémon: ${err.message}`);
  }
};

const fetchSpeciesFromApi = async (id) => {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${id}`
    );
    return response.data;
  } catch (err) {
    throw new Error(`Failed to fetch Pokémon species: ${err.message}`);
  }
};

const fetchAllPokemonFromApi = async () => {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`
    );
    return response.data;
  } catch (err) {
    throw new Error(`Failed to fetch Pokémon: ${err.message}`);
  }
};

module.exports = {
  fetchPokemonFromApi,
  fetchAllPokemonFromApi,
  fetchSpeciesFromApi,
};
