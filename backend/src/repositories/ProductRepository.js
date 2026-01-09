const Product = require('../models/Product');

async function find(limit = null) {
  const query = Product.find();
  if (limit) {
    query.limit(limit);
  }
  return query.exec();
}

async function findById(id) {
  return Product.findById(id).exec();
}

module.exports = { find, findById };
