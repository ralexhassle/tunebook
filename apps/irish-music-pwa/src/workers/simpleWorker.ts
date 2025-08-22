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

// Écoute des messages du thread principal
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { id, type, payload } = event.data;

  try {
    switch (type) {
      case 'PING':
        sendResponse(id, { message: 'PONG', timestamp: Date.now() });
        break;

      case 'ECHO':
        sendResponse(id, { message: 'Echo received', payload });
        break;

      case 'PROCESS_DATA': {
        // Simulation d'un traitement
        const result = processData(payload);
        sendResponse(id, result);
        break;
      }

      default:
        sendResponse(id, null, `Unknown message type: ${type}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    sendResponse(id, null, errorMessage);
  }
};

function sendResponse(id: string, data: unknown, error?: string) {
  const response: WorkerResponse = {
    id,
    success: !error,
    data,
    error,
  };
  self.postMessage(response);
}

function processData(data: unknown) {
  // Exemple de traitement simple
  if (typeof data === 'string') {
    return {
      original: data,
      processed: data.toUpperCase(),
      length: data.length,
      processedAt: new Date().toISOString(),
    };
  }

  if (typeof data === 'number') {
    return {
      original: data,
      processed: data * 2,
      isEven: data % 2 === 0,
      processedAt: new Date().toISOString(),
    };
  }

  return {
    original: data,
    processed: 'Data processed',
    processedAt: new Date().toISOString(),
  };
}
