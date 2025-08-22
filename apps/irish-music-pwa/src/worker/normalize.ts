import { TuneType, TuneMode, TimeSignature } from './types';
import type {
  TuneData,
  RecordingData,
  AliasData,
  TunePopularityData,
  TuneSetData,
  Tune,
  Recording,
  Alias,
  Popularity,
  TuneSet,
} from './types';

const TUNE_TYPE_MAPPING: Record<string, TuneType> = {
  barndance: TuneType.BARNDANCE,
  hornpipe: TuneType.HORNPIPE,
  jig: TuneType.JIG,
  march: TuneType.MARCH,
  mazurka: TuneType.MAZURKA,
  polka: TuneType.POLKA,
  reel: TuneType.REEL,
  slide: TuneType.SLIDE,
  'slip jig': TuneType.SLIP_JIG,
  strathspey: TuneType.STRATHSPEY,
  'three-two': TuneType.THREE_TWO,
  waltz: TuneType.WALTZ,
};

const TIME_SIGNATURE_MAPPING: Record<string, TimeSignature> = {
  '12/8': TimeSignature.TIME_12_8,
  '2/4': TimeSignature.TIME_2_4,
  '3/2': TimeSignature.TIME_3_2,
  '3/4': TimeSignature.TIME_3_4,
  '4/4': TimeSignature.TIME_4_4,
  '6/8': TimeSignature.TIME_6_8,
  '9/8': TimeSignature.TIME_9_8,
};

function normalizeTuneType(type: string, warnings: string[]): TuneType {
  const normalized = type.toLowerCase().trim();
  const tuneType = TUNE_TYPE_MAPPING[normalized];

  if (!tuneType) {
    warnings.push(`Unknown tune type: "${type}" - will be excluded`);
    throw new Error(`Invalid tune type: ${type}`);
  }

  return tuneType;
}

function normalizeTimeSignature(
  meter: string,
  warnings: string[]
): TimeSignature | undefined {
  if (!meter || meter.trim() === '') return undefined;

  const timeSignature = TIME_SIGNATURE_MAPPING[meter.trim()];
  if (!timeSignature) {
    warnings.push(`Unknown time signature: "${meter}" - will be ignored`);
    return undefined;
  }

  return timeSignature;
}

function normalizeTuneMode(
  mode: string,
  warnings: string[]
): TuneMode | undefined {
  if (!mode || mode.trim() === '') return undefined;

  // Check if mode exists in TuneMode enum
  const tuneMode = Object.values(TuneMode).find((m) => m === mode.trim());
  if (!tuneMode) {
    warnings.push(`Unknown tune mode: "${mode}" - will be ignored`);
    return undefined;
  }

  return tuneMode;
}

export function normalizeTunes(
  tunesData: TuneData[],
  aliasesMap: Map<string, string[]>,
  popularityMap: Map<string, number>,
  warnings: string[]
): Tune[] {
  const normalized: Tune[] = [];

  for (const tuneData of tunesData) {
    try {
      const type = normalizeTuneType(tuneData.type, warnings);
      const meter = normalizeTimeSignature(tuneData.meter, warnings);
      const mode = normalizeTuneMode(tuneData.mode, warnings);

      const title = tuneData.name.trim();
      const aliases = aliasesMap.get(tuneData.tune_id) || [];
      const searchText = [title, ...aliases].join(' ').toLowerCase();

      const tune: Tune = {
        id: tuneData.tune_id,
        title,
        type,
        meter,
        mode,
        abc: tuneData.abc || undefined,
        aliases: aliases.length > 0 ? aliases : undefined,
        popularity: popularityMap.get(tuneData.tune_id),
        searchText,
        createdAt: tuneData.date,
        updatedAt: new Date().toISOString(),
      };

      normalized.push(tune);
    } catch (error) {
      // Skip invalid tunes (already logged in warnings)
      continue;
    }
  }

  return normalized;
}

export function normalizeRecordings(
  recordingsData: RecordingData[],
  warnings: string[]
): Recording[] {
  const normalized: Recording[] = [];

  for (const recordingData of recordingsData) {
    if (!recordingData.tune_id) {
      warnings.push(
        `Recording ${recordingData.id} has no tune_id - will be excluded`
      );
      continue;
    }

    const recording: Recording = {
      id: recordingData.id,
      tuneId: recordingData.tune_id,
      artist: recordingData.artist || undefined,
      album: recordingData.recording || undefined,
      track: recordingData.track || undefined,
      sourceRef: recordingData.number || undefined,
    };

    normalized.push(recording);
  }

  return normalized;
}

export function normalizeAliases(aliasesData: AliasData[]): {
  aliases: Alias[];
  aliasesMap: Map<string, string[]>;
} {
  const aliases: Alias[] = [];
  const aliasesMap = new Map<string, string[]>();

  // Group aliases by tune_id
  const grouped = new Map<string, Set<string>>();

  for (const aliasData of aliasesData) {
    if (!grouped.has(aliasData.tune_id)) {
      grouped.set(aliasData.tune_id, new Set());
    }
    grouped.get(aliasData.tune_id)!.add(aliasData.alias.trim());
  }

  // Create normalized aliases and map
  for (const [tuneId, aliasSet] of grouped) {
    const tuneAliases = Array.from(aliasSet);
    aliasesMap.set(tuneId, tuneAliases);

    tuneAliases.forEach((alias, index) => {
      aliases.push({
        id: `${tuneId}_alias_${index}`,
        tuneId,
        alias,
      });
    });
  }

  return { aliases, aliasesMap };
}

export function normalizePopularity(
  popularityData: TunePopularityData[],
  warnings: string[]
): {
  popularity: Popularity[];
  popularityMap: Map<string, number>;
} {
  const popularity: Popularity[] = [];
  const popularityMap = new Map<string, number>();

  for (const popData of popularityData) {
    const tunebooks = parseInt(popData.tunebooks, 10);
    if (isNaN(tunebooks)) {
      warnings.push(
        `Invalid tunebooks count for tune ${popData.tune_id}: "${popData.tunebooks}"`
      );
      continue;
    }

    const pop: Popularity = {
      tuneId: popData.tune_id,
      tunebooks,
    };

    popularity.push(pop);
    popularityMap.set(popData.tune_id, tunebooks);
  }

  return { popularity, popularityMap };
}

export function normalizeSets(
  setsData: TuneSetData[],
  warnings: string[]
): TuneSet[] {
  const setsMap = new Map<string, TuneSetData[]>();

  // Group by tuneset
  for (const setData of setsData) {
    if (!setsMap.has(setData.tuneset)) {
      setsMap.set(setData.tuneset, []);
    }
    setsMap.get(setData.tuneset)!.push(setData);
  }

  const normalized: TuneSet[] = [];

  for (const [tunesetId, tuneSetItems] of setsMap) {
    try {
      // Sort by settingorder
      tuneSetItems.sort((a, b) => {
        const orderA = parseInt(a.settingorder, 10);
        const orderB = parseInt(b.settingorder, 10);
        return orderA - orderB;
      });

      const tuneSet: TuneSet = {
        id: tunesetId,
        name: tuneSetItems[0]?.name || undefined,
        tuneIds: tuneSetItems.map((item) => item.tune_id),
      };

      normalized.push(tuneSet);
    } catch (error) {
      warnings.push(`Error processing tune set ${tunesetId}: ${error}`);
    }
  }

  return normalized;
}

export function normalizeAllData(input: {
  tunes?: TuneData[];
  aliases?: AliasData[];
  popularity?: TunePopularityData[];
  recordings?: RecordingData[];
  sets?: TuneSetData[];
}): {
  tunes: Tune[];
  recordings: Recording[];
  aliases: Alias[];
  popularity: Popularity[];
  sets: TuneSet[];
  warnings: string[];
} {
  const warnings: string[] = [];

  // Normalize aliases first to get the map
  const { aliases, aliasesMap } = normalizeAliases(input.aliases || []);

  // Normalize popularity to get the map
  const { popularity, popularityMap } = normalizePopularity(
    input.popularity || [],
    warnings
  );

  // Normalize tunes with aliases and popularity
  const tunes = normalizeTunes(
    input.tunes || [],
    aliasesMap,
    popularityMap,
    warnings
  );

  // Normalize other entities
  const recordings = normalizeRecordings(input.recordings || [], warnings);
  const sets = normalizeSets(input.sets || [], warnings);

  return {
    tunes,
    recordings,
    aliases,
    popularity,
    sets,
    warnings,
  };
}
