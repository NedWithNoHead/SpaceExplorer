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

  return (
    <Card className="lg:col-span-7 bg-gray bg-opacity-30 rounded-xl p-6 border border-gray-800 h-96 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        {/* Space background with small stars */}
        <div className="absolute inset-0 bg-space-black opacity-60"></div>
        
        {/* Earth representation - smaller and to the side */}
        <div className="absolute bottom-12 left-12 w-20 h-20 rounded-full bg-blue-500 shadow-lg z-20" 
             style={{ background: 'radial-gradient(circle, #1e88e5, #0d47a1)' }}>
          <div className="absolute -bottom-6 text-white text-xs font-medium bg-blue-900 px-2 py-0.5 rounded-full">
            Earth
          </div>
          <div className="absolute inset-0 opacity-40 rounded-full" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23ffffff' d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 4.5a.5.5 0 11-1 0 .5.5 0 011 0zm-6 2a.5.5 0 11-1 0 .5.5 0 011 0zm2 .5a1 1 0 11-2 0 1 1 0 012 0zm8-1a1 1 0 11-2 0 1 1 0 012 0z'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover'
          }}></div>
        </div>
        
        {/* Moon - small and close to Earth */}
        <div className="absolute bottom-20 left-4 w-5 h-5 rounded-full bg-gray-300 shadow-md">
          <div className="absolute -top-5 text-white text-[10px] bg-gray-700 px-1 py-0.5 rounded">Moon</div>
        </div>

        {/* Asteroid field - center of the visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          {visibleAsteroids.map((asteroid, index) => {
            // Determine asteroid size based on diameter - make them more prominent
            const diameter = asteroid.diameterMaxKm;
            const size = 16 + Math.min(Math.round(diameter / 30), 36); // Larger size for better visibility
            
            // Determine color based on hazard potential
            let color = '#10b981'; // Green for safe
            let glow = 'rgba(16, 185, 129, 0.4)';
            let status = 'Safe';
            
            if (asteroid.isPotentiallyHazardous) {
              color = '#ef4444'; // Red for hazardous
              glow = 'rgba(239, 68, 68, 0.4)';
              status = 'Hazardous';
            } else if (diameter > 500) {
              color = '#f59e0b'; // Amber for large
              glow = 'rgba(245, 158, 11, 0.4)';
              status = 'Large';
            }
            
            // Calculate position - spread asteroids out across the visualization
            // Use golden ratio for natural positioning
            const phi = (1 + Math.sqrt(5)) / 2;
            const angle = (index * phi * Math.PI * 2) % (Math.PI * 2);
            const angleOffset = Math.random() * 0.5;
            const distance = 120 + (index * 25) + (Math.random() * 30);
            
            // Calculate x and y position with some random variation
            const xPos = Math.cos(angle + angleOffset) * distance;
            const yPos = Math.sin(angle + angleOffset) * distance;
            
            const isSelected = selectedAsteroidId === asteroid.id;
            const isHovered = hoveredAsteroid?.id === asteroid.id;
            
            return (
              <div 
                key={`asteroid-${asteroid.id}`}
                className={`absolute rounded-full shadow-lg cursor-pointer transition-all duration-300
                           ${isSelected || isHovered ? 'z-30' : 'z-20'}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  boxShadow: isSelected ? `0 0 15px 5px ${glow}` : isHovered ? `0 0 8px 3px ${glow}` : `0 0 5px 2px ${glow}`,
                  left: `calc(50% + ${xPos}px)`,
                  top: `calc(50% + ${yPos}px)`,
                  transform: `translate(-50%, -50%)`,
                  transition: 'width 0.3s, height 0.3s, box-shadow 0.3s'
                }}
                onClick={() => handleAsteroidClick(asteroid)}
                onMouseEnter={() => setHoveredAsteroid(asteroid)}
                onMouseLeave={() => setHoveredAsteroid(null)}
              >
                {/* Asteroid surface detail */}
                <div className="absolute inset-0 rounded-full opacity-30" style={{
                  backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 10%, rgba(255,255,255,0.2) 20%, transparent 30%)'
                }}></div>
                
                {/* Asteroid label for larger ones */}
                {size > 30 && !isHovered && !isSelected && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs whitespace-nowrap bg-space-black bg-opacity-70 px-1 rounded">
                    {asteroid.name.split(' ')[0]}
                  </div>
                )}
                
                {/* Tooltip on hover/select */}
                {(isHovered || isSelected) && (
                  <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 bg-space-black bg-opacity-90 p-2 rounded shadow-lg text-white text-xs whitespace-nowrap z-50 min-w-[120px]">
                    <div className="font-bold text-center">{asteroid.name}</div>
                    <div className="flex justify-center mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-center ${
                        status === 'Hazardous' ? 'bg-red-900 text-red-100' : 
                        status === 'Large' ? 'bg-amber-900 text-amber-100' : 
                        'bg-green-900 text-green-100'
                      }`}>
                        {status}
                      </span>
                    </div>
                    <div className="mt-1 text-center">Diameter: {calculateAvgDiameter(asteroid.diameterMinKm, asteroid.diameterMaxKm)}</div>
                    <div className="text-[10px] text-gray-300 mt-0.5 text-center">Click to select</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
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