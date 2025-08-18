# Requirements Document

## Introduction

Tunebook est un monorepo d'exploration de ressources musicales irlandaises qui permet aux utilisateurs de découvrir, rechercher et analyser une vaste collection de morceaux, albums et informations musicales. Le projet utilise les données de TheSession (https://github.com/adactio/TheSession-data) et propose une architecture moderne avec pnpm, des services Node.js/Fastify, une PWA React/Vite, et une infrastructure dockerisée.

## Requirements

### Requirement 1

**User Story:** En tant que développeur, je veux un monorepo bien structuré avec pnpm, afin de pouvoir gérer efficacement plusieurs projets interconnectés.

#### Acceptance Criteria

1. WHEN le projet est initialisé THEN le système SHALL utiliser pnpm comme gestionnaire de dépendances
2. WHEN la structure est créée THEN le système SHALL organiser les projets en packages distincts (serveurs Node.js, PWA React, utilitaires partagés)
3. WHEN les dépendances sont installées THEN le système SHALL permettre le partage de dépendances communes entre packages
4. IF un framework de monorepo est nécessaire THEN le système SHALL évaluer et potentiellement intégrer des outils comme Bit

### Requirement 2

**User Story:** En tant que développeur, je veux des services Node.js avec Fastify, afin de créer rapidement des APIs performantes pour les données musicales.

#### Acceptance Criteria

1. WHEN un service est créé THEN le système SHALL utiliser Fastify comme framework web
2. WHEN les routes sont définies THEN le système SHALL supporter les opérations CRUD sur les entités musicales
3. IF GraphQL est implémenté THEN le système SHALL fournir une couche GraphQL en plus des routes REST
4. WHEN les services sont déployés THEN le système SHALL être dockerisés pour faciliter le déploiement

### Requirement 3

**User Story:** En tant que développeur, je veux une infrastructure dockerisée, afin de standardiser l'environnement de développement et de déploiement.

#### Acceptance Criteria

1. WHEN l'infrastructure est configurée THEN le système SHALL inclure un conteneur PostgreSQL
2. WHEN les services sont containerisés THEN le système SHALL dockeriser chaque service Node.js
3. WHEN le développement commence THEN le système SHALL fournir un docker-compose pour l'environnement local
4. WHEN les conteneurs sont lancés THEN le système SHALL permettre la communication entre services

### Requirement 4

**User Story:** En tant qu'utilisateur, je veux une PWA React performante, afin d'explorer les ressources musicales irlandaises de manière fluide et responsive.

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
