import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AsteroidOrbit, NearEarthObject } from '@/types/nasa';

interface AsteroidVisualizerProps {
  asteroids: NearEarthObject[];
  onSelectAsteroid: (asteroid: NearEarthObject) => void;
}

export default function AsteroidVisualizer({ asteroids, onSelectAsteroid }: AsteroidVisualizerProps) {
  const [orbits, setOrbits] = useState<AsteroidOrbit[]>([]);
  
  // Generate orbit paths for visualization
  useEffect(() => {
    if (asteroids && asteroids.length > 0) {
      const newOrbits = asteroids.slice(0, 5).map((asteroid, index) => {
        // Generate different orbit sizes based on asteroid data
        const size = 2 + Math.round(asteroid.diameterMaxKm / 100);
        const orbitSize = 64 + (index * 9); // Percentage of container
        
        // Determine color based on hazard potential
        let color = '#10b981'; // Green for safe
        if (asteroid.isPotentiallyHazardous) {
          color = '#ef4444'; // Red for hazardous
        } else if (asteroid.diameterMaxKm > 500) {
          color = '#f59e0b'; // Amber for large
        }
        
        // Animation duration based on size
        const animationDuration = 15 + (index * 5);
        
        return {
          id: asteroid.id,
          size,
          color,
          animationDuration,
          orbitWidth: `${orbitSize}%`,
          orbitHeight: `${orbitSize}%`
        };
      });
      
      setOrbits(newOrbits);
    }
  }, [asteroids]);

  return (
    <Card className="lg:col-span-7 bg-gray bg-opacity-30 rounded-xl p-6 border border-gray-800 h-96 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Earth representation */}
        <div className="w-32 h-32 rounded-full bg-blue-500 relative flex items-center justify-center shadow-lg" style={{ background: 'radial-gradient(circle, #1e88e5, #0d47a1)' }}>
          {/* Earth's continents representation */}
          <div className="absolute inset-0 opacity-40 rounded-full" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23ffffff' d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 4.5a.5.5 0 11-1 0 .5.5 0 011 0zm-6 2a.5.5 0 11-1 0 .5.5 0 011 0zm2 .5a1 1 0 11-2 0 1 1 0 012 0zm8-1a1 1 0 11-2 0 1 1 0 012 0zm2-1a.5.5 0 11-1 0 .5.5 0 011 0zm0 3a.5.5 0 11-1 0 .5.5 0 011 0zm0 3a.5.5 0 11-1 0 .5.5 0 011 0zm0 3a.5.5 0 11-1 0 .5.5 0 011 0zm-2 2a1 1 0 11-2 0 1 1 0 012 0zm-6-6a1 1 0 11-2 0 1 1 0 012 0zm-3 5a1 1 0 11-2 0 1 1 0 012 0z'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover'
          }}></div>
          
          {/* Moon orbit */}
          <div className="absolute w-full h-full rounded-full border border-gray-500 border-dashed opacity-30" style={{ width: '180%', height: '180%' }}></div>
          
          {/* Moon */}
          <div className="absolute w-6 h-6 bg-gray-300 rounded-full shadow-md" style={{ 
            left: '50%', 
            marginLeft: '-3px', 
            animation: 'orbit 15s linear infinite'
          }}></div>
        </div>

        {/* Asteroid orbits */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={`orbit-${i}`}
            className="absolute border border-gray-600 rounded-full border-dashed opacity-20" 
            style={{ 
              width: `${64 + (i * 9)}%`, 
              height: `${64 + (i * 9)}%`
            }}
          ></div>
        ))}

        {/* Asteroids */}
        {orbits.map((orbit, index) => (
          <div 
            key={`asteroid-${orbit.id}`}
            className="absolute rounded-full shadow-md cursor-pointer"
            style={{ 
              width: `${orbit.size}px`, 
              height: `${orbit.size}px`,
              backgroundColor: orbit.color,
              left: '50%', 
              marginLeft: `-${orbit.size / 2}px`,
              width: orbit.orbitWidth,
              height: orbit.orbitHeight,
              animation: `orbit ${orbit.animationDuration}s linear infinite`,
              animationDelay: `${index * -3}s`
            }}
            onClick={() => onSelectAsteroid(asteroids.find(a => a.id === orbit.id) || asteroids[0])}
          ></div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-space-black bg-opacity-80 p-3 text-xs font-mono text-muted-foreground">
        Showing {asteroids ? Math.min(asteroids.length, 5) : 0} near-Earth objects | Interactive: Click on any asteroid to view details
      </div>
    </Card>
  );
}
