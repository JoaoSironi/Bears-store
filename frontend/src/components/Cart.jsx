import React from 'react';
import '../css/Cart.css';

export default function Cart({ items, onUpdateItem, onRemoveItem, total }) {
  return (
    <div className="cart">
      <h2>Carrinho ({items.length})</h2>
      {items.length === 0 ? (
        <p className="cart-empty">Carrinho vazio</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item, idx) => (
              <div key={idx} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  {item.size && <p>Tamanho: {item.size}</p>}
                  {item.personalization && <p>Personalização: {item.personalization}</p>}
                </div>
                <div className="cart-item-qty">
                  <label>
                    Qtd:
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => onUpdateItem(idx, { quantity: Number(e.target.value) })}
                    />
                  </label>
                </div>
                <div className="cart-item-price">
                  <p>R${Number(item.price || 0).toFixed(2)}</p>
                  <p className="subtotal">R${Number(item.subtotal || 0).toFixed(2)}</p>
                </div>
                <button className="cart-item-remove" onClick={() => onRemoveItem(idx)}>✕</button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <strong>Total: R${Number(total || 0).toFixed(2)}</strong>
          </div>
        </>
      )}
    </div>
  );
}
