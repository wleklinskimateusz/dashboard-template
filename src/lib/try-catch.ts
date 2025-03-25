export function tryCatch<T>(fn: () => T) {
  try {
    return { result: fn(), error: undefined };
  } catch (e) {
    return { result: undefined, error: e as Error };
  }
}

export async function tryCatchAsync<T>(fn: () => Promise<T>) {
  try {
    return { result: await fn(), error: undefined };
  } catch (e) {
    return { result: undefined, error: e as Error };
  }
}
