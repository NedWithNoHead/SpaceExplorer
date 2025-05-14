import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SearchForm from '@/components/search/SearchForm';
import SearchResults from '@/components/search/SearchResults';
import { searchSpace } from '@/services/apiService';
import { SearchParams } from '@/types/nasa';

export default function SearchPage() {
  const [location] = useLocation();
  
  // Parse query parameters from URL
  const params = new URLSearchParams(location.split('?')[1]);
  const defaultCategory = params.get('category') as 'apod' | 'mars' | 'neo' | undefined;
  
  // State for search parameters
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  
  // Search query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/search', searchParams?.category, searchParams?.startDate, searchParams?.endDate, searchParams?.query],
    queryFn: () => searchSpace(searchParams!),
    enabled: !!searchParams,
  });

  // Handle search submission
  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  return (
    <>
      <Helmet>
        <title>Search Space Archives - Space Explorer</title>
        <meta name="description" content="Search through NASA's collection of space imagery and data including historical Astronomy Pictures of the Day, Mars Rover photos, and asteroid information." />
        <meta property="og:title" content="Search Space Archives - Space Explorer" />
        <meta property="og:description" content="Search NASA's space imagery archive by date, category, and keywords." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="relative flex flex-col min-h-screen overflow-hidden bg-space-black">
        <Navigation />
        
        <main className="flex-grow">
          <section id="search" className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Search Space Archives
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Search through NASA's extensive collection of space imagery and data including historical Astronomy Pictures of the Day.
                  </p>
                </div>

                {/* Search Form */}
                <SearchForm 
                  defaultCategory={defaultCategory} 
                  onSearch={handleSearch} 
                  isLoading={isLoading}
                />

                {/* Search Results */}
                <SearchResults 
                  data={data}
                  isLoading={isLoading} 
                  isError={isError}
                  searchPerformed={!!searchParams}
                  searchCategory={searchParams?.category}
                />
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
