import ApiClient from './ApiClient';

function toAbsoluteImagePath(raw) {
  if (!raw) return '';
  if (raw.startsWith('http')) return raw;
  const clean = raw.replace(/^\/+/, '');
  return `${ApiClient ? 'http://localhost:4000' : ''}/${clean}`.replace(/\/+/g, '/').replace('http:/', 'http://');
}

function normalize(product) {
  return {
    id: product.id,
    name: product.name || 'Produto',
    price: Number(product.price || 0),
    imagePath: toAbsoluteImagePath(product.image || product.imageUrl || product.imagePath),
    availableSizes: Array.isArray(product.availableSizes) ? product.availableSizes : [],
    availablePersonalization: product.availablePersonalization === false ? false : true,
    // manter demais campos
    ...product
  };
}

async function getProducts() {
  const data = await ApiClient.get('/api/products');
  const list = Array.isArray(data) ? data : (Array.isArray(data && data.products) ? data.products : []);
  return list.map(normalize);
}

export default { getProducts };
