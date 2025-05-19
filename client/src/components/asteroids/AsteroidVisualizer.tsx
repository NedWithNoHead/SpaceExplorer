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
  const [selectedOrbitIndex, setSelectedOrbitIndex] = useState<number | null>(null);
  const [hoveredAsteroid, setHoveredAsteroid] = useState<NearEarthObject | null>(null);
  const visibleAsteroids = asteroids.slice(0, 5);
  
  // Handle asteroid selection
  const handleAsteroidClick = (asteroid: NearEarthObject, index: number) => {
    setSelectedOrbitIndex(index);
    onSelectAsteroid(asteroid);
  };

  return (
    <Card className="lg:col-span-7 bg-gray bg-opacity-30 rounded-xl p-6 border border-gray-800 h-96 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Earth representation - smaller size */}
        <div className="w-20 h-20 rounded-full bg-blue-500 relative flex items-center justify-center shadow-lg z-30" 
             style={{ background: 'radial-gradient(circle, #1e88e5, #0d47a1)' }}>
          {/* Earth label */}
          <div className="absolute -bottom-6 text-white text-xs font-medium bg-blue-900 px-2 py-0.5 rounded-full">
            Earth
          </div>
          
          {/* Earth's continents representation */}
          <div className="absolute inset-0 opacity-40 rounded-full" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23ffffff' d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 4.5a.5.5 0 11-1 0 .5.5 0 011 0zm-6 2a.5.5 0 11-1 0 .5.5 0 011 0zm2 .5a1 1 0 11-2 0 1 1 0 012 0zm8-1a1 1 0 11-2 0 1 1 0 012 0zm2-1a.5.5 0 11-1 0 .5.5 0 011 0zm0 3a.5.5 0 11-1 0 .5.5 0 011 0zm0 3a.5.5 0 11-1 0 .5.5 0 011 0zm0 3a.5.5 0 11-1 0 .5.5 0 011 0zm-2 2a1 1 0 11-2 0 1 1 0 012 0zm-6-6a1 1 0 11-2 0 1 1 0 012 0zm-3 5a1 1 0 11-2 0 1 1 0 012 0z'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover'
          }}></div>
          
          {/* Moon orbit */}
          <div className="absolute w-full h-full rounded-full border border-gray-500 border-dashed opacity-30" 
               style={{ width: '160%', height: '160%' }}></div>
          
          {/* Moon */}
          <div className="absolute w-4 h-4 bg-gray-300 rounded-full shadow-md" style={{ 
            left: '50%', 
            marginLeft: '-2px', 
            animation: 'orbit 15s linear infinite'
          }}>
            <div className="absolute -bottom-4 text-white text-[10px] bg-gray-700 px-1 rounded">Moon</div>
          </div>
        </div>

        {/* Asteroid orbits with labels - more spread out */}
        {visibleAsteroids.map((asteroid, index) => {
          // Determine orbit size based on index - more spread out orbits
          const orbitSize = 50 + (index * 20); // Wider spacing between orbits
          
          // Determine asteroid size based on diameter - scaled appropriately
          const diameter = asteroid.diameterMaxKm;
          const size = 6 + Math.min(Math.round(diameter / 80), 16); // Slightly smaller overall
          
          // Determine color based on hazard potential
          let color = '#10b981'; // Green for safe
          let status = 'Safe';
          
          if (asteroid.isPotentiallyHazardous) {
            color = '#ef4444'; // Red for hazardous
            status = 'Hazardous';
          } else if (diameter > 500) {
            color = '#f59e0b'; // Amber for large
            status = 'Large';
          }
          
          // Animation parameters - more varied and faster speeds
          const animationDuration = 10 + (index * 5); // More variation in speeds
          const position = Math.floor(Math.random() * 360); // Randomized starting positions
          
          const isSelected = selectedOrbitIndex === index;
          const isHovered = hoveredAsteroid?.id === asteroid.id;
          
          return (
            <div key={`asteroid-system-${asteroid.id}`}>
              {/* Orbit path */}
              <div 
                className={`absolute border rounded-full border-dashed transition-all duration-300 ${isSelected ? 'border-white opacity-60' : 'border-gray-600 opacity-20'}`} 
                style={{ 
                  width: `${orbitSize}%`, 
                  height: `${orbitSize}%`
                }}
              ></div>
              
              {/* Asteroid */}
              <div 
                className={`absolute rounded-full shadow-lg cursor-pointer z-20 transition-all duration-300
                           hover:shadow-white hover:shadow-sm ${isSelected ? 'shadow-white ring-2 ring-white' : ''}`}
                style={{ 
                  width: `${size}px`, 
                  height: `${size}px`,
                  backgroundColor: color,
                  '--orbit-distance': `${orbitSize / 2}%`,
                  transform: `rotate(${position}deg) translateX(${orbitSize / 2}%) rotate(-${position}deg)`,
                  animation: `orbit ${animationDuration}s linear infinite`,
                  animationPlayState: isSelected || isHovered ? 'paused' : 'running'
                } as React.CSSProperties}
                onClick={() => handleAsteroidClick(asteroid, index)}
                onMouseEnter={() => setHoveredAsteroid(asteroid)}
                onMouseLeave={() => setHoveredAsteroid(null)}
              >
                {/* Tooltip on hover/select */}
                {(isHovered || isSelected) && (
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-space-black bg-opacity-90 p-2 rounded text-white text-xs whitespace-nowrap z-50">
                    <div className="font-bold">{asteroid.name}</div>
                    <div className="text-xs mt-1">
                      <span className={`px-1.5 py-0.5 rounded ${
                        status === 'Hazardous' ? 'bg-red-900 text-red-100' : 
                        status === 'Large' ? 'bg-amber-900 text-amber-100' : 
                        'bg-green-900 text-green-100'
                      }`}>
                        {status}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px]">Diameter: {calculateAvgDiameter(asteroid.diameterMinKm, asteroid.diameterMaxKm)}</div>
                    <div className="text-[10px] text-gray-300 mt-0.5">Click to select</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-space-black bg-opacity-80 p-3 flex justify-between items-center">
        <div className="text-xs font-mono text-muted-foreground">
          Showing {visibleAsteroids.length} near-Earth objects
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-xs text-white mr-2">Hazardous</span>
          
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className="text-xs text-white mr-2">Large</span>
          
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-xs text-white">Safe</span>
        </div>
      </div>
    </Card>
  );
}
