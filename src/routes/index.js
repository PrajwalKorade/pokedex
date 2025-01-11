const express = require("express");
const pokemonRoutes = require("./pokemon");

const router = express.Router();

router.use("/pokemon", pokemonRoutes);

module.exports = router;
