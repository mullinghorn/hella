export let container: HTMLElement;

export const fn = () => { return };

export function renderTestSetup() {
  container = document.createElement("div");
  container.id = "app";
  document.body.appendChild(container);
}

export function renderTestCleanup() {
  document.body.innerHTML = "";
}
