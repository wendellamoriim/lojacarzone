import { brands } from '../data/brands';

export function Brands() {
  return (
    <section className="brands-section" id="brands">
      <div className="container">
        <h2 className="section-title">Marcas que <span className="text-gradient-red">elevam</span> o nível</h2>
        <p className="section-subtitle">
          Trabalhamos com marcas reconhecidas no mercado automotivo, som, iluminação e acessórios premium.
        </p>

        <div className="brands-grid">
          {brands.map((brand, idx) => (
            <div className="brand-card glass-panel" key={idx}>
              <span>{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
