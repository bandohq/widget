export interface RetryConfig {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  jitter?: boolean;
}

export interface RetryResult<T> {
  success: boolean;
  data: T | null;
  attempts: number;
  totalTime: number;
  lastError?: Error;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffMultiplier: number,
  jitter: boolean
): number {
  let delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);

  if (jitter) {
    // add jitter to avoid thundering herd
    const jitterAmount = delay * 0.1;
    delay += Math.random() * jitterAmount - jitterAmount / 2;
  }

  return Math.min(delay, maxDelay);
}

/**
 * Generic retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T | null>,
  config: RetryConfig = {},
  onAttempt?: (attempt: number, maxAttempts: number, error?: Error) => void
): Promise<RetryResult<T>> {
  const {
    maxAttempts = 5,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    jitter = true,
  } = config;

  const startTime = Date.now();
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await operation();

      if (result !== null) {
        return {
          success: true,
          data: result,
          attempts: attempt,
          totalTime: Date.now() - startTime,
        };
      }

      // if the result is null, it's a "soft failure"
      onAttempt?.(attempt, maxAttempts);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      onAttempt?.(attempt, maxAttempts, lastError);
    }

    if (attempt < maxAttempts) {
      const delay = calculateDelay(
        attempt,
        initialDelay,
        maxDelay,
        backoffMultiplier,
        jitter
      );
      await sleep(delay);
    }
  }

  return {
    success: false,
    data: null,
    attempts: maxAttempts,
    totalTime: Date.now() - startTime,
    lastError,
  };
}

/**
 * Predefined configurations for different types of operations
 */
export const RetryPresets = {
  // For blockchain transactions that may take time to confirm
  blockchain: {
    maxAttempts: 8,
    initialDelay: 2000,
    maxDelay: 15000,
    backoffMultiplier: 1.5,
    jitter: true,
  } as RetryConfig,

  // For fast operations with limited retries
  quick: {
    maxAttempts: 3,
    initialDelay: 500,
    maxDelay: 2000,
    backoffMultiplier: 2,
    jitter: false,
  } as RetryConfig,

  // For polling transaction receipts
  receipt: {
    maxAttempts: 40, // 40 attempts * 1.5s = 60s default timeout
    initialDelay: 1500,
    maxDelay: 10000,
    backoffMultiplier: 1.2,
    jitter: true,
  } as RetryConfig,
};
