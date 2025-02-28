import {
  HellaElement,
  ProcessChildArgs,
  DiffNodesArgs,
  BatchUpdateArgs,
  UpdateNodeArgs,
  NodeTypes,
  HNodeChild,
} from "./types";
import { render } from "./core";
import { isFalsy, isFunction, isPrimitive, isRecord } from "@hella/core";
import { replaceEvents } from "./events";

const FRAGMENT = document.createDocumentFragment();
const TEXT_TEMPLATE = document.createTextNode("");
const NODE_TYPES = {
  TEXT: Node.TEXT_NODE,
  ELEMENT: Node.ELEMENT_NODE,
} as const;

/**
 * Processes HellaElement children
 */
export function processChildren(
  element: HTMLElement | DocumentFragment,
  hellaElement: HellaElement,
): void {
  const { content, root } = hellaElement;
  const batch = document.createDocumentFragment();

  (Array.isArray(content) ? content : [content])
    .filter(Boolean)
    .forEach((child) => {
      isRecord(child) && ((child as HellaElement).root = root);
      processChild({ child, element: batch, rootSelector: root! });
    });

  element.appendChild(batch);
}

/**
 * Optimized node diffing with batched updates
 */
export function diffNodes({
  parent,
  currentNode,
  newNode,
  rootSelector,
}: DiffNodesArgs): void {
  const nodeTypes: NodeTypes = {
    isElement: isElementNode(currentNode) && isElementNode(newNode),
    isText: isTextNode(currentNode) && isTextNode(newNode),
  };

  const shouldReplace = shouldReplaceNodes(currentNode, newNode, nodeTypes);

  if (shouldReplace && !nodeTypes.isText) {
    if (currentNode.parentNode === parent) {
      replaceEvents(
        currentNode as HTMLElement,
        newNode as HTMLElement,
        rootSelector,
      );
      parent.replaceChild(newNode, currentNode);
    } else {
      console.warn("Node replacement failed: invalid parent reference");
    }
    return;
  }

  if (nodeTypes.isElement) {
    batchAttributeUpdates({
      current: currentNode as Element,
      next: newNode as Element,
    });
    batchChildUpdates(
      currentNode,
      Array.from(newNode.childNodes),
      rootSelector,
    );
    return;
  }

  if (nodeTypes.isText && currentNode.textContent !== newNode.textContent) {
    currentNode.textContent = newNode.textContent;
  }
}

/**
 * Processes child nodes with type optimization
 */
function processChild({
  child,
  element,
  rootSelector,
}: ProcessChildArgs): void {
  if (isFalsy(child)) return;

  const nodeType = {
    isReactive: isFunction(child),
    isFragment:
      !isFunction(child) && (child as HellaElement).tag === undefined,
    isPrim: isPrimitive(child),
  };

  switch (true) {
    case nodeType.isReactive:
      processFunctionChild(
        child as () => HNodeChild | HNodeChild[],
        element,
        rootSelector,
      );
      break;
    case nodeType.isPrim:
      element.appendChild(textNodeProxy(String(child)));
      break;
    case nodeType.isFragment:
      processChildren(element, child as HellaElement);
      break;
    default:
      const rendered = render(child as HellaElement);
      rendered && element.appendChild(rendered as unknown as Node);
  }
}

/**
 * Efficiently processes reactive function children
 */
function processFunctionChild(
  childFn: () => HNodeChild | HNodeChild[],
  element: HTMLElement | DocumentFragment,
  rootSelector: string,
): void {
  const result = childFn();
  const nodes = Array.isArray(result) ? result : [result];
  const batch = FRAGMENT.cloneNode() as DocumentFragment;

  nodes.forEach((node) => {
    isRecord(node) && ((node as HellaElement).root = rootSelector);
    const temp = FRAGMENT.cloneNode() as DocumentFragment;
    processChild({ child: node, element: temp, rootSelector });
    temp.firstChild && batch.appendChild(temp.firstChild);
  });

  batch.childNodes.length && element.appendChild(batch);
}

/**
 * Batches attribute updates for better performance
 */
function batchAttributeUpdates({ current, next }: BatchUpdateArgs): void {
  const currentAttrs = new Set(
    Array.from(current.attributes).map((a) => a.name),
  );
  const nextAttrs = Array.from(next.attributes);

  const hellaClasses = current.className
    .split(" ")
    .filter((cls) => cls.startsWith("h-"));

  currentAttrs.forEach((name) => {
    if (!next.hasAttribute(name)) {
      current.removeAttribute(name);
    }
  });

  nextAttrs.forEach(({ name, value }) => {
    switch (name) {
      case "class":
        const newClasses = [...hellaClasses, ...value.split(" ")].filter(
          Boolean,
        );
        current.className = newClasses.join(" ").trim();
        break;
      case "style":
        (current as HTMLElement).style.cssText = value;
        break;
      default:
        if (current.getAttribute(name) !== value) {
          current.setAttribute(name, value);
        }
    }
  });
}

/**
 * Optimized text node creation with template reuse
 */
function textNodeProxy(text: string): Text {
  const node = TEXT_TEMPLATE.cloneNode() as Text;
  node.textContent = text;
  return node;
}

/**
 * Utility functions
 */
const isTextNode = (node: Node): node is Text =>
  node.nodeType === NODE_TYPES.TEXT;

const isElementNode = (node: Node): node is HTMLElement =>
  node.nodeType === NODE_TYPES.ELEMENT;

function shouldReplaceNodes(
  current: Node,
  next: Node,
  types: { isElement: boolean; isText: boolean },
): boolean {
  return (
    current.nodeType !== next.nodeType ||
    (types.isElement &&
      (current as Element).tagName !== (next as Element).tagName) ||
    (types.isText && current.textContent !== next.textContent)
  );
}

function batchChildUpdates(
  parent: Node,
  newNodes: Node[],
  rootSelector: string,
): void {
  const currentNodes = Array.from(parent.childNodes);
  const batch = FRAGMENT.cloneNode() as DocumentFragment;

  Math.max(currentNodes.length, newNodes.length) &&
    Array.from({
      length: Math.max(currentNodes.length, newNodes.length),
    }).forEach((_, i) =>
      { updateNode({
        parent: batch,
        current: currentNodes[i],
        next: newNodes[i],
        rootSelector,
      }); },
    );

  batch.childNodes.length && parent.appendChild(batch);
}

function updateNode({
  parent,
  current,
  next,
  rootSelector,
}: UpdateNodeArgs): void {
  if (!current && !next) return;

  if (current && !next && current.parentNode) {
    current.parentNode.removeChild(current);
    return;
  }

  if (!current && next) {
    parent.appendChild(next);
    return;
  }

  if (current && next) {
    const parentNode = current.parentNode || parent;
    diffNodes({
      parent: parentNode as HTMLElement | DocumentFragment,
      currentNode: current,
      newNode: next,
      rootSelector,
    });
    replaceEvents(
      current.parentElement || (parent as unknown as HTMLElement),
      next.parentElement || (parent as unknown as HTMLElement),
      rootSelector,
    );
  }
}
