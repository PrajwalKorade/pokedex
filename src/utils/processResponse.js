const processResponse = (data, speciesData) => {
  try {
    return {
      id: data.id,
      name: data.name,
      height: data.height / 10,
      weight: data.weight / 10,
      types: data.types.map((type) => type.type.name),
      stats: data.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      sprites: {
        front: data.sprites.front_default,
        back: data.sprites.back_default,
        official: data.sprites.other["official-artwork"].front_default,
      },
      moves: data.moves.slice(-8, -1).map((move) => move.move.name),
      abilities: data.abilities.map((ability) => ability.ability.name),
      description:
        speciesData.flavor_text_entries
          .find((entry) => entry.language.name === "en")
          ?.flavor_text.replace(/\f/g, " ") || "No description available.",
    };
  } catch (err) {
    console.error(`[UTILS] Failed to process response: ${err.message}`);
    throw new Error(`Failed to process response: ${err.message}`);
  }
};

module.exports = { processResponse };
