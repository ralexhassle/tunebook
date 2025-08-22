import Fuse, { type IFuseOptions } from 'fuse.js';
import type { Tune, SearchOptions, ListOptions } from './types';
import { db } from './db';

let fuseIndex: Fuse<Tune> | null = null;

const FUSE_OPTIONS: IFuseOptions<Tune> = {
  keys: ['title', 'aliases', 'abc', 'searchText'],
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

export function buildSearchIndex(tunes: Tune[]): void {
  fuseIndex = new Fuse(tunes, FUSE_OPTIONS);
}

export async function searchTunes(
  query: string,
  options: SearchOptions = {}
): Promise<Tune[]> {
  const { limit = 50, type, mode, meter } = options;

  if (!query.trim()) {
    return listTunes({ ...options, limit });
  }

  // If no index, build it from current data
  if (!fuseIndex) {
    const allTunes = await db.tunes.toArray();
    buildSearchIndex(allTunes);
  }

  if (!fuseIndex) return [];

  // Perform fuzzy search
  const fuseResults = fuseIndex.search(query, { limit: limit * 2 }); // Get more results to filter

  // Apply filters
  let results = fuseResults.map((result) => result.item);

  if (type) {
    results = results.filter((tune) => tune.type === type);
  }

  if (mode) {
    results = results.filter((tune) => tune.mode === mode);
  }

  if (meter) {
    results = results.filter((tune) => tune.meter === meter);
  }

  return results.slice(0, limit);
}

export async function listTunes(options: ListOptions = {}): Promise<Tune[]> {
  const {
    type,
    mode,
    meter,
    offset = 0,
    limit = 50,
    orderBy = 'title',
  } = options;

  let query = db.tunes.orderBy(orderBy);

  // Apply filters
  if (type) {
    query = query.filter((tune) => tune.type === type);
  }

  if (mode) {
    query = query.filter((tune) => tune.mode === mode);
  }

  if (meter) {
    query = query.filter((tune) => tune.meter === meter);
  }

  return query.offset(offset).limit(limit).toArray();
}

export async function getTune(id: string): Promise<Tune | undefined> {
  return db.tunes.get(id);
}

export function invalidateSearchIndex(): void {
  fuseIndex = null;
}
