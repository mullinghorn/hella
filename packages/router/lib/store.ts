import { routerContext } from "./global";
import {
  RouterState,
  RouterContext,
  RouterEmitArgs,
  RouterNavigationArgs,
  RouteExecutionArgs,
  RouterInitArgs,
  RouterUrlArgs,
  Routes,
  RouterNavigatePathArgs,
} from "./types";
import { matchRoute } from "./utils";
import { validatePath, validateNavigationRate } from "./validation";
import { CleanupFunction, isString } from "@hellajs/core";
import { store } from "@hellajs/store";

/** Router store factory */
export function router() {
  if (routerContext.store) return routerContext.store;

  const initialState = {
    currentPath: window.location.pathname,
    params: {},
    routes: {},
    currentCleanup: null,
    history: [window.location.pathname],
  };

  routerContext.store = store<RouterState>((state) => {
    const context: RouterContext = {
      state,
      events: routerContext.events,
      isHandlingPopState: false,
    };

    return {
      ...initialState,
      start: (routes: Routes) => { initRouter({ context, routes }); },
      navigate: async (path: string) =>
        await navigationPipeline({
          context,
          path,
          updateHistory: true,
        }),
      back: async (fallback?: string) => {
        const hasHistory = state.history().length > 1;
        if (hasHistory) {
          history.back()
        }
        if (fallback && !hasHistory) {
          await state.navigate(fallback)
        }
      },
      on: (event, handler) => context.events[event].add(handler),
      off: (event, handler) => context.events[event].delete(handler),
    };
  });

  return routerContext.store;
}

/** Safely emit router events with error boundary */
function emit({ context, event, path }: RouterEmitArgs): void {
  context.events[event].forEach((handler) => {
    try {
      handler(path);
    } catch (err) {
      console.error(`Router event handler error: ${String(err)}`);
    }
  });
}

/** Update URL and history state */
function urlManager({ context, path }: RouterUrlArgs): void {
  if (path === context.state.currentPath() || context.isHandlingPopState)
    return;

  history.pushState(null, "", path);
  context.state.currentPath.set(path);
  context.state.history.set([...context.state.history(), path]);
}

/** Execute route handler and manage cleanup */
async function executeRoute({
  context,
  handler,
  params,
}: RouteExecutionArgs): Promise<boolean> {
  const cleanup = context.state.currentCleanup();
  cleanup?.();

  context.state.params.set(params);
  const newCleanup: CleanupFunction = await handler(params);
  context.state.currentCleanup.set(newCleanup);

  return true;
}

/** Handle route redirection */
async function redirectPipeline({
  context,
  path,
}: RouterUrlArgs): Promise<boolean> {
  emit({ context, event: "beforeNavigate", path });
  const result = await navigationPipeline({
    context,
    path,
    updateHistory: true,
    skipEvents: true,
  });
  if (result) {
    emit({ context, event: "afterNavigate", path })
  }
  return result;
}

/** Match and execute route handlers */
async function routePipeline({
  context,
  path,
}: RouterUrlArgs): Promise<boolean> {
  const routes = context.state.routes();
  const matchedRoute = Object.entries(routes).find(([pattern]) =>
    matchRoute(pattern, path),
  );

  if (!matchedRoute) return false;

  const [pattern, handler] = matchedRoute;
  const params = matchRoute(pattern, path);

  return isString(handler)
    ? redirectPipeline({ context, path: handler })
    : executeRoute({
      context,
      handler: handler as CallableFunction,
      params: params ?? {},
    });
}

/** Manage navigation state and validation */
async function navigationPipeline({
  context,
  path,
  updateHistory,
  skipEvents = false,
}: RouterNavigationArgs): Promise<boolean> {
  if (context.isHandlingPopState) return true;
  if (!validateNavigationRate()) return false;
  if (!validatePath(path)) {
    console.error("Invalid path detected");
    return false;
  }

  if (!skipEvents) {
    emit({ context, event: "beforeNavigate", path })
  }

  let result = true;
  if (path !== context.state.currentPath()) {
    result = await navigateToPath({ context, path, updateHistory })
  }

  if (!skipEvents && result) {
    emit({ context, event: "afterNavigate", path });
  }

  return result;
}

/** Execute path navigation */
async function navigateToPath({
  context,
  path,
  updateHistory,
}: RouterNavigatePathArgs): Promise<boolean> {
  if (updateHistory) {
    urlManager({ context, path })
  }
  return routePipeline({ context, path });
}

/** Handle popstate events */
function popStateHandler(context: RouterContext) {
  if (context.isHandlingPopState) return;

  context.isHandlingPopState = true;
  const path = window.location.pathname;
  context.state.currentPath.set(path);
  routePipeline({ context, path }).then(() => {
    context.isHandlingPopState = false;
  }).catch(console.error);
}

/** Initialize router with routes */
function initRouter({ context, routes }: RouterInitArgs): void {
  context.state.routes.set(routes);
  window.addEventListener("popstate", () => { popStateHandler(context); });
  const path = window.location.pathname;
  emit({ context, event: "beforeNavigate", path });
  context.state.currentPath.set(path);
  urlManager({ context, path });
  routePipeline({ context, path }).then(() => { emit({ context, event: "afterNavigate", path }); }).catch(console.error);
}
