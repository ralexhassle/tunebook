import { useState } from 'react';
import { useMusicStats } from '../hooks/useMusicData';
const styles = {
  statsFloat: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    width: '300px',
    background: 'white',
    border: '1px solid #e3e3e3',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    transition: 'all 0.2s',
  },
  statsFloatCollapsed: { width: '60px', height: '60px' },
  header: {
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    background: '#fafafa',
    borderRadius: '8px 8px 0 0',
  },
  headerCollapsed: {
    border: 'none',
    borderRadius: '8px',
    justifyContent: 'center',
  },
  title: { fontSize: '14px', fontWeight: '600', color: '#323232', margin: 0 },
  toggleButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    color: '#666',
  },
  content: { padding: '16px' },
  statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  statItem: { textAlign: 'center' as const },
  statValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#378ef0',
    margin: '0 0 4px 0',
  },
  statLabel: { fontSize: '11px', color: '#666', margin: '0' },
  loading: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center' as const,
    padding: '20px',
  },
};
export function Stats() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: stats, isLoading, error } = useMusicStats();
  if (error) {
    return null;
  }
  return (
    <div
      style={{
        ...styles.statsFloat,
        ...(isCollapsed ? styles.statsFloatCollapsed : {}),
      }}
    >
      {' '}
      <div
        style={{
          ...styles.header,
          ...(isCollapsed ? styles.headerCollapsed : {}),
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {' '}
        {!isCollapsed && <h3 style={styles.title}>Statistiques</h3>}{' '}
        <button style={styles.toggleButton}>
          {' '}
          {isCollapsed ? '📊' : '−'}{' '}
        </button>{' '}
      </div>{' '}
      {!isCollapsed && (
        <div style={styles.content}>
          {' '}
          {isLoading ? (
            <div style={styles.loading}>Chargement...</div>
          ) : stats ? (
            <div style={styles.statGrid}>
              {' '}
              <div style={styles.statItem}>
                {' '}
                <div style={styles.statValue}>{stats.totalTunes || 0}</div>{' '}
                <div style={styles.statLabel}>Total</div>{' '}
              </div>{' '}
              <div style={styles.statItem}>
                {' '}
                <div style={styles.statValue}>{stats.withAbc || 0}</div>{' '}
                <div style={styles.statLabel}>Avec ABC</div>{' '}
              </div>{' '}
              <div style={styles.statItem}>
                {' '}
                <div style={styles.statValue}>
                  {Object.keys(stats.byType || {}).length}
                </div>{' '}
                <div style={styles.statLabel}>Types</div>{' '}
              </div>{' '}
              <div style={styles.statItem}>
                {' '}
                <div style={styles.statValue}>
                  {Object.keys(stats.byMode || {}).length}
                </div>{' '}
                <div style={styles.statLabel}>Modes</div>{' '}
              </div>{' '}
            </div>
          ) : null}{' '}
        </div>
      )}{' '}
    </div>
  );
}
