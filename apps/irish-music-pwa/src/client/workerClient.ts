interface WorkerMessage {
  id: string;
  type: string;
  payload?: unknown;
}

interface WorkerResponse {
  id: string;
  success: boolean;
  data?: unknown;
  error?: string;
}

class MinimalWorkerClient {
  private worker: Worker | null = null;
  private messageQueue: Map<
    string,
    { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }
  > = new Map();

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      this.worker = new Worker(
        new URL('../workers/simpleWorker.ts', import.meta.url),
        {
          type: 'module',
        }
      );

      this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const { id, success, data, error } = event.data;
        const pendingMessage = this.messageQueue.get(id);

        if (pendingMessage) {
          if (success) {
            pendingMessage.resolve(data);
          } else {
            pendingMessage.reject(new Error(error || 'Worker error'));
          }
          this.messageQueue.delete(id);
        }
      };

      this.worker.onerror = (error) => {
        console.error('Worker error:', error);
      };
    } catch (error) {
      console.error('Failed to create worker:', error);
    }
  }

  sendMessage(type: string, payload?: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not available'));
        return;
      }

      const id = crypto.randomUUID();
      const message: WorkerMessage = { id, type, payload };

      this.messageQueue.set(id, { resolve, reject });
      this.worker.postMessage(message);
    });
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.messageQueue.clear();
  }
}

export const workerClient = new MinimalWorkerClient();
