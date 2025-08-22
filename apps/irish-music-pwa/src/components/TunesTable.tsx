import { useState } from 'react';
import { Table, TableHeader, TableBody, Row, Column, Cell, Button, TextField } from 'react-aria-components';
import { AbcNotation } from './AbcNotation';
import { useListTunesWithPagination } from '../hooks/useMusicData';
import type { TuneType } from '../worker/types';

const styles = {
  container: {
    background: 'white',
    border: '1px solid #e3e3e3',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  searchContainer: {
    padding: '16px',
    borderBottom: '1px solid #e3e3e3',
    background: '#fafafa',
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d3d3d3',
    borderRadius: '4px',
    fontSize: '14px',
  },
  tableContainer: {
    height: '600px',
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  headerCell: {
    padding: '12px',
    background: '#f5f5f5',
    borderBottom: '1px solid #e3e3e3',
    fontWeight: '600',
    fontSize: '14px',
    color: '#323232',
    textAlign: 'left' as const,
  },
  cell: {
    padding: '12px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '13px',
    verticalAlign: 'top' as const,
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderTop: '1px solid #e3e3e3',
    background: '#fafafa',
  },
  pageButton: {
    padding: '6px 12px',
    border: '1px solid #d3d3d3',
    borderRadius: '4px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '12px',
    margin: '0 2px',
  },
  pageButtonActive: {
    background: '#378ef0',
    color: 'white',
    borderColor: '#378ef0',
  },
  pageInfo: {
    fontSize: '14px',
    color: '#666',
  },
  abcColumn: {
    width: '300px',
  },
  titleColumn: {
    width: '200px',
  },
  typeColumn: {
    width: '100px',
  },
  popularityColumn: {
    width: '80px',
    textAlign: 'center' as const,
  },
};

export function TunesTable({ filters }: { filters: { types?: string[] } }) {
  const [page, setPage] = useState(0);
  const [localSearch, setLocalSearch] = useState('');
  const pageSize = 25;

  // Convertir le filtre de types en un seul type pour l'API
  const selectedType = filters.types && filters.types.length > 0 
    ? filters.types[0] as TuneType 
    : undefined;

  const listQuery = useListTunesWithPagination({
    type: selectedType,
    offset: page * pageSize,
    limit: pageSize,
  });

  // Pour l'instant, utilisons seulement la liste paginée
  const { tunes, total, isLoading } = {
    tunes: listQuery.data?.tunes || [],
    total: listQuery.data?.total || 0,
    isLoading: listQuery.isLoading
  };

  // Filtrage local additionnel si recherche locale
  const filteredTunes = localSearch.trim()
    ? tunes.filter(
        (tune) =>
          tune.title.toLowerCase().includes(localSearch.toLowerCase()) ||
          (tune.abc &&
            extractNotes(tune.abc)
              .toLowerCase()
              .includes(localSearch.toLowerCase()))
      )
    : tunes;

  const totalPages = Math.ceil(total / pageSize);

  // Fonction pour extraire les notes de l'ABC pour la recherche de séquences
  function extractNotes(abc: string): string {
    // Extraction simple des notes (A-G) avec dièses/bémols
    const notePattern = /[A-Ga-g][#b]?/g;
    return (abc.match(notePattern) || []).join(' ');
  }

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Recherche locale pour séquences de notes */}
      <div style={styles.searchContainer}>
        <TextField
          value={localSearch}
          onChange={setLocalSearch}
          style={styles.searchInput}
        >
          <input
            placeholder="Rechercher par titre ou séquence de notes (ex: A B c d)..."
            style={styles.searchInput}
          />
        </TextField>
      </div>

      {/* Tableau */}
      <div style={styles.tableContainer}>
        <Table style={styles.table}>
          <TableHeader>
            <Column style={styles.titleColumn}>
              <div style={styles.headerCell}>Titre</div>
            </Column>
            <Column style={styles.typeColumn}>
              <div style={styles.headerCell}>Type</div>
            </Column>
            <Column style={styles.abcColumn}>
              <div style={styles.headerCell}>Partition</div>
            </Column>
            <Column style={styles.popularityColumn}>
              <div style={styles.headerCell}>Pop.</div>
            </Column>
          </TableHeader>
          <TableBody>
            {filteredTunes.map((tune) => (
              <Row key={tune.id}>
                <Cell style={styles.cell}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {tune.title}
                  </div>
                  {tune.mode && (
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {tune.mode}
                    </div>
                  )}
                  {tune.aliases && tune.aliases.length > 0 && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#888',
                        marginTop: '2px',
                      }}
                    >
                      Alias: {tune.aliases.slice(0, 2).join(', ')}
                      {tune.aliases.length > 2 && '...'}
                    </div>
                  )}
                </Cell>
                <Cell style={styles.cell}>
                  <span
                    style={{
                      background: '#f0f8ff',
                      padding: '2px 6px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#378ef0',
                    }}
                  >
                    {tune.type}
                  </span>
                </Cell>
                <Cell style={styles.cell}>
                  {tune.abc ? (
                    <AbcNotation abc={tune.abc} width={280} height={120} />
                  ) : (
                    <div
                      style={{
                        color: '#999',
                        fontSize: '12px',
                        textAlign: 'center',
                      }}
                    >
                      Pas de partition
                    </div>
                  )}
                </Cell>
                <Cell style={{ ...styles.cell, ...styles.popularityColumn }}>
                  {tune.popularity !== undefined ? (
                    <div
                      style={{
                        background: '#f0f8f0',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#2d5a2d',
                      }}
                    >
                      {tune.popularity}
                    </div>
                  ) : (
                    <span style={{ color: '#ccc' }}>-</span>
                  )}
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <div style={styles.pageInfo}>
            Page {page + 1} sur {totalPages} ({total} mélodies)
          </div>

          <div>
            <Button
              onPress={() => setPage(0)}
              isDisabled={page === 0}
              style={styles.pageButton}
            >
              ««
            </Button>
            <Button
              onPress={() => setPage(page - 1)}
              isDisabled={page === 0}
              style={styles.pageButton}
            >
              ‹
            </Button>

            {/* Pages visibles */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum =
                Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
              return (
                <Button
                  key={pageNum}
                  onPress={() => setPage(pageNum)}
                  style={{
                    ...styles.pageButton,
                    ...(pageNum === page ? styles.pageButtonActive : {}),
                  }}
                >
                  {pageNum + 1}
                </Button>
              );
            })}

            <Button
              onPress={() => setPage(page + 1)}
              isDisabled={page >= totalPages - 1}
              style={styles.pageButton}
            >
              ›
            </Button>
            <Button
              onPress={() => setPage(totalPages - 1)}
              isDisabled={page >= totalPages - 1}
              style={styles.pageButton}
            >
              »»
            </Button>
          </div>
        </div>
      )}

      {/* Info sur la recherche locale */}
      {localSearch.trim() && (
        <div style={styles.pagination}>
          <div style={styles.pageInfo}>
            {filteredTunes.length} résultat(s) trouvé(s) pour "{localSearch}"
          </div>
        </div>
      )}
    </div>
  );
}
