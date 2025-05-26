# API Service

A RESTful API service built with Node.js, Express, and PostgreSQL, providing backend functionality for the HireMe applications.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Kysely
- **Schema Management**: Sqitch
- **Validation**: Zod
- **Testing**: Vitest, Supertest
- **Type Generation**: Kanel

## Prerequisites

- Node.js (LTS version)
- pnpm
- Docker (for local development)
- PostgreSQL (if running without Docker)

## Environment Setup

1. Copy the example environment file:

   ```bash
   cp example.env .env
   ```

2. Configure the following environment variables:
   - `PORT`: API server port (default: 3000)
   - `DATABASE_URL`: PostgreSQL connection string
   - `NODE_ENV`: Environment (development/production)

## Development

### Starting the Development Server

```bash
pnpm dev
```

This will:

- Spin up database in docker
- Run database migrations
- Seed database with fake data
- Start the API server with hot reloading

### Database Management

The project uses Sqitch for database migrations. Available commands:

```bash
# Start local database
pnpm db:local:up

# Stop local database
pnpm db:local:down

# Seed test database
pnpm db:local:seed

# Verify migrations (CI)
pnpm db:ci:verify
```

### Type Generation

Database types are automatically generated using Kanel:

```bash
pnpm typegen
```

## Testing

The project includes comprehensive test suites:

```bash
# Run all tests
pnpm test:all

# Run unit tests only
pnpm test:unit

# Run integration tests only
pnpm test:integration

# Run tests with coverage
pnpm test:coverage
```

## Project Structure

```
api/
├── src/
│   ├── controllers/   # Request handlers
│   ├── db/            # Database configuration and types
│   ├── middleware/    # Express middleware
│   ├── models/        # Data models and schemas
│   ├── routes/        # API route definitions
│   ├── services/      # Business logic
│   ├── testUtils/     # Test utilities and helpers
│   ├── utils/         # Utility functions
│   ├── api.ts         # API configuration
│   └── index.ts       # Application entry point
├── db/
│   ├── deploy/        # Database migrations
│   ├── revert/        # Migration revert scripts
│   └── verify/        # Migration verification scripts
├── docker/            # Docker configuration files
```
