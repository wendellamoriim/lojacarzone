import { Mail, Globe, MessageCircle } from 'lucide-react';
import { brands } from '../data/brands';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <div className="logo" onClick={scrollToTop}>
              <img src="/logo.png" alt="CarZone Logo" className="logo-img" />
            </div>
            <p className="footer-desc">
              O catálogo digital definitivo para quem busca alta performance, tecnologia e estética automotiva premium.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" title="Website"><Globe size={20} /></a>
              <a href="#" className="social-link" title="WhatsApp"><MessageCircle size={20} /></a>
              <a href="#" className="social-link" title="Email"><Mail size={20} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navegação</h4>
            <ul>
              <li><a href="#hero">Início</a></li>
              <li><a href="#brands">Marcas</a></li>
              <li><a href="#catalog">Catálogo</a></li>
              <li><a href="#how-to-buy">Como Comprar</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Parceiros</h4>
            <ul>
              {brands.slice(0, 4).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="footer-col cta-col">
            <h4>Pronto para montar o seu carro?</h4>
            <p>Fale conosco e tire suas dúvidas direto com a equipe comercial.</p>
            <button className="btn btn-outline" onClick={() => window.open('https://wa.me/5593999999999', '_blank')}>
              Chamar no WhatsApp
            </button>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CarZone. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
