/**
 * Types for @tunebook/data-processing
 */

/** Configuration for data processing helpers */
export interface DataProcessingConfig {
  /** Path to the raw JSON file containing tunes */
  sourcePath: string;
}

/** Raw tune as downloaded from TheSession.org */
export interface RawTune {
  id: number;
  name: string;
  type: string;
  meter?: string;
  mode?: string;
  key?: string;
  [key: string]: unknown;
}

/** Simplified tune record ready for database insertion */
export interface TuneRecord {
  thesession_id: number;
  title: string;
  type: string;
  meter: string | null;
  mode: string | null;
  key: string | null;
}
