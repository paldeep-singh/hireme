# HireMe

A monorepo containing web applications and tools to showcase my professional journey and manage job applications. This project serves as both a practical tool for job hunting and a demonstration of web development skills.

## Applications

### Jobs Dashboard

A web application for storing information about specific roles. Built with modern web technologies to demonstrate frontend development skills.

### CV Website (Coming Soon)

A personal CV website showcasing professional experience, skills, and projects, tailored to specific roles using data stored through the Jobs Dashboard.

### API

A RESTful API service built with Node.js and PostgreSQL, providing backend functionality for both web applications.

## Project Structure

The project is organized as a monorepo using pnpm workspaces and Turborepo.

```
hireme/
├── apps/
│   ├── jobs-dashboard/    # Job application tracking dashboard
│   └── api/               # RESTFUL API for web-apps to communicate with the database
├── packages/
│   └── shared/           # Shared types for facilitating communication between web apps and api
```

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/) (v10.6.2 or later)
- [Docker](https://www.docker.com/products/docker-desktop/) (for running PostgreSQL)
- [Turborepo](https://turbo.build/repo) (included as a dev dependency)

## Running Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/hireme.git
   cd hireme
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` in each app directory
   - Fill in the required environment variables

4. Start the development servers:

   ```bash
   # Start all applications
   turbo dev

   # Or start specific applications
   pnpm --filter jobs-dashboard dev
   pnpm --filter api dev
   ```

## Available Scripts

- `turbo dev` - Start all applications in development mode
- `turbo build:package` - Build shared packages used by apps
- `turbo typecheck` - Run type checking
- `turbo lint` - Run linting

## Development

### Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: Postgres, Sqitch
- **Repo Management**: Turborepo, pnpm
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint
- **Formatting**: Prettier

## CI/CD Pipelines

The project uses GitHub Actions for continuous integration. The following pipelines run on every pull request:

### Code Quality

- **Linting** (`🔎 Linting`): Runs ESLint on all packages
- **Type Checking** (`📐 Type Checking`): Verifies TypeScript types across all packages

### Testing

- **API Tests** (`🕸️ 🧪 API Tests`):
  - Unit tests
  - Integration tests
- **Jobs Dashboard Tests** (`🖥️ 🧪 Jobs Dashboard Tests`):
  - Unit tests
  - Page tests

### Database

- **DB Verification** (`💽 🧪 DB Verification`): Verifies database migrations using Sqitch

### Others

- **WIP Check**: Ensures no work-in-progress code is accidentally committed
