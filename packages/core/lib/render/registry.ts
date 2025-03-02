import { renderContext } from "./global";

export function componentRegistry(root: string) {
  let component = renderContext.get(root);
  if (!component) {
    resetComponentRegistry(root);
    component = renderContext.get(root);
  }
  return component!;
}

export function resetComponentRegistry(root: string) {
  renderContext.set(root, {
    eventNames: new Set(),
    events: new Map(),
    rootListeners: new Set(),
    cleanups: new Map(),
  });
}

export function cleanupComponentRegistry(root: string) {
  const component = renderContext.get(root);
  if (!component) return;

  for (const cleanup of component.cleanups.values()) {
    cleanup();
  }

  component.cleanups.clear();

  renderContext.delete(root);
}
