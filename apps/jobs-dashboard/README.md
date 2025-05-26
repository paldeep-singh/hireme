# Jobs Dashboard

A web application for storing details about specific roles I'm applying for.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **Forms**: TanStack Form
- **Styling**: CSS
- **Testing**: Vitest, React Testing Library
- **Type Safety**: TypeScript
- **API Integration**: REST API with shared types

## Prerequisites

- Node.js (LTS version)
- pnpm
- API service running locally (see API README)

## Development

### Starting the Development Server

```bash
pnpm dev
```

This will start the development server with hot module replacement (HMR) enabled.

## Testing

The project includes comprehensive test suites:

```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run page tests only
pnpm test:page
```

## Project Structure

```
jobs-dashboard/
├── src/
│   ├── assets/        # Static assets (images, fonts, etc.)
│   ├── components/    # Reusable React components
│   ├── forms/         # Form schemas and validation
│   ├── routes/        # Page components and route definitions
│   ├── testUtils/     # Test utilities and helpers
│   ├── utils/         # Utility functions
│   ├── styles.css     # Global styles
│   ├── main.tsx       # Application entry point
├── public/            # Public static assets
├── dist/              # Production build output
```
