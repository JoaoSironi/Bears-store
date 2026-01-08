const EPS = 0.01;

function validateCustomerName(name) {
  const errors = [];
  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    errors.push('Nome do cliente inválido (mínimo 3 caracteres)');
  }
  return errors;
}

function validateContact(contact) {
  const errors = [];
  if (!contact || typeof contact !== 'string' || !/^[\d+\-\s()]{8,}$/.test(contact.trim())) {
    errors.push('Contato inválido (mínimo 8 dígitos, apenas números/caracteres + - () allowed)');
  }
  return errors;
}

function isInteger(val) {
  return Number.isInteger(val);
}

function almostEqual(a, b) {
  return Math.abs((Number(a) || 0) - (Number(b) || 0)) <= EPS;
}

function validateProducts(products) {
  const errors = [];
  if (!Array.isArray(products) || products.length === 0) {
    errors.push('Nenhum produto selecionado');
    return errors;
  }
  products.forEach((p, idx) => {
    const name = p.name || `Produto[${idx}]`;
    if (!isInteger(p.quantity) || p.quantity <= 0) errors.push(`${name}: quantidade deve ser inteiro positivo`);
    if (typeof p.price === 'undefined' || Number(p.price) < 0 || Number.isNaN(Number(p.price))) errors.push(`${name}: preço inválido`);
    // subtotal consistency
    const expected = Number(p.quantity || 0) * Number(p.price || 0);
    if (!almostEqual(p.subtotal, expected)) errors.push(`${name}: subtotal inconsistente (esperado ${expected.toFixed(2)})`);
    // size requirement if availableSizes provided
    if (Array.isArray(p.availableSizes) && p.availableSizes.length > 0) {
      if (!p.size || String(p.size).trim() === '') errors.push(`${name}: selecione um tamanho`);
    }
    // personalization
    if (p.availablePersonalization === false && p.personalization && String(p.personalization).trim() !== '') {
      errors.push(`${name}: personalização não permitida`);
    }
  });
  return errors;
}

function validateTotal(products, total) {
  const errors = [];
  const sum = products.reduce((s, p) => s + (Number(p.subtotal) || 0), 0);
  if (!almostEqual(sum, total)) {
    errors.push(`Total inválido: soma dos subtotais é ${sum.toFixed(2)} mas total informado é ${Number(total || 0).toFixed(2)}`);
  }
  return errors;
}

function validateOrder(order) {
  const errors = [
    ...validateCustomerName(order.customerName),
    ...validateContact(order.contactNumber),
    ...validateProducts(order.products || [])
  ];
  if (errors.length === 0) {
    errors.push(...validateTotal(order.products || [], order.total));
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { validateOrder };
