import React from 'react';
import './CartBadge.css';

export default function CartBadge({ count, onClick }) {
  return (
    <button className="cart-badge" onClick={onClick}>
      <span className="cart-icon">🛒</span>
      {count > 0 && <span className="badge-count">{count}</span>}
    </button>
  );
}
