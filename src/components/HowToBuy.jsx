import { MousePointerClick, ShoppingBag, MessageSquare } from 'lucide-react';

export function HowToBuy() {
  return (
    <section className="how-to-buy-section" id="how-to-buy">
      <div className="container">
        <h2 className="section-title">Como Comprar</h2>
        <p className="section-subtitle">
          Processo simples e rápido para garantir o melhor para o seu projeto.
        </p>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-icon">
              <MousePointerClick size={32} />
              <span className="step-number">1</span>
            </div>
            <h3>Escolha</h3>
            <p>Navegue pelo nosso catálogo de produtos premium e selecione seus favoritos.</p>
          </div>
          
          <div className="step-connector"></div>

          <div className="step-card">
            <div className="step-icon">
              <ShoppingBag size={32} />
              <span className="step-number">2</span>
            </div>
            <h3>Adicione</h3>
            <p>Coloque os itens desejados no carrinho para revisar as quantidades.</p>
          </div>

          <div className="step-connector"></div>

          <div className="step-card">
            <div className="step-icon">
              <MessageSquare size={32} />
              <span className="step-number">3</span>
            </div>
            <h3>Finalize</h3>
            <p>Envie o pedido diretamente pelo WhatsApp e fale com um especialista.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
