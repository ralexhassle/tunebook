import { QueryClient } from '@tanstack/react-query';

// Configuration du QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Temps avant qu'une query soit considérée comme stale
      staleTime: 2 * 60 * 1000, // 2 minutes par défaut
      // Temps de garbage collection (anciennement cacheTime)
      gcTime: 10 * 60 * 1000, // 10 minutes par défaut
      // Retry automatique
      retry: (failureCount, error) => {
        // Ne pas retry sur les erreurs d'annulation
        if (error.message.includes('aborted')) {
          return false;
        }
        // Maximum 2 retries pour les autres erreurs
        return failureCount < 2;
      },
      // Délai entre les retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch automatique en arrière-plan
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false, // Pas de retry automatique pour les mutations
    },
  },
});
