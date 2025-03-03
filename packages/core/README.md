# Hella

A lightweight JavaScript framework for building reactive interfaces.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Reactive Components](#reactive-components)
- [Documentation](#documentation)
- [Examples](#examples)

## Features

- 🚀 **Fast DOM Updates** - Intelligent diffing with automatic batching
- 🎯 **Granular Reactivity** - Signal-based state with automatic dependency tracking
- 🔒 **Security First** - Built-in XSS protection and input sanitization
- 📦 **Tiny Bundle** - Under 5kB gzipped
- 🔍 **Type Safe** - Written in TypeScript with full type inference

## Getting Started

### Installation

`npm install @hellajs/core`

### Reactive Components

Components in Hella are plain objects that can be enhanced with reactivity. They automatically track signal dependencies and efficiently update only what changed.

Key features:

- Automatic dependency tracking
- Event delegation for better performance
- Proper cleanup of events and effects
- TypeScript support with element inference

```typescript
// Simple Counter Example
const count = signal(0);
const doubled = computed(() => count() * 2);

// Static typing with HellaElement
const Header: HellaElement<"header"> = {
  tag: "header",
  content: "Counter Example",
};

// Ergonomic HTML helpers
const { div, button, span } = html;

const Counter = div([
  button({ onclick: () => count.set(count() + 1) }, "Add"),
  span(`Count: ${count()}, Double: ${doubled()}`),
  button({ onclick: () => count.set(count() - 1) }, "Subtract"),
]);

// Cleanup is automatic when component unmounts
render(() => div([Header, Counter]), "#app");
```

## Documentation

For detailed documentation, check out:

- [Reactive](https://github.com/omilli/hella/blob/master/docs/reactive.md)
- [Render](https://github.com/omilli/hella/blob/master/docs/render.md)

## Examples

Examples apps and core concepts:

- [Concepts](https://github.com/omilli/hella/tree/master/examples/lib/concepts)
- [Apps](https://github.com/omilli/hella/tree/master/examples/lib/apps)
