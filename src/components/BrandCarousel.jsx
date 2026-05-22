import './BrandCarousel.css';

export function BrandCarousel() {
  const logos = [
    { src: '/rcigo.png', alt: 'RCI Go' },
    { src: '/luxled.png', alt: 'LuxLed' },
    { src: '/jbl.png', alt: 'JBL', scale: 1.5 },
    { src: '/J2.png', alt: 'J2', scale: 1.5, width: '120px' },
    { src: '/funkyz.png', alt: 'Funkyz' },
    { src: '/CARMENS.png', alt: 'Carmens', scale: 2.0 },
  ];

  // Triplicamos a lista para garantir um looping infinito perfeito sem saltos
  const carouselLogos = [...logos, ...logos, ...logos];

  return (
    <div className="brand-carousel-container" id="brands">
      <div className="brand-carousel-track">
        {carouselLogos.map((logo, index) => (
          <div 
            className="brand-logo-item" 
            key={index} 
            style={logo.width ? { width: logo.width } : {}}
          >
            <img 
              src={logo.src} 
              alt={logo.alt} 
              className="carousel-logo" 
              style={logo.scale ? { transform: `scale(${logo.scale})` } : {}}
              loading="eager"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
