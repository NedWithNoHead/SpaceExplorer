import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  getApod, 
  getApodRange, 
  getMarsRoverPhotos,
  getNearEarthObjects 
} from "./services/nasaService";

export async function registerRoutes(app: Express): Promise<Server> {
  // NASA API routes
  
  // APOD routes
  app.get("/api/apod", async (req: Request, res: Response) => {
    try {
      const date = req.query.date as string | undefined;
      
      // Check if we already have this APOD in storage
      if (date) {
        const storedApod = await storage.getApodByDate(date);
        if (storedApod) {
          return res.json(storedApod);
        }
      }
      
      // Fetch from NASA API
      const apodData = await getApod(date);
      const savedApod = await storage.saveApod(apodData);
      
      res.json(savedApod);
    } catch (error) {
      console.error("Error in APOD API:", error);
      res.status(500).json({ message: "Failed to fetch APOD data" });
    }
  });
  
  // APOD range/search route
  app.get("/api/apod/search", async (req: Request, res: Response) => {
    try {
      const { startDate, endDate, start_date, end_date } = req.query;
      
      // Support both camelCase and snake_case parameters for compatibility
      const effectiveStartDate = (startDate || start_date) as string;
      const effectiveEndDate = (endDate || end_date) as string;
      
      if (!effectiveStartDate) {
        return res.status(400).json({ message: "startDate is required" });
      }
      
      const finalEndDate = effectiveEndDate || effectiveStartDate;
      
      // Try to get from storage first
      const storedApods = await storage.getApodRange(
        effectiveStartDate as string, 
        finalEndDate as string
      );
      if (storedApods.length > 0) {
        return res.json(storedApods);
      }
      
      // Fetch from NASA API
      const apodData = await getApodRange(
        effectiveStartDate as string, 
        finalEndDate as string
      );
      
      // Save all APODs to storage
      const savedApods = await Promise.all(
        apodData.map(apod => storage.saveApod(apod))
      );
      
      res.json(savedApods);
    } catch (error) {
      console.error("Error in APOD range API:", error);
      res.status(500).json({ message: "Failed to fetch APOD range data" });
    }
  });
  
  // Mars Rover Photos route
  app.get("/api/mars/photos", async (req: Request, res: Response) => {
    try {
      const { sol, earth_date, camera } = req.query;
      
      // Convert query parameters
      const solParam = sol ? parseInt(sol as string) : undefined;
      const earthDateParam = earth_date as string | undefined;
      const cameraParam = camera as string | undefined;
      
      // Try to get from storage first
      const storedPhotos = await storage.getMarsRoverPhotosByFilter(
        solParam, 
        earthDateParam, 
        cameraParam
      );
      
      if (storedPhotos.length > 0) {
        return res.json(storedPhotos);
      }
      
      // Fetch from NASA API
      const marsPhotos = await getMarsRoverPhotos(solParam, earthDateParam, cameraParam);
      
      // Save photos to storage
      const savedPhotos = await Promise.all(
        marsPhotos.map(photo => storage.saveMarsRoverPhoto(photo))
      );
      
      res.json(savedPhotos);
    } catch (error) {
      console.error("Error in Mars Rover Photos API:", error);
      res.status(500).json({ message: "Failed to fetch Mars Rover photos" });
    }
  });
  
  // Near Earth Objects (Asteroids) route
  app.get("/api/neo", async (req: Request, res: Response) => {
    try {
      const { start_date, end_date } = req.query;
      
      if (!start_date) {
        return res.status(400).json({ message: "start_date is required" });
      }
      
      const startDate = start_date as string;
      const endDate = (end_date as string) || startDate;
      
      // Try to get from storage first
      const storedNeos = await storage.getNearEarthObjectsByDateRange(startDate, endDate);
      const storedApproaches = await storage.getCloseApproachesInDateRange(startDate, endDate);
      
      if (storedNeos.length > 0 && storedApproaches.length > 0) {
        return res.json({
          elements: storedNeos.length,
          near_earth_objects: storedNeos,
          close_approaches: storedApproaches
        });
      }
      
      // Fetch from NASA API
      const { objects, approaches } = await getNearEarthObjects(startDate, endDate);
      
      // Save to storage
      const savedNeos = await Promise.all(
        objects.map(neo => storage.saveNearEarthObject(neo))
      );
      
      const savedApproaches = await Promise.all(
        approaches.map(approach => storage.saveCloseApproach(approach))
      );
      
      res.json({
        elements: savedNeos.length,
        near_earth_objects: savedNeos,
        close_approaches: savedApproaches
      });
    } catch (error) {
      console.error("Error in Near Earth Objects API:", error);
      res.status(500).json({ message: "Failed to fetch Near Earth Objects data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
