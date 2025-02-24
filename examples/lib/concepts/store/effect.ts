import { effect } from "@hella/reactive";
import { store } from "@hella/store";

interface AppStore {
  counter: number;
  double: () => number;
}

const appStore = store<AppStore>((state) => ({
  counter: 0,
  double: () => state.counter() * 2,
}));

effect(() => {
  const state = appStore.computed();
  console.log("Store state:", state);
});

setInterval(() => {
  appStore.set({ counter: appStore.counter() + 1 });
}, 1000);
