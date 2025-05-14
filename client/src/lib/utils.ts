import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a more readable format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Truncate a string to a specific length
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Calculate the average diameter of an asteroid in kilometers or meters
 */
export function calculateAvgDiameter(minKm: number, maxKm: number): string {
  const avgDiameter = (minKm + maxKm) / 2;
  return avgDiameter < 1 
    ? `${Math.round(avgDiameter * 1000)}m` 
    : `${avgDiameter.toFixed(1)}km`;
}

/**
 * Format a large number with commas (e.g., 1,234,567)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Get random elements from an array
 */
export function getRandomElements<T>(array: T[], count: number): T[] {
  if (count >= array.length) return [...array];
  
  const result: T[] = [];
  const used = new Set<number>();
  
  while (result.length < count) {
    const index = Math.floor(Math.random() * array.length);
    if (!used.has(index)) {
      used.add(index);
      result.push(array[index]);
    }
  }
  
  return result;
}

/**
 * Determine hazard level color by lunar distance
 */
export function getHazardColor(
  isHazardous: boolean, 
  lunarDistance?: number
): string {
  if (isHazardous) return '#ef4444'; // Red
  if (lunarDistance && lunarDistance < 3) return '#ef4444'; // Red
  if (lunarDistance && lunarDistance < 7) return '#f59e0b'; // Amber
  return '#10b981'; // Green
}
