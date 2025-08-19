/**
 * TypeScript types for Irish traditional music data based on thesession.org
 */

import { TuneType, TuneMode, TimeSignature } from './enums';

// Tune data structure (from tunes.json)
export interface TuneData {
  tune_id: string;
  setting_id: string;
  name: string;
  type: string;
  meter: string;
  mode: string;
  abc: string;
  date: string;
  username: string;
}

// Recording data structure (from recordings.json)
export interface RecordingData {
  id: string;
  artist: string;
  recording: string;
  track: string;
  number: string;
  tune: string;
  tune_id: string;
}

// Alias data structure (from aliases.json)
export interface AliasData {
  tune_id: string;
  alias: string;
  name: string;
}

// Popularity data structure (from tune_popularity.json)
export interface TunePopularityData {
  name: string;
  tune_id: string;
  tunebooks: string;
}

// Set data structure (from sets.json)
export interface TuneSetData {
  tuneset: string;
  date: string;
  member_id: string;
  username: string;
  settingorder: string;
  name: string;
  tune_id: string;
  setting_id: string;
  type: string;
  meter: string;
  mode: string;
  abc: string;
}

// Processed/normalized types for business logic
export interface Tune {
  id: number;
  name: string;
  type: TuneType;
  mode?: TuneMode;
  meter?: TimeSignature;
  abc?: string;
  aliases: string[];
  popularity?: number;
  settings: TuneSetting[];
}

export interface TuneSetting {
  id: number;
  tuneId: number;
  abc: string;
  date: Date;
  username: string;
  mode: TuneMode;
  meter: TimeSignature;
}

export interface Recording {
  id: number;
  artistName: string;
  recordingTitle: string;
  trackNumber: number;
  tuneTitle: string;
  tuneId?: number;
}

export interface TuneSet {
  id: number;
  date: Date;
  memberId: number;
  username: string;
  tunes: TuneInSet[];
}

export interface TuneInSet {
  order: number;
  tune: Tune;
  setting: TuneSetting;
}

// Utility types for data processing
export { TuneType, TuneMode, TimeSignature } from './enums';
