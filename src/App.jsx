import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandCarousel } from './components/BrandCarousel';
import { Categories } from './components/Categories';
import { Catalog } from './components/Catalog';
import { HowToBuy } from './components/HowToBuy';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { ProductDetail } from './pages/ProductDetail';
import './App.css';

// ─── Página Pública (Site de Catálogo) ───────────────────────────────────────
function StorePage({
  cart,
  cartItemCount,
  setIsCartOpen,
  addToCart,
  isCartOpen,
  updateQuantity,
  removeFromCart,
  selectedCategory,
  setSelectedCategory,
  selectedCarBrand,
  setSelectedCarBrand
}) {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const elementId = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);

      // Limpa o estado para evitar rolagens automáticas adicionais
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  return (
    <>
      <Header
        cartItemCount={cartItemCount}
        setIsCartOpen={setIsCartOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedCarBrand={selectedCarBrand}
        setSelectedCarBrand={setSelectedCarBrand}
      />
      <main>
        <Hero />
        <BrandCarousel />
        <Categories
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedCarBrand={setSelectedCarBrand}
        />
        <Catalog
          addToCart={addToCart}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedCarBrand={selectedCarBrand}
          setSelectedCarBrand={setSelectedCarBrand}
        />
        <HowToBuy />
      </main>
      <Footer />
      <CartDrawer
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
    </>
  );
}

// ─── App Principal com Roteamento, Carrinho Elevado e Filtros Globais ──────────
function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('carzone_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estados de filtros globais para manter estado entre páginas
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedCarBrand, setSelectedCarBrand] = useState("Todos");

  useEffect(() => {
    localStorage.setItem('carzone_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCart(prevCart =>
      prevCart.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartProps = {
    cart,
    cartItemCount,
    setIsCartOpen,
    addToCart,
    isCartOpen,
    updateQuantity,
    removeFromCart
  };

  const filterProps = {
    selectedCategory,
    setSelectedCategory,
    selectedCarBrand,
    setSelectedCarBrand
  };

  return (
    <Routes>
      {/* Site público */}
      <Route path="/" element={<StorePage {...cartProps} {...filterProps} />} />
      <Route path="/produto/:id" element={<ProductDetail {...cartProps} {...filterProps} />} />

      {/* Área Administrativa */}
      <Route path="/garagemcz/login" element={<AdminLogin />} />
      <Route
        path="/garagemcz/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      {/* Redireciona /garagemcz para o login */}
      <Route path="/garagemcz" element={<Navigate to="/garagemcz/login" replace />} />
      {/* Fallback de rotas públicas */}
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

