import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query';
import { getWorkerAPI } from '../lib/workerClient';
import {
  musicQueryKeys,
  type SearchFilters,
  type ListFilters,
} from '../lib/queryKeys';
import type { Tune, IngestInput, IngestResult } from '../worker/types';

// Hook pour rechercher des mélodies avec Suspense
export function useSearchTunes(query: string, filters: SearchFilters = {}) {
  return useSuspenseQuery({
    queryKey: musicQueryKeys.tunesSearch(query, filters),
    queryFn: async (): Promise<Tune[]> => {
      const api = await getWorkerAPI();
      return api.searchTunes(query, filters);
    },
  });
}

// Hook pour lister les mélodies avec pagination (non-suspense pour permettre loading states)
export function useListTunesWithPagination(
  filters: ListFilters & { offset?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: musicQueryKeys.tunesList(filters),
    queryFn: async (): Promise<{ tunes: Tune[]; total: number }> => {
      const api = await getWorkerAPI();
      const tunes = await api.listTunes(filters);
      // Pour l'instant, on retourne toutes les mélodies, mais on pourrait implémenter la pagination côté worker
      const start = filters.offset || 0;
      const limit = filters.limit || 50;
      return {
        tunes: tunes.slice(start, start + limit),
        total: tunes.length,
      };
    },
  });
}

// Hook pour obtenir des statistiques
export function useMusicStats() {
  return useQuery({
    queryKey: ['musicStats'],
    queryFn: async () => {
      const api = await getWorkerAPI();
      const allTunes = await api.listTunes();

      const stats = {
        totalTunes: allTunes.length,
        byType: allTunes.reduce(
          (acc, tune) => {
            acc[tune.type] = (acc[tune.type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
        byMode: allTunes.reduce(
          (acc, tune) => {
            if (tune.mode) {
              acc[tune.mode] = (acc[tune.mode] || 0) + 1;
            }
            return acc;
          },
          {} as Record<string, number>
        ),
        withAbc: allTunes.filter((t) => t.abc).length,
        withPopularity: allTunes.filter((t) => t.popularity !== undefined)
          .length,
      };

      return stats;
    },
  });
}

// Hook pour obtenir une mélodie par ID avec Suspense
export function useTune(id: string) {
  return useSuspenseQuery({
    queryKey: musicQueryKeys.tunesById(id),
    queryFn: async (): Promise<Tune | undefined> => {
      const api = await getWorkerAPI();
      return api.getTune(id);
    },
  });
}

// Hook pour lister les mélodies avec Suspense
export function useListTunes(filters: ListFilters = {}) {
  return useSuspenseQuery({
    queryKey: musicQueryKeys.tunesList(filters),
    queryFn: async (): Promise<Tune[]> => {
      const api = await getWorkerAPI();
      return api.listTunes(filters);
    },
  });
}

// Hook pour ingérer des données
export function useIngestData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: IngestInput): Promise<IngestResult> => {
      const api = await getWorkerAPI();
      return api.ingest(input);
    },
    onSuccess: () => {
      // Invalider toutes les queries de musique après ingestion
      queryClient.invalidateQueries({ queryKey: musicQueryKeys.all });
    },
  });
}

// Hook pour vider la base de données
export function useClearData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const api = await getWorkerAPI();
      return api.clear();
    },
    onSuccess: () => {
      // Invalider toutes les queries après nettoyage
      queryClient.invalidateQueries({ queryKey: musicQueryKeys.all });
    },
  });
}
