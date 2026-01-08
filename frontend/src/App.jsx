import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import CartModal from './components/CartModal';
import Footer from './components/Footer';
import ProductService from './services/ProductService';
import OrderService from './services/OrderService';
import ValidationService from './services/ValidationService';

export default function App(){
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setFetchError('');
      try {
        const productList = await ProductService.getProducts();
        setProducts(productList);
      } catch (e) {
        setFetchError(e.message || 'Falha ao carregar produtos');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addToCart = (product, size, personalization, quantity) => {
    // buscar item existente com mesma config
    const existing = cartItems.findIndex(
      item => item.id === product.id && item.size === size && item.personalization === personalization
    );
    if (existing >= 0) {
      // atualizar quantidade
      updateCartItem(existing, { quantity: cartItems[existing].quantity + quantity });
    } else {
      // adicionar novo
      setCartItems(prev => [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        size,
        personalization,
        quantity,
        subtotal: quantity * product.price,
        availableSizes: product.availableSizes,
        availablePersonalization: product.availablePersonalization
      }]);
    }
  };

  const updateCartItem = (idx, changes) => {
    setCartItems(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...changes };
      copy[idx].subtotal = (copy[idx].quantity || 0) * (copy[idx].price || 0);
      return copy;
    });
  };

  const removeCartItem = (idx) => {
    setCartItems(prev => prev.filter((_, i) => i !== idx));
  };

  const total = useMemo(() => cartItems.reduce((s, i) => s + (i.subtotal || 0), 0), [cartItems]);

  const sendOrder = async () => {
    const selected = cartItems.map(i => ({
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
      setCartItems([]);
      setCustomerName(''); setContactNumber('');
    } catch (e) {
      alert('Erro ao enviar pedido: ' + (e.message || 'Erro de rede'));
    }
  };

  return (
    <div className="page">
      <Header cartCount={cartItems.length} onCartClick={() => setIsCartModalOpen(true)} />

      <CartModal
        isOpen={isCartModalOpen}
        items={cartItems}
        onClose={() => setIsCartModalOpen(false)}
        onUpdateItem={updateCartItem}
        onRemoveItem={removeCartItem}
        total={total}
        customerName={customerName}
        contactNumber={contactNumber}
        onCustomerChange={setCustomerName}
        onContactChange={setContactNumber}
        onSendOrder={sendOrder}
      />

      <main className="grid" style={{ marginTop: 73 }}>
        {loading && <div>Carregando produtos...</div>}
        {!loading && fetchError && <div>{fetchError}</div>}
        {!loading && !fetchError && products.length === 0 && <div>Nenhum produto disponível.</div>}
        {!loading && !fetchError && products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
        ))}
      </main>

      {/* <Cart items={cartItems} onUpdateItem={updateCartItem} onRemoveItem={removeCartItem} total={total} /> */}
    </div>
  );
}
