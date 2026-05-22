import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, RefreshCw, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Catalog.css';

export function Catalog({
  addToCart,
  selectedCategory,
  setSelectedCategory,
  selectedCarBrand,
  setSelectedCarBrand,
}) {
  const navigate = useNavigate();
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Busca produtos do Supabase ───────────────────────────────────────────
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, short_description, regular_price, active, is_global_fit, category_id,
        categories ( name ),
        product_images ( image_url, is_primary ),
        product_promotions ( promotional_price, active_override ),
        product_inventory ( quantity, low_stock_threshold ),
        product_compatibility ( car_brand )
      `)
      .eq('active', true)
      .order('id', { ascending: true });

    if (!error) setProducts(data || []);
    setLoading(false);
  };

  // ── Escuta mudanças em tempo real via Supabase Realtime ──────────────────
  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('catalog-public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const toggleFavorite = (id) =>
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const clearFilters = () => {
    setSelectedCategory('Todos');
    setSelectedCarBrand('Todos');
    setSearchQuery('');
  };

  // ── Filtragem ────────────────────────────────────────────────────────────
  const filteredProducts = products.filter(p => {
    const catName    = p.categories?.name;
    const catMatch   = selectedCategory === 'Todos' || catName === selectedCategory;
    const brands     = (p.product_compatibility || []).map(c => c.car_brand);
    const brandMatch = selectedCarBrand === 'Todos' || p.is_global_fit ||
      brands.some(b => b.toLowerCase() === selectedCarBrand.toLowerCase());

    const searchStr = `${p.name} ${p.short_description || ''} ${catName || ''}`.toLowerCase();
    const searchMatch = !searchQuery || searchStr.includes(searchQuery.toLowerCase().trim());

    return catMatch && brandMatch && searchMatch;
  });

  // ── Normaliza para renderização ──────────────────────────────────────────
  const normalize = (p) => {
    const img    = p.product_images?.find(i => i.is_primary) || p.product_images?.[0];
    const promo  = p.product_promotions?.active_override ? p.product_promotions : null;
    const inv    = p.product_inventory;
    const compat = p.is_global_fit
      ? ['Global']
      : (p.product_compatibility || []).map(c => c.car_brand);
    return {
      ...p,
      imagem:       img?.image_url || 'https://placehold.co/400x300/1a1a2e/ff3333?text=CarZone',
      preco:        parseFloat(promo?.promotional_price || p.regular_price),
      oldPrice:     promo ? parseFloat(p.regular_price) : null,
      quantity:     inv?.quantity ?? 0,
      carrosCompats: compat,
    };
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="catalog-section" id="catalog">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '80px 20px', color: 'rgba(255,255,255,0.35)' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#ff3333', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            <p>Carregando catálogo...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="catalog-section" id="catalog">
      <div className="container">
        <div className="section-header-centered">
          <h2 className="section-title">NOSSO <span className="text-gradient-red">CATÁLOGO</span></h2>
          <p className="section-subtitle">
            Equipe seu veículo com o que há de melhor no mercado de acessórios e performance automotiva.
          </p>
        </div>

        {/* Barra de Pesquisa Premium */}
        <div className="catalog-search-wrapper">
          <div className="catalog-search-bar">
            <Search className="search-icon-nav" size={18} />
            <input
              type="text"
              placeholder="O que você está procurando para seu carro? (Ex: LED, Som, JBL...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog-search-input"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')} title="Limpar busca">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="catalog-filter-bar">
          <div className="filter-summary">
            Mostrando <strong>{filteredProducts.length}</strong>{' '}
            {filteredProducts.length === 1 ? 'produto' : 'produtos'}
          </div>
          {(selectedCategory !== 'Todos' || selectedCarBrand !== 'Todos' || searchQuery) && (
            <div className="active-filters-container animate-fade-in">
              {selectedCategory !== 'Todos' && (
                <div className="filter-badge-chip">
                  <span>Categoria: {selectedCategory}</span>
                  <button className="remove-chip-btn" onClick={() => setSelectedCategory('Todos')}>×</button>
                </div>
              )}
              {selectedCarBrand !== 'Todos' && (
                <div className="filter-badge-chip">
                  <span>Veículo: {selectedCarBrand}</span>
                  <button className="remove-chip-btn" onClick={() => setSelectedCarBrand('Todos')}>×</button>
                </div>
              )}
              {searchQuery && (
                <div className="filter-badge-chip">
                  <span>Busca: "{searchQuery}"</span>
                  <button className="remove-chip-btn" onClick={() => setSearchQuery('')}>×</button>
                </div>
              )}
              <button className="btn-clear-filters" onClick={clearFilters}>
                <RefreshCw size={12} /> Limpar Filtros
              </button>
            </div>
          )}
        </div>

        {/* Grade de Produtos */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid-ref">
            {filteredProducts.map(raw => {
              const p   = normalize(raw);
              const isFav = favorites.includes(p.id);
              return (
                <div className="product-card-ref animate-fade-in" key={p.id}>
                  {/* Imagem */}
                  <div className="product-image-container-ref">
                    <div className="image-box-border">
                      <img src={p.imagem} alt={p.name} className="main-product-img clickable-detail" onClick={() => navigate(`/produto/${p.id}`)} loading="lazy" />
                      {p.categories?.name && <span className="product-cat-tag">{p.categories.name}</span>}
                      {p.oldPrice && <span className="promo-badge-card">PROMO</span>}
                      <div className="image-footer-actions">
                        <button className="btn-add-ref" onClick={() => addToCart({ ...p, nome: p.name, preco: p.preco, imagem: p.imagem })}>
                          <ShoppingCart size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                          ADICIONAR
                        </button>
                        <button className={`btn-wish-ref ${isFav ? 'active-fav' : ''}`} onClick={() => toggleFavorite(p.id)}>
                          <Heart size={16} fill={isFav ? '#FF1E1E' : 'none'} stroke={isFav ? '#FF1E1E' : '#fff'} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="product-title-ref clickable-detail" onClick={() => navigate(`/produto/${p.id}`)}>{p.name}</h3>
                  <div className="product-compat-cars">
                    <span>
                      {p.is_global_fit
                        ? 'Compatível com todos os veículos'
                        : `Compatível com: ${p.carrosCompats.slice(0, 3).join(', ')}${p.carrosCompats.length > 3 ? '...' : ''}`}
                    </span>
                  </div>

                  {/* Preços */}
                  <div className="product-pricing-ref">
                    <span className="current-price-ref">
                      R$ {p.preco.toFixed(2).replace('.', ',')}
                    </span>
                    {p.oldPrice && (
                      <span className="old-price-ref">
                        R$ {p.oldPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>

                  {/* Estoque */}
                  <div className="product-stock-ref">
                    <div className="stock-labels">
                      <span style={{ color: p.quantity <= 0 ? '#ef4444' : 'inherit' }}>
                        {p.quantity > 0 ? `${p.quantity} em estoque` : 'Esgotado'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="catalog-empty-state glass-panel animate-fade-in">
            <h3>Nenhum Acessório Encontrado</h3>
            <p>
              Não encontramos produtos para os termos e filtros selecionados (
              <strong>
                {selectedCategory !== 'Todos' ? `Categoria: ${selectedCategory}` : ''}
                {selectedCarBrand !== 'Todos' ? `${selectedCategory !== 'Todos' ? ' | ' : ''}Veículo: ${selectedCarBrand}` : ''}
                {searchQuery ? `${(selectedCategory !== 'Todos' || selectedCarBrand !== 'Todos') ? ' | ' : ''}Busca: "${searchQuery}"` : ''}
              </strong>
              ).
            </p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Limpar Filtros e Busca
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
