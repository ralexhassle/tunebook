import { useState } from 'react';
import { Button, ToggleButton } from 'react-aria-components';
import { TuneType } from '../worker/types';
import type { SearchFilters } from '../lib/queryKeys';

interface FilterChipsProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

const TUNE_TYPES = Object.values(TuneType);

const styles = {
  filterChips: {
    padding: '16px',
    background: '#fafafa',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  filterSection: {
    marginBottom: '12px',
  },
  filterLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#323232',
  },
  chipsContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  chip: {
    padding: '6px 12px',
    border: '1px solid #d3d3d3',
    borderRadius: '16px',
    background: 'white',
    color: '#323232',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
  },
  chipSelected: {
    background: '#378ef0',
    color: 'white',
    borderColor: '#378ef0',
  },
  chipMore: {
    background: '#e3e3e3',
    color: '#666',
    borderColor: '#e3e3e3',
  },
};

export function FilterChips({ filters, onChange }: FilterChipsProps) {
  const [showAllTypes, setShowAllTypes] = useState(false);

  const visibleTypes = showAllTypes ? TUNE_TYPES : TUNE_TYPES.slice(0, 6);

  const toggleType = (type: TuneType) => {
    const currentTypes = filters.type ? [filters.type] : [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];

    onChange({
      ...filters,
      type: newTypes.length === 1 ? newTypes[0] : undefined,
    });
  };

  return (
    <div style={styles.filterChips}>
      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>Types:</label>
        <div style={styles.chipsContainer}>
          {visibleTypes.map((type) => (
            <ToggleButton
              key={type}
              isSelected={filters.type === type}
              onPress={() => toggleType(type)}
              style={{
                ...styles.chip,
                ...(filters.type === type ? styles.chipSelected : {}),
              }}
            >
              {type}
            </ToggleButton>
          ))}
          {TUNE_TYPES.length > 6 && (
            <Button
              onPress={() => setShowAllTypes(!showAllTypes)}
              style={{
                ...styles.chip,
                ...styles.chipMore,
              }}
            >
              {showAllTypes ? 'Moins' : `+${TUNE_TYPES.length - 6}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
