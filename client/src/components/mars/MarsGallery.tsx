import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MARS_CAMERAS, MarsRoverPhoto } from '@/types/nasa';
import { cn } from '@/lib/utils';
import { fetchMarsPhotos } from '@/services/apiService';

export default function MarsGallery() {
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  
  // Format today's date for the date picker max value
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch Mars rover photos with default parameters (enabled on mount)
  const { data: marsPhotos, isLoading, isError, refetch } = useQuery<MarsRoverPhoto[]>({
    queryKey: ['/api/mars/photos', selectedCamera, selectedDate],
    queryFn: () => fetchMarsPhotos(undefined, selectedDate || undefined, selectedCamera || undefined),
    enabled: true, // Fetch on mount
  });
  
  // Pagination
  const paginatedPhotos = marsPhotos ? marsPhotos.slice(0, page * itemsPerPage) : [];
  const hasMore = marsPhotos ? marsPhotos.length > page * itemsPerPage : false;
  
  // Load more photos
  const loadMore = () => {
    setPage(prev => prev + 1);
  };
  
  // Apply filters
  const applyFilters = () => {
    refetch();
  };
  
  // Select camera
  const handleCameraSelect = (camera: string) => {
    setSelectedCamera(camera === selectedCamera ? '' : camera);
  };
  
  return (
    <section id="mars" className="py-16 bg-space-black bg-opacity-60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Mars Rover Gallery
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the Martian surface through the eyes of NASA's Curiosity rover. Filter photos by camera type and date to witness the red planet up close.
          </p>
        </div>

        {/* Filter controls */}
        <div className="mb-8 bg-gray bg-opacity-30 rounded-lg p-4 md:p-6 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="w-full md:w-auto">
              <h3 className="text-white font-medium mb-2">Camera Type</h3>
              <div className="flex flex-wrap gap-2">
                {MARS_CAMERAS.map(camera => (
                  <button
                    key={camera.id}
                    className={cn(
                      "px-3 py-1.5 border border-gray-600 rounded text-sm hover:bg-primary hover:text-white hover:border-primary transition-colors",
                      selectedCamera === camera.id && "bg-primary text-white border-primary"
                    )}
                    onClick={() => handleCameraSelect(camera.id)}
                    title={camera.fullName}
                  >
                    {camera.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              <h3 className="text-white font-medium mb-2">Earth Date</h3>
              <div className="flex gap-2">
                <input 
                  type="date" 
                  className="bg-space-black border border-gray-600 rounded px-3 py-1.5 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={today}
                />
                <Button
                  className="bg-primary hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm transition-colors"
                  onClick={applyFilters}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mars Photos Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray bg-opacity-30 border border-gray-800 rounded-lg overflow-hidden">
                <Skeleton className="h-60 w-full" />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Skeleton className="h-6 w-16 mb-2" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center p-8 bg-gray bg-opacity-30 rounded-lg border border-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3 className="mt-4 text-xl font-bold text-white">Failed to Load Photos</h3>
            <p className="mt-2 text-muted-foreground">
              We couldn't load the Mars Rover photos. Please try again or select different filters.
            </p>
            <Button className="mt-4" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        ) : !marsPhotos || marsPhotos.length === 0 ? (
          <div className="text-center p-8 bg-gray bg-opacity-30 rounded-lg border border-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path>
            </svg>
            <h3 className="mt-4 text-xl font-bold text-white">No Photos Found</h3>
            <p className="mt-2 text-muted-foreground">
              {selectedCamera || selectedDate 
                ? "No photos match your filter criteria. Try different filters."
                : "No Mars Rover photos available. Please try again later."}
            </p>
            <Button className="mt-4" onClick={applyFilters}>
              {selectedCamera || selectedDate ? "Try Different Filters" : "Retry Loading Photos"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPhotos.map((photo) => (
              <Card 
                key={photo.id} 
                className="bg-gray bg-opacity-30 border border-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300"
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer">
                      <img 
                        src={photo.imgSrc} 
                        alt={`Mars surface captured by ${photo.camera} camera`} 
                        className="w-full h-60 object-cover"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <div className="aspect-w-16 aspect-h-9">
                      <img 
                        src={photo.imgSrc} 
                        alt={`Mars surface captured by ${photo.camera} camera`} 
                        className="w-full object-contain"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-bold">Photo Details</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-sm">Rover: <span className="font-semibold">{photo.rover}</span></p>
                          <p className="text-sm">Camera: <span className="font-semibold">{photo.camera}</span></p>
                        </div>
                        <div>
                          <p className="text-sm">Sol: <span className="font-semibold">{photo.sol}</span></p>
                          <p className="text-sm">Earth Date: <span className="font-semibold">{new Date(photo.earthDate).toLocaleDateString()}</span></p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded">{photo.camera}</span>
                      <h4 className="text-white font-medium mt-2">Mars Sol: <span className="font-mono">{photo.sol}</span></h4>
                    </div>
                    <span className="text-muted-foreground text-sm">{new Date(photo.earthDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-muted-foreground text-xs">Photo ID: <span className="font-mono">{photo.nasaId}</span></span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-amber-400 hover:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <polyline points="9 21 3 21 3 15"></polyline>
                            <line x1="21" y1="3" x2="14" y2="10"></line>
                            <line x1="3" y1="21" x2="10" y2="14"></line>
                          </svg>
                        </button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="mt-8 text-center">
            <Button 
              className="bg-primary hover:bg-blue-800 text-white px-5 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center mx-auto"
              onClick={loadMore}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
              Load More Photos
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
