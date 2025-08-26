export type Success<T> = {
  success: true;
  data: T;
  error: null;
};

export type Failure = {
  success: false;
  data: null;
  error: Error;
};

export type SafeResult<T> = Success<T> | Failure;

export function safeTry<T>(fn: () => T): SafeResult<T> {
  try {
    const data = fn();
    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export async function safeTryAsync<T>(
  fn: () => Promise<T>,
): Promise<SafeResult<T>> {
  try {
    const data = await fn();
    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export function safeExecute<T>(fn: () => T): SafeResult<T>;
export function safeExecute<T>(fn: () => Promise<T>): Promise<SafeResult<T>>;
export function safeExecute<T>(
  fn: () => T | Promise<T>,
): SafeResult<T> | Promise<SafeResult<T>> {
  try {
    const result = fn();

    if (result instanceof Promise) {
      return result
        .then((data) => ({
          success: true as const,
          data,
          error: null,
        }))
        .catch((error) => ({
          success: false as const,
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
    }

    return {
      success: true,
      data: result,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export async function safeTryWithOptions<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    timeout?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {},
): Promise<SafeResult<T>> {
  const { retries = 0, timeout, onRetry } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      let promise = fn();

      if (timeout) {
        promise = Promise.race([
          promise,
          new Promise<never>((_, reject) => {
            setTimeout(
              () => reject(new Error(`Timeout after ${timeout}ms`)),
              timeout,
            );
          }),
        ]);
      }

      const data = await promise;
      return {
        success: true,
        data,
        error: null,
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      if (attempt < retries) {
        onRetry?.(attempt + 1, err);
        continue;
      }

      return {
        success: false,
        data: null,
        error: err,
      };
    }
  }

  return {
    success: false,
    data: null,
    error: new Error('Unexpected error'),
  };
}
