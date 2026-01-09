import React, { useState } from 'react';
import '../css/ProductCard.css';

export default function ProductCard({ product, onAddToCart }) {
  const [size, setSize] = useState('');
  const [personalization, setPersonalization] = useState('');
  const [quantity, setQuantity] = useState(1);

  const fallbackSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="16">Sem imagem</text></svg>'
  );

  const handleAdd = () => {
    if (product.availableSizes && product.availableSizes.length > 0 && !size) {
      alert('Selecione um tamanho');
      return;
    }
    onAddToCart(product, size, personalization, quantity);
    // resetar form
    setSize('');
    setPersonalization('');
    setQuantity(1);
  };

  return (
    <div className="card">
      { (product.imagePath) ? (
        <img className="card-image" src={product.imagePath} alt={product.name} />
      ) : (
        <div className="image-placeholder">Sem imagem</div>
      )}

      <h3 className="card-title">{product.name}</h3>

      <div className="controls">
        {product.availableSizes && product.availableSizes.length > 0 && (
          <label>
            Tamanho
            <select value={size} onChange={e => setSize(e.target.value)}>
              <option value="">Selecione</option>
              {product.availableSizes.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        )}

        {product.availablePersonalization && (
          <label>
            Personalização
            <input value={personalization} onChange={e => setPersonalization(e.target.value)} placeholder="Nome / Nº" />
          </label>
        )}

        <label>
          Quantidade
          <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
        </label>
      </div>

      <div className="card-footer">
        <div className="price">R${Number(product.price || 0).toFixed(2)}</div>
        <button className="btn-cart-icon" onClick={handleAdd} title="Adicionar ao carrinho">
          🛒
        </button>
      </div>
    </div>
  );
}
