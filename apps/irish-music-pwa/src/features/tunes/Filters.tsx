import React from 'react';
import { TuneType, TuneMode, TimeSignature } from '../../worker/types';
import type { SearchFilters } from '../../lib/queryKeys';

interface FiltersProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

export function Filters({ filters, onChange }: FiltersProps) {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value =
      e.target.value === '' ? undefined : (e.target.value as TuneType);
    onChange({ ...filters, type: value });
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value =
      e.target.value === '' ? undefined : (e.target.value as TuneMode);
    onChange({ ...filters, mode: value });
  };

  const handleMeterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value =
      e.target.value === '' ? undefined : (e.target.value as TimeSignature);
    onChange({ ...filters, meter: value });
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <label
          htmlFor="type-filter"
          style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
        >
          Type :
        </label>
        <select
          id="type-filter"
          value={filters.type || ''}
          onChange={handleTypeChange}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option value="">Tous les types</option>
          {Object.values(TuneType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="mode-filter"
          style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
        >
          Mode :
        </label>
        <select
          id="mode-filter"
          value={filters.mode || ''}
          onChange={handleModeChange}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option value="">Tous les modes</option>
          {Object.values(TuneMode).map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="meter-filter"
          style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
        >
          Mesure :
        </label>
        <select
          id="meter-filter"
          value={filters.meter || ''}
          onChange={handleMeterChange}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option value="">Toutes les mesures</option>
          {Object.values(TimeSignature).map((meter) => (
            <option key={meter} value={meter}>
              {meter}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
