import { ApodResponse, MarsRoverPhoto, AsteroidData, SearchParams } from '@/types/nasa';
import { apiRequest } from '@/lib/queryClient';

// APOD API
export const fetchApod = async (date?: string): Promise<ApodResponse> => {
  const endpoint = date ? `/api/apod?date=${date}` : '/api/apod';
  const response = await apiRequest('GET', endpoint);
  return response.json();
};

export const searchApod = async (startDate: string, endDate?: string): Promise<ApodResponse[]> => {
  const endpoint = `/api/apod/search?startDate=${startDate}${endDate ? `&endDate=${endDate}` : ''}`;
  const response = await apiRequest('GET', endpoint);
  return response.json();
};

// Mars Rover API
export const fetchMarsPhotos = async (
  sol?: number,
  earthDate?: string,
  camera?: string
): Promise<MarsRoverPhoto[]> => {
  let endpoint = `/api/mars/photos?`;
  
  const params = new URLSearchParams();
  if (sol !== undefined) params.append('sol', sol.toString());
  if (earthDate) params.append('earth_date', earthDate);
  if (camera) params.append('camera', camera);
  
  endpoint += params.toString();
  
  const response = await apiRequest('GET', endpoint);
  return response.json();
};

// Near Earth Objects API
export const fetchAsteroids = async (
  startDate: string,
  endDate?: string
): Promise<AsteroidData> => {
  const endpoint = `/api/neo?start_date=${startDate}${endDate ? `&end_date=${endDate}` : ''}`;
  const response = await apiRequest('GET', endpoint);
  return response.json();
};

// Search API (combines multiple endpoints)
export const searchSpace = async (params: SearchParams): Promise<any> => {
  const { category, query, startDate, endDate } = params;
  
  if (!category || !startDate) {
    throw new Error('Category and start date are required for search');
  }
  
  switch (category) {
    case 'apod':
      return searchApod(startDate, endDate);
    case 'mars':
      return fetchMarsPhotos(undefined, startDate, undefined);
    case 'neo':
      return fetchAsteroids(startDate, endDate);
    default:
      throw new Error('Invalid category specified');
  }
};
