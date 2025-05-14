import { Helmet } from 'react-helmet';
import { useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import MarsGallery from '@/components/mars/MarsGallery';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import AsteroidVisualizer from '@/components/asteroids/AsteroidVisualizer';
import AsteroidList from '@/components/asteroids/AsteroidList';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchAsteroids } from '@/services/apiService';
import { AsteroidData, NearEarthObject } from '@/types/nasa';

export default function HomePage() {
  const apodRef = useRef<HTMLDivElement>(null);
  const marsRef = useRef<HTMLDivElement>(null);
  const asteroidsRef = useRef<HTMLDivElement>(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState<NearEarthObject | undefined>();
  
  // Get current date and date a week from now for asteroid data
  const today = new Date();
  const weekLater = new Date(today);
  weekLater.setDate(today.getDate() + 7);
  
  const formattedToday = today.toISOString().split('T')[0];
  const formattedWeekLater = weekLater.toISOString().split('T')[0];
  
  // Fetch asteroid data
  const { data, isLoading, isError } = useQuery<AsteroidData>({
    queryKey: ['/api/neo', formattedToday, formattedWeekLater],
    queryFn: () => fetchAsteroids(formattedToday, formattedWeekLater)
  });
  
  const asteroids = data?.near_earth_objects || [];
  const closeApproaches = data?.close_approaches || [];
  
  // Set first asteroid as selected when data loads
  if (asteroids.length > 0 && !selectedAsteroid) {
    setSelectedAsteroid(asteroids[0]);
  }
  
  // Calculate stats for asteroids
  const stats = {
    totalObjects: asteroids.length,
    closestApproach: closeApproaches.length > 0 
      ? Math.min(...closeApproaches.map(a => a.missDistanceLunar)).toFixed(1) + ' LD'
      : 'N/A',
    largestObject: asteroids.length > 0
      ? Math.max(...asteroids.map(a => a.diameterMaxKm)).toFixed(0) + 'm'
      : 'N/A'
  };

  return (
    <>
      <Helmet>
        <title>Space Explorer - NASA APOD & Space Data</title>
        <meta name="description" content="Explore the wonders of space through NASA's open APIs. View the Astronomy Picture of the Day, Mars rover photos, and asteroid data." />
        <meta property="og:title" content="Space Explorer - NASA Space Data" />
        <meta property="og:description" content="Discover the cosmos with daily astronomy pictures, Mars rover images, and asteroid tracking." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="relative flex flex-col min-h-screen overflow-hidden bg-space-black">
        {/* Star field background */}
        <div className="star-field absolute inset-0 -z-10" aria-hidden="true">
          {/* Stars are added via CSS */}
        </div>

        {/* Persistent Navigation */}
        <Navigation />
        
        <main className="flex-grow">
          {/* APOD Section */}
          <div ref={apodRef} id="apod">
            <HeroSection />
          </div>
          
          {/* Mars Rover Section */}
          <div ref={marsRef} id="mars">
            <MarsGallery />
          </div>
          
          {/* Asteroid Section */}
          <div ref={asteroidsRef} id="asteroids">
            <section className="py-16">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Near-Earth Asteroid Tracker
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Monitor asteroids and near-Earth objects that will make close approaches to our planet in the coming days.
                  </p>
                </div>

                {/* Visualization and Data Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                  {/* Interactive Visualization */}
                  {isLoading ? (
                    <Card className="lg:col-span-7 bg-gray bg-opacity-30 rounded-xl p-6 border border-gray-800 h-96 flex items-center justify-center">
                      <Skeleton className="w-32 h-32 rounded-full" />
                    </Card>
                  ) : isError ? (
                    <Card className="lg:col-span-7 bg-gray bg-opacity-30 rounded-xl p-6 border border-gray-800 h-96 flex items-center justify-center">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <p className="text-white">Failed to load asteroid data</p>
                      </div>
                    </Card>
                  ) : (
                    <AsteroidVisualizer 
                      asteroids={asteroids} 
                      onSelectAsteroid={setSelectedAsteroid} 
                    />
                  )}

                  {/* Upcoming Close Approaches */}
                  <AsteroidList 
                    isLoading={isLoading}
                    asteroids={asteroids}
                    closeApproaches={closeApproaches}
                    selectedAsteroid={selectedAsteroid}
                  />
                </div>

                {/* Asteroid stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {isLoading ? (
                    [...Array(3)].map((_, i) => (
                      <Card key={i} className="bg-gray bg-opacity-30 border border-gray-800 rounded-lg p-5 text-center">
                        <Skeleton className="h-10 w-20 mx-auto mb-2" />
                        <Skeleton className="h-5 w-36 mx-auto mb-2" />
                        <Skeleton className="h-4 w-24 mx-auto" />
                      </Card>
                    ))
                  ) : (
                    <>
                      <Card className="bg-gray bg-opacity-30 border border-gray-800 rounded-lg p-5 text-center">
                        <div className="text-amber-400 text-4xl font-bold font-mono">{stats.totalObjects}</div>
                        <div className="text-white mt-2">Near-Earth Objects</div>
                        <div className="text-muted-foreground text-sm mt-1">Predicted This Week</div>
                      </Card>
                      <Card className="bg-gray bg-opacity-30 border border-gray-800 rounded-lg p-5 text-center">
                        <div className="text-amber-400 text-4xl font-bold font-mono">{stats.closestApproach}</div>
                        <div className="text-white mt-2">Closest Approach</div>
                        <div className="text-muted-foreground text-sm mt-1">Lunar Distance</div>
                      </Card>
                      <Card className="bg-gray bg-opacity-30 border border-gray-800 rounded-lg p-5 text-center">
                        <div className="text-amber-400 text-4xl font-bold font-mono">{stats.largestObject}</div>
                        <div className="text-white mt-2">Largest Object</div>
                        <div className="text-muted-foreground text-sm mt-1">Estimated Diameter</div>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
