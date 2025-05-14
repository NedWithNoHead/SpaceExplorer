import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchParams } from '@/types/nasa';

interface SearchFormProps {
  defaultCategory?: 'apod' | 'mars' | 'neo';
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
}

export default function SearchForm({ defaultCategory, onSearch, isLoading = false }: SearchFormProps) {
  const [, setLocation] = useLocation();
  
  // Format today's date for the date picker max value
  const today = new Date().toISOString().split('T')[0];
  
  // Set default start date to one week ago
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const defaultStartDate = oneWeekAgo.toISOString().split('T')[0];
  
  // Form state
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'apod' | 'mars' | 'neo'>(defaultCategory || 'apod');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(today);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date cannot be after end date');
      return;
    }
    
    // Execute search
    onSearch({
      query: query.trim() || undefined,
      category,
      startDate,
      endDate
    });
  };
  
  return (
    <Card className="bg-gray bg-opacity-30 rounded-xl p-6 border border-gray-800 mb-8">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Label htmlFor="search-query" className="block text-white mb-2">Search Query</Label>
              <Input 
                id="search-query" 
                placeholder="E.g. galaxy, nebula, mars..." 
                className="w-full bg-space-black border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="search-category" className="block text-white mb-2">Category</Label>
              <Select 
                value={category} 
                onValueChange={(value: 'apod' | 'mars' | 'neo') => setCategory(value)}
              >
                <SelectTrigger className="bg-space-black border border-gray-700 text-white focus:border-primary focus:ring-1 focus:ring-primary h-[46px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apod">APOD</SelectItem>
                  <SelectItem value="mars">Mars Rover</SelectItem>
                  <SelectItem value="neo">Asteroids</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Label htmlFor="search-date-from" className="block text-white mb-2">From Date</Label>
              <Input 
                id="search-date-from" 
                type="date"
                className="w-full bg-space-black border border-gray-700 rounded px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={today}
              />
            </div>
            <div className="w-full md:w-1/2">
              <Label htmlFor="search-date-to" className="block text-white mb-2">To Date</Label>
              <Input 
                id="search-date-to"
                type="date"
                className="w-full bg-space-black border border-gray-700 rounded px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={today}
              />
            </div>
          </div>

          <Button 
            type="submit"
            className="bg-primary hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors w-full flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search Space Archives
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
