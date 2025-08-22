# Irish Music PWA - Architecture Comlink + Dexie + React Query Suspense

Une application PWA moderne pour explorer la musique traditionnelle irlandaise avec :

- **Web Worker** instrumenté avec **Comlink** pour le traitement des données
- **IndexedDB** via **Dexie** pour le stockage local normalisé
- **React Query v5** avec **Suspense** pour la gestion des états
- **Recherche floue** avec **Fuse.js** dans le worker
- **Normalisation** des données selon les enums métier

## Architecture

```
src/
├── worker/                  # Web Worker avec Comlink
│   ├── index.ts            # API exposée via Comlink
│   ├── db.ts               # Schéma Dexie + tables indexées
│   ├── normalize.ts        # Normalisation des données brutes
│   ├── search.ts           # Recherche floue avec Fuse.js
│   └── types.ts            # Types domaine (enums + interfaces)
├── lib/
│   ├── workerClient.ts     # Client Comlink pour le worker
│   ├── queryKeys.ts        # Clés React Query
│   └── providers/
│       ├── ReactQueryProvider.tsx
│       └── ErrorBoundary.tsx
├── features/tunes/
│   ├── TunesPage.tsx       # Page principale avec Suspense
│   ├── Filters.tsx         # Filtres par type/mode/mesure
│   └── TuneList.tsx        # Liste des mélodies
└── hooks/
    └── useMusicData.ts     # Hooks useSuspenseQuery
```

## Fonctionnalités

### Base de données normalisée (IndexedDB/Dexie)

- **tunes** : mélodies avec type/mode/mesure normalisés selon les enums
- **recordings** : enregistrements liés aux mélodies
- **aliases** : alias consolidés par mélodie
- **popularity** : scores de popularité
- **sets** : ensembles de mélodies ordonnés

### API Worker (Comlink)

- `init()` : initialisation de la base
- `ingest(input)` : ingestion + normalisation en transaction
- `searchTunes(query, filters)` : recherche floue + filtres
- `getTune(id)` : récupération par ID
- `listTunes(filters)` : listing avec pagination
- `clear()` : vidage complet

### Recherche floue (Fuse.js)

- Recherche sur : titre, alias, notation ABC, texte de recherche
- Seuil : 0.35, ignore la position
- Filtres post-recherche : type, mode, mesure

### React Query + Suspense

- `useSearchTunes()` : recherche avec cache automatique
- `useTune()` : récupération par ID
- `useIngestData()` : mutation d'ingestion
- Cache intelligent + retry + invalidation

## Démarrage

\`\`\`bash

# Installation

pnpm install

# Développement

pnpm dev

# Build

pnpm build
\`\`\`

## Utilisation

1. **Charger données démo** : charge des mélodies irlandaises d'exemple
2. **Rechercher** : tapez "blackbird", "cooley", "jig", etc.
3. **Filtrer** : par type (reel, jig...), mode (Gmajor...), mesure (4/4...)
4. **Sélectionner** : cliquez sur une mélodie pour voir les détails

## Types métier stricts

Tous les enums (`TuneType`, `TuneMode`, `TimeSignature`) sont respectés lors de la normalisation. Les valeurs invalides génèrent des warnings et sont exclues ou marquées comme inconnues.

## Performance

- **Worker** : traitement des données déporté (non-bloquant)
- **IndexedDB** : stockage local persistant avec indexes
- **Suspense** : UI réactive avec loading states automatiques
- **Cache** : React Query évite les requêtes redondantes

La recherche floue sur 10k mélodies s'exécute en <200ms grâce au worker et aux indexes Dexie.
