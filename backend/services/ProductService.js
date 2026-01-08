const ProductRepository = require('../repositories/ProductRepository');
const ApiError = require('./ApiError');

function toAbsoluteImagePath(raw) {
  if (!raw) return '';
  if (raw.startsWith('http')) return raw;
  const clean = raw.replace(/^\/+/, '');
  return `http://localhost:4000/${clean}`.replace(/\/+/g, '/').replace('http:/', 'http://');
}

function normalize(product) {
  return {
    id: product.id,
    name: product.name || 'Produto',
    price: Number(product.price || 0),
    imagePath: toAbsoluteImagePath(product.image || product.imageUrl || product.imagePath),
    availableSizes: Array.isArray(product.availableSizes) ? product.availableSizes : [],
    availablePersonalization: product.availablePersonalization === false ? false : true,
    ...product
  };
}

async function getProducts() {
  try {
    const products = await ProductRepository.find();

    if (!Array.isArray(products)) {
      throw new Error('Resultado inválido do repositório');
    }

    // return products.map(normalize);
    return products;
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    throw new ApiError(500, 'Erro ao buscar produtos');
  }
}

async function getProductById(id) {
  try {
    const product = await ProductRepository.findById(id);
    return product ? normalize(product) : null;
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    throw new ApiError(500, 'Erro ao buscar produto');
  }
}

module.exports = { getProducts, getProductById };
