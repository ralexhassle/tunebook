/**
 * Enums for Irish traditional music based on thesession.org data analysis
 */

/**
 * Tune types found in thesession.org data
 * Based on analysis of 52,189 tune records
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

/**
 * Musical modes found in thesession.org data
 * Based on analysis of 52,189 tune records
 */
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

/**
 * Time signatures found in thesession.org data
 * Based on analysis of 52,189 tune records
 */
export enum TimeSignature {
  TIME_12_8 = '12/8',
  TIME_2_4 = '2/4',
  TIME_3_2 = '3/2',
  TIME_3_4 = '3/4',
  TIME_4_4 = '4/4',
  TIME_6_8 = '6/8',
  TIME_9_8 = '9/8',
}

/**
 * Helper functions to get all values
 */
export const getAllTuneTypes = (): string[] => Object.values(TuneType);
export const getAllTuneModes = (): string[] => Object.values(TuneMode);
export const getAllTimeSignatures = (): string[] =>
  Object.values(TimeSignature);

/**
 * Helper functions for validation
 */
export const isValidTuneType = (type: string): type is TuneType =>
  Object.values(TuneType).includes(type as TuneType);

export const isValidTuneMode = (mode: string): mode is TuneMode =>
  Object.values(TuneMode).includes(mode as TuneMode);

export const isValidTimeSignature = (
  signature: string
): signature is TimeSignature =>
  Object.values(TimeSignature).includes(signature as TimeSignature);
