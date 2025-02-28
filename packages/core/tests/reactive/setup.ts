import { reactiveContext, signal, Signal } from "../../lib";
import { mock, Mock } from "bun:test";

export const fn = () => { return };

export let count: Signal<number>;
export let spy: Mock<(_?: number) => void>;
export let onRead: Mock<() => void>;
export let onWrite: Mock<() => void>;
export let onSubscribe: Mock<() => void>;
export let onUnsubscribe: Mock<() => void>;
export let onDispose: Mock<() => void>;
export const sanitize = (n: number) => parseInt(n.toFixed(0));
export const validate = (n: number) => n >= 0;

export function reactiveTestSetup() {
  spy = mock(fn);
  onRead = mock(fn);
  onWrite = mock(fn);
  onSubscribe = mock(fn);
  onUnsubscribe = mock(fn);
  onDispose = mock(fn);
  count = signal(0, {
    onRead,
    onWrite,
    onSubscribe,
    onUnsubscribe,
    onDispose,
    sanitize,
    validate,
  });

  reactiveContext.activeEffects = [];
  reactiveContext.pendingEffects.clear();

  return {
    count,
    spy,
    onRead,
    onWrite,
    onSubscribe,
    onUnsubscribe,
    onDispose,
  };
}
