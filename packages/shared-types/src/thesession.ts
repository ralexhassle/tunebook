/**
 * TypeScript interfaces for TheSession.org data
 * Based on data analysis from TheSession-data repository
 */

// Import real enums from data analysis
import { TuneType } from './enums';

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Represents a traditional Irish music tune with its settings
 */
export interface Tune {
  /** Unique identifier for the tune */
  tune_id: string;
  /** Unique identifier for this specific setting/version */
  setting_id: string;
  /** Name of the tune */
  name: string;
  /** Type of tune (reel, jig, hornpipe, etc.) */
  type: TuneType;
  /** Musical meter (4/4, 6/8, 9/8, etc.) */
  meter: string; // Keep as string since data has various formats
  /** Musical mode (Gmajor, Aminor, etc.) */
  mode: string; // Keep as string since data has various formats
  /** ABC notation for the tune */
  abc: string;
  /** Date when this setting was added */
  date: string;
  /** Username of the person who added this setting */
  username: string;
}

/**
 * Represents a recording of tunes on an album or collection
 */
export interface Recording {
  /** Unique identifier for the recording */
  id: string;
  /** Artist identifier */
  artist: string;
  /** Name of the recording/album */
  recording: string;
  /** Track number on the recording */
  track: string;
  /** Position number within the track */
  number: string;
  /** Name of the tune */
  tune: string;
  /** Reference to the tune ID (may be empty) */
  tune_id: string;
}

/**
 * Represents tune popularity based on tunebook appearances
 */
export interface TunePopularity {
  /** Name of the tune */
  name: string;
  /** Unique identifier for the tune */
  tune_id: string;
  /** Number of tunebooks containing this tune */
  tunebooks: string; // Note: stored as string in source data
}

/**
 * Represents alternative names/aliases for tunes
 */
export interface TuneAlias {
  /** Unique identifier for the tune */
  tune_id: string;
  /** Alternative name for the tune */
  alias: string;
  /** Canonical name of the tune */
  name: string;
}

// ============================================================================
// Enums and Types (imported from real data analysis)
// ============================================================================

// Re-export real enums from data analysis
export { TuneType, Meter, MusicalMode } from './enums';

// ============================================================================
// Normalized/Processed Types
// ============================================================================

/**
 * Normalized tune data for application use
 */
export interface NormalizedTune {
  /** Unique identifier for the tune */
  id: string;
  /** Primary name of the tune */
  name: string;
  /** Alternative names/aliases */
  aliases: string[];
  /** Type of tune */
  type: TuneType;
  /** Musical meter */
  meter: string;
  /** Musical key */
  key?: string;
  /** Musical mode */
  mode?: string;
  /** All settings/versions of this tune */
  settings: TuneSetting[];
  /** Popularity metrics */
  popularity: PopularityMetrics;
  /** Cross-references to related tunes */
  relatedTunes: string[];
  /** Metadata */
  metadata: TuneMetadata;
}

/**
 * Individual setting/version of a tune
 */
export interface TuneSetting {
  /** Unique identifier for this setting */
  id: string;
  /** ABC notation */
  abc: string;
  /** Date added */
  dateAdded: Date;
  /** Username of contributor */
  contributor: string;
  /** Musical mode for this setting */
  mode?: string;
}

/**
 * Popularity metrics for a tune
 */
export interface PopularityMetrics {
  /** Number of tunebooks containing this tune */
  tunebookCount: number;
  /** Number of recordings featuring this tune */
  recordingCount: number;
  /** Overall popularity score */
  popularityScore: number;
  /** Ranking among all tunes */
  rank?: number;
}

/**
 * Additional metadata for a tune
 */
export interface TuneMetadata {
  /** Date first added to the database */
  dateAdded: Date;
  /** Date last modified */
  lastModified: Date;
  /** Number of different settings */
  settingCount: number;
  /** Whether this tune has ABC notation */
  hasAbc: boolean;
  /** Source information */
  source?: string;
}

/**
 * Normalized recording/album data
 */
export interface NormalizedRecording {
  /** Unique identifier */
  id: string;
  /** Artist name */
  artist: string;
  /** Album/recording title */
  title: string;
  /** Tracks on this recording */
  tracks: RecordingTrack[];
  /** Metadata */
  metadata: RecordingMetadata;
}

/**
 * Individual track on a recording
 */
export interface RecordingTrack {
  /** Track number */
  trackNumber: number;
  /** Tunes on this track */
  tunes: RecordingTune[];
}

/**
 * Tune within a recording track
 */
export interface RecordingTune {
  /** Position within the track */
  position: number;
  /** Name of the tune */
  name: string;
  /** Reference to tune ID if available */
  tuneId?: string;
}

/**
 * Metadata for recordings
 */
export interface RecordingMetadata {
  /** Total number of tracks */
  trackCount: number;
  /** Total number of tunes */
  tuneCount: number;
  /** Whether all tunes are identified */
  fullyIdentified: boolean;
}

// ============================================================================
// Search and Filter Types
// ============================================================================

/**
 * Search criteria for tunes
 */
export interface TuneSearchCriteria {
  /** Text query for name/alias search */
  query?: string;
  /** Filter by tune type */
  type?: TuneType | TuneType[];
  /** Filter by musical key */
  key?: string | string[];
  /** Filter by musical mode */
  mode?: string | string[];
  /** Filter by meter */
  meter?: string | string[];
  /** Minimum popularity threshold */
  minPopularity?: number;
  /** Whether to include aliases in search */
  includeAliases?: boolean;
}

/**
 * Tune-specific sort criteria
 */
export interface TuneSortCriteria {
  /** Field to sort by */
  field: 'name' | 'popularity' | 'dateAdded' | 'type';
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Paginated search results for tunes
 */
export interface PaginatedTuneResults<T> {
  /** Results for current page */
  items: T[];
  /** Total number of results */
  total: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there are more pages */
  hasNext: boolean;
  /** Whether there are previous pages */
  hasPrevious: boolean;
}
