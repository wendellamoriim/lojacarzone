import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

export function Header({ 
  cartItemCount, 
  setIsCartOpen,
  selectedCategory,
  setSelectedCategory,
  selectedCarBrand,
  setSelectedCarBrand
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;
      
      const startPosition = window.pageYOffset;
      const distance = offsetPosition - startPosition;
      const duration = 1000;
      let start = null;

      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const ease = progress / duration;
        
        // Easing function: easeInOutQuad
        const easing = ease < 0.5 
          ? 2 * ease * ease 
          : 1 - Math.pow(-2 * ease + 2, 2) / 2;

        window.scrollTo(0, startPosition + distance * easing);

        if (progress < duration) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }
    setIsMobileMenuOpen(false);
    setIsMobileDropdownOpen(false);
  };

  const handleNavClick = (id) => {
    if (isHomePage) {
      scrollToSection(id);
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
    setIsMobileMenuOpen(false);
    setIsMobileDropdownOpen(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedCarBrand("Todos"); // Limpa o filtro de marcas para priorizar o tipo de produto
    if (isHomePage) {
      scrollToSection('catalog');
    } else {
      navigate('/', { state: { scrollTo: 'catalog' } });
    }
    setIsMobileMenuOpen(false);
    setIsMobileDropdownOpen(false);
  };

  const handleBrandSelect = (brand) => {
    setSelectedCarBrand(brand);
    setSelectedCategory("Todos"); // Limpa a categoria de produto para priorizar a marca do carro
    if (isHomePage) {
      scrollToSection('catalog');
    } else {
      navigate('/', { state: { scrollTo: 'catalog' } });
    }
    setIsMobileMenuOpen(false);
    setIsMobileDropdownOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled glass-panel' : ''}`}>
      <div className="container header-container">
        <div className="logo" onClick={() => handleNavClick('hero')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="CarZone Logo" className="logo-img" />
        </div>

        <nav className={`nav-links ${isMobileMenuOpen ? 'active glass-panel' : ''}`}>
          <button className="nav-link" onClick={() => handleNavClick('hero')}>Início</button>
          <button className="nav-link" onClick={() => handleNavClick('brands')}>Marcas</button>
          
          {/* Dropdown com Mega Menu de Categorias */}
          <div className="nav-item-dropdown">
            <button 
              className={`nav-link dropdown-toggle ${(selectedCategory !== "Todos" || selectedCarBrand !== "Todos") ? 'active-filter' : ''}`}
              onClick={(e) => {
                if (window.innerWidth <= 768) {
                  e.preventDefault();
                  setIsMobileDropdownOpen(!isMobileDropdownOpen);
                } else {
                  handleNavClick('categories');
                }
              }}
            >
              Categorias <ChevronDown size={14} className={`arrow-icon ${isMobileDropdownOpen ? 'rotate' : ''}`} />
            </button>

            {/* O Mega Menu */}
            <div className={`mega-menu glass-panel ${isMobileDropdownOpen ? 'mobile-active' : ''}`}>
              <div className="mega-menu-grid">
                
                {/* Coluna 1: Categorias de Acessórios */}
                <div className="mega-menu-column">
                  <h4 className="mega-column-title">Por Tipo de Produto</h4>
                  <ul className="mega-links-list">
                    <li>
                      <button onClick={() => handleCategorySelect('Iluminação')} className="mega-link-item">
                        Iluminação
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleCategorySelect('Som Automotivo')} className="mega-link-item">
                        Som Automotivo
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleCategorySelect('Performance')} className="mega-link-item">
                        Performance
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleCategorySelect('Acessórios Internos')} className="mega-link-item">
                        Acessórios Internos
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleCategorySelect('Acessórios Externos')} className="mega-link-item">
                        Acessórios Externos
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleCategorySelect('Tecnologia')} className="mega-link-item">
                        Tecnologia
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Coluna 2: Marcas de Carros */}
                <div className="mega-menu-column">
                  <h4 className="mega-column-title">Compatível com seu Carro</h4>
                  <ul className="mega-links-list">
                    <li>
                      <button onClick={() => handleBrandSelect('Honda')} className="mega-link-item">
                        Honda
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleBrandSelect('Toyota')} className="mega-link-item">
                        Toyota
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleBrandSelect('Volkswagen')} className="mega-link-item">
                        Volkswagen
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleBrandSelect('Chevrolet')} className="mega-link-item">
                        Chevrolet
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleBrandSelect('Ford')} className="mega-link-item">
                        Ford
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleBrandSelect('BMW')} className="mega-link-item">
                        BMW & Mercedes-Benz
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Coluna 3: Destaque Premium */}
                <div className="mega-menu-column promo-column">
                  <div className="promo-banner-card">
                    <span className="promo-badge">EXCLUSIVO</span>
                    <h5 className="promo-title">Upgrade de Elite</h5>
                    <p className="promo-desc">
                      Eleve o nível do seu veículo com nossa linha exclusiva de acessórios de alta performance.
                    </p>
                    <button 
                      onClick={() => {
                        setSelectedCategory("Todos");
                        setSelectedCarBrand("Todos");
                        scrollToSection('catalog');
                      }} 
                      className="promo-action-btn"
                    >
                      Ver Tudo →
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <button className="nav-link" onClick={() => scrollToSection('catalog')}>Produtos</button>
          <button className="nav-link" onClick={() => scrollToSection('how-to-buy')}>Como Comprar</button>
        </nav>

        <div className="header-actions">
          <button 
            className="cart-btn" 
            onClick={() => setIsCartOpen(true)}
            aria-label="Abrir carrinho"
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </button>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
