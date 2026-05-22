import { ChevronRight } from 'lucide-react';

export function FinalCTA() {
  const scrollToCatalog = () => {
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="final-cta-section">
      <div className="container final-cta-container glass-panel">
        <div className="cta-content">
          <h2 className="section-title">Pronto para elevar o visual do seu carro?</h2>
          <p className="section-subtitle">
            Escolha seus acessórios favoritos e fale com nossa equipe direto pelo WhatsApp.
          </p>
          <button className="btn btn-primary" onClick={scrollToCatalog}>
            Montar meu pedido <ChevronRight size={20} />
          </button>
        </div>
        <div className="cta-glow"></div>
      </div>
    </section>
  );
}
