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
