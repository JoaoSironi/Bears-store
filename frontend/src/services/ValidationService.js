function validateCustomer(name) {
  const errors = [];
  if (!name || String(name).trim().length < 3) errors.push('Nome do cliente inválido (min 3 caracteres)');
  return errors;
}

function validateContact(contact) {
  const errors = [];
  if (!contact || !/^[\d+\-\s()]{8,}$/.test(String(contact))) errors.push('Contato inválido (mínimo 8 dígitos)');
  return errors;
}

function validateProducts(products) {
  const errors = [];
  if (!Array.isArray(products) || products.length === 0) { errors.push('Nenhum produto selecionado'); return errors; }
  products.forEach((p, idx) => {
    if (!Number.isInteger(p.quantity) || p.quantity <= 0) errors.push(`${p.name || 'Produto'}: quantidade deve ser inteiro positivo`);
    if (Array.isArray(p.availableSizes) && p.availableSizes.length > 0 && (!p.size || String(p.size).trim() === '')) errors.push(`${p.name || 'Produto'}: selecione um tamanho`);
    if (p.availablePersonalization === false && (p.personalization && String(p.personalization).trim() !== '')) errors.push(`${p.name || 'Produto'}: personalização não permitida`);
  });
  return errors;
}

function validateOrder(order) {
  const errors = [
    ...validateCustomer(order.customerName),
    ...validateContact(order.contactNumber),
    ...validateProducts(order.products)
  ];
  return { valid: errors.length === 0, errors };
}

export default { validateOrder };
