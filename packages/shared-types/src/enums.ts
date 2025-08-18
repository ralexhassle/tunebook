/**
 * Generated TypeScript enums from TheSession.org data analysis
 * Generated on: 2025-08-18T14:44:47.736Z
 */

export enum TuneType {
  REEL = 'reel',
  JIG = 'jig',
  POLKA = 'polka',
  WALTZ = 'waltz',
  HORNPIPE = 'hornpipe',
  SLIP_JIG = 'slip jig',
  BARNDANCE = 'barndance',
  MARCH = 'march',
  STRATHSPEY = 'strathspey',
  SLIDE = 'slide',
  MAZURKA = 'mazurka',
  THREE_TWO = 'three-two'
}

export enum Meter {
  TYPE_4_4 = '4/4',
  TYPE_6_8 = '6/8',
  TYPE_3_4 = '3/4',
  TYPE_2_4 = '2/4',
  TYPE_9_8 = '9/8',
  TYPE_12_8 = '12/8',
  TYPE_3_2 = '3/2'
}

export enum MusicalMode {
  GMAJOR = 'Gmajor',
  DMAJOR = 'Dmajor',
  AMAJOR = 'Amajor',
  ADORIAN = 'Adorian',
  EMINOR = 'Eminor',
  EDORIAN = 'Edorian',
  BMINOR = 'Bminor',
  AMIXOLYDIAN = 'Amixolydian',
  AMINOR = 'Aminor',
  DMIXOLYDIAN = 'Dmixolydian',
  CMAJOR = 'Cmajor',
  FMAJOR = 'Fmajor',
  GMINOR = 'Gminor',
  DMINOR = 'Dminor',
  DDORIAN = 'Ddorian',
  GDORIAN = 'Gdorian',
  EMAJOR = 'Emajor',
  GMIXOLYDIAN = 'Gmixolydian',
  BDORIAN = 'Bdorian',
  CDORIAN = 'Cdorian',
  FDORIAN = 'Fdorian',
  EMIXOLYDIAN = 'Emixolydian',
  BMIXOLYDIAN = 'Bmixolydian'
}

/**
 * Utility type for all tune type values
 */
export type TuneTypeValue = `${TuneType}`;

/**
 * Utility type for all meter values
 */
export type MeterValue = `${Meter}`;

/**
 * Utility type for all mode values
 */
export type MusicalModeValue = `${MusicalMode}`;

/**
 * Statistics about the data
 */
export const DATA_STATS = {
  totalTuneTypes: 12,
  totalMeters: 7,
  totalModes: 23,
  topModesIncluded: 23
} as const;
