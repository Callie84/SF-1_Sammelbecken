export async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function withRetry<T>(fn: () => Promise<T>, tries = 3, baseMs = 1000): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); } catch (e) { lastErr = e; await sleep(baseMs * Math.pow(2, i)); }
  }
  throw lastErr;
}