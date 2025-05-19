import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ApodResponse, MarsRoverPhoto, AsteroidData } from '@/types/nasa';
import { formatDate, truncateText } from '@/lib/utils';

interface SearchResultsProps {
  data: any;
  isLoading: boolean;
  isError: boolean;
  searchPerformed: boolean;
  searchCategory?: 'apod' | 'mars' | 'neo';
}

export default function SearchResults({ 
  data, 
  isLoading, 
  isError,
  searchPerformed,
  searchCategory = 'apod'
}: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<string>(searchCategory || 'apod');
  
  // Determine what type of data we have
  const isApodData = Array.isArray(data) && data.length > 0 && 'title' in data[0] && 'explanation' in data[0];
  const isMarsData = Array.isArray(data) && data.length > 0 && 'sol' in data[0] && 'camera' in data[0];
  const isAsteroidData = data && 'near_earth_objects' in data && 'close_approaches' in data;
  
  // Get typed data
  const apodResults = isApodData ? (data as ApodResponse[]) : [];
  const marsResults = isMarsData ? (data as MarsRoverPhoto[]) : [];
  const asteroidResults = isAsteroidData 
    ? {
        asteroids: (data as AsteroidData).near_earth_objects,
        approaches: (data as AsteroidData).close_approaches
      } 
    : { asteroids: [], approaches: [] };
  
  // Count results
  const resultCount = isApodData ? apodResults.length : 
                    isMarsData ? marsResults.length : 
                    isAsteroidData ? asteroidResults.asteroids.length : 0;
  
  // Render empty state
  if (!searchPerformed) {
    return (
      <Card className="bg-space-gray bg-opacity-30 rounded-xl border border-gray-800 overflow-hidden">
        <CardHeader className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-medium text-white">Search Results</h3>
          <div className="text-muted-foreground text-sm">
            Enter search parameters above
          </div>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p>Enter a search query to explore space imagery and data</p>
        </CardContent>
      </Card>
    );
  }
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className="bg-space-gray bg-opacity-30 rounded-xl border border-gray-800 overflow-hidden">
        <CardHeader className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-medium text-white">Search Results</h3>
          <div className="text-muted-foreground text-sm">
            <svg className="animate-spin h-5 w-5 inline-block mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-space-black bg-opacity-30 border border-gray-700">
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (isError) {
    return (
      <Card className="bg-space-gray bg-opacity-30 rounded-xl border border-gray-800 overflow-hidden">
        <CardHeader className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-medium text-white">Search Results</h3>
          <div className="text-muted-foreground text-sm">
            Error occurred
          </div>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-lg font-medium text-white mb-2">Error Loading Results</p>
          <p>We couldn't retrieve the search results. Please try again later or modify your search parameters.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }
  
  // Render no results state
  if (resultCount === 0) {
    return (
      <Card className="bg-space-gray bg-opacity-30 rounded-xl border border-gray-800 overflow-hidden">
        <CardHeader className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-medium text-white">Search Results</h3>
          <div className="text-muted-foreground text-sm">
            No results found
          </div>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium text-white mb-2">No Results Found</p>
          <p>Try adjusting your search criteria or choosing a different date range.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Render results
  return (
    <Card className="bg-space-gray bg-opacity-30 rounded-xl border border-gray-800 overflow-hidden">
      <CardHeader className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-xl font-medium text-white">Search Results</h3>
        <div className="text-muted-foreground text-sm">
          {resultCount} results found
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isApodData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apodResults.map((apod, index) => (
              <Card key={index} className="bg-space-black bg-opacity-30 border border-gray-700 overflow-hidden hover:border-primary transition-colors">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer">
                      {apod.mediaType === 'image' ? (
                        <img 
                          src={apod.url} 
                          alt={apod.title} 
                          className="h-40 w-full object-cover"
                        />
                      ) : apod.mediaType === 'video' ? (
                        <div className="h-40 w-full bg-gray-900 flex items-center justify-center relative overflow-hidden">
                          <video 
                            className="w-full h-full object-cover"
                            muted
                          >
                            <source src={apod.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="h-40 w-full bg-gray-900 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{apod.title}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">
                      {apod.mediaType === 'image' ? (
                        <img 
                          src={apod.hdurl || apod.url} 
                          alt={apod.title} 
                          className="w-full max-h-[60vh] object-contain"
                        />
                      ) : apod.mediaType === 'video' ? (
                        <video 
                          src={apod.url}
                          controls
                          autoPlay
                          className="w-full aspect-video"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <iframe 
                          src={apod.url} 
                          title={apod.title}
                          className="w-full aspect-video"
                          allowFullScreen
                        ></iframe>
                      )}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-amber-400 font-mono">{formatDate(apod.date)}</span>
                          {apod.copyright && (
                            <span className="text-sm text-muted-foreground">© {apod.copyright}</span>
                          )}
                        </div>
                        <p className="mt-2 text-sm">{apod.explanation}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <CardContent className="p-4">
                  <h4 className="font-bold text-white mb-1">
                    {truncateText(apod.title, 60)}
                  </h4>
                  <p className="text-xs text-amber-400 mb-2">{formatDate(apod.date)}</p>
                  <p className="text-sm text-muted-foreground">
                    {truncateText(apod.explanation, 100)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isMarsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marsResults.map((photo, index) => (
              <Card key={index} className="bg-space-black bg-opacity-30 border border-gray-700 overflow-hidden hover:border-primary transition-colors">
                <Dialog>
                  <DialogTrigger asChild>
                    <img 
                      src={photo.imgSrc} 
                      alt={`Mars Rover - ${photo.camera}`} 
                      className="h-48 w-full object-cover cursor-pointer"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Mars Rover Photo (ID: {photo.nasaId})</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">
                      <img 
                        src={photo.imgSrc} 
                        alt={`Mars Rover - ${photo.camera}`} 
                        className="w-full max-h-[70vh] object-contain"
                      />
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Camera Details</h4>
                          <p className="text-sm">Camera: {photo.camera}</p>
                          <p className="text-sm">Rover: {photo.rover}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Date Information</h4>
                          <p className="text-sm">Earth Date: {formatDate(photo.earthDate)}</p>
                          <p className="text-sm">Sol: {photo.sol}</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        {photo.camera}
                      </span>
                      <p className="text-white font-medium mt-2">
                        Mars Sol: <span className="font-mono">{photo.sol}</span>
                      </p>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {formatDate(photo.earthDate)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isAsteroidData && (
          <div className="space-y-4">
            {asteroidResults.asteroids.map((asteroid, index) => {
              // Find this asteroid's approaches
              const approaches = asteroidResults.approaches.filter(a => a.neoId === asteroid.id);
              const closestApproach = approaches.length > 0 
                ? approaches.sort((a, b) => a.missDistanceLunar - b.missDistanceLunar)[0] 
                : null;
              
              // Determine hazard level
              const isHazardous = asteroid.isPotentiallyHazardous;
              const lunarDistance = closestApproach?.missDistanceLunar;
              
              // Set color based on hazard level
              let statusColor = '#10b981'; // Green (safe)
              let statusText = 'Safe';
              
              if (isHazardous) {
                statusColor = '#ef4444'; // Red (hazardous)
                statusText = 'Potentially Hazardous';
              } else if (lunarDistance && lunarDistance < 3) {
                statusColor = '#ef4444'; // Red (close)
                statusText = 'Close Approach';
              } else if (lunarDistance && lunarDistance < 7) {
                statusColor = '#f59e0b'; // Amber (monitor)
                statusText = 'Monitor';
              }
              
              return (
                <Card key={index} className="bg-space-black bg-opacity-30 border border-gray-700 hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span 
                          className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                          style={{ backgroundColor: statusColor }}
                        ></span>
                        <div>
                          <h4 className="font-bold text-white">{asteroid.name}</h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Diameter:</span>{' '}
                              <span className="font-mono">
                                {((asteroid.diameterMinKm + asteroid.diameterMaxKm) / 2).toFixed(2)} km
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Magnitude:</span>{' '}
                              <span className="font-mono">{asteroid.absoluteMagnitude.toFixed(1)}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Status:</span>{' '}
                              <span className="font-mono">{statusText}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">NASA ID:</span>{' '}
                              <span className="font-mono">{asteroid.nasaId}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {closestApproach && (
                        <div className="bg-gray-800 bg-opacity-50 rounded-md p-3 md:min-w-[220px]">
                          <h5 className="font-medium text-white mb-2">Closest Approach</h5>
                          <p className="text-sm text-amber-400 font-mono mb-1">
                            {formatDate(closestApproach.closeApproachDate)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Distance:</span>{' '}
                            <span className="font-mono">{closestApproach.missDistanceLunar.toFixed(2)} LD</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Velocity:</span>{' '}
                            <span className="font-mono">
                              {Math.round(closestApproach.relativeVelocityKmh).toLocaleString()} km/h
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {approaches.length > 1 && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <h5 className="font-medium text-white mb-2">All Approaches ({approaches.length})</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {approaches.map((approach, i) => (
                            <div key={i} className="text-xs bg-gray-800 bg-opacity-30 rounded p-2">
                              <p className="text-amber-400 font-mono mb-1">
                                {formatDate(approach.closeApproachDate)}
                              </p>
                              <p className="text-muted-foreground">
                                Distance: <span className="font-mono">{approach.missDistanceLunar.toFixed(2)} LD</span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
