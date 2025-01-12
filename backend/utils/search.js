const Fuse = require("fuse.js");

const getFuzzySearchResults = (items, searchTerm, limit = 5) => {
  const fuse = new Fuse(items, {
    includeScore: true,
    threshold: 0.4,
  });

  return fuse
    .search(searchTerm)
    .map((result) => result.item)
    .slice(0, limit);
};

module.exports = { getFuzzySearchResults };
