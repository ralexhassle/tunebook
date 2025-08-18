# Requirements Document

## Introduction

Tunebook is a monorepo exploration platform for Irish music resources that provides tools for discovering, searching, and analyzing traditional Irish music data. The system will be built as a modern web application using a monorepo architecture with pnpm, featuring React TypeScript frontends, Node.js Fastify backends, and PostgreSQL databases, all containerized with Docker. The initial focus is on creating a Progressive Web App (PWA) that loads and normalizes music data from TheSession.org dataset, enabling fuzzy search, filtering, sorting, and cross-referencing of tunes, albums, and related entities.

## Requirements

### Requirement 1

**User Story:** As a developer, I want a well-structured monorepo setup with pnpm, so that I can efficiently manage multiple related projects with shared dependencies and consistent tooling.

#### Acceptance Criteria

1. WHEN the monorepo is initialized THEN the system SHALL use pnpm as the package manager with workspace configuration
2. WHEN projects are added to the monorepo THEN the system SHALL support both Node.js Fastify servers and React TypeScript applications
3. WHEN dependencies are managed THEN the system SHALL optimize shared dependencies across workspace packages
4. WHEN the project structure is created THEN the system SHALL include proper TypeScript configuration for the entire workspace

### Requirement 2

**User Story:** As a developer, I want containerized development environment setup, so that I can run PostgreSQL databases and Node.js servers consistently across different environments.

#### Acceptance Criteria

1. WHEN Docker configuration is created THEN the system SHALL provide containerized PostgreSQL database setup
2. WHEN services are containerized THEN the system SHALL support running multiple Node.js Fastify servers in containers
3. WHEN the development environment is started THEN the system SHALL orchestrate all services using Docker Compose
4. WHEN containers are configured THEN the system SHALL include proper networking and volume management
5. WHEN alternative backends are considered THEN the system SHALL be compatible with modern BaaS platforms like Convex

### Requirement 3

**User Story:** As a user, I want a Progressive Web App for Irish music exploration, so that I can access the music database offline and have a native app-like experience.

#### Acceptance Criteria

1. WHEN the PWA is built THEN the system SHALL use React TypeScript with Vite for optimal performance
2. WHEN the PWA is accessed THEN the system SHALL work offline after initial data load
3. WHEN the PWA is installed THEN the system SHALL provide native app-like experience on mobile and desktop
4. WHEN data is loaded THEN the system SHALL cache music data locally for offline access

### Requirement 4

**User Story:** As a user, I want to load and normalize Irish music data from TheSession.org, so that I can work with clean, structured data for analysis and search.

#### Acceptance Criteria

1. WHEN data is fetched THEN the system SHALL load JSON data from TheSession.org GitHub repository
2. WHEN data is processed THEN the system SHALL normalize tunes, albums, and related entities into consistent structures
3. WHEN entities are processed THEN the system SHALL extract and standardize metadata (types, names, relationships)
4. WHEN data processing occurs THEN the system SHALL use Web Workers to handle large datasets without blocking the UI

### Requirement 5

**User Story:** As a user, I want fuzzy search capabilities across music entities, so that I can find tunes and albums even with partial or approximate queries.

#### Acceptance Criteria

1. WHEN I search for content THEN the system SHALL provide fuzzy search on tune names, album names, and other text attributes
2. WHEN search results are returned THEN the system SHALL rank results by relevance and similarity
3. WHEN I type in the search box THEN the system SHALL provide real-time search suggestions
4. WHEN search is performed THEN the system SHALL highlight matching text in results

### Requirement 6

**User Story:** As a user, I want to filter and sort music content by various criteria, so that I can discover music based on specific characteristics.

#### Acceptance Criteria

1. WHEN I apply filters THEN the system SHALL filter tunes by type (jig, reel, hornpipe, etc.)
2. WHEN I sort content THEN the system SHALL sort by popularity, alphabetical order, or other relevant metrics
3. WHEN filters are applied THEN the system SHALL maintain filter state and allow multiple simultaneous filters
4. WHEN I clear filters THEN the system SHALL reset to show all available content

### Requirement 7

**User Story:** As a user, I want to cross-reference music data, so that I can find relationships between tunes, albums, and other entities.

#### Acceptance Criteria

1. WHEN I view a tune THEN the system SHALL show all albums containing that tune
2. WHEN I view an album THEN the system SHALL show all tunes included in that album
3. WHEN I explore relationships THEN the system SHALL provide navigation between related entities
4. WHEN cross-references are displayed THEN the system SHALL show relationship strength or frequency

### Requirement 8

**User Story:** As a user, I want to see popularity rankings and statistics, so that I can discover the most popular or frequently played tunes.

#### Acceptance Criteria

1. WHEN popularity is calculated THEN the system SHALL rank tunes based on frequency across albums and sessions
2. WHEN statistics are displayed THEN the system SHALL show play counts, album appearances, and other metrics
3. WHEN I browse popular content THEN the system SHALL provide "most popular" and "trending" sections
4. WHEN popularity data is shown THEN the system SHALL update rankings based on the latest data analysis

### Requirement 9

**User Story:** As a developer, I want GraphQL API capabilities, so that I can provide flexible data querying for future frontend applications.

#### Acceptance Criteria

1. WHEN GraphQL is implemented THEN the system SHALL provide a GraphQL endpoint for data queries
2. WHEN queries are made THEN the system SHALL support complex filtering, sorting, and relationship queries
3. WHEN the API is accessed THEN the system SHALL provide proper schema documentation and introspection
4. WHEN GraphQL resolvers are implemented THEN the system SHALL efficiently handle nested queries and relationships

### Requirement 10

**User Story:** As a developer, I want comprehensive data analysis tools, so that I can extract insights and patterns from the Irish music dataset.

#### Acceptance Criteria

1. WHEN data is analyzed THEN the system SHALL extract entity types and their relationships automatically
2. WHEN analysis is performed THEN the system SHALL identify patterns in tune types, popularity, and cross-references
3. WHEN insights are generated THEN the system SHALL provide statistical summaries and data visualizations
4. WHEN analysis runs THEN the system SHALL use background processing to avoid blocking user interactionsx une PWA React performante, afin d'explorer les ressources musicales irlandaises de manière fluide et responsive.

#### Acceptance Criteria

1. WHEN l'application est développée THEN le système SHALL utiliser React avec TypeScript et Vite
2. WHEN l'application est accédée THEN le système SHALL fonctionner comme une PWA (Progressive Web App)
3. WHEN les données sont chargées THEN le système SHALL charger les données TheSession en mémoire
4. WHEN l'interface est utilisée THEN le système SHALL être responsive et optimisée pour mobile et desktop

### Requirement 5

**User Story:** En tant qu'utilisateur, je veux pouvoir rechercher et filtrer les morceaux musicaux, afin de trouver facilement les ressources qui m'intéressent.

#### Acceptance Criteria

1. WHEN les données sont normalisées THEN le système SHALL structurer les entités (morceaux, albums, artistes) de manière cohérente
2. WHEN une recherche est effectuée THEN le système SHALL supporter la recherche floue sur les noms d'albums et de morceaux
3. WHEN les filtres sont appliqués THEN le système SHALL permettre de filtrer par type de morceau
4. WHEN le tri est demandé THEN le système SHALL permettre de trier par popularité et autres critères

### Requirement 6

**User Story:** En tant qu'utilisateur, je veux analyser les relations entre morceaux et albums, afin de découvrir des connexions intéressantes dans la musique irlandaise.

#### Acceptance Criteria

1. WHEN les données sont analysées THEN le système SHALL identifier tous les albums contenant des morceaux spécifiques
2. WHEN les relations sont calculées THEN le système SHALL croiser les informations entre entités
3. WHEN la popularité est évaluée THEN le système SHALL classer les morceaux par popularité basée sur les données disponibles
4. WHEN les analyses complexes sont effectuées THEN le système SHALL utiliser des Web Workers pour éviter de bloquer l'interface

### Requirement 7

**User Story:** En tant que développeur, je veux un traitement performant des données, afin de gérer efficacement de gros volumes d'informations musicales.

#### Acceptance Criteria

1. WHEN les données sont traitées THEN le système SHALL utiliser des Web Workers pour les opérations lourdes
2. WHEN les calculs sont effectués THEN le système SHALL déléguer le traitement en arrière-plan
3. WHEN les résultats sont prêts THEN le système SHALL mettre à jour l'interface de manière non-bloquante
4. WHEN les performances sont critiques THEN le système SHALL optimiser le chargement et la manipulation des données

### Requirement 8

**User Story:** En tant que développeur, je veux analyser les types d'entités disponibles, afin de comprendre la structure des données et planifier les fonctionnalités.

#### Acceptance Criteria

1. WHEN les données TheSession sont récupérées THEN le système SHALL extraire et analyser les types d'entités
2. WHEN l'analyse est terminée THEN le système SHALL documenter la structure des données disponibles
3. WHEN les types sont identifiés THEN le système SHALL proposer des fonctionnalités adaptées aux données
4. WHEN le POC est créé THEN le système SHALL démontrer les capacités de base avec un sous-ensemble des données
