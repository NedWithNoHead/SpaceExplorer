import axios from "axios";
import NodeCache from "node-cache";
import { 
  InsertApod, 
  InsertMarsRoverPhoto,
  InsertNearEarthObject,
  InsertCloseApproach
} from "@shared/schema";

// Cache for API responses with TTL of 1 hour
const apiCache = new NodeCache({ stdTTL: 3600 });

// Get NASA API key from environment variables
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

// Base URLs for NASA APIs
const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod";
const NASA_MARS_ROVER_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos";
const NASA_NEO_URL = "https://api.nasa.gov/neo/rest/v1/feed";

// Fetch APOD (Astronomy Picture of the Day)
export async function getApod(date?: string): Promise<InsertApod> {
  const cacheKey = `apod_${date || 'today'}`;
  const cached = apiCache.get<InsertApod>(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const params: Record<string, string> = { api_key: NASA_API_KEY };
    if (date) {
      params.date = date;
    }
    
    const response = await axios.get(NASA_APOD_URL, { params });
    
    const apod: InsertApod = {
      date: new Date(response.data.date),
      title: response.data.title,
      explanation: response.data.explanation,
      url: response.data.url,
      hdurl: response.data.hdurl || null,
      mediaType: response.data.media_type,
      copyright: response.data.copyright || null,
      serviceVersion: response.data.service_version || null
    };
    
    apiCache.set(cacheKey, apod);
    return apod;
  } catch (error) {
    console.error("Error fetching APOD:", error);
    throw new Error("Failed to fetch Astronomy Picture of the Day");
  }
}

// Fetch APOD for a date range
export async function getApodRange(startDate: string, endDate: string): Promise<InsertApod[]> {
  const cacheKey = `apod_range_${startDate}_${endDate}`;
  const cached = apiCache.get<InsertApod[]>(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await axios.get(NASA_APOD_URL, {
      params: {
        api_key: NASA_API_KEY,
        start_date: startDate,
        end_date: endDate
      }
    });
    
    const apods: InsertApod[] = response.data.map((item: any) => ({
      date: new Date(item.date),
      title: item.title,
      explanation: item.explanation,
      url: item.url,
      hdurl: item.hdurl || null,
      mediaType: item.media_type,
      copyright: item.copyright || null,
      serviceVersion: item.service_version || null
    }));
    
    apiCache.set(cacheKey, apods);
    return apods;
  } catch (error) {
    console.error("Error fetching APOD range:", error);
    throw new Error("Failed to fetch Astronomy Pictures for the specified date range");
  }
}

// Fetch Mars Rover Photos
export async function getMarsRoverPhotos(
  sol?: number,
  earthDate?: string,
  camera?: string
): Promise<InsertMarsRoverPhoto[]> {
  const cacheKey = `mars_${sol || ''}_${earthDate || ''}_${camera || ''}`;
  const cached = apiCache.get<InsertMarsRoverPhoto[]>(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const params: Record<string, string | number> = { api_key: NASA_API_KEY };
    
    if (sol !== undefined) {
      params.sol = sol;
    } else if (earthDate) {
      params.earth_date = earthDate;
    } else {
      // Default to latest photos if no filters provided
      params.sol = 1000;
    }
    
    if (camera) {
      params.camera = camera;
    }
    
    const response = await axios.get(NASA_MARS_ROVER_URL, { params });
    
    const photos: InsertMarsRoverPhoto[] = response.data.photos.map((photo: any) => ({
      nasaId: photo.id,
      sol: photo.sol,
      earthDate: new Date(photo.earth_date),
      camera: photo.camera.name,
      imgSrc: photo.img_src,
      rover: photo.rover.name
    }));
    
    apiCache.set(cacheKey, photos);
    return photos;
  } catch (error) {
    console.error("Error fetching Mars Rover photos:", error);
    throw new Error("Failed to fetch Mars Rover photos");
  }
}

// Fetch Near Earth Objects
export async function getNearEarthObjects(
  startDate: string,
  endDate?: string
): Promise<{
  objects: InsertNearEarthObject[],
  approaches: InsertCloseApproach[]
}> {
  const actualEndDate = endDate || startDate;
  const cacheKey = `neo_${startDate}_${actualEndDate}`;
  const cached = apiCache.get<{
    objects: InsertNearEarthObject[],
    approaches: InsertCloseApproach[]
  }>(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await axios.get(NASA_NEO_URL, {
      params: {
        api_key: NASA_API_KEY,
        start_date: startDate,
        end_date: actualEndDate
      }
    });
    
    const objects: InsertNearEarthObject[] = [];
    const approaches: InsertCloseApproach[] = [];
    const neoIdMap = new Map<string, number>(); // Maps NASA ID to our neoId
    let neoIdCounter = 1;
    
    // Process the near earth objects data
    Object.values(response.data.near_earth_objects).forEach((dailyNeos: any) => {
      dailyNeos.forEach((neo: any) => {
        const nasaId = neo.id;
        let neoId: number;
        
        if (neoIdMap.has(nasaId)) {
          neoId = neoIdMap.get(nasaId)!;
        } else {
          neoId = neoIdCounter++;
          neoIdMap.set(nasaId, neoId);
          
          const diameterData = neo.estimated_diameter.kilometers;
          
          objects.push({
            nasaId,
            name: neo.name,
            isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
            diameterMinKm: diameterData.estimated_diameter_min,
            diameterMaxKm: diameterData.estimated_diameter_max,
            absoluteMagnitude: neo.absolute_magnitude_h
          });
        }
        
        // Process close approach data
        neo.close_approach_data.forEach((approach: any) => {
          approaches.push({
            neoId,
            closeApproachDate: new Date(approach.close_approach_date),
            closeApproachDateFull: new Date(approach.close_approach_date_full),
            epochDateCloseApproach: approach.epoch_date_close_approach,
            relativeVelocityKmh: parseFloat(approach.relative_velocity.kilometers_per_hour),
            missDistanceKm: parseFloat(approach.miss_distance.kilometers),
            missDistanceLunar: parseFloat(approach.miss_distance.lunar),
            orbitingBody: approach.orbiting_body
          });
        });
      });
    });
    
    const result = { objects, approaches };
    apiCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error fetching Near Earth Objects:", error);
    throw new Error("Failed to fetch Near Earth Objects data");
  }
}
