import { StoreSignals } from "@hellajs/store";
import { RouterState, RouterEvents, RouterHella } from "./types";
import { Context, ctx } from "@hellajs/core";

const HELLA_ROUTER: RouterHella = {
  store: null as StoreSignals<RouterState> | null,
  events: {
    beforeNavigate: new Set(),
    afterNavigate: new Set(),
  } as RouterEvents,
};

const context: Context<{
  HELLA_ROUTER?: RouterHella;
}> = ctx();


context.HELLA_ROUTER ??= HELLA_ROUTER;

export const routerContext = context.HELLA_ROUTER;
