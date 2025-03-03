# @hellajs/router

A lightweight, type-safe JavaScript router library for building single-page applications with pattern matching, params extraction, and navigation guards.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
  - [Advanced Usage](#advanced-usage)
- [Examples](#examples)
- [Documentation](#documentation)

## Features

- 🧩 **Pattern Matching** - Support for static routes, dynamic parameters, and wildcards
- 🔄 **Navigation Guards** - Before and after navigation hooks with path filtering
- 🧭 **History Management** - Built-in history API integration with back navigation support
- ⏱️ **Rate Limiting** - Automatic throttling to prevent navigation spam
- 🔍 **Type Safe** - Written in TypeScript with full type inference
- 📦 **Tiny Bundle** - Under 2.6kB gzipped

## Getting Started

### Installation

```bash
npm install @hellajs/router
```

### Basic Usage

Set up routes and navigate between pages:

```typescript
import { router } from '@hellajs/router';

// Setup routes with type-safe params
router().start({
  "/": () => render(HomePage),
  "/users/:id": ({ id }) => render(UserProfile, { id }),
  "/blog/*": ({ "*": path }) => render(BlogPost, { path }),

  // Route to route redirection
  "/legacy-path": "/new-path"
});

// Navigate programmatically
function goToUser(userId) {
  router().navigate(`/users/${userId}`);
}

// Go back with optional fallback
function goBack() {
  router().back("/");
}
```

### Advanced Usage

Navigation guards and dynamic routes:

```typescript
import { router, beforeNavigate, afterNavigate } from '@hellajs/router';

// Setup routes with async code-splitting
router().start({
  "/": () => render(Home),
  "/admin": async () => {
    const { AdminPanel } = await import("./admin");
    return render(AdminPanel);
  }
});

// Navigation guards with path filtering
const unsubscribe = beforeNavigate(["/admin"], (path) => {
  if (!isAuthenticated()) {
    // Return value from navigation guard redirects
    return "/login?redirect=" + encodeURIComponent(path);
  }
});

// After navigation actions
afterNavigate(["/users/:id"], (path) => {
  analytics.trackPageView(path);
});

// Cleanup when needed
unsubscribe();
```

## Examples

```typescript
// Active route detection
import { isActiveRoute } from '@hellajs/router';

function NavLink({ to, children }) {
  const isActive = isActiveRoute(to);
  return div(
    { class: isActive ? "active-link" : "link", onClick: () => router().navigate(to) },
    children
  );
}

// Matching routes with parameters
const ProductList = div(
  // Create links to product detail pages
  products().map(product => 
    NavLink({ to: `/products/${product.id}` }, product.name)
  )
);

// Route parameters extraction
router().start({
  "/products/:productId/reviews/:reviewId": ({ productId, reviewId }) => {
    // Both parameters are type-safe strings
    return render(ProductReview, { productId, reviewId });
  }
});
```

## Documentation

For detailed documentation, check out:

- [Router](https://github.com/omilli/hella/tree/master/docs/router.md)

## Examples

Examples apps and core concepts:

- [Router](https://github.com/omilli/hella/tree/master/examples/lib/concepts/router)
- [Apps](https://github.com/omilli/hella/tree/master/examples/lib/apps)
