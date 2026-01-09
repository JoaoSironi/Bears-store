import React, { useState } from 'react';
import '../css/CartModal.css';

function formatPhone(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 9)}${digits.slice(9, 11)}`.trim();
}

export default function CartModal({ isOpen, items, onClose, onUpdateItem, onRemoveItem, total, customerName, contactNumber, onCustomerChange, onContactChange, onSendOrder }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSendOrder = async () => {
    setSubmitting(true);
    try {
      await onSendOrder();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Carrinho</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
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
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => onUpdateItem(idx, { quantity: Number(e.target.value) })}
                      />
                    </div>
                    <div className="cart-item-price">
                      <p>R${Number(item.subtotal || 0).toFixed(2)}</p>
                    </div>
                    <button className="cart-item-remove" onClick={() => onRemoveItem(idx)}>✕</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="modal-footer">
            <div className="footer-section">
              <div className="footer-total">
                <strong>Total: R${Number(total || 0).toFixed(2)}</strong>
              </div>

              <form className="checkout-form">
                <label>
                  Nome do Cliente
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => onCustomerChange(e.target.value)}
                    placeholder="Seu nome"
                    disabled={submitting}
                  />
                </label>

                <label>
                  Contato
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={e => onContactChange(formatPhone(e.target.value))}
                    placeholder="(xx) x xxxxxxxx"
                    maxLength="15"
                    disabled={submitting}
                  />
                </label>

                <button
                  type="button"
                  className="btn-send-order"
                  onClick={handleSendOrder}
                  disabled={submitting}
                >
                  {submitting ? 'Enviando...' : 'Enviar Pedido'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
