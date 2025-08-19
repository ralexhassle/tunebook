import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import type {
  TuneData,
  RecordingData,
  AliasData,
  TunePopularityData,
  TuneSetData,
} from '../types';
import {
  ErrorMessages,
  DataFiles,
  CONFIG,
  MonorepoError,
  DataFileError,
  DataParsingError,
} from '../constants';

function findMonorepoRoot() {
  let currentDir = process.cwd();

  while (currentDir !== dirname(currentDir)) {
    const workspaceFile = join(currentDir, CONFIG.WORKSPACE_FILE);

    if (existsSync(workspaceFile)) return currentDir;
    else currentDir = dirname(currentDir);
  }

  throw new MonorepoError();
}

const MONOREPO_ROOT = findMonorepoRoot();

const DATA_DIR = join(MONOREPO_ROOT, CONFIG.DATA_DIR_NAME);

export function readTunesData(): TuneData[] {
  const filePath = join(DATA_DIR, DataFiles.TUNES);
  const content = readFileSync(filePath, CONFIG.DEFAULT_ENCODING);
  return JSON.parse(content);
}

/**
 * Generic data reader - replaces specific readers
 */
export function readDataFile<T>(filename: string): T[] {
  const filePath = join(DATA_DIR, filename);
  const content = readFileSync(filePath, CONFIG.DEFAULT_ENCODING);
  return JSON.parse(content);
}

// Convenience functions using the generic reader
export const readRecordingsData = (): RecordingData[] =>
  readDataFile<RecordingData>(DataFiles.RECORDINGS);
export const readAliasesData = (): AliasData[] =>
  readDataFile<AliasData>(DataFiles.ALIASES);
export const readTunePopularityData = (): TunePopularityData[] =>
  readDataFile<TunePopularityData>(DataFiles.TUNE_POPULARITY);
export const readTuneSetsData = (): TuneSetData[] =>
  readDataFile<TuneSetData>(DataFiles.TUNE_SETS);

/**
 * Safe JSON reading with error handling
 */
export function safeReadJsonFile<T>(filename: string): T[] {
  try {
    const filePath = join(DATA_DIR, filename);
    const content = readFileSync(filePath, CONFIG.DEFAULT_ENCODING);
    return JSON.parse(content);
  } catch (error) {
    console.error(`${ErrorMessages.FILE_READ_ERROR} ${filename}:`, error);
    return [];
  }
}

/**
 * Safely get the first item from an array
 */
export function safeGetFirstItem<T>(data: T[]): T | null {
  return data.length > 0 ? data[0] : null;
}

/**
 * Get statistics about a JSON file
 */
export function getDataStats(filename: string) {
  try {
    const data = safeReadJsonFile(filename);
    const firstItem = safeGetFirstItem(data);
    return {
      filename,
      count: data.length,
      firstItem,
      keys: firstItem ? Object.keys(firstItem) : [],
    };
  } catch (error) {
    return {
      filename,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get the monorepo root path
 */
export function getMonorepoRoot(): string {
  return MONOREPO_ROOT;
}

/**
 * Get the data directory path
 */
export function getDataDir(): string {
  return DATA_DIR;
}
