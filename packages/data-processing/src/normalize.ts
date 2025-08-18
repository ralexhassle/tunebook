import { RawTune, TuneRecord } from './types';

/**
 * Convert a raw tune from TheSession to a normalized record ready for DB insertion.
 */
export function normalizeTune(raw: RawTune): TuneRecord {
  return {
    thesession_id: raw.id,
    title: raw.name,
    type: raw.type,
    meter: raw.meter ?? null,
    mode: raw.mode ?? null,
    key: raw.key ?? null,
  };
}

/**
 * Normalize an array of raw tunes.
 */
export function normalizeTunes(rawTunes: RawTune[]): TuneRecord[] {
  return rawTunes.map(normalizeTune);
}
