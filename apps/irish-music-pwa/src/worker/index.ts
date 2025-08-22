import { expose } from 'comlink';
import { db } from './db';
import { normalizeAllData } from './normalize';
import {
  searchTunes,
  listTunes,
  getTune,
  buildSearchIndex,
  invalidateSearchIndex,
} from './search';
import type {
  IngestInput,
  IngestResult,
  SearchOptions,
  ListOptions,
  TuneData,
  AliasData,
  TunePopularityData,
  RecordingData,
  TuneSetData,
} from './types';

class MusicWorkerAPI {
  async init(): Promise<void> {
    await db.open();
    console.log('Music database initialized');
  }

  async ingest(input: IngestInput): Promise<IngestResult> {
    const warnings: string[] = [];
    let data = input.data || {};

    // Download from URLs if provided
    if (input.urls && input.urls.length > 0) {
      for (const url of input.urls) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            warnings.push(`Failed to fetch ${url}: ${response.statusText}`);
            continue;
          }

          const jsonData = await response.json();

          // Try to determine data type from filename or content
          if (url.includes('tunes')) {
            data.tunes = [
              ...(data.tunes || []),
              ...(Array.isArray(jsonData) ? jsonData : [jsonData]),
            ];
          } else if (url.includes('aliases')) {
            data.aliases = [
              ...(data.aliases || []),
              ...(Array.isArray(jsonData) ? jsonData : [jsonData]),
            ];
          } else if (url.includes('popularity')) {
            data.popularity = [
              ...(data.popularity || []),
              ...(Array.isArray(jsonData) ? jsonData : [jsonData]),
            ];
          } else if (url.includes('recordings')) {
            data.recordings = [
              ...(data.recordings || []),
              ...(Array.isArray(jsonData) ? jsonData : [jsonData]),
            ];
          } else if (url.includes('sets')) {
            data.sets = [
              ...(data.sets || []),
              ...(Array.isArray(jsonData) ? jsonData : [jsonData]),
            ];
          } else {
            warnings.push(`Unknown data type for URL: ${url}`);
          }
        } catch (error) {
          warnings.push(
            `Error fetching ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }
    }

    // Normalize all data
    const normalized = normalizeAllData(data);
    warnings.push(...normalized.warnings);

    // Store in database using transaction
    await db.transaction(
      'rw',
      [db.tunes, db.recordings, db.aliases, db.popularity, db.sets],
      async () => {
        // Clear existing data (or we could merge based on IDs)
        if (normalized.tunes.length > 0) {
          await db.tunes.clear();
          await db.tunes.bulkAdd(normalized.tunes);
        }

        if (normalized.recordings.length > 0) {
          await db.recordings.clear();
          await db.recordings.bulkAdd(normalized.recordings);
        }

        if (normalized.aliases.length > 0) {
          await db.aliases.clear();
          await db.aliases.bulkAdd(normalized.aliases);
        }

        if (normalized.popularity.length > 0) {
          await db.popularity.clear();
          await db.popularity.bulkAdd(normalized.popularity);
        }

        if (normalized.sets.length > 0) {
          await db.sets.clear();
          await db.sets.bulkAdd(normalized.sets);
        }
      }
    );

    // Rebuild search index
    if (normalized.tunes.length > 0) {
      buildSearchIndex(normalized.tunes);
    }

    const counts = {
      tunes: normalized.tunes.length,
      recordings: normalized.recordings.length,
      aliases: normalized.aliases.length,
      popularity: normalized.popularity.length,
      sets: normalized.sets.length,
    };

    return { counts, warnings };
  }

  async searchTunes(query: string, options: SearchOptions = {}) {
    return searchTunes(query, options);
  }

  async getTune(id: string) {
    return getTune(id);
  }

  async listTunes(options: ListOptions = {}) {
    return listTunes(options);
  }

  async clear(): Promise<void> {
    await db.transaction(
      'rw',
      [db.tunes, db.recordings, db.aliases, db.popularity, db.sets],
      async () => {
        await db.tunes.clear();
        await db.recordings.clear();
        await db.aliases.clear();
        await db.popularity.clear();
        await db.sets.clear();
      }
    );

    invalidateSearchIndex();
  }
}

const api = new MusicWorkerAPI();

// Initialize on worker startup
api.init().catch(console.error);

// Expose API via Comlink
expose(api);
