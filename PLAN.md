# Plan — Mise en place de l'arborescence projet Lokini

## Arborescence cible

```
lokini/
├── .github/
│   └── workflows/
│       ├── ci.yml                         # CI: lint, test, build (chaque push/PR)
│       └── release.yml                    # Release: Docker image, build web statique
│
├── packages/
│   ├── core/                              # @lokini/core — logique métier partagée
│   │   ├── src/
│   │   │   ├── crdt/                      # Moteur CRDT (intégration Automerge)
│   │   │   │   ├── index.ts
│   │   │   │   ├── document.ts            # Gestion document CRDT
│   │   │   │   ├── operations.ts          # Opérations CRDT
│   │   │   │   └── compaction.ts          # Compaction automatique
│   │   │   ├── crypto/                    # Opérations cryptographiques (libsodium)
│   │   │   │   ├── index.ts
│   │   │   │   ├── keys.ts               # Génération/échange de clés (X25519)
│   │   │   │   ├── encryption.ts          # Chiffrement symétrique (XChaCha20-Poly1305)
│   │   │   │   ├── signatures.ts          # Signatures (Ed25519)
│   │   │   │   ├── ratchet.ts             # Sender Keys / ratchet symétrique
│   │   │   │   ├── kdf.ts                # Dérivation (HKDF-SHA256)
│   │   │   │   └── local.ts              # Chiffrement au repos (Argon2id)
│   │   │   ├── sync/                      # Logique de synchronisation
│   │   │   │   ├── index.ts
│   │   │   │   ├── delta.ts              # Gestion des deltas
│   │   │   │   ├── protocol.ts           # Protocole pull/push
│   │   │   │   └── offline.ts            # Mode offline
│   │   │   ├── models/                    # Types et modèles partagés
│   │   │   │   ├── index.ts
│   │   │   │   ├── document.ts           # Document de base
│   │   │   │   ├── device.ts             # Identité device
│   │   │   │   ├── note.ts               # Type Note
│   │   │   │   ├── todo.ts               # Type To-do (post-MVP)
│   │   │   │   └── shopping-list.ts      # Type Liste de courses (post-MVP)
│   │   │   └── index.ts                   # Point d'entrée principal
│   │   ├── tests/
│   │   │   ├── crdt/
│   │   │   ├── crypto/
│   │   │   ├── sync/
│   │   │   └── models/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsup.config.ts
│   │   └── vitest.config.ts
│   │
│   ├── web/                               # Application React (web) — MVP
│   │   ├── src/
│   │   │   ├── presentation/              # Couche Présentation (Clean Architecture)
│   │   │   │   ├── components/            # Composants UI réutilisables
│   │   │   │   │   └── .gitkeep
│   │   │   │   ├── pages/                 # Pages/écrans
│   │   │   │   │   └── .gitkeep
│   │   │   │   ├── layouts/               # Layouts
│   │   │   │   │   └── .gitkeep
│   │   │   │   ├── hooks/                 # React hooks custom
│   │   │   │   │   └── .gitkeep
│   │   │   │   └── theme/                 # Thème (clair/sombre/auto)
│   │   │   │       └── .gitkeep
│   │   │   ├── application/               # Couche Application
│   │   │   │   ├── usecases/              # Cas d'usage
│   │   │   │   │   └── .gitkeep
│   │   │   │   └── store/                 # Zustand stores
│   │   │   │       └── .gitkeep
│   │   │   ├── infrastructure/            # Couche Infrastructure
│   │   │   │   ├── api/                   # Client REST
│   │   │   │   │   └── .gitkeep
│   │   │   │   ├── websocket/             # Client WebSocket
│   │   │   │   │   └── .gitkeep
│   │   │   │   ├── storage/               # IndexedDB adapter
│   │   │   │   │   └── .gitkeep
│   │   │   │   └── push/                  # Push notifications
│   │   │   │       └── .gitkeep
│   │   │   ├── i18n/                      # Configuration i18n
│   │   │   │   ├── index.ts
│   │   │   │   └── locales/
│   │   │   │       ├── fr.json
│   │   │   │       └── en.json
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── public/
│   │   │   └── .gitkeep
│   │   ├── tests/
│   │   │   ├── presentation/
│   │   │   ├── application/
│   │   │   └── infrastructure/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   └── vitest.config.ts
│   │
│   ├── mobile/                            # React Native (post-MVP)
│   │   └── README.md                      # Placeholder — React Native iOS + Android
│   │
│   └── desktop/                           # Tauri wrapper (post-MVP)
│       └── README.md                      # Placeholder — Tauri desktop app
│
├── server/                                # Serveur Java Quarkus
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/dev/lokini/server/
│   │   │   │   ├── domain/                # Domaine (centre hexagonal)
│   │   │   │   │   ├── model/             # Modèles domaine
│   │   │   │   │   │   └── .gitkeep
│   │   │   │   │   ├── port/
│   │   │   │   │   │   ├── in/            # Ports entrants (driving)
│   │   │   │   │   │   │   └── .gitkeep
│   │   │   │   │   │   └── out/           # Ports sortants (driven)
│   │   │   │   │   │       └── .gitkeep
│   │   │   │   │   └── usecase/           # Cas d'usage domaine
│   │   │   │   │       └── .gitkeep
│   │   │   │   └── adapter/               # Adaptateurs
│   │   │   │       ├── in/
│   │   │   │       │   ├── rest/          # API REST (Quarkus RESTEasy)
│   │   │   │       │   │   └── .gitkeep
│   │   │   │       │   └── ws/            # WebSocket
│   │   │   │       │       └── .gitkeep
│   │   │   │       └── out/
│   │   │   │           ├── persistence/   # PostgreSQL (Hibernate/Panache)
│   │   │   │           │   └── .gitkeep
│   │   │   │           ├── push/          # FCM/APNs notifications
│   │   │   │           │   └── .gitkeep
│   │   │   │           └── pubsub/        # Pub/Sub inter-instances (cluster)
│   │   │   │               └── .gitkeep
│   │   │   └── resources/
│   │   │       ├── application.properties # Configuration Quarkus
│   │   │       └── db/
│   │   │           └── changelog/
│   │   │               └── db.changelog-master.xml  # Liquibase master
│   │   └── test/
│   │       └── java/dev/lokini/server/
│   │           ├── domain/                # Tests unitaires domaine
│   │           │   └── .gitkeep
│   │           ├── adapter/               # Tests adapters
│   │           │   └── .gitkeep
│   │           └── integration/           # Tests d'intégration
│   │               └── .gitkeep
│   ├── pom.xml
│   └── .dockerignore
│
├── docker/
│   ├── docker-compose.yml                 # Production : Quarkus + PostgreSQL
│   ├── docker-compose.dev.yml             # Développement : PostgreSQL seul
│   └── Dockerfile.server                  # Image Docker du serveur
│
├── .editorconfig                          # Conventions de formatage
├── .gitignore                             # Mis à jour pour Java + Node + Docker
├── .nvmrc                                 # Version Node.js
├── pnpm-workspace.yaml                    # Configuration pnpm workspaces
├── package.json                           # Root — scripts monorepo
├── eslint.config.js                       # ESLint flat config (monorepo)
├── prettier.config.js                     # Prettier config
├── LICENSE
├── README.md
└── SPECIFICATIONS.md
```

## Étapes d'implémentation

### Étape 1 — Configuration racine du monorepo
- Mettre à jour `.gitignore` (Node.js, Java, IDE, Docker, OS)
- Créer `pnpm-workspace.yaml`
- Créer `package.json` racine (scripts: lint, test, build, dev)
- Créer `.nvmrc` (Node 22 LTS)
- Créer `.editorconfig`
- Créer `eslint.config.js` (ESLint flat config)
- Créer `prettier.config.js`

### Étape 2 — Package @lokini/core
- Initialiser `packages/core/package.json` avec dépendances :
  - `@automerge/automerge` (CRDT)
  - `libsodium-wrappers-sumo` (crypto)
  - `vitest` (test, devDep)
  - `tsup` (build, devDep)
  - `typescript` (devDep)
- Créer `tsconfig.json` (strict, ESM)
- Créer `tsup.config.ts` (ESM + CJS, dts)
- Créer `vitest.config.ts`
- Créer l'arborescence `src/` avec fichiers index barrel
- Créer l'arborescence `tests/`

### Étape 3 — Application web React
- Initialiser `packages/web/package.json` avec dépendances :
  - `react`, `react-dom`
  - `react-router-dom`
  - `prosemirror-*` (model, state, view, commands, schema-basic, etc.)
  - `zustand` (state management)
  - `react-i18next`, `i18next`
  - `tailwindcss`, `postcss`, `autoprefixer`
  - `@lokini/core` (workspace dependency)
  - `vite`, `vitest`, `typescript` (devDeps)
  - `@testing-library/react` (devDep)
- Créer `tsconfig.json`
- Créer `vite.config.ts`
- Créer `tailwind.config.ts` (thème clair/sombre)
- Créer `postcss.config.js`
- Créer `vitest.config.ts`
- Créer l'arborescence Clean Architecture (`presentation/`, `application/`, `infrastructure/`)
- Créer la configuration i18n avec fichiers FR/EN initiaux
- Créer `index.html`, `main.tsx`, `App.tsx` minimaux
- Créer l'arborescence `tests/`

### Étape 4 — Placeholders post-MVP
- Créer `packages/mobile/README.md` (placeholder React Native)
- Créer `packages/desktop/README.md` (placeholder Tauri)

### Étape 5 — Serveur Java Quarkus
- Créer `server/pom.xml` avec :
  - Quarkus BOM (dernière version)
  - Java 25
  - Extensions : RESTEasy Reactive, WebSockets, Hibernate ORM Panache, JDBC PostgreSQL, Liquibase, OpenTelemetry, Jackson
  - Test : JUnit 5, Quarkus Test, Testcontainers, REST Assured, Mockito
- Créer l'arborescence hexagonale (`domain/`, `adapter/`)
- Créer `application.properties` (config dev par défaut)
- Créer `db.changelog-master.xml` (Liquibase master vide)
- Créer `.dockerignore`
- Créer l'arborescence `test/`

### Étape 6 — Docker
- Créer `docker/Dockerfile.server` (multi-stage build Quarkus)
- Créer `docker/docker-compose.yml` (Quarkus + PostgreSQL)
- Créer `docker/docker-compose.dev.yml` (PostgreSQL seul pour dev)

### Étape 7 — CI/CD GitHub Actions
- Créer `.github/workflows/ci.yml` :
  - Lint TS (ESLint) + Lint Java (Checkstyle)
  - Tests unitaires (Vitest + JUnit)
  - Tests d'intégration (Testcontainers + PostgreSQL)
  - Build web (Vite) + Build serveur (Quarkus)
  - Vérification des seuils de couverture
- Créer `.github/workflows/release.yml` :
  - Build et publish image Docker serveur
  - Build statique web

### Étape 8 — Vérification
- `pnpm install` pour valider le workspace
- `pnpm -r build` pour valider les builds TS
- `mvn compile` dans server/ pour valider la compilation Java
- Vérifier que les tests passent (même vides)
