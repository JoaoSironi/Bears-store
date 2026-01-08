import React from 'react';
import './ProductCard.css';

export default function ProductCard({ product, onChange }) {
  const fallbackSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="16">Sem imagem</text></svg>'
  );

  console.log(product);

  return (
    <div className="card">
      { (product.imagePath) ? (
        <img
          className="card-image"
          src={product.imagePath}
          alt={product.name}
          // onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackSvg; }}
        />
      ) : (
        <div className="image-placeholder">Sem imagem</div>
      )}

      <h3 className="card-title">{product.name}</h3>

      <div className="controls">
        <label>
          Tamanho
          <select value={product.size || 'Único'} onChange={e=>onChange({ size: e.target.value })}>
            <option value="">Selecione</option>
            {product.availableSizes && product.availableSizes.length > 0 ? (
              product.availableSizes.map(s => (
                <option key={s} value={s}>{s}</option>
              ))
            ) : null}
          </select>
        </label>

        <label>
          Quantidade
          <input type="number" min="0" value={product.quantity || 0} onChange={e=>onChange({ quantity: Number(e.target.value) })} />
        </label>

        {product.availablePersonalization !== false && (
          <label>
            Personalização
            <input value={product.personalization || ''} onChange={e=>onChange({ personalization: e.target.value })} placeholder="Nome / Nº" />
          </label>
        )}
      </div>

      <div className="card-footer">
        <div className="price">R${Number(product.price || 0).toFixed(2)}</div>
        <div className="subtotal">Subtotal: R${Number(product.subtotal || 0).toFixed(2)}</div>
      </div>
    </div>
  );
}
