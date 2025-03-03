
export function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function isTrue(value: unknown): boolean {
  return value === true;
}

export function isFalse(value: unknown): boolean {
  return value === false;
}

export function isUndefined(value: unknown): boolean {
  return value === undefined;
}

export function isNull(value: unknown): boolean {
  return value === null;
}

export function isFalsy(value: unknown): boolean {
  return isNull(value) || isUndefined(value) || isFalse(value);
}

export function isPrimitive(value: unknown): value is string | number {
  return isString(value) || isNumber(value);
}

export function isObject(value: unknown): value is object {
  return typeof value === "object";
}

export function isRecord(value: unknown): value is object {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === "function";
}

export function isString(type: unknown): type is string {
  return typeof type === "string";
}

export function isNumber(type: unknown): type is number {
  return typeof type === "number";
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => { reject(new Error("Request timeout")); }, ms),
  );
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


