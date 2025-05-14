import { pgTable, text, serial, integer, boolean, date, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (kept from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// NASA APOD (Astronomy Picture of the Day)
export const apodItems = pgTable("apod_items", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  title: text("title").notNull(),
  explanation: text("explanation").notNull(),
  url: text("url").notNull(),
  hdurl: text("hdurl"),
  mediaType: text("media_type").notNull(),
  copyright: text("copyright"),
  serviceVersion: text("service_version")
});

export const insertApodSchema = createInsertSchema(apodItems).omit({
  id: true
});

export type InsertApod = z.infer<typeof insertApodSchema>;
export type Apod = typeof apodItems.$inferSelect;

// Mars Rover Photos
export const marsRoverPhotos = pgTable("mars_rover_photos", {
  id: serial("id").primaryKey(),
  nasaId: integer("nasa_id").notNull().unique(),
  sol: integer("sol").notNull(),
  earthDate: date("earth_date").notNull(),
  camera: text("camera").notNull(),
  imgSrc: text("img_src").notNull(),
  rover: text("rover").notNull()
});

export const insertMarsRoverPhotoSchema = createInsertSchema(marsRoverPhotos).omit({
  id: true
});

export type InsertMarsRoverPhoto = z.infer<typeof insertMarsRoverPhotoSchema>;
export type MarsRoverPhoto = typeof marsRoverPhotos.$inferSelect;

// Near Earth Objects
export const nearEarthObjects = pgTable("near_earth_objects", {
  id: serial("id").primaryKey(),
  nasaId: text("nasa_id").notNull().unique(),
  name: text("name").notNull(),
  isPotentiallyHazardous: boolean("is_potentially_hazardous").notNull(),
  diameterMinKm: doublePrecision("diameter_min_km").notNull(),
  diameterMaxKm: doublePrecision("diameter_max_km").notNull(),
  absoluteMagnitude: doublePrecision("absolute_magnitude").notNull()
});

export const insertNearEarthObjectSchema = createInsertSchema(nearEarthObjects).omit({
  id: true
});

export type InsertNearEarthObject = z.infer<typeof insertNearEarthObjectSchema>;
export type NearEarthObject = typeof nearEarthObjects.$inferSelect;

// Close Approaches for Near Earth Objects
export const closeApproaches = pgTable("close_approaches", {
  id: serial("id").primaryKey(),
  neoId: integer("neo_id").notNull(),
  closeApproachDate: date("close_approach_date").notNull(),
  closeApproachDateFull: timestamp("close_approach_date_full").notNull(),
  epochDateCloseApproach: integer("epoch_date_close_approach").notNull(),
  relativeVelocityKmh: doublePrecision("relative_velocity_kmh").notNull(),
  missDistanceKm: doublePrecision("miss_distance_km").notNull(),
  missDistanceLunar: doublePrecision("miss_distance_lunar").notNull(),
  orbitingBody: text("orbiting_body").notNull()
});

export const insertCloseApproachSchema = createInsertSchema(closeApproaches).omit({
  id: true
});

export type InsertCloseApproach = z.infer<typeof insertCloseApproachSchema>;
export type CloseApproach = typeof closeApproaches.$inferSelect;
