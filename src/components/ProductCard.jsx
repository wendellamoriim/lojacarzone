import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';

export function ProductCard({ product, addToCart }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="product-card glass-panel">
      <div className="product-image-container">
        <img src={product.imagem} alt={product.nome} className="product-image" loading="lazy" />
        <div className="product-badges">
          <span className="badge badge-brand">{product.marca}</span>
        </div>
      </div>
      
      <div className="product-info">
        <span className="product-category">{product.categoria}</span>
        <h3 className="product-title">{product.nome}</h3>
        <p className="product-desc">{product.descricao}</p>
        
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.preco)}</span>
          
          <button 
            className={`btn-add-cart ${isAdded ? 'added' : ''}`} 
            onClick={handleAddToCart}
            aria-label="Adicionar ao carrinho"
          >
            {isAdded ? <Check size={20} /> : <ShoppingCart size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
