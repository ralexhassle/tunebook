// Mini-client RPC pour Worker avec corrélation par ID et AbortSignal

interface WorkerRequest {
  id: string;
  type: 'SEARCH_TUNES' | 'ANALYZE_POPULARITY' | 'FILTER_RECORDINGS';
  payload: any;
}

interface WorkerResponse {
  id: string;
  type: string;
  data?: any;
  error?: string;
}

interface PendingRequest {
  resolve: (data: any) => void;
  reject: (error: Error) => void;
  abortController: AbortController;
}

export class MusicWorkerClient {
  private worker: Worker | null = null;
  private pendingRequests = new Map<string, PendingRequest>();
  private isReady = false;
  private readyPromise: Promise<void>;

  constructor() {
    this.readyPromise = this.initializeWorker();
  }

  private async initializeWorker(): Promise<void> {
    this.worker = new Worker(
      new URL('../workers/musicWorker.ts', import.meta.url),
      { type: 'module' }
    );

    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { id, data, error } = event.data;

      if (event.data.type === 'WORKER_READY') {
        this.isReady = true;
        return;
      }

      const pending = this.pendingRequests.get(id);
      if (!pending) return;

      this.pendingRequests.delete(id);

      if (error) {
        pending.reject(new Error(error));
      } else {
        pending.resolve(data);
      }
    };

    this.worker.onerror = (error) => {
      // Rejeter toutes les requêtes en cours
      this.pendingRequests.forEach((pending) => {
        pending.reject(new Error(`Worker error: ${error.message}`));
      });
      this.pendingRequests.clear();
    };

    // Attendre que le worker soit prêt
    return new Promise((resolve) => {
      const checkReady = () => {
        if (this.isReady) {
          resolve();
        } else {
          setTimeout(checkReady, 50);
        }
      };
      checkReady();
    });
  }

  async sendRequest(
    type: WorkerRequest['type'],
    payload: any,
    abortSignal?: AbortSignal
  ): Promise<any> {
    await this.readyPromise;

    if (!this.worker) {
      throw new Error('Worker not initialized');
    }

    const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return new Promise((resolve, reject) => {
      const abortController = new AbortController();

      // Lier l'AbortSignal externe si fourni
      if (abortSignal) {
        if (abortSignal.aborted) {
          reject(new Error('Request was aborted'));
          return;
        }

        abortSignal.addEventListener('abort', () => {
          abortController.abort();
        });
      }

      // Gérer l'annulation
      abortController.signal.addEventListener('abort', () => {
        this.pendingRequests.delete(id);
        reject(new Error('Request was aborted'));
      });

      // Stocker la requête en attente
      this.pendingRequests.set(id, {
        resolve,
        reject,
        abortController,
      });

      // Envoyer au worker
      this.worker!.postMessage({
        id,
        type,
        payload,
      } as WorkerRequest);
    });
  }

  // Méthodes spécialisées
  async searchTunes(
    query: string,
    filters: any = {},
    abortSignal?: AbortSignal
  ) {
    return this.sendRequest('SEARCH_TUNES', { query, filters }, abortSignal);
  }

  async analyzePopularity(tuneId: number, abortSignal?: AbortSignal) {
    return this.sendRequest('ANALYZE_POPULARITY', { tuneId }, abortSignal);
  }

  async filterRecordings(filters: any = {}, abortSignal?: AbortSignal) {
    return this.sendRequest('FILTER_RECORDINGS', { filters }, abortSignal);
  }

  terminate() {
    // Annuler toutes les requêtes en cours
    this.pendingRequests.forEach((pending) => {
      pending.abortController.abort();
    });
    this.pendingRequests.clear();

    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Instance singleton
export const musicWorkerClient = new MusicWorkerClient();
