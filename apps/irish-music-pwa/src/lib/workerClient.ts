import { wrap, type Remote } from 'comlink';
import type {
  Tune,
  IngestInput,
  IngestResult,
  SearchOptions,
  ListOptions,
} from '../worker/types';

type MusicWorkerAPI = {
  init(): Promise<void>;
  ingest(input: IngestInput): Promise<IngestResult>;
  searchTunes(query: string, options?: SearchOptions): Promise<Tune[]>;
  getTune(id: string): Promise<Tune | undefined>;
  listTunes(options?: ListOptions): Promise<Tune[]>;
  clear(): Promise<void>;
};

let workerInstance: Worker | null = null;
let apiInstance: Remote<MusicWorkerAPI> | null = null;

export async function getWorkerAPI(): Promise<Remote<MusicWorkerAPI>> {
  if (!apiInstance) {
    // Create worker
    workerInstance = new Worker(
      new URL('../worker/index.ts', import.meta.url),
      { type: 'module' }
    );

    // Wrap with Comlink
    apiInstance = wrap<MusicWorkerAPI>(workerInstance);

    // Initialize
    await apiInstance.init();
  }

  return apiInstance;
}

export function terminateWorker(): void {
  if (workerInstance) {
    workerInstance.terminate();
    workerInstance = null;
    apiInstance = null;
  }
}
