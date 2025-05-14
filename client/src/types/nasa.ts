// NASA APOD Types
export interface ApodResponse {
  id: number;
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  mediaType: string;
  copyright?: string;
  serviceVersion?: string;
}

// Mars Rover Types
export interface MarsRoverPhoto {
  id: number;
  nasaId: number;
  sol: number;
  earthDate: string;
  camera: string;
  imgSrc: string;
  rover: string;
}

export interface MarsRoverCamera {
  id: string;
  name: string;
  fullName: string;
}

// Near Earth Object Types
export interface NearEarthObject {
  id: number;
  nasaId: string;
  name: string;
  isPotentiallyHazardous: boolean;
  diameterMinKm: number;
  diameterMaxKm: number;
  absoluteMagnitude: number;
}

export interface CloseApproach {
  id: number;
  neoId: number;
  closeApproachDate: string;
  closeApproachDateFull: string;
  epochDateCloseApproach: number;
  relativeVelocityKmh: number;
  missDistanceKm: number;
  missDistanceLunar: number;
  orbitingBody: string;
}

export interface AsteroidData {
  elements: number;
  near_earth_objects: NearEarthObject[];
  close_approaches: CloseApproach[];
}

// For visualization
export interface AsteroidOrbit {
  id: number;
  size: number;
  color: string;
  animationDuration: number;
  orbitWidth: string;
  orbitHeight: string;
}

// Search types
export interface SearchParams {
  query?: string;
  category?: 'apod' | 'mars' | 'neo';
  startDate?: string;
  endDate?: string;
}

// Camera list for Mars Rover
export const MARS_CAMERAS: MarsRoverCamera[] = [
  { id: 'FHAZ', name: 'FHAZ', fullName: 'Front Hazard Avoidance Camera' },
  { id: 'RHAZ', name: 'RHAZ', fullName: 'Rear Hazard Avoidance Camera' },
  { id: 'MAST', name: 'MAST', fullName: 'Mast Camera' },
  { id: 'CHEMCAM', name: 'CHEMCAM', fullName: 'Chemistry and Camera Complex' },
  { id: 'MAHLI', name: 'MAHLI', fullName: 'Mars Hand Lens Imager' },
  { id: 'MARDI', name: 'MARDI', fullName: 'Mars Descent Imager' },
  { id: 'NAVCAM', name: 'NAVCAM', fullName: 'Navigation Camera' }
];
