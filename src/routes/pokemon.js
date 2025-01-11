const express = require("express");
const {
  getPokemon,
  suggestPokemon,
} = require("../controllers/pokemonController");

const router = express.Router();

router.get("/suggest", suggestPokemon);
router.get("/:name", getPokemon);

module.exports = router;
