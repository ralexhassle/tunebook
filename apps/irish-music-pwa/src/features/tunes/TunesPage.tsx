import { useState, Suspense } from 'react';
import { useIngestData, useClearData } from '../../hooks/useMusicData';
import { FilterChips } from '../../components/FilterChips';
import { TunesTable } from '../../components/TunesTable';
import { Stats } from '../../components/Stats';
import type { SearchFilters } from '../../lib/queryKeys';

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
    background: '#f8f9fa',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '24px',
    background: 'white',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #e3e3e3',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#323232',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: '0',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '16px',
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  primaryButton: {
    background: '#378ef0',
    color: 'white',
  },
  dangerButton: {
    background: '#d73a49',
    color: 'white',
  },
  disabledButton: {
    background: '#e3e3e3',
    color: '#999',
    cursor: 'not-allowed',
  },
  searchContainer: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e3e3e3',
    marginBottom: '20px',
  },
  searchInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d3d3d3',
    borderRadius: '6px',
    fontSize: '16px',
    outline: 'none',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
    color: '#666',
    fontSize: '18px',
  },
};

function TunesContent() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});

  const ingestMutation = useIngestData();
  const clearMutation = useClearData();

  const handleIngestRealData = async () => {
    try {
      // Charger les vraies données depuis le workspace parent
      await ingestMutation.mutateAsync({
        urls: [
          '/data/tunes.json',
          '/data/aliases.json', 
          '/data/tune_popularity.json',
          '/data/recordings.json',
        ],
      });
    } catch (error) {
      console.error('Error ingesting real data:', error);
    }
  };

  const handleIngestDemo = async () => {
    try {
      await ingestMutation.mutateAsync({
        urls: [
          '/data/demo-tunes.json',
          '/data/demo-aliases.json',
          '/data/demo-popularity.json',
        ],
      });
    } catch (error) {
      console.error('Error ingesting demo data:', error);
    }
  };

  const handleClear = async () => {
    try {
      await clearMutation.mutateAsync();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Irish Traditional Music Database</h1>
        <p style={styles.subtitle}>
          Explorez la collection complète avec partitions ABC et recherche floue
        </p>
        
        <div style={styles.actions}>
          <button
            onClick={handleIngestRealData}
            disabled={ingestMutation.isPending}
            style={{
              ...styles.button,
              ...(ingestMutation.isPending ? styles.disabledButton : styles.primaryButton)
            }}
          >
            {ingestMutation.isPending ? 'Chargement...' : 'Charger vraies données'}
          </button>
          <button
            onClick={handleIngestDemo}
            disabled={ingestMutation.isPending}
            style={{
              ...styles.button,
              ...(ingestMutation.isPending ? styles.disabledButton : styles.primaryButton)
            }}
          >
            {ingestMutation.isPending ? 'Chargement...' : 'Données démo'}
          </button>
          <button
            onClick={handleClear}
            disabled={clearMutation.isPending}
            style={{
              ...styles.button,
              ...(clearMutation.isPending ? styles.disabledButton : styles.dangerButton)
            }}
          >
            {clearMutation.isPending ? 'Nettoyage...' : 'Vider'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <Stats />

      {/* Recherche principale */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Recherche globale par titre, alias..."
          style={styles.searchInput}
        />
      </div>

      {/* Filtres */}
      <FilterChips filters={filters} onChange={setFilters} />

      {/* Tableau principal */}
              <TunesTable filters={filters} />
    </div>
  );
}

export function TunesPage() {
  return (
    <Suspense
      fallback={
        <div style={styles.loading}>
          Chargement de l'application...
        </div>
      }
    >
      <TunesContent />
    </Suspense>
  );
}
