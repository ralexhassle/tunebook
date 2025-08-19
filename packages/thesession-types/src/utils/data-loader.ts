/**
 * Generic data loader with type safety
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { DataFiles, CONFIG } from '../constants';
import type {
  TuneData,
  RecordingData,
  AliasData,
  TunePopularityData,
  TuneSetData,
} from '../types';

// Data type mapping
export type DataFileType = keyof typeof DataFiles;
export type DataTypeMap = {
  TUNES: TuneData;
  RECORDINGS: RecordingData;
  ALIASES: AliasData;
  TUNE_POPULARITY: TunePopularityData;
  TUNE_SETS: TuneSetData;
};

export class DataLoader {
  private static dataDir: string;

  static setDataDir(dataDir: string) {
    this.dataDir = dataDir;
  }

  /**
   * Generic data reader with type safety
   */
  static readData<T extends DataFileType>(fileType: T): DataTypeMap[T][] {
    if (!this.dataDir) {
      throw new Error('Data directory not set. Call DataLoader.setDataDir() first.');
    }

    const filename = DataFiles[fileType];
    const filePath = join(this.dataDir, filename);
    const content = readFileSync(filePath, CONFIG.DEFAULT_ENCODING);
    return JSON.parse(content);
  }

  /**
   * Get statistics for a data file
   */
  static getStats<T extends DataFileType>(fileType: T) {
    const data = this.readData(fileType);
    const firstItem = data.length > 0 ? data[0] : null;
    
    return {
      fileType,
      filename: DataFiles[fileType],
      count: data.length,
      firstItem,
      keys: firstItem ? Object.keys(firstItem) : [],
      memorySize: JSON.stringify(data).length,
    };
  }

  /**
   * Get all available data types
   */
  static getAvailableDataTypes(): DataFileType[] {
    return Object.keys(DataFiles) as DataFileType[];
  }
}
