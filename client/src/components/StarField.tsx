import { useEffect } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDuration: number;
  isGold: boolean;
}

export default function StarField() {
  useEffect(() => {
    const createStarField = () => {
      const starField = document.querySelector('.star-field') as HTMLElement;
      if (!starField) return;
      
      // Clear any existing stars
      starField.innerHTML = '';
      
      const starCount = 150;
      const stars: Star[] = [];
      
      // Generate random stars
      for (let i = 0; i < starCount; i++) {
        const size = Math.random() * 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const opacity = Math.random() * 0.8 + 0.2;
        const animationDuration = Math.random() * 5 + 3;
        const isGold = i % 20 === 0; // Make every 20th star gold
        
        stars.push({
          x,
          y,
          size,
          opacity,
          animationDuration,
          isGold
        });
      }
      
      // Create stars in the DOM
      stars.forEach(star => {
        const starElement = document.createElement('div');
        
        starElement.style.position = 'absolute';
        starElement.style.width = `${star.size}px`;
        starElement.style.height = `${star.size}px`;
        starElement.style.backgroundColor = star.isGold ? '#FFD700' : '#FFFFFF';
        starElement.style.borderRadius = '50%';
        starElement.style.left = `${star.x}%`;
        starElement.style.top = `${star.y}%`;
        starElement.style.opacity = `${star.opacity}`;
        starElement.style.animation = `twinkle ${star.animationDuration}s infinite alternate`;
        
        starField.appendChild(starElement);
      });
    };
    
    // Create stars
    createStarField();
    
    // Recreate on window resize (debounced)
    let timeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(createStarField, 200);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);
  
  return <div className="star-field" aria-hidden="true"></div>;
}
