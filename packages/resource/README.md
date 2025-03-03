# @hellajs/resource

A lightweight, type-safe JavaScript library for fetching, caching, and managing remote data with built-in reactivity.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
  - [Advanced Usage](#advanced-usage)
- [Examples](#examples)
- [Documentation](#documentation)

## Features

- 💾 **Cache Management** - Built-in caching system with configurable TTL and automatic invalidation
- 🔄 **Request Retries** - Automatic retry mechanism with configurable attempts and delay
- ✅ **Data Validation** - Type-safe validation with custom validators and runtime checks
- 🔌 **Custom Fetchers** - Flexible API supporting both URL strings and custom promise-based fetchers
- 🔍 **Type Safe** - Written in TypeScript with full type inference
- 📦 **Tiny Bundle** - Under 1.1kB gzipped

## Getting Started

### Installation

```bash
npm install @hellajs/resource
```

### Basic Usage

Fetch and manage remote data with built-in caching and error handling:

```typescript
import { resource } from '@hellajs/resource';
import { effect } from '@hellajs/core';

// Type-safe resource fetching
const users = resource<User[]>("/api/users", {
  cache: true,
  retries: 3,
  validate: (data): data is User[] => {
    return Array.isArray(data) && data.every(isUser);
  },
});

// Start fetching data
users.fetch();

// Use in reactive components
effect(() => {
  if (users.loading()) return "Loading...";
  if (users.error()) return "Error: " + users.error().message;
  return users.data()?.map((user) => user.name).join(", ") || "No users found";
});
```

### Advanced Usage

Custom data transformation and error handling:

```typescript
const userDetails = resource<RawUserData, UserProfile>("/api/users/1", {
  transform: (data) => ({
    id: data.id,
    fullName: `${data.firstName} ${data.lastName}`,
    email: data.email,
    avatarUrl: `https://example.com/avatars/${data.avatarId}`
  }),
  validate: isValidUserData,
  onError: (response) => {
    console.error(`Failed to fetch user: ${response.status}`);
    // Trigger analytics or custom error handling
  },
  cacheTime: 60000, // 1 minute cache
  retries: 2,
  retryDelay: 500
});

// Refresh data and bypass cache
await userDetails.refresh();

// Cancel ongoing request
userDetails.abort();

// Invalidate cache without fetching
userDetails.invalidate();
```

## Documentation

For detailed documentation, check out:

- [Resource](https://github.com/omilli/hella/tree/master/docs/resource.md)

## Examples

Examples apps and core concepts:

- [Resource](https://github.com/omilli/hella/tree/master/examples/lib/concepts/resource)
- [Apps](https://github.com/omilli/hella/tree/master/examples/lib/apps)

