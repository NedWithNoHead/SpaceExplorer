import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { NearEarthObject } from '@/types/nasa';
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
    <Card className="lg:col-span-7 bg-gray-900 bg-opacity-50 rounded-xl p-6 border border-gray-800 h-96 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-space-black opacity-60"></div>

      {/* The solar system */}
      <div className="relative w-full h-full">
        {/* Central Earth */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-blue-500 z-50 shadow-[0_0_20px_5px_rgba(59,130,246,0.3)]" 
             style={{ background: 'radial-gradient(circle, #1e88e5, #0d47a1)' }}>
          {/* Earth's continents representation */}
          <div className="absolute inset-0 opacity-40 rounded-full earth-rotation"></div>
          
          {/* Earth label */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium bg-blue-900 px-2 py-0.5 rounded-full z-50">
            Earth
          </div>
        </div>
        
        {/* Moon orbit - outside NEO objects */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full border border-gray-500 border-dashed opacity-20"></div>
        
        {/* Moon - outside NEO objects */}
        <div className="moon">
          <div className="absolute w-full h-full rounded-full opacity-50 moon-rotation"></div>
          
          {/* Moon label - fixed position relative to moon */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-2 text-white text-[10px] bg-gray-700 px-1 py-0.5 rounded whitespace-nowrap z-40">
            Moon
          </div>
        </div>
        
        {/* Asteroid orbits - between Earth and Moon */}
        {visibleAsteroids.map((asteroid, index) => {
          // Calculate orbit size - between Earth and Moon - more compact
          const orbitSize = 60 + (index * 15); 
          
          return (
            <div 
              key={`orbit-${asteroid.id}`}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed"
              style={{ 
                width: `${orbitSize}px`, 
                height: `${orbitSize}px`,
                borderColor: asteroid.isPotentiallyHazardous ? 'rgba(239, 68, 68, 0.3)' : 'rgba(100, 116, 139, 0.15)',
                opacity: asteroid.isPotentiallyHazardous ? 0.4 : 0.2
              }}
            ></div>
          );
        })}
        
        {/* Asteroids - between Earth and Moon */}
        {visibleAsteroids.map((asteroid, index) => {
          // Determine asteroid size based on diameter
          const diameter = asteroid.diameterMaxKm;
          const size = 6 + Math.min(Math.round(diameter / 100), 10);
          
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
          
          const isSelected = selectedAsteroidId === asteroid.id;
          const isHovered = hoveredAsteroid?.id === asteroid.id;
          
          // Use CSS classes instead of inline animation
          const orbitClass = `asteroid-orbit-${index + 1}`;
          
          return (
            <div 
              key={`asteroid-${asteroid.id}`}
              className={`absolute rounded-full cursor-pointer transition-all duration-300 z-40 ${orbitClass}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                boxShadow: isSelected ? `0 0 15px 5px ${glow}` : isHovered ? `0 0 10px 3px ${glow}` : `0 0 5px 2px ${glow}`
              }}
              onClick={() => handleAsteroidClick(asteroid)}
              onMouseEnter={() => setHoveredAsteroid(asteroid)}
              onMouseLeave={() => setHoveredAsteroid(null)}
            >
              {/* Asteroid surface texture */}
              <div className="absolute inset-0 rounded-full opacity-40 asteroid-rotation"></div>
              
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

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 bg-space-black bg-opacity-80 p-3 flex justify-between items-center z-50">
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