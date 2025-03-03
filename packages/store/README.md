# @hellajs/store

A lightweight, type-safe state management library for building reactive applications with automatic dependency tracking and batched updates.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
  - [Advanced Usage](#advanced-usage)
- [Examples](#examples)
- [Documentation](#documentation)

## Features

- 🔄 **Automatic Reactivity** - Signals that automatically track dependencies and trigger updates
- 🧮 **Computed Properties** - Derived state with memoization and dependency tracking
- 🛠️ **Action Methods** - Type-safe methods for updating state with automatic binding
- 🔍 **Type Safe** - Written in TypeScript with full type inference for state and actions
- 🔄 **Batched Updates** - Efficient UI updates with automatic batching
- 📦 **Tiny Bundle** - Under 1.2kB gzipped

## Getting Started

### Installation

```bash
npm install @hellajs/store
```

### Basic Usage

Create a store with reactive state and actions:

```typescript
import { store } from '@hellajs/store';
import { effect } from '@hellajs/core';

// Type-safe store with computed values
const todoStore = store(() => ({
  items: [],
  
  // Computed properties are automatically memoized
  active() {
    return this.items().filter(todo => !todo.completed);
  },
  
  completed() {
    return this.items().filter(todo => todo.completed);
  },

  // Actions are automatically bound
  addTodo(text: string) {
    this.items.set([...this.items(), { text, completed: false }]);
  },

  toggleTodo(index: number) {
    const todos = [...this.items()];
    todos[index].completed = !todos[index].completed;
    this.items.set(todos);
  }
}));

// Use anywhere in your app
todoStore.addTodo("Learn Hella");
console.log(todoStore.active().length);

// Reactive UI updates
effect(() => {
  const activeCount = todoStore.active().length;
  const completedCount = todoStore.completed().length;
  return `${activeCount} active, ${completedCount} completed`;
});
```

### Advanced Usage

Stores with readonly properties, effects and composable logic:

```typescript
import { store } from '@hellajs/store';

// Store with readonly properties and custom logic
const userStore = store(() => ({
  user: { name: "Guest", role: "visitor" },
  preferences: { theme: "light", notifications: true },
  
  // Define readonly properties
  isAdmin() {
    return this.user().role === "admin";
  },
  
  // Add cleanup effects when store is destroyed
  effect(onDestroy) {
    const unsubscribe = api.subscribeToUserUpdates(
      (userData) => this.user.set(userData)
    );
    onDestroy(unsubscribe);
  },
  
  // Update multiple properties in a batch
  setThemePreferences(theme: string, notifications: boolean) {
    this.preferences.set({ theme, notifications });
  }
}), { 
  // Mark certain properties as readonly from outside
  readonly: ["user"] 
});

// Compose stores for complex state management
function createAuthStore() {
  const authStore = store(() => ({
    token: localStorage.getItem("auth_token") || "",
    isAuthenticated() {
      return Boolean(this.token());
    },
    
    login: async (username: string, password: string) => {
      const response = await api.login(username, password);
      authStore.token.set(response.token);
      localStorage.setItem("auth_token", response.token);
      return response.success;
    },
    
    logout: () => {
      authStore.token.set("");
      localStorage.removeItem("auth_token");
    }
  }));
  
  return authStore;
}
```

## Documentation

For detailed documentation, check out:

- [Store](https://github.com/omilli/hella/tree/master/docs/store.md)

## Examples

Examples apps and core concepts:

- [Store](https://github.com/omilli/hella/tree/master/examples/lib/concepts/store)
- [Apps](https://github.com/omilli/hella/tree/master/examples/lib/apps)
