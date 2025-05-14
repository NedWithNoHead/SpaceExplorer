import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { NearEarthObject, CloseApproach } from '@/types/nasa';
import { formatDate } from '@/lib/utils';

interface AsteroidListProps {
  isLoading: boolean;
  asteroids: NearEarthObject[];
  closeApproaches: CloseApproach[];
  selectedAsteroid?: NearEarthObject;
}

export default function AsteroidList({ 
  isLoading, 
  asteroids = [], 
  closeApproaches = [],
  selectedAsteroid 
}: AsteroidListProps) {
  const [visibleCount, setVisibleCount] = useState(3);
  
  // Filter approaches by asteroid ID
  const getApproachesForAsteroid = (neoId: number) => {
    return closeApproaches.filter(approach => approach.neoId === neoId);
  };
  
  // Get the closest approach for an asteroid (for preview in card)
  const getClosestApproach = (neoId: number) => {
    const approaches = getApproachesForAsteroid(neoId);
    if (approaches.length === 0) return null;
    
    // Sort by closest approach
    return approaches.sort((a, b) => a.missDistanceLunar - b.missDistanceLunar)[0];
  };
  
  // Get hazard level for styling
  const getHazardLevel = (asteroid: NearEarthObject) => {
    if (asteroid.isPotentiallyHazardous) return 'severe';
    
    const approach = getClosestApproach(asteroid.id);
    if (!approach) return 'safe';
    
    if (approach.missDistanceLunar < 3) return 'close';
    if (approach.missDistanceLunar < 7) return 'monitor';
    return 'safe';
  };
  
  // Format hazard level for display
  const formatHazardLevel = (level: string) => {
    switch (level) {
      case 'severe': return { text: 'Potentially Hazardous', className: 'bg-red-900 text-red-100' };
      case 'close': return { text: 'Close Approach', className: 'bg-red-900 text-red-100' };
      case 'monitor': return { text: 'Monitor', className: 'bg-amber-900 text-amber-100' };
      default: return { text: 'Safe', className: 'bg-green-900 text-green-100' };
    }
  };
  
  // Format velocity for display
  const formatVelocity = (kmh: number) => {
    return Math.round(kmh).toLocaleString();
  };
  
  // Format diameter for display (average of min/max)
  const formatDiameter = (asteroid: NearEarthObject) => {
    const avgDiameter = (asteroid.diameterMinKm + asteroid.diameterMaxKm) / 2;
    return avgDiameter < 1 
      ? `${Math.round(avgDiameter * 1000)}m` 
      : `${avgDiameter.toFixed(1)}km`;
  };
  
  // Load more asteroids
  const loadMore = () => {
    setVisibleCount(prev => prev + 3);
  };
  
  // Visible asteroids
  const visibleAsteroids = asteroids.slice(0, visibleCount);

  return (
    <Card className="lg:col-span-5 bg-gray bg-opacity-30 rounded-xl border border-gray-800 h-full">
      <CardHeader className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-xl font-medium text-white">Upcoming Close Approaches</h3>
        <div className="text-muted-foreground text-sm">
          Next 7 days
        </div>
      </CardHeader>
      <CardContent className="p-2 max-h-80 overflow-y-auto">
        {isLoading ? (
          // Loading skeleton
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-3 border-b border-gray-700">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Skeleton className="w-3 h-3 rounded-full mr-2" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <div className="flex gap-4">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          ))
        ) : asteroids.length === 0 ? (
          <div className="p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="5" x2="5" y2="19"></line>
              <circle cx="6.5" cy="6.5" r="2.5"></circle>
              <circle cx="17.5" cy="17.5" r="2.5"></circle>
            </svg>
            <p className="mt-4 text-muted-foreground">No asteroid data available</p>
          </div>
        ) : (
          // Asteroid list
          visibleAsteroids.map(asteroid => {
            const closestApproach = getClosestApproach(asteroid.id);
            const hazardLevel = getHazardLevel(asteroid);
            const { text: hazardText, className: hazardClass } = formatHazardLevel(hazardLevel);
            const diameter = formatDiameter(asteroid);
            
            return (
              <div 
                key={asteroid.id} 
                className={`p-3 border-b border-gray-700 hover:bg-space-black hover:bg-opacity-40 transition-colors ${selectedAsteroid?.id === asteroid.id ? 'bg-space-black bg-opacity-60' : ''}`}
              >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <span 
                      className={`w-3 h-3 rounded-full mr-2`}
                      style={{ 
                        backgroundColor: hazardLevel === 'severe' || hazardLevel === 'close' 
                          ? '#ef4444' 
                          : hazardLevel === 'monitor' 
                            ? '#f59e0b' 
                            : '#10b981'
                      }}
                    ></span>
                    <div>
                      <h4 className="text-white font-medium">{asteroid.name}</h4>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                        <span>Diameter: <span className="font-mono">{diameter}</span></span>
                        {closestApproach && (
                          <span>Velocity: <span className="font-mono">{formatVelocity(closestApproach.relativeVelocityKmh)} km/h</span></span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {closestApproach && (
                      <>
                        <div className="text-amber-400 font-mono text-sm">{formatDate(closestApproach.closeApproachDate)}</div>
                        <div className="text-muted-foreground text-xs mt-1">
                          Distance: <span className="font-mono">{closestApproach.missDistanceLunar.toFixed(1)} LD</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className={`text-xs px-2 py-0.5 rounded ${hazardClass}`}>{hazardText}</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" size="sm" className="text-white text-xs hover:text-amber-400 p-0 h-auto">
                        View Details <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <span 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ 
                              backgroundColor: hazardLevel === 'severe' || hazardLevel === 'close' 
                                ? '#ef4444' 
                                : hazardLevel === 'monitor' 
                                  ? '#f59e0b' 
                                  : '#10b981'
                            }}
                          ></span>
                          {asteroid.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Physical Characteristics</h4>
                          <p className="text-sm">Diameter: {diameter}</p>
                          <p className="text-sm">Absolute Magnitude: {asteroid.absoluteMagnitude.toFixed(1)}</p>
                          <p className="text-sm">Potentially Hazardous: {asteroid.isPotentiallyHazardous ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Orbit Information</h4>
                          <p className="text-sm">NASA ID: {asteroid.nasaId}</p>
                          {closestApproach && (
                            <>
                              <p className="text-sm">Orbiting Body: {closestApproach.orbitingBody}</p>
                            </>
                          )}
                        </div>
                        {getApproachesForAsteroid(asteroid.id).length > 0 && (
                          <div className="col-span-2">
                            <h4 className="text-sm font-medium mb-1">Close Approaches</h4>
                            <div className="max-h-40 overflow-y-auto border rounded-md">
                              <table className="w-full text-sm">
                                <thead className="bg-muted">
                                  <tr>
                                    <th className="px-2 py-1 text-left">Date</th>
                                    <th className="px-2 py-1 text-left">Distance (LD)</th>
                                    <th className="px-2 py-1 text-left">Velocity (km/h)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getApproachesForAsteroid(asteroid.id).map((approach, i) => (
                                    <tr key={i} className="border-t">
                                      <td className="px-2 py-1">{formatDate(approach.closeApproachDate)}</td>
                                      <td className="px-2 py-1">{approach.missDistanceLunar.toFixed(2)}</td>
                                      <td className="px-2 py-1">{formatVelocity(approach.relativeVelocityKmh)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
      {!isLoading && asteroids.length > visibleCount && (
        <CardFooter className="p-4 border-t border-gray-700">
          <Button 
            className="w-full bg-primary hover:bg-blue-800 text-white py-2 rounded text-sm transition-colors"
            onClick={loadMore}
          >
            Load More Asteroids
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
