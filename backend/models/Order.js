const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, enum: ['P','M','G','GG',''], default: '' }, // validação de tamanhos
  personalization: { type: String, maxlength: 150, default: '' }, // limite de caracteres
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 }
});

const OrderSchema = new mongoose.Schema({
  products: { type: [ProductSchema], validate: [arr => arr.length > 0, 'É necessário pelo menos 1 produto'] },
  total: { type: Number, required: true, min: 0 },
  customerName: { type: String, trim: true, default: '' },
  contactNumber: { type: String, trim: true, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Hook para calcular subtotais e total antes de validar/salvar
OrderSchema.pre('validate', function(next) {
  try {
    if (!Array.isArray(this.products) || this.products.length === 0) {
      return next(new Error('Pedido deve conter pelo menos um produto.'));
    }

    let computedTotal = 0;
    this.products = this.products.map(p => {
      const qty = Number(p.quantity) || 0;
      const price = Number(p.price) || 0;
      const subtotal = Math.round((qty * price) * 100) / 100; // 2 casas decimais
      computedTotal += subtotal;
      return {
        name: String(p.name || '').trim(),
        size: p.size || '',
        personalization: p.personalization ? String(p.personalization).trim() : '',
        quantity: qty,
        price: price,
        subtotal
      };
    });

    this.total = Math.round(computedTotal * 100) / 100;
    next();
  } catch (err) {
    next(err);
  }
});

// Método estático para listar pedidos recentes
OrderSchema.statics.listRecent = function(limit = 50) {
  return this.find().sort({ createdAt: -1 }).limit(limit).exec();
};

// Normalizar JSON de saída
OrderSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Order', OrderSchema);
