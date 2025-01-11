const processResponse = (data) => {
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
      abilities: data.abilities.map((ability) => ability.ability.name),
    };
  } catch (err) {
    console.error(`[UTILS] Failed to process response: ${err.message}`);
    throw new Error(`Failed to process response: ${err.message}`);
  }
};

module.exports = { processResponse };
