import { isFalsy, isFunction, isObject, toError } from "../";
import { HellaElement, PropHandler, PropValue } from "./types";
import { attachEvent } from "./events";
import { sanitizeValue, sanitizeUrl, shouldSanitizeProp } from "./sanitize";
import { validateEventHandler } from "./validation";

/* Mapping of prop types to their handlers for O(1) lookup */
const PROP_HANDLERS = new Map<string, PropHandler>([
  ["classes", styleProp],
  ["css", styleProp],
  ["data", dataProp],
]);

const HIDDEN_KEYS = new Set(["onRender", "tag", "root"]);

/* Applies all valid properties from HellaElement to DOM element */
export function applyProps(
  element: HTMLElement,
  hellaElement: HellaElement,
): void {
  if (!hellaElement) return;

  const rootSelector = hellaElement.root;
  const entries = Object.entries(hellaElement);

  for (const [key, value] of entries) {
    if (isFalsy(value) || key === "content") continue;

    const handler = propHandler(key);
    handler?.(element, key, value, rootSelector!);
  }
}

/* Determines appropriate prop handler based on property key */
function propHandler(key: string): PropHandler | null {
  if (HIDDEN_KEYS.has(key)) return null;
  if (PROP_HANDLERS.has(key)) return PROP_HANDLERS.get(key)!;
  return key.startsWith("on") ? eventProp : regularProp;
}

/* Safely updates DOM element attributes with sanitization */
function updateProp(element: HTMLElement, key: string, value: PropValue): void {
  if (isFalsy(value) || value === "") {
    element.removeAttribute(key);
    return;
  }

  const sanitized = shouldSanitizeProp(key)
    ? sanitizeUrl(String(value))
    : sanitizeValue(value);

  sanitized
    ? element.setAttribute(key, sanitized as string)
    : element.removeAttribute(key);
}

/* Handles style and class property updates */
function styleProp(element: HTMLElement, key: string, value: PropValue): void {
  const isClass = key === "classes";
  const propKey = isClass ? "class" : key;
  const processedValue = isClass ? processClass(value) : value;
  updateProp(element, propKey, processedValue);
}

/* Processes class values into valid class string */
function processClass(value: any): string {
  if (Array.isArray(value)) {
    const filtered = value.filter(Boolean);
    return filtered.length ? filtered.join(" ") : "";
  }

  if (isObject(value)) {
    const classes = Object.entries(value).reduce<string[]>(
      (classes, [className, active]) => {
        return active ? [...classes, className] : classes;
      },
      [],
    );
    return classes.length ? classes.join(" ") : "";
  }

  return String(value || "");
}

/* Handles regular property updates with reactive support */
function regularProp(
  element: HTMLElement,
  key: string,
  value: PropValue,
): void {
  const resolvedValue = isFunction(value) ? value() : value;
  updateProp(element, key, resolvedValue);
}

/* Handles event binding with validation */
function eventProp(
  element: HTMLElement,
  key: string,
  handler: PropValue,
  rootSelector: string,
): void {
  if (!isFunction(handler)) {
    throw toError("Event handlers must be a function");
  }

  if (!validateEventHandler(handler)) {
    throw toError("Invalid event handler detected");
  }

  const eventName = key.toLowerCase().slice(2);
  attachEvent({ element, eventName, handler, rootSelector });
}

/* Handles data-* attribute updates */
function dataProp(element: HTMLElement, _: string, value: PropValue): void {
  if (!isObject(value)) return;

  Object.entries(value).forEach(([key, val]) => {
    const sanitized = sanitizeValue(val);
    sanitized
      ? element.setAttribute(`data-${key}`, sanitized as string)
      : element.removeAttribute(`data-${key}`);
  });
}
