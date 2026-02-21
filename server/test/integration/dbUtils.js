const mongoose = require('mongoose');

const clearDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
};

module.exports = { clearDatabase };
