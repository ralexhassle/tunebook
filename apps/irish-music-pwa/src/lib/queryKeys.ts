import type { TuneType, TuneMode, TimeSignature } from '../worker/types';

export interface SearchFilters {
  type?: TuneType;
  mode?: TuneMode;
  meter?: TimeSignature;
  limit?: number;
}

export interface ListFilters extends SearchFilters {
  offset?: number;
  limit?: number;
  orderBy?: 'title' | 'popularity';
}

export const musicQueryKeys = {
  all: ['music'] as const,
  tunes: () => [...musicQueryKeys.all, 'tunes'] as const,
  tunesSearch: (query: string, filters: SearchFilters) =>
    [...musicQueryKeys.tunes(), 'search', query, filters] as const,
  tunesById: (id: string) => [...musicQueryKeys.tunes(), 'byId', id] as const,
  tunesList: (filters: ListFilters) =>
    [...musicQueryKeys.tunes(), 'list', filters] as const,
};
