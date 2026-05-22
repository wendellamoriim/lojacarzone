import { Shield, Zap, MessageCircle, RefreshCw } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Shield size={28} />,
      title: "Produtos Selecionados",
      desc: "Apenas as melhores marcas de performance e estética."
    },
    {
      icon: <Zap size={28} />,
      title: "Marcas Reconhecidas",
      desc: "Garantia de qualidade e acabamento premium."
    },
    {
      icon: <MessageCircle size={28} />,
      title: "Compra Rápida",
      desc: "Feche seu pedido em segundos via WhatsApp."
    },
    {
      icon: <RefreshCw size={28} />,
      title: "Catálogo Atualizado",
      desc: "Novidades constantes para o seu projeto automotivo."
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          {features.map((item, index) => (
            <div className="feature-card glass-panel" key={index}>
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
