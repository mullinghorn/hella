import { ctx } from "@hella/global";
import { StoreHella } from "./types";

const HELLA_STORES: StoreHella = {
  stores: new WeakMap(),
};

const context = ctx();

context.HELLA_STORES ||= HELLA_STORES;

export const storeContext = context.HELLA_STORES as StoreHella;
