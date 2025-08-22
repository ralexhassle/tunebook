/**
 * Enums for Irish traditional music based on thesession.org data analysis
 */
export enum TuneType {
  BARNDANCE = 'barndance',
  HORNPIPE = 'hornpipe',
  JIG = 'jig',
  MARCH = 'march',
  MAZURKA = 'mazurka',
  POLKA = 'polka',
  REEL = 'reel',
  SLIDE = 'slide',
  SLIP_JIG = 'slip jig',
  STRATHSPEY = 'strathspey',
  THREE_TWO = 'three-two',
  WALTZ = 'waltz',
}

export enum TuneMode {
  ADORIAN = 'Adorian',
  AMAJOR = 'Amajor',
  AMINOR = 'Aminor',
  AMIXOLYDIAN = 'Amixolydian',
  BDORIAN = 'Bdorian',
  BMINOR = 'Bminor',
  BMIXOLYDIAN = 'Bmixolydian',
  CDORIAN = 'Cdorian',
  CMAJOR = 'Cmajor',
  DDORIAN = 'Ddorian',
  DMAJOR = 'Dmajor',
  DMINOR = 'Dminor',
  DMIXOLYDIAN = 'Dmixolydian',
  EDORIAN = 'Edorian',
  EMAJOR = 'Emajor',
  EMINOR = 'Eminor',
  EMIXOLYDIAN = 'Emixolydian',
  FDORIAN = 'Fdorian',
  FMAJOR = 'Fmajor',
  GDORIAN = 'Gdorian',
  GMAJOR = 'Gmajor',
  GMINOR = 'Gminor',
  GMIXOLYDIAN = 'Gmixolydian',
}

export enum TimeSignature {
  TIME_12_8 = '12/8',
  TIME_2_4 = '2/4',
  TIME_3_2 = '3/2',
  TIME_3_4 = '3/4',
  TIME_4_4 = '4/4',
  TIME_6_8 = '6/8',
  TIME_9_8 = '9/8',
}

// Raw data interfaces
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

export interface RecordingData {
  id: string;
  artist: string;
  recording: string;
  track: string;
  number: string;
  tune: string;
  tune_id: string;
}

export interface AliasData {
  tune_id: string;
  alias: string;
  name: string;
}

export interface TunePopularityData {
  name: string;
  tune_id: string;
  tunebooks: string;
}

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

// Normalized database models
export interface Tune {
  id: string;
  title: string;
  type: TuneType;
  meter?: TimeSignature;
  mode?: TuneMode;
  abc?: string;
  aliases?: string[];
  popularity?: number;
  searchText: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Recording {
  id: string;
  tuneId: string;
  artist?: string;
  album?: string;
  track?: string;
  sourceRef?: string;
}

export interface Alias {
  id: string;
  tuneId: string;
  alias: string;
}

export interface Popularity {
  tuneId: string;
  tunebooks: number;
}

export interface TuneSet {
  id: string;
  name?: string;
  tuneIds: string[];
}

// API interfaces
export interface IngestInput {
  urls?: string[];
  data?: {
    tunes?: TuneData[];
    aliases?: AliasData[];
    popularity?: TunePopularityData[];
    recordings?: RecordingData[];
    sets?: TuneSetData[];
  };
}

export interface IngestResult {
  counts: Record<string, number>;
  warnings: string[];
}

export interface SearchOptions {
  limit?: number;
  type?: TuneType;
  mode?: TuneMode;
  meter?: TimeSignature;
}

export interface ListOptions extends SearchOptions {
  offset?: number;
  orderBy?: 'title' | 'popularity';
}
