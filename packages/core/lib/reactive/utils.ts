import { reactiveContext } from "./global";

export function tick(): Promise<unknown> {
  return new Promise((resolve) => {
    const ticker = setInterval(() => {
      if (reactiveContext.pendingEffects.size === 0) {
        clearInterval(ticker);
        resolve(null);
      }
    }, 10);
  });
}