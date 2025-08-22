import Dexie, { type EntityTable } from 'dexie';
import type { Tune, Recording, Alias, Popularity, TuneSet } from './types';

export class MusicDatabase extends Dexie {
  tunes!: EntityTable<Tune, 'id'>;
  recordings!: EntityTable<Recording, 'id'>;
  aliases!: EntityTable<Alias, 'id'>;
  popularity!: EntityTable<Popularity, 'tuneId'>;
  sets!: EntityTable<TuneSet, 'id'>;

  constructor() {
    super('MusicDatabase');

    this.version(1).stores({
      tunes:
        'id, title, type, meter, mode, searchText, popularity, createdAt, updatedAt',
      recordings: 'id, tuneId, artist, album, track',
      aliases: 'id, tuneId, alias',
      popularity: 'tuneId, tunebooks',
      sets: 'id, name',
    });
  }
}

export const db = new MusicDatabase();
