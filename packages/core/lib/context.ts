import { Context } from "./types";
import { isUndefined } from "./utils";

export const ctx = (): Context<{}> => {
  if (!isUndefined(window)) {
    return window as Window;
  }

  if (!isUndefined(global)) {
    return global;
  }

  return globalThis;
};
