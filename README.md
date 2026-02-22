# Lokini

Application privacy-first et local-first de partage et synchronisation de documents texte entre appareils.

## Principes fondamentaux

- **Privacy-first** : chiffrement de bout en bout, le serveur ne peut jamais lire le contenu
- **Local-first** : les données vivent sur l'appareil, le serveur n'est qu'un relais de synchronisation
- **Simplicité** : toute la complexité technique est invisible pour l'utilisateur

## Architecture

### Monorepo

```
lokini/
├── packages/
│   ├── core/           @lokini/core — logique métier partagée (CRDT, crypto, sync)
│   ├── web/            Application React (web)
│   ├── mobile/         React Native — iOS + Android (post-MVP)
│   └── desktop/        Tauri — macOS, Windows, Linux (post-MVP)
├── server/             Serveur Java Quarkus (relais zero-knowledge)
└── docker/             Docker Compose (serveur + PostgreSQL)
```

### Client — Clean Architecture

| Couche | Responsabilité | Technologies |
|--------|---------------|-------------|
| **Présentation** | UI, navigation, thème | React 19, Tailwind CSS v4 |
| **Application** | Use cases, state management | Zustand |
| **Domaine** | Logique métier pure | @lokini/core (Automerge, libsodium) |
| **Infrastructure** | Réseau, stockage, notifications | REST, WebSocket, IndexedDB |

### Serveur — Architecture Hexagonale

| Composant | Responsabilité |
|-----------|---------------|
| **Domaine** | Gestion des deltas, routage, rétention bornée |
| **Ports entrants** | API REST, WebSocket |
| **Ports sortants** | PostgreSQL, push notifications (FCM/APNs) |

## Stack technique

| Composant | Technologies |
|-----------|-------------|
| Client web | React 19, Vite 6, TypeScript, ProseMirror |
| Logique partagée | Automerge (CRDT), libsodium (crypto) |
| Serveur | Java 25, Quarkus 3.31, PostgreSQL 17 |
| Migrations DB | Liquibase |
| Tests | Vitest (TS), JUnit 5 + ArchUnit (Java) |
| CI/CD | GitHub Actions |
| Déploiement | Docker Compose |

## Démarrage rapide

### Prérequis

- Node.js >= 22
- pnpm >= 9
- Java 25
- Maven
- Docker (pour PostgreSQL)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/arnaudroubinet/Lokini.git
cd Lokini

# Installer les dépendances TypeScript
pnpm install

# Lancer PostgreSQL pour le développement
docker compose -f docker/docker-compose.dev.yml up -d

# Lancer le serveur Quarkus (dans un terminal)
cd server && mvn quarkus:dev

# Lancer l'application web (dans un autre terminal)
pnpm dev
```

### Commandes

```bash
pnpm dev          # Serveur de développement web
pnpm build        # Build tous les packages
pnpm test         # Tous les tests
pnpm lint         # Linting
pnpm format       # Formatage du code
```

## Tests

Les tests d'architecture valident automatiquement le respect des règles :

- **TypeScript** : les tests Vitest vérifient que les couches Clean Architecture respectent les dépendances autorisées
- **Java** : ArchUnit vérifie que l'architecture hexagonale est respectée (domaine indépendant des frameworks)

```bash
pnpm test:core    # Tests @lokini/core
pnpm test:web     # Tests @lokini/web (inclut tests d'architecture)
cd server && mvn test   # Tests Java (inclut ArchUnit)
```

## Licence

[AGPL-3.0](LICENSE) — GNU Affero General Public License v3
