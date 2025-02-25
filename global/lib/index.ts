import { isUndefined } from "./global.utils";

export * from "./global.utils";
export * from "./global.types";

export const ctx = () => {
  if (!isUndefined(window)) {
    return window as any;
  }
  if (!isUndefined(global)) {
    return global as any;
  }

  return {} as any;
};

export function tick(): Promise<unknown> {
  return new Promise((resolve) => {
    const ticker = setInterval(() => {
      if (ctx().HELLA_REACTIVE.pendingEffects.size === 0) {
        clearInterval(ticker);
        resolve(null);
      }
    }, 10);
  });
}


