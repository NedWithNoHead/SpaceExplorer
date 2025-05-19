import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AsteroidOrbit, NearEarthObject } from '@/types/nasa';
import { calculateAvgDiameter } from '@/lib/utils';

interface AsteroidVisualizerProps {
  asteroids: NearEarthObject[];
  onSelectAsteroid: (asteroid: NearEarthObject) => void;
}

export default function AsteroidVisualizer({ asteroids, onSelectAsteroid }: AsteroidVisualizerProps) {
  const [selectedAsteroidId, setSelectedAsteroidId] = useState<number | null>(null);
  const [hoveredAsteroid, setHoveredAsteroid] = useState<NearEarthObject | null>(null);
  const visibleAsteroids = asteroids.slice(0, 5);
  
  // Handle asteroid selection
  const handleAsteroidClick = (asteroid: NearEarthObject) => {
    setSelectedAsteroidId(asteroid.id);
    onSelectAsteroid(asteroid);
  };

  // Use useEffect to randomly assign unique animation delays to each asteroid
  const [asteroidAnimations, setAsteroidAnimations] = useState<{[key: number]: number}>({});
  
  useEffect(() => {
    const animations: {[key: number]: number} = {};
    
    visibleAsteroids.forEach((asteroid) => {
      animations[asteroid.id] = Math.random() * 10; // Random delay between 0 and 10 seconds
    });
    
    setAsteroidAnimations(animations);
  }, [visibleAsteroids]);

  return (
    <Card className="lg:col-span-7 bg-gray bg-opacity-30 rounded-xl p-6 border border-gray-800 h-96 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-space-black opacity-60"></div>

      {/* The solar system */}
      <div className="relative w-full h-full">
        {/* Central Earth */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-blue-500 z-30 shadow-[0_0_20px_5px_rgba(59,130,246,0.3)]" 
             style={{ background: 'radial-gradient(circle, #1e88e5, #0d47a1)' }}>
          {/* Earth's continents representation */}
          <div className="absolute inset-0 opacity-40 rounded-full" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23ffffff' d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 4.5a.5.5 0 11-1 0 .5.5 0 011 0zm-6 2a.5.5 0 11-1 0 .5.5 0 011 0zm2 .5a1 1 0 11-2 0 1 1 0 012 0zm8-1a1 1 0 11-2 0 1 1 0 012 0z'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
            animation: 'spin 40s linear infinite'
          }}></div>
          
          {/* Earth label */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium bg-blue-900 px-2 py-0.5 rounded-full z-30">
            Earth
          </div>
        </div>
        
        {/* Moon orbit */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] rounded-full border border-gray-500 border-dashed opacity-30"></div>
        
        {/* Moon */}
        <div className="absolute w-6 h-6 bg-gray-300 rounded-full z-20"
             style={{
               top: 'calc(50% - 3px)',
               left: 'calc(50% - 3px)',
               animation: 'moon-orbit 10s linear infinite',
               boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
             }}>
          <div className="absolute w-full h-full rounded-full opacity-50" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 40%)',
                 animation: 'spin 10s linear infinite'
               }}></div>
        </div>
        
        {/* Asteroid orbits */}
        {visibleAsteroids.map((asteroid, index) => {
          // Calculate orbit size based on index
          const orbitSize = 220 + (index * 60);
          
          return (
            <div 
              key={`orbit-${asteroid.id}`}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed opacity-20"
              style={{ 
                width: `${orbitSize}px`, 
                height: `${orbitSize * 0.8}px`,
                borderColor: asteroid.isPotentiallyHazardous ? '#ef4444' : '#64748b',
                transform: `translate(-50%, -50%) rotate(${index * 20}deg)`
              }}
            ></div>
          );
        })}
        
        {/* Asteroids */}
        {visibleAsteroids.map((asteroid, index) => {
          // Determine asteroid size based on diameter
          const diameter = asteroid.diameterMaxKm;
          const baseSize = 16;
          const size = baseSize + Math.min(Math.round(diameter / 30), 36);
          
          // Determine color and glow based on hazard potential
          let color = '#10b981'; // Green for safe
          let glow = 'rgba(16, 185, 129, 0.5)';
          let status = 'Safe';
          
          if (asteroid.isPotentiallyHazardous) {
            color = '#ef4444'; // Red for hazardous
            glow = 'rgba(239, 68, 68, 0.6)';
            status = 'Hazardous';
          } else if (diameter > 500) {
            color = '#f59e0b'; // Amber for large
            glow = 'rgba(245, 158, 11, 0.5)';
            status = 'Large';
          }
          
          // Animation parameters
          const delay = asteroidAnimations[asteroid.id] || 0;
          const duration = 15 + (index * 4); // Varied orbit speeds
          const isSelected = selectedAsteroidId === asteroid.id;
          const isHovered = hoveredAsteroid?.id === asteroid.id;
          
          return (
            <div 
              key={`asteroid-${asteroid.id}`}
              className={`absolute rounded-full cursor-pointer transition-all duration-300 asteroid-${index + 1}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                boxShadow: isSelected ? `0 0 20px 8px ${glow}` : isHovered ? `0 0 15px 5px ${glow}` : `0 0 10px 3px ${glow}`,
                top: 'calc(50% - 8px)',
                left: 'calc(50% - 8px)',
                zIndex: isSelected || isHovered ? 50 : 10,
                animationName: `asteroid-orbit-${index + 1}`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationPlayState: isSelected || isHovered ? 'paused' : 'running',
              }}
              onClick={() => handleAsteroidClick(asteroid)}
              onMouseEnter={() => setHoveredAsteroid(asteroid)}
              onMouseLeave={() => setHoveredAsteroid(null)}
            >
              {/* Asteroid surface texture */}
              <div className="absolute inset-0 rounded-full opacity-40" style={{
                backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 20%, rgba(255,255,255,0.2) 40%, transparent 60%)',
                animation: `spin ${10 + index * 5}s linear infinite`
              }}></div>
              
              {/* Tooltip on hover/select */}
              {(isHovered || isSelected) && (
                <div className="absolute -bottom-28 left-1/2 transform -translate-x-1/2 bg-space-black bg-opacity-90 p-3 rounded shadow-lg text-white text-xs whitespace-nowrap z-50 min-w-[140px]">
                  <div className="font-bold text-center">{asteroid.name}</div>
                  <div className="flex justify-center mt-2">
                    <span className={`px-2 py-1 rounded text-center ${
                      status === 'Hazardous' ? 'bg-red-900 text-red-100' : 
                      status === 'Large' ? 'bg-amber-900 text-amber-100' : 
                      'bg-green-900 text-green-100'
                    }`}>
                      {status}
                    </span>
                  </div>
                  <div className="mt-2 text-center">Diameter: {calculateAvgDiameter(asteroid.diameterMinKm, asteroid.diameterMaxKm)}</div>
                  <div className="text-[10px] text-gray-300 mt-1 text-center">Click for details</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CSS for orbits and animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes moon-orbit {
          from { transform: rotate(0deg) translate(75px) rotate(0deg); }
          to { transform: rotate(360deg) translate(75px) rotate(-360deg); }
        }
        
        @keyframes asteroid-orbit-1 {
          from { transform: rotate(0deg) translate(110px) rotate(0deg); }
          to { transform: rotate(360deg) translate(110px) rotate(-360deg); }
        }
        
        @keyframes asteroid-orbit-2 {
          from { transform: rotate(72deg) translate(140px) rotate(-72deg); }
          to { transform: rotate(432deg) translate(140px) rotate(-432deg); }
        }
        
        @keyframes asteroid-orbit-3 {
          from { transform: rotate(144deg) translate(170px) rotate(-144deg); }
          to { transform: rotate(504deg) translate(170px) rotate(-504deg); }
        }
        
        @keyframes asteroid-orbit-4 {
          from { transform: rotate(216deg) translate(200px) rotate(-216deg); }
          to { transform: rotate(576deg) translate(200px) rotate(-576deg); }
        }
        
        @keyframes asteroid-orbit-5 {
          from { transform: rotate(288deg) translate(230px) rotate(-288deg); }
          to { transform: rotate(648deg) translate(230px) rotate(-648deg); }
        }
      `}</style>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 bg-space-black bg-opacity-80 p-3 flex justify-between items-center z-40">
        <div className="text-xs font-mono text-muted-foreground">
          Showing {visibleAsteroids.length} near-Earth objects
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-400"></span>
          <span className="text-xs text-white mr-2">Hazardous</span>
          
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-400"></span>
          <span className="text-xs text-white mr-2">Large</span>
          
          <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-400"></span>
          <span className="text-xs text-white">Safe</span>
        </div>
      </div>
    </Card>
  );
}