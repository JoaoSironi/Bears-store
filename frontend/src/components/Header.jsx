import React from 'react';
import CartBadge from './CartBadge';
import '../css/Header.css';

export default function Header({ cartCount, onCartClick }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <img src="/logo.png" alt="Bears Logo" className="logo-img" />
        </div>
        <div className="header-center">
          <div className="logo">BEARS STORE</div>
        </div>
        <div className="header-right">
          <CartBadge count={cartCount} onClick={onCartClick} />
        </div>
      </div>
    </header>
  );
}
