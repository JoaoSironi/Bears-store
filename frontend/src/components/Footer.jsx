import React from 'react';

function formatPhone(value) {
  // remove caracteres não numéricos
  const digits = value.replace(/\D/g, '');
  // limita a 11 dígitos (xx + x + xxxxxxxx)
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 9)}${digits.slice(9, 11)}`.trim();
}

export default function Footer({ total, customerName, contactNumber, onCustomerChange, onContactChange, onSend }) {
  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="total-label">VALOR TOTAL:</div>
        <div className="total-value">R${total.toFixed(2)}</div>
      </div>

      <div className="footer-center">
        <input placeholder="Responsável pelo Pedido" value={customerName} onChange={e=>onCustomerChange(e.target.value)} />
        <input
          placeholder="Número para contato"
          value={contactNumber}
          onChange={e => onContactChange(formatPhone(e.target.value))}
          maxLength={15}
        />
      </div>

      <div className="footer-right">
        <button className="send-btn" onClick={onSend}>Enviar pedido</button>
      </div>
    </footer>
  );
}
