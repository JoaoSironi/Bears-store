import React from 'react';

export default function Footer({ total, customerName, contactNumber, onCustomerChange, onContactChange, onSend }) {
  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="total-label">VALOR TOTAL:</div>
        <div className="total-value">R${total.toFixed(2)}</div>
      </div>

      <div className="footer-center">
        <input placeholder="Responsável pelo Pedido" value={customerName} onChange={e=>onCustomerChange(e.target.value)} />
        <input placeholder="Número para contato" value={contactNumber} onChange={e=>onContactChange(e.target.value)} />
      </div>

      <div className="footer-right">
        <button className="send-btn" onClick={onSend}>Enviar pedido</button>
      </div>
    </footer>
  );
}
