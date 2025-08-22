import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { musicWorkerClient } from '../services/musicWorkerClient';

// Types pour les filtres
interface SearchFilters {
  type?: string;
  mode?: string;
  sortByPopularity?: boolean;
  limit?: number;
}

interface RecordingFilters {
  tuneId?: number;
  member?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

// Types pour les données
interface Tune {
  id: number;
  name: string;
  type: string;
  mode?: string;
  aliases?: string[];
}

interface TuneAnalysis {
  tune: Tune;
  popularity: {
    tune_id: number;
    popularity_score: number;
  };
  recordingsCount: number;
  recordings: Array<{
    id: number;
    tune_id: number;
    member?: string;
    date: string;
  }>;
}

// Clés de query pour le cache
export const musicQueryKeys = {
  all: ['music'] as const,
  tunes: () => [...musicQueryKeys.all, 'tunes'] as const,
  tuneSearch: (query: string, filters: SearchFilters) =>
    [...musicQueryKeys.tunes(), 'search', query, filters] as const,
  tuneAnalysis: (tuneId: number) =>
    [...musicQueryKeys.all, 'analysis', tuneId] as const,
  recordings: () => [...musicQueryKeys.all, 'recordings'] as const,
  recordingsFilter: (filters: RecordingFilters) =>
    [...musicQueryKeys.recordings(), 'filter', filters] as const,
};

// Hook pour rechercher des mélodies
export function useSearchTunes(query: string, filters: SearchFilters = {}) {
  return useQuery({
    queryKey: musicQueryKeys.tuneSearch(query, filters),
    queryFn: async ({ signal }) => {
      if (!query.trim()) return [];
      return musicWorkerClient.searchTunes(query, filters, signal);
    },
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (anciennement cacheTime)
  });
}

// Hook pour analyser la popularité d'une mélodie
export function useTuneAnalysis(tuneId: number | null) {
  return useQuery({
    queryKey: musicQueryKeys.tuneAnalysis(tuneId!),
    queryFn: async ({ signal }): Promise<TuneAnalysis> => {
      return musicWorkerClient.analyzePopularity(tuneId!, signal);
    },
    enabled: !!tuneId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 heure
  });
}

// Hook pour filtrer les enregistrements
export function useFilterRecordings(filters: RecordingFilters) {
  return useQuery({
    queryKey: musicQueryKeys.recordingsFilter(filters),
    queryFn: async ({ signal }) => {
      return musicWorkerClient.filterRecordings(filters, signal);
    },
    enabled: Object.keys(filters).length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook pour précharger une analyse de mélodie
export function usePrefetchTuneAnalysis() {
  const queryClient = useQueryClient();

  return (tuneId: number) => {
    queryClient.prefetchQuery({
      queryKey: musicQueryKeys.tuneAnalysis(tuneId),
      queryFn: async () => {
        return musicWorkerClient.analyzePopularity(tuneId);
      },
      staleTime: 10 * 60 * 1000,
    });
  };
}

// Mutation pour effectuer une recherche avancée (avec invalidation du cache)
export function useAdvancedSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      query,
      filters,
    }: {
      query: string;
      filters: SearchFilters;
    }) => {
      return musicWorkerClient.searchTunes(query, filters);
    },
    onSuccess: (data, variables) => {
      // Mettre à jour le cache avec les nouveaux résultats
      queryClient.setQueryData(
        musicQueryKeys.tuneSearch(variables.query, variables.filters),
        data
      );

      // Précharger les analyses pour les premiers résultats
      data.slice(0, 3).forEach((tune: Tune) => {
        queryClient.prefetchQuery({
          queryKey: musicQueryKeys.tuneAnalysis(tune.id),
          queryFn: () => musicWorkerClient.analyzePopularity(tune.id),
          staleTime: 10 * 60 * 1000,
        });
      });
    },
  });
}

// Hook pour invalider le cache
export function useInvalidateCache() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: musicQueryKeys.all,
      }),
    invalidateTunes: () =>
      queryClient.invalidateQueries({
        queryKey: musicQueryKeys.tunes(),
      }),
    invalidateRecordings: () =>
      queryClient.invalidateQueries({
        queryKey: musicQueryKeys.recordings(),
      }),
  };
}
