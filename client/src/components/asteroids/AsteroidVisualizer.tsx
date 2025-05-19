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

      {/* The solar system container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Earth */}
        <div className="earth-container absolute">
          <div className="earth">
            <div className="earth-surface"></div>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium bg-blue-900 px-2 py-0.5 rounded-full z-50">
            Earth
          </div>
        </div>
        
        {/* Moon */}
        <div className="moon-container absolute">
          <div className="moon">
            <div className="moon-surface"></div>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium bg-gray-700 px-2 py-0.5 rounded-full z-50">
            Moon
          </div>
        </div>
        
        {/* Asteroids */}
        {visibleAsteroids.map((asteroid, index) => {
          // Determine asteroid display info
          const diameter = asteroid.diameterMaxKm;
          const size = 8 + Math.min(Math.round(diameter / 100), 8);
          
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
          
          const isSelected = selectedAsteroidId === asteroid.id;
          const isHovered = hoveredAsteroid?.id === asteroid.id;
          
          return (
            <div 
              key={`asteroid-${asteroid.id}`}
              className={`asteroid-${index + 1} absolute`}
              onClick={() => handleAsteroidClick(asteroid)}
              onMouseEnter={() => setHoveredAsteroid(asteroid)}
              onMouseLeave={() => setHoveredAsteroid(null)}
            >
              <div
                className="relative cursor-pointer"
                style={{
                  width: `${size}px`,
                  height: `${size}px`
                }}
              >
                <div 
                  className="absolute inset-0 rounded-full asteroid-surface"
                  style={{ backgroundColor: color }}
                ></div>
                
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