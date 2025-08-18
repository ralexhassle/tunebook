# Tunebook

A modern monorepo for exploring Irish traditional music resources, built with TypeScript, React, and Node.js.

## Overview

Tunebook is a comprehensive platform for discovering, searching, and analyzing traditional Irish music data from TheSession.org. The project features a Progressive Web App (PWA) frontend, REST and GraphQL APIs, and advanced search capabilities with offline support.

## Architecture

This monorepo contains:

- **Apps**: Frontend PWA and backend API servers
- **Packages**: Shared libraries for types, utilities, data processing, and search
- **Infrastructure**: Docker configurations and database schemas
- **Tools**: Build scripts and development utilities

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Fastify, Prisma ORM
- **Database**: PostgreSQL, Redis
- **Search**: Fuse.js with custom indexing
- **Infrastructure**: Docker, pnpm workspaces
- **Testing**: Jest, Playwright, React Testing Library

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker and Docker Compose

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tunebook

# Install dependencies
pnpm install

# Start development environment
pnpm setup
```

### Development

```bash
# Start all services in development mode
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm type-check
```

### Docker Services

```bash
# Start infrastructure services
pnpm docker:up

# Stop services
pnpm docker:down
```

## Project Structure

```
tunebook/
├── apps/
│   ├── pwa/                    # React PWA frontend
│   ├── api-server/             # REST API server
│   └── graphql-server/         # GraphQL API server
├── packages/
│   ├── shared-types/           # TypeScript definitions
│   ├── data-processing/        # Data ETL and normalization
│   ├── search-engine/          # Fuzzy search implementation
│   └── utils/                  # Common utilities
├── infrastructure/
│   ├── docker/                 # Docker configurations
│   └── database/               # Database schemas
├── tools/
│   └── scripts/                # Build and deployment scripts
└── docs/                       # Documentation
```

## Features

### Current Features
- Monorepo setup with pnpm workspaces
- TypeScript configuration across all packages
- ESLint and Prettier for code quality
- Docker infrastructure setup

### Planned Features
- Progressive Web App with offline support
- Fuzzy search across Irish music database
- Advanced filtering and sorting
- Cross-referencing between tunes and albums
- Popularity rankings and statistics
- REST and GraphQL APIs
- Real-time data synchronization

## Data Source

This project uses music data from [TheSession.org](https://github.com/adactio/TheSession-data), a comprehensive database of traditional Irish music sessions, tunes, and albums.

## Development Workflow

1. **Requirements**: Detailed user stories and acceptance criteria
2. **Design**: Comprehensive architecture and component design
3. **Implementation**: Incremental development with testing
4. **Testing**: Unit, integration, and end-to-end testing
5. **Deployment**: Containerized deployment with CI/CD

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [TheSession.org](https://thesession.org) for providing the Irish music data
- The traditional Irish music community for preserving these musical traditions