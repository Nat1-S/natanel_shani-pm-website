const FETCH_TIMEOUT_MS = 4000;

export function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) =>
      setTimeout(() => resolve(fallback), FETCH_TIMEOUT_MS)
    ),
  ]);
}
