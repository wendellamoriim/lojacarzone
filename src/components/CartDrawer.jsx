import { X, Minus, Plus, Trash2 } from 'lucide-react';

export function CartDrawer({ isOpen, setIsOpen, cart, updateQuantity, removeFromCart }) {
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const total = cart.reduce((acc, item) => acc + (item.preco * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // ALTERE AQUI O NÚMERO DO WHATSAPP
    const WHATSAPP_NUMBER = "5593999999999";
    
    let text = "Olá! Tenho interesse nesses produtos:\n\n";
    
    cart.forEach((item, index) => {
      text += `${index + 1}. ${item.nome}\n`;
      if (item.marca) text += `Marca: ${item.marca}\n`;
      text += `Quantidade: ${item.quantity}\n`;
      text += `Valor unitário: ${formatPrice(item.preco)}\n`;
      text += `Subtotal: ${formatPrice(item.preco * item.quantity)}\n\n`;
    });
    
    text += `*Total do pedido: ${formatPrice(total)}*\n\n`;
    text += "Pode me passar mais informações?";
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank');
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}></div>
      
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Seu Carrinho</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>Seu carrinho está vazio.</p>
              <button className="btn btn-outline" onClick={() => setIsOpen(false)}>
                Continuar comprando
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                {item.imagem ? (
                  <img src={item.imagem} alt={item.nome} className="cart-item-img" />
                ) : (
                  <div className="cart-item-img placeholder-img-cart">
                    <span>Item</span>
                  </div>
                )}
                <div className="cart-item-info">
                  <h4>{item.nome}</h4>
                  {item.marca && <span className="cart-item-brand">{item.marca}</span>}
                  <div className="cart-item-price">{formatPrice(item.preco)}</div>
                  
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button className="btn btn-primary w-full" onClick={handleCheckout}>
              Finalizar no WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
