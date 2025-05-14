import { 
  users, type User, type InsertUser, 
  apodItems, type Apod, type InsertApod,
  marsRoverPhotos, type MarsRoverPhoto, type InsertMarsRoverPhoto,
  nearEarthObjects, type NearEarthObject, type InsertNearEarthObject,
  closeApproaches, type CloseApproach, type InsertCloseApproach
} from "@shared/schema";

// Modified interface with CRUD methods for NASA data
export interface IStorage {
  // User methods (kept from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // APOD methods
  getApodByDate(date: string): Promise<Apod | undefined>;
  getApodRange(startDate: string, endDate: string): Promise<Apod[]>;
  saveApod(apod: InsertApod): Promise<Apod>;
  
  // Mars Rover Photo methods
  getMarsRoverPhotosByFilter(sol?: number, earthDate?: string, camera?: string): Promise<MarsRoverPhoto[]>;
  saveMarsRoverPhoto(photo: InsertMarsRoverPhoto): Promise<MarsRoverPhoto>;
  
  // Near Earth Object methods
  getNearEarthObjectsByDateRange(startDate: string, endDate: string): Promise<NearEarthObject[]>;
  getNearEarthObjectById(id: string): Promise<NearEarthObject | undefined>;
  saveNearEarthObject(neo: InsertNearEarthObject): Promise<NearEarthObject>;
  
  // Close Approach methods
  getCloseApproachesByNeoId(neoId: number): Promise<CloseApproach[]>;
  getCloseApproachesInDateRange(startDate: string, endDate: string): Promise<CloseApproach[]>;
  saveCloseApproach(approach: InsertCloseApproach): Promise<CloseApproach>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private apods: Map<string, Apod>; // date -> APOD
  private marsPhotos: Map<number, MarsRoverPhoto>; // id -> MarsRoverPhoto
  private neos: Map<string, NearEarthObject>; // nasaId -> NearEarthObject
  private approaches: Map<number, CloseApproach>; // id -> CloseApproach
  currentId: number;
  currentApodId: number;
  currentMarsPhotoId: number;
  currentNeoId: number;
  currentApproachId: number;

  constructor() {
    this.users = new Map();
    this.apods = new Map();
    this.marsPhotos = new Map();
    this.neos = new Map();
    this.approaches = new Map();
    this.currentId = 1;
    this.currentApodId = 1;
    this.currentMarsPhotoId = 1;
    this.currentNeoId = 1;
    this.currentApproachId = 1;
  }

  // User methods (kept from original)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // APOD methods
  async getApodByDate(date: string): Promise<Apod | undefined> {
    return this.apods.get(date);
  }

  async getApodRange(startDate: string, endDate: string): Promise<Apod[]> {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return Array.from(this.apods.values()).filter(apod => {
      const apodDate = new Date(apod.date).getTime();
      return apodDate >= start && apodDate <= end;
    });
  }

  async saveApod(insertApod: InsertApod): Promise<Apod> {
    const id = this.currentApodId++;
    const apod: Apod = { ...insertApod, id };
    this.apods.set(apod.date.toString(), apod);
    return apod;
  }

  // Mars Rover Photo methods
  async getMarsRoverPhotosByFilter(sol?: number, earthDate?: string, camera?: string): Promise<MarsRoverPhoto[]> {
    return Array.from(this.marsPhotos.values()).filter(photo => {
      if (sol !== undefined && photo.sol !== sol) return false;
      if (earthDate !== undefined && photo.earthDate.toString() !== earthDate) return false;
      if (camera !== undefined && photo.camera !== camera) return false;
      return true;
    });
  }

  async saveMarsRoverPhoto(insertPhoto: InsertMarsRoverPhoto): Promise<MarsRoverPhoto> {
    const id = this.currentMarsPhotoId++;
    const photo: MarsRoverPhoto = { ...insertPhoto, id };
    this.marsPhotos.set(id, photo);
    return photo;
  }

  // Near Earth Object methods
  async getNearEarthObjectsByDateRange(startDate: string, endDate: string): Promise<NearEarthObject[]> {
    // For in-memory implementation, we'll return all NEOs
    // In a real DB implementation, this would filter by close approach dates
    return Array.from(this.neos.values());
  }

  async getNearEarthObjectById(nasaId: string): Promise<NearEarthObject | undefined> {
    return this.neos.get(nasaId);
  }

  async saveNearEarthObject(insertNeo: InsertNearEarthObject): Promise<NearEarthObject> {
    const id = this.currentNeoId++;
    const neo: NearEarthObject = { ...insertNeo, id };
    this.neos.set(neo.nasaId, neo);
    return neo;
  }

  // Close Approach methods
  async getCloseApproachesByNeoId(neoId: number): Promise<CloseApproach[]> {
    return Array.from(this.approaches.values()).filter(approach => approach.neoId === neoId);
  }

  async getCloseApproachesInDateRange(startDate: string, endDate: string): Promise<CloseApproach[]> {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return Array.from(this.approaches.values()).filter(approach => {
      const approachDate = new Date(approach.closeApproachDate).getTime();
      return approachDate >= start && approachDate <= end;
    });
  }

  async saveCloseApproach(insertApproach: InsertCloseApproach): Promise<CloseApproach> {
    const id = this.currentApproachId++;
    const approach: CloseApproach = { ...insertApproach, id };
    this.approaches.set(id, approach);
    return approach;
  }
}

export const storage = new MemStorage();
