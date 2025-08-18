# Tunebook Tools

This directory contains utility scripts for processing TheSession.org data and generating TypeScript types.

## Scripts

### 🔄 Data Processing Pipeline

```bash
# Complete pipeline: download + analyze
pnpm data:process
# or
node tools/process-data.js
```

### 📥 Download Data

```bash
# Download JSON files from TheSession.org
pnpm data:download
# or
node tools/download-data.js
```

Downloads the following files to `data/` directory:

- `tunes.json` (~21MB) - 52,189 tune settings with ABC notation
- `recordings.json` (~28MB) - 196,985 album/track recordings
- `tune_popularity.json` (~700KB) - 11,299 popular tunes with tunebook counts
- `aliases.json` (~2MB) - 29,080 alternative tune names

### 🔍 Analyze Types

```bash
# Analyze downloaded data and generate TypeScript enums
pnpm data:analyze
# or
node tools/analyze-types.js
```

Generates:

- `packages/shared-types/src/enums.ts` - Real TypeScript enums from data
- `docs/type-analysis.json` - Detailed analysis results

### 🏗️ Development Setup

```bash
# Set up local development environment
./tools/dev-setup.sh
```

### 🐙 GitHub Setup

```bash
# Set up GitHub repository
./tools/setup-github.sh
```

## Generated Files

### TypeScript Enums

The analysis generates real enums based on actual data:

```typescript
// 12 tune types found in the data
export enum TuneType {
  REEL = 'reel', // 18,920 tunes
  JIG = 'jig', // 13,254 tunes
  POLKA = 'polka', // 4,047 tunes
  WALTZ = 'waltz', // 3,765 tunes
  HORNPIPE = 'hornpipe', // 3,602 tunes
  // ... and 7 more
}

// 7 meters found in the data
export enum Meter {
  TYPE_4_4 = '4/4', // 27,179 tunes
  TYPE_6_8 = '6/8', // 13,254 tunes
  TYPE_3_4 = '3/4', // 4,331 tunes
  // ... and 4 more
}

// 23 musical modes found in the data
export enum MusicalMode {
  GMAJOR = 'Gmajor', // 13,736 tunes
  DMAJOR = 'Dmajor', // 13,486 tunes
  AMAJOR = 'Amajor', // 3,709 tunes
  // ... and 20 more
}
```

### Analysis Results

The `docs/type-analysis.json` file contains:

- Complete lists of all tune types, meters, and modes with counts
- Artist statistics (4,428 unique artists)
- Recording statistics (196,985 recordings)
- Data quality insights

## Data Structure Insights

### Tune Types by Popularity

1. **Reel** (18,920) - Most common, 4/4 time
2. **Jig** (13,254) - Second most common, 6/8 time
3. **Polka** (4,047) - 2/4 time
4. **Waltz** (3,765) - 3/4 time
5. **Hornpipe** (3,602) - 4/4 time

### Musical Modes

- **Gmajor** and **Dmajor** dominate (13k+ tunes each)
- Strong presence of **Dorian** modes (Adorian, Edorian)
- **Mixolydian** modes are common in Irish music

### Data Quality

- Rich ABC notation for most tunes
- Comprehensive cross-referencing
- Some missing tune_id references in recordings
- Consistent date/contributor tracking

## Next Steps

After running the data processing pipeline:

1. **Review Generated Types**: Check `packages/shared-types/src/enums.ts`
2. **Update Interfaces**: Use the real enums in your TypeScript interfaces
3. **Build Package**: Run `pnpm build` in `packages/shared-types`
4. **Implement Processing**: Create data normalization utilities
5. **Build Search**: Implement fuzzy search with the real data structure

## Notes

- Data files are excluded from git (see `.gitignore`)
- The `sets.json` file is too large (108MB, Git LFS) and excluded
- Events and sessions are excluded per project requirements
- All scripts are designed to be run from the project root
