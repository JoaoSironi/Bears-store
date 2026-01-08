import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';

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
        const res = await fetch('http://localhost:4000/api/products');
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data = await res.json();
        // normaliza resposta: aceita [{...}] ou { products: [...] }
        const products = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : []);
        setProductsBase(products);
        setItems(products.map(p => ({
          ...p,
          availableSizes: Array.isArray(p.availableSizes) ? p.availableSizes : [],
          // treat undefined as allowed (true) unless explicitly false
          availablePersonalization: p.availablePersonalization === false ? false : true,
          size: '',
          personalization: '',
          quantity: 0,
          subtotal: 0
        })));
      } catch (e) {
        setFetchError('Falha ao carregar produtos');
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
    try {
      const res = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert('Pedido enviado com sucesso!');
        // reset com base nos produtos carregados do servidor
        setItems(productsBase.map(p => ({
          ...p,
          availableSizes: Array.isArray(p.availableSizes) ? p.availableSizes : [],
          availablePersonalization: p.availablePersonalization === false ? false : true,
          size: '',
          personalization: '',
          quantity: 0,
          subtotal: 0
        })));
        setCustomerName(''); setContactNumber('');
      } else {
        const err = await res.json();
        alert('Erro: ' + (err.error || res.statusText));
      }
    } catch (e) {
      alert('Erro ao conectar com servidor');
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
