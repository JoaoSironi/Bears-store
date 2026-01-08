import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import ProductService from './services/ProductService';
import OrderService from './services/OrderService';
import ValidationService from './services/ValidationService';

export default function App(){
  const [items, setItems] = useState([]);
  const [productsBase, setProductsBase] = useState([]); // lista bruta do servidor
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setFetchError('');
      try {
        const products = await ProductService.getProducts();
        setProductsBase(products);
        setItems(products.map(p => ({ ...p, size: '', personalization: '', quantity: 0, subtotal: 0 })));
      } catch (e) {
        setFetchError(e.message || 'Falha ao carregar produtos');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateItem = (idx, changes) => {
    setItems(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...changes };
      copy[idx].subtotal = (copy[idx].quantity || 0) * (copy[idx].price || 0);
      return copy;
    });
  };

  const total = useMemo(() => items.reduce((s,i)=> s + (i.subtotal||0), 0), [items]);

  const sendOrder = async () => {
    const selected = items.filter(i => i.quantity > 0).map(i => ({
      name: i.name, size: i.size, personalization: i.personalization, quantity: i.quantity, price: i.price, subtotal: i.subtotal
    }));
    if (selected.length === 0) {
      alert('Selecione ao menos um produto.');
      return;
    }
    const body = { products: selected, total, customerName, contactNumber };
    const validation = ValidationService.validateOrder(body);
    if (!validation.valid) {
      alert('Validação: ' + validation.errors.join('; '));
      return;
    }
    try {
      console.log('Enviando pedido', body);
      await OrderService.createOrder(body);
      alert('Pedido enviado com sucesso!');
      setItems(productsBase.map(p => ({ ...p, size: '', personalization: '', quantity: 0, subtotal: 0 })));
      setCustomerName(''); setContactNumber('');
    } catch (e) {
      alert('Erro ao enviar pedido: ' + (e.message || 'Erro de rede'));
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="logo">LOJINHA DO BEARS</div>
      </header>

      <main className="grid">
        {loading && <div>Carregando produtos...</div>}
        {!loading && fetchError && <div>{fetchError}</div>}
        {!loading && !fetchError && items.length === 0 && <div>Nenhum produto disponível.</div>}
        {!loading && !fetchError && items.map((p, idx) => (
          <ProductCard key={p.id} product={p} onChange={(changes)=> updateItem(idx, changes)} />
        ))}
      </main>

      <Footer total={total} customerName={customerName} contactNumber={contactNumber}
        onCustomerChange={(v)=>setCustomerName(v)} onContactChange={(v)=>setContactNumber(v)} onSend={sendOrder} />
    </div>
  );
}
