import { ctx } from "@hella/global";
import { ComponentRegistry } from "./types";

const context = ctx() as { HELLA_COMPONENTS: ComponentRegistry };

export function componentRegistry(root: string) {
  let component = context.HELLA_COMPONENTS.get(root);
  if (!component) {
    resetComponentRegistry(root);
    component = context.HELLA_COMPONENTS.get(root);
  }
  return component!;
}

export function resetComponentRegistry(root: string) {
  context.HELLA_COMPONENTS.set(root, {
    eventNames: new Set(),
    events: new Map(),
    rootListeners: new Set(),
    cleanups: new Map(),
  });
}

export function cleanupComponentRegistry(root: string) {
  const component = context.HELLA_COMPONENTS.get(root);
  if (!component) return;

  for (const cleanup of component.cleanups.values()) {
    cleanup();
  }

  component.cleanups.clear();

  context.HELLA_COMPONENTS.delete(root);
}
