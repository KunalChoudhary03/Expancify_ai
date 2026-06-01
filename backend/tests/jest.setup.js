const mongoose = require("mongoose");

afterEach(async () => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  const collections = mongoose.connection.collections;
  const cleanupTasks = Object.keys(collections).map((key) =>
    collections[key].deleteMany({})
  );

  await Promise.all(cleanupTasks);
});
