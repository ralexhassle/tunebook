#!/usr/bin/env ts-node

/**
 * Search utilities using the new enums and types
 */

import { readTunesData } from '../utils/data-reader';
import { TuneData } from '../types';
import {
  TuneType,
  TuneMode,
  TimeSignature,
  isValidTuneType,
  isValidTuneMode,
  isValidTimeSignature,
} from '../enums';

export interface SearchFilters {
  type?: TuneType;
  mode?: TuneMode;
  meter?: TimeSignature;
  name?: string;
  username?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchResult {
  tunes: TuneData[];
  totalCount: number;
  filters: SearchFilters;
  searchTime: number;
}

export class TuneSearchEngine {
  private tunes: TuneData[];

  constructor() {
    this.tunes = readTunesData();
  }

  /**
   * Search tunes with filters
   */
  search(filters: SearchFilters, limit?: number): SearchResult {
    const startTime = Date.now();

    let filteredTunes = this.tunes;

    // Filter by type
    if (filters.type && isValidTuneType(filters.type)) {
      filteredTunes = filteredTunes.filter(
        (tune) => tune.type === filters.type
      );
    }

    // Filter by mode
    if (filters.mode && isValidTuneMode(filters.mode)) {
      filteredTunes = filteredTunes.filter(
        (tune) => tune.mode === filters.mode
      );
    }

    // Filter by meter
    if (filters.meter && isValidTimeSignature(filters.meter)) {
      filteredTunes = filteredTunes.filter(
        (tune) => tune.meter === filters.meter
      );
    }

    // Filter by name (case-insensitive partial match)
    if (filters.name) {
      const searchName = filters.name.toLowerCase();
      filteredTunes = filteredTunes.filter((tune) =>
        tune.name.toLowerCase().includes(searchName)
      );
    }

    // Filter by username
    if (filters.username) {
      const searchUsername = filters.username.toLowerCase();
      filteredTunes = filteredTunes.filter((tune) =>
        tune.username.toLowerCase().includes(searchUsername)
      );
    }

    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      filteredTunes = filteredTunes.filter((tune) => {
        const tuneDate = new Date(tune.date);

        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (tuneDate < fromDate) return false;
        }

        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (tuneDate > toDate) return false;
        }

        return true;
      });
    }

    const totalCount = filteredTunes.length;
    const resultTunes = limit ? filteredTunes.slice(0, limit) : filteredTunes;
    const searchTime = Date.now() - startTime;

    return {
      tunes: resultTunes,
      totalCount,
      filters,
      searchTime,
    };
  }

  /**
   * Get popular tunes by type
   */
  getPopularByType(type: TuneType, limit: number = 10): TuneData[] {
    if (!isValidTuneType(type)) {
      throw new Error(`Invalid tune type: ${type}`);
    }

    const tunesOfType = this.tunes.filter((tune) => tune.type === type);

    // Group by name and count occurrences (different settings of same tune)
    const tuneGroups = new Map<string, TuneData[]>();

    tunesOfType.forEach((tune) => {
      const name = tune.name.toLowerCase().trim();
      if (!tuneGroups.has(name)) {
        tuneGroups.set(name, []);
      }
      tuneGroups.get(name)!.push(tune);
    });

    // Sort by popularity (number of settings) and return first setting
    const popularTunes = Array.from(tuneGroups.entries())
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, limit)
      .map(([, tunes]) => tunes[0]); // Take first setting

    return popularTunes;
  }

  /**
   * Get statistics about the dataset
   */
  getStats() {
    const typeCount = new Map<string, number>();
    const modeCount = new Map<string, number>();
    const meterCount = new Map<string, number>();

    this.tunes.forEach((tune) => {
      typeCount.set(tune.type, (typeCount.get(tune.type) || 0) + 1);
      modeCount.set(tune.mode, (modeCount.get(tune.mode) || 0) + 1);
      meterCount.set(tune.meter, (meterCount.get(tune.meter) || 0) + 1);
    });

    return {
      totalTunes: this.tunes.length,
      typeDistribution: Object.fromEntries(typeCount),
      modeDistribution: Object.fromEntries(modeCount),
      meterDistribution: Object.fromEntries(meterCount),
    };
  }
}

// Demo function
function searchDemo() {
  console.log('🔍 Tune Search Engine Demo');
  console.log('============================\n');

  const searchEngine = new TuneSearchEngine();

  // Example 1: Search for reels in G major
  console.log('1. Searching for reels in G major:');
  const reelsInG = searchEngine.search(
    {
      type: TuneType.REEL,
      mode: TuneMode.GMAJOR,
    },
    5
  );

  console.log(
    `   Found ${reelsInG.totalCount} reels in G major (showing first 5):`
  );
  reelsInG.tunes.forEach((tune, i) => {
    console.log(`   ${i + 1}. "${tune.name}" by ${tune.username}`);
  });
  console.log(`   Search time: ${reelsInG.searchTime}ms\n`);

  // Example 2: Search for jigs with "Paddy" in the name
  console.log('2. Searching for jigs with "Paddy" in the name:');
  const paddyJigs = searchEngine.search(
    {
      type: TuneType.JIG,
      name: 'Paddy',
    },
    5
  );

  console.log(
    `   Found ${paddyJigs.totalCount} jigs with "Paddy" in the name:`
  );
  paddyJigs.tunes.forEach((tune, i) => {
    console.log(`   ${i + 1}. "${tune.name}" in ${tune.mode} (${tune.meter})`);
  });
  console.log(`   Search time: ${paddyJigs.searchTime}ms\n`);

  // Example 3: Popular polkas
  console.log('3. Most popular polkas (by number of settings):');
  const popularPolkas = searchEngine.getPopularByType(TuneType.POLKA, 5);
  popularPolkas.forEach((tune, i) => {
    console.log(`   ${i + 1}. "${tune.name}" in ${tune.mode} (${tune.meter})`);
  });

  console.log('\n📊 Dataset overview:');
  const stats = searchEngine.getStats();
  console.log(`   Total tunes: ${stats.totalTunes.toLocaleString()}`);
  console.log(
    `   Most common type: ${Object.entries(stats.typeDistribution).sort(([, a], [, b]) => b - a)[0][0]}`
  );
  console.log(
    `   Most common mode: ${Object.entries(stats.modeDistribution).sort(([, a], [, b]) => b - a)[0][0]}`
  );
  console.log(
    `   Most common meter: ${Object.entries(stats.meterDistribution).sort(([, a], [, b]) => b - a)[0][0]}`
  );
}

// Execute if run directly
if (require.main === module) {
  searchDemo();
}
