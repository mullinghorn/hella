import { CleanupFunction } from "@hella/core";
import { StoreSignals } from "@hella/store";

export interface RouterHella {
  store: StoreSignals<RouterState> | null;
  events: RouterEvents;
}

// Core types
export type RouteParams = Record<string, string>;
export type RouteHandler = string | RouteHandlerFunction;
export type Routes = Record<string, RouteHandler>;

// Handler types
export type RouteHandlerFunction = (
  params: RouteParams,
) =>
  | CleanupFunction
  | undefined
  | void
  | Promise<CleanupFunction | undefined | void>;

export interface RoutePatternMatch {
  matches: RegExpMatchArray | null;
  pattern: string;
}

// Event types
export type RouterEventType = "beforeNavigate" | "afterNavigate";
export type RouterEventHandler = (path: string) => void;
export type RouterEvents = Record<RouterEventType, Set<RouterEventHandler>>;

// Store types
export interface RouterState {
  currentPath: string;
  params: RouteParams;
  routes: Routes;
  currentCleanup: CleanupFunction | null;
  history: string[];
  navigate: (path: string) => Promise<boolean>;
  back: (path?: string) => Promise<void>;
  start: (routes: Routes) => void;
  on: (event: RouterEventType, handler: RouterEventHandler) => void;
  off: (event: RouterEventType, handler: RouterEventHandler) => void;
}

export interface RouterContext {
  state: StoreSignals<RouterState>;
  events: RouterEvents;
  isHandlingPopState: boolean;
}

interface RouterContextArg {
  context: RouterContext;
}

interface RouterPathArg {
  path: string;
}

export type RouterNavigationArgs = {
  updateHistory: boolean;
  skipEvents?: boolean;
} & RouterContextArg &
  RouterPathArg;

export type RouterNavigatePathArgs = {
  updateHistory: boolean;
} & RouterContextArg &
  RouterPathArg;

export type RouterEmitArgs = {
  event: RouterEventType;
} & RouterContextArg &
  RouterPathArg;

export type RouteExecutionArgs = {
  handler: CallableFunction;
  params: RouteParams;
} & RouterContextArg;

export type RouterInitArgs = {
  routes: Routes;
} & RouterContextArg;

export type RouterUrlArgs = RouterContextArg & RouterPathArg;
