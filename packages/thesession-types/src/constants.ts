/**
 * Enums and constants for @tunebook/thesession-types
 */

/**
 * Error messages used throughout the package
 */
export enum ErrorMessages {
  MONOREPO_ROOT_NOT_FOUND = 'Could not find monorepo root (no pnpm-workspace.yaml found)',
  DATA_DIR_NOT_FOUND = 'Data directory not found',
  FILE_READ_ERROR = 'Error reading file',
  JSON_PARSE_ERROR = 'Error parsing JSON file',
  INVALID_DATA_FORMAT = 'Invalid data format',
}

/**
 * File names for data files
 */
export enum DataFiles {
  TUNES = 'tunes.json',
  RECORDINGS = 'recordings.json',
  ALIASES = 'aliases.json',
  TUNE_POPULARITY = 'tune_popularity.json',
  TUNE_SETS = 'sets.json',
}

/**
 * Configuration constants
 */
export const CONFIG = {
  WORKSPACE_FILE: 'pnpm-workspace.yaml',
  DATA_DIR_NAME: 'data',
  DEFAULT_ENCODING: 'utf-8' as const,
} as const;

/**
 * Custom error classes for better error handling
 */
export class MonorepoError extends Error {
  constructor(message: string = ErrorMessages.MONOREPO_ROOT_NOT_FOUND) {
    super(message);
    this.name = 'MonorepoError';
  }
}

export class DataFileError extends Error {
  public readonly originalError?: Error;

  constructor(filename: string, cause?: Error) {
    super(`${ErrorMessages.FILE_READ_ERROR} ${filename}`);
    this.name = 'DataFileError';
    this.originalError = cause;
  }
}

export class DataParsingError extends Error {
  public readonly originalError?: Error;

  constructor(filename: string, cause?: Error) {
    super(`${ErrorMessages.JSON_PARSE_ERROR} ${filename}`);
    this.name = 'DataParsingError';
    this.originalError = cause;
  }
}
