import { ToggleButton } from 'react-aria-components';
import { TuneType } from '../worker/types';

interface FilterChipsProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

const TUNE_TYPES = Object.values(TuneType);

const styles = {
  filterChips: {
    padding: '16px',
    background: '#fafafa',
    borderRadius: '8px',
    marginBottom: '16px',
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
};

export function FilterChips({ selectedTypes, onChange }: FilterChipsProps) {
  const toggleType = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    onChange(newTypes);
  };

  return (
    <div style={styles.filterChips}>
      <label style={styles.filterLabel}>Types de mélodies:</label>
      <div style={styles.chipsContainer}>
        {TUNE_TYPES.map((type) => (
          <ToggleButton
            key={type}
            isSelected={selectedTypes.includes(type)}
            onPress={() => toggleType(type)}
            style={{
              ...styles.chip,
              ...(selectedTypes.includes(type) ? styles.chipSelected : {}),
            }}
          >
            {type}
          </ToggleButton>
        ))}
      </div>
    </div>
  );
}
