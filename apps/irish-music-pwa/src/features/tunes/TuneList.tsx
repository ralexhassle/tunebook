import { useSearchTunes } from '../../hooks/useMusicData';
import type { SearchFilters } from '../../lib/queryKeys';
import type { Tune } from '../../worker/types';

interface TuneListProps {
  query: string;
  filters: SearchFilters;
  onTuneSelect?: (tune: Tune) => void;
  selectedTuneId?: string;
}

export function TuneList({
  query,
  filters,
  onTuneSelect,
  selectedTuneId,
}: TuneListProps) {
  // La recherche se fait ici, dans le composant qui est wrappé par Suspense
  const { data: tunes = [] } = useSearchTunes(query || ' ', {
    ...filters,
    limit: 50,
  });
  if (tunes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>Aucune mélodie trouvée</p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: '15px',
          color: '#666',
          fontSize: '0.9em',
          textAlign: 'center',
        }}
      >
        {tunes.length} résultat{tunes.length > 1 ? 's' : ''}
      </div>
      <div style={{ display: 'grid', gap: '10px' }}>
        {tunes.map((tune) => (
          <div
            key={tune.id}
            onClick={() => onTuneSelect?.(tune)}
            style={{
              padding: '10px',
              border:
                selectedTuneId === tune.id
                  ? '2px solid #007bff'
                  : '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: selectedTuneId === tune.id ? '#f0f8ff' : 'white',
              cursor: onTuneSelect ? 'pointer' : 'default',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{tune.title}</h3>

            <div
              style={{
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  padding: '2px 8px',
                  backgroundColor: '#2c5530',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '0.85em',
                  fontWeight: 'bold',
                }}
              >
                {tune.type}
              </span>

              {tune.mode && (
                <span
                  style={{
                    padding: '2px 8px',
                    backgroundColor: '#666',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                  }}
                >
                  {tune.mode}
                </span>
              )}

              {tune.meter && (
                <span
                  style={{
                    padding: '2px 8px',
                    backgroundColor: '#888',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                  }}
                >
                  {tune.meter}
                </span>
              )}
            </div>

            {tune.aliases && tune.aliases.length > 0 && (
              <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>
                <strong>Alias :</strong> {tune.aliases.join(', ')}
              </p>
            )}

            {tune.popularity !== undefined && (
              <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#999' }}>
                <strong>Popularité :</strong> {tune.popularity} tunebooks
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
