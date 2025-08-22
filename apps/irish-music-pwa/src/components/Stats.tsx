import { useMusicStats } from '../hooks/useMusicData';

const styles = {
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    padding: '16px',
    marginBottom: '24px',
  },
  statCard: {
    background: 'white',
    border: '1px solid #e3e3e3',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#378ef0',
    margin: '0 0 4px 0',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    margin: '0',
  },
  loading: {
    color: '#666',
    fontStyle: 'italic',
  },
  typesList: {
    fontSize: '12px',
    color: '#888',
    marginTop: '8px',
  },
};

export function Stats() {
  const { data: stats, isLoading, error } = useMusicStats();

  if (isLoading) {
    return (
      <div style={styles.statsContainer}>
        <div style={{ ...styles.statCard, ...styles.loading }}>
          Chargement des statistiques...
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const topTypes = Object.entries(stats.byType)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const topModes = Object.entries(stats.byMode)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div style={styles.statsContainer}>
      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.totalTunes}</div>
        <div style={styles.statLabel}>Mélodies totales</div>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statValue}>{Object.keys(stats.byType).length}</div>
        <div style={styles.statLabel}>Types différents</div>
        <div style={styles.typesList}>
          {topTypes.map(([type, count]) => `${type}: ${count}`).join(', ')}
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.withAbc}</div>
        <div style={styles.statLabel}>Avec partition ABC</div>
        <div style={styles.typesList}>
          {Math.round((stats.withAbc / stats.totalTunes) * 100)}% du total
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.withPopularity}</div>
        <div style={styles.statLabel}>Avec popularité</div>
        <div style={styles.typesList}>
          {Math.round((stats.withPopularity / stats.totalTunes) * 100)}% du
          total
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statValue}>{Object.keys(stats.byMode).length}</div>
        <div style={styles.statLabel}>Modes différents</div>
        <div style={styles.typesList}>
          {topModes.map(([mode, count]) => `${mode}: ${count}`).join(', ')}
        </div>
      </div>
    </div>
  );
}
