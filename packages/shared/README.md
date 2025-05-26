# Shared Package

A TypeScript package containing shared types, utilities, and test helpers used across the HireMe applications. This package ensures type safety and consistency between the frontend and backend services.

## Package Structure

```
shared/
├── generated/         # Auto-generated types from database and API
│   ├── api/           # API response and request types
├── types/             # Manually defined shared types
│   └── api/           # API-specific type definitions
├── testUtils/         # Shared testing utilities
├── utils/             # Shared utility functions
└── scripts/           # Type generation scripts
```

## Features

- **Type Generation**: Automatically generated TypeScript types from:
  - Database schema (using Kanel)
  - API endpoints (using custom scripts)
- **Shared Types**: Common type definitions used across applications
- **Test Utilities**: Reusable testing helpers
- **Utility Functions**: Shared helper functions

## Usage

### Installation

The package is automatically installed as a workspace dependency in the monorepo:

```bash
pnpm install
```

### Importing Types

```typescript
// Import generated database types
import type { User } from "@repo/api-types/generated/db";
// Import test utilities
import { mockUser } from "@repo/api-types/testUtils";
// Import API types
import type { ApiResponse } from "@repo/api-types/types/api";
// Import utility functions
import { formatDate } from "@repo/api-types/utils";
```

## Development

### Type Generation

The package includes scripts for generating types from various sources:

```bash

# Uses Kanel to generate json types for database tables
pnpm typegen:api

# Generates types for each api route
pnpm routegen
```

### Building

```bash
pnpm build:package
```

This will compile the TypeScript code to JavaScript in the `dist` directory.
