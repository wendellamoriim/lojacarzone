import { ChevronRight } from 'lucide-react';
import './Hero.css';

export function Hero() {
  const scrollToCatalog = () => {
    const element = document.getElementById('catalog');
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
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-background">
      </div>
      
      <div className="container hero-content animate-fade-in">
        <button className="btn btn-primary btn-hero-animated" onClick={scrollToCatalog}>
        </button>
      </div>
    </section>
  );
}
