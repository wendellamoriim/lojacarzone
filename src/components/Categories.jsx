import './Categories.css';
import { Speaker, Lightbulb, Zap, Shield, Layout, Settings } from 'lucide-react';

export function Categories({ selectedCategory, setSelectedCategory, setSelectedCarBrand }) {
  const categories = [
    { title: 'Som', icon: <Speaker size={24} />, target: 'Som Automotivo' },
    { title: 'Iluminação', icon: <Lightbulb size={24} />, target: 'Iluminação' },
    { title: 'Performance', icon: <Zap size={24} />, target: 'Performance' },
    { title: 'Estética', icon: <Layout size={24} />, target: 'Acessórios Externos' },
    { title: 'Segurança', icon: <Shield size={24} />, target: 'Tecnologia' },
    { title: 'Personalização', icon: <Settings size={24} />, target: 'Acessórios Internos' }
  ];

  const handleCategoryClick = (targetCategory) => {
    setSelectedCategory(targetCategory);
    setSelectedCarBrand("Todos"); // Reseta filtro de marcas para focar no tipo selecionado

    // Rola suavemente para o catálogo de produtos
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      const headerOffset = 80;
      const elementPosition = catalogElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="categories-section" id="categories">
      <div className="categories-horizontal-list">
        {categories.map((category, index) => {
          const isActive = selectedCategory === category.target;
          return (
            <div 
              className={`category-item-compact ${isActive ? 'active-cat-card' : ''}`} 
              key={index}
              onClick={() => handleCategoryClick(category.target)}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-icon-small">
                {category.icon}
              </div>
              <span className="category-title-small">{category.title}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
