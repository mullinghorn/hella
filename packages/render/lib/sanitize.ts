import { isString, isFunction } from "@hella/core";
import { validateEventHandler } from "./validation";

export const sanitizeValue = (value: any): string => {
  if (isFunction(value)) {
    return validateEventHandler(value) ? value : () => {};
  }
  return isString(value) ? value.replace(/[^\w\s-:./]/gi, "") : String(value);
};

export const sanitizeUrl = (url: string): string => {
  const parsed = new URL(url, window.location.origin);
  return ["http:", "https:"].includes(parsed.protocol) ? url : "";
};

export const sanitizeHtml = (html: string): string => {
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
};
const dangerousProps = new Set([
  "href",
  "src",
  "action",
  "data",
  "integrity",
  "nonce",
  "referrerpolicy",
  "formaction",
  "formtarget",
]);
export const shouldSanitizeProp = (key: string): boolean => {
  return key.startsWith("on") || dangerousProps.has(key);
};
