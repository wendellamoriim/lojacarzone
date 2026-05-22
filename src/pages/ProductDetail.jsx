import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { ShoppingCart, ArrowLeft, RefreshCw, Layers, Globe } from 'lucide-react';
import './ProductDetail.css';

export function ProductDetail({
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data, error: fetchErr } = await supabase
        .from('products')
        .select(`
          id, name, short_description, full_description,
          regular_price, active, is_global_fit, created_at,
          categories ( name ),
          brands ( name ),
          product_images ( image_url, is_primary ),
          product_promotions ( promotional_price, active_override ),
          product_inventory ( quantity ),
          product_compatibility ( car_brand )
        `)
        .eq('id', id)
        .maybeSingle();

      if (fetchErr || !data) {
        setError(true);
      } else {
        // Normaliza as propriedades
        const img = data.product_images?.find(i => i.is_primary) || data.product_images?.[0];
        const promo = data.product_promotions?.active_override ? data.product_promotions : null;
        const inv = data.product_inventory;
        const compat = data.is_global_fit
          ? ['Global']
          : (data.product_compatibility || []).map(c => c.car_brand);

        setProduct({
          ...data,
          imagem: img?.image_url || 'https://placehold.co/600x500/1a1a2e/ff3333?text=CarZone',
          preco: parseFloat(promo?.promotional_price || data.regular_price),
          oldPrice: promo ? parseFloat(data.regular_price) : null,
          quantity: inv?.quantity ?? 0,
          carrosCompats: compat,
        });
      }
    } catch (err) {
      console.error(err);
      setError(true);
    }
    setLoading(false);
  };

  const headerProps = {
    cartItemCount,
    setIsCartOpen,
    selectedCategory,
    setSelectedCategory,
    selectedCarBrand,
    setSelectedCarBrand
  };

  if (loading) {
    return (
      <>
        <Header {...headerProps} />
        <div className="detail-loading-state">
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#ff3333', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          <p>Buscando detalhes do acessório...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header {...headerProps} />
        <div className="detail-loading-state">
          <p>O produto solicitado não foi encontrado ou está temporariamente indisponível.</p>
          <button className="btn-back-catalog" onClick={() => navigate('/', { state: { scrollTo: 'catalog' } })}>
            <ArrowLeft size={16} /> Voltar ao Catálogo
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header {...headerProps} />

      <div className="product-detail-layout">
        <div className="product-detail-container">
          {/* Botão Voltar */}
          <button className="btn-back-catalog" onClick={() => navigate('/', { state: { scrollTo: 'catalog' } })}>
            <ArrowLeft size={16} /> Voltar ao Catálogo
          </button>

          {/* Seção Principal */}
          <div className="detail-grid">
            {/* Foto do Produto */}
            <div className="detail-image-sec">
              <img src={product.imagem} alt={product.name} className="detail-main-img" />
            </div>

            {/* Ficha Rápida e Botão de Ação */}
            <div className="detail-info-sec">
              <div className="detail-badges-row">
                {product.categories?.name && (
                  <span
                    className="badge-detail category"
                    onClick={() => {
                      setSelectedCategory(product.categories.name);
                      setSelectedCarBrand("Todos");
                      navigate('/', { state: { scrollTo: 'catalog' } });
                    }}
                    style={{ cursor: 'pointer' }}
                    title={`Filtrar por ${product.categories.name}`}
                  >
                    {product.categories.name}
                  </span>
                )}
                {product.brands?.name && (
                  <span className="badge-detail brand">{product.brands.name}</span>
                )}
              </div>

              <h1 className="detail-title">{product.name}</h1>

              <div className="detail-stock-status">
                {product.quantity > 0 ? (
                  <span className="em-estoque">✔ {product.quantity} unidades disponíveis em estoque</span>
                ) : (
                  <span className="esgotado">✖ Produto temporariamente Esgotado</span>
                )}
              </div>

              <div className="detail-price-box">
                <span className="detail-current-price">
                  R$ {product.preco.toFixed(2).replace('.', ',')}
                </span>
                {product.oldPrice && (
                  <span className="detail-old-price">
                    R$ {product.oldPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>

              {product.short_description && (
                <p className="detail-short-desc">{product.short_description}</p>
              )}

              <button
                className="btn-detail-add"
                disabled={product.quantity <= 0}
                onClick={() => {
                  addToCart({
                    ...product,
                    nome: product.name,
                    preco: product.preco,
                    imagem: product.imagem,
                  });
                  setIsCartOpen(true);
                }}
              >
                <ShoppingCart size={18} />
                {product.quantity > 0 ? 'ADICIONAR AO CARRINHO' : 'ESGOTADO'}
              </button>
            </div>
          </div>

          {/* Especificações Completas */}
          <div className="detail-rich-sections">
            {/* Descrição Longa */}
            <div>
              <h3 className="rich-section-title">Descrição do Produto</h3>
              <p className="rich-text">
                {product.full_description || 'Nenhuma descrição detalhada informada.'}
              </p>
            </div>

            {/* Compatibilidade de Carros */}
            <div>
              <h3 className="rich-section-title">Veículos Compatíveis</h3>
              <div className="compat-grid-detail">
                {product.is_global_fit ? (
                  <span className="compat-chip-detail global" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Globe size={14} style={{ marginRight: '6px' }} />
                    Compatibilidade Universal (Multimarcas)
                  </span>
                ) : product.carrosCompats.length > 0 ? (
                  product.carrosCompats.map(brand => (
                    <span
                      key={brand}
                      className="compat-chip-detail"
                      onClick={() => {
                        setSelectedCarBrand(brand);
                        setSelectedCategory("Todos");
                        navigate('/', { state: { scrollTo: 'catalog' } });
                      }}
                      style={{ cursor: 'pointer' }}
                      title={`Ver todos compatíveis com ${brand}`}
                    >
                      🚗 {brand}
                    </span>
                  ))
                ) : (
                  <span className="compat-chip-detail">Universal</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
