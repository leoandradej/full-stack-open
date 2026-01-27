const DataLoader = require("dataloader");
const Book = require("./models/book");

const batchBookCounts = async (authorIds) => {
  console.log("batchBookCounts called with :", authorIds);

  const bookCounts = await Book.aggregate([
    {
      $match: { author: { $in: authorIds } },
    },
    {
      $group: {
        _id: "$author",
        count: { $sum: 1 },
      },
    },
  ]);

  console.log("Database returned:", bookCounts);

  const countMap = {};
  bookCounts.forEach(({ _id, count }) => {
    countMap[_id.toString()] = count;
  });

  return authorIds.map((id) => countMap[id.toString()] || 0);
};

const createLoaders = () => ({
  bookCountLoader: new DataLoader(batchBookCounts),
});

module.exports = createLoaders;
