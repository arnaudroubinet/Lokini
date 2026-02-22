# CLAUDE.md — Règles de développement Lokini

## Projet

Lokini est une application privacy-first, local-first de partage et synchronisation de documents texte. Le serveur est zero-knowledge : il ne peut jamais lire le contenu des documents.

## Monorepo

```
packages/core/    → @lokini/core (logique métier partagée, TypeScript)
packages/web/     → Application React (web) — MVP
packages/mobile/  → React Native (post-MVP)
packages/desktop/ → Tauri wrapper (post-MVP)
server/           → Serveur Java Quarkus
```

Gestionnaire de paquets : **pnpm workspaces**. Ne jamais utiliser npm ou yarn.

## Architecture client — Clean Architecture

L'application web suit une Clean Architecture stricte en 4 couches :

```
Présentation  →  Application  →  Domaine (@lokini/core)
                                      ↑
Infrastructure ─────────────────────────┘
```

### Règles de dépendance (STRICTES)

1. **@lokini/core** (domaine) : AUCUNE dépendance sur React, le navigateur, ou toute plateforme. Uniquement de la logique métier pure.
2. **presentation/** : peut importer depuis `application/` et `@lokini/core`. NE PEUT PAS importer depuis `infrastructure/`.
3. **application/** : peut importer depuis `@lokini/core`. NE PEUT PAS importer depuis `presentation/` ni `infrastructure/` directement (utilise des ports/interfaces).
4. **infrastructure/** : peut importer depuis `application/` (pour implémenter les ports) et `@lokini/core`. NE PEUT PAS importer depuis `presentation/`.

### Structure web (packages/web/src/)

- `presentation/` — Composants React, pages, layouts, hooks, thème
- `application/` — Use cases, Zustand stores
- `infrastructure/` — Clients REST, WebSocket, IndexedDB, push notifications
- `i18n/` — Internationalisation (FR/EN via react-i18next)

## Architecture serveur — Hexagonale (Ports & Adapters)

### Règles de dépendance (STRICTES)

1. **domain/** (centre) : AUCUNE dépendance sur les frameworks (Quarkus, Jakarta, Hibernate). Uniquement du Java pur.
2. **domain/port/in/** : interfaces des cas d'usage (driving ports)
3. **domain/port/out/** : interfaces des dépendances externes (driven ports)
4. **domain/usecase/** : implémentation des cas d'usage, dépend uniquement des ports
5. **domain/model/** : modèles de domaine, aucune annotation framework
6. **adapter/in/** : contrôleurs REST et WebSocket, dépendent des ports entrants
7. **adapter/out/** : implémentations PostgreSQL, push, pub/sub, dépendent des ports sortants

### Package Java : `dev.lokini.server`

```
dev.lokini.server.domain.model/
dev.lokini.server.domain.port.in/
dev.lokini.server.domain.port.out/
dev.lokini.server.domain.usecase/
dev.lokini.server.adapter.in.rest/
dev.lokini.server.adapter.in.ws/
dev.lokini.server.adapter.out.persistence/
dev.lokini.server.adapter.out.push/
dev.lokini.server.adapter.out.pubsub/
```

## Stack technique

### Client (TypeScript)
- **Build** : Vite 6 (web), tsup (@lokini/core)
- **UI** : React 19, Tailwind CSS v4
- **State** : Zustand
- **Éditeur** : ProseMirror (direct)
- **CRDT** : Automerge
- **Crypto** : libsodium-wrappers-sumo (X25519, XChaCha20-Poly1305, Ed25519, Argon2id, HKDF-SHA256, BLAKE2b)
- **i18n** : react-i18next
- **Tests** : Vitest
- **Lint** : ESLint 9 (flat config) + Prettier

### Serveur (Java)
- **Java 25**, **Quarkus 3.31**, **Maven**
- **DB** : PostgreSQL 17, migrations Liquibase
- **Tests** : JUnit 5, Mockito, REST Assured, Testcontainers, ArchUnit
- **Observabilité** : OpenTelemetry

## Commandes

```bash
# Développement
pnpm dev              # Lance le serveur de dev web (Vite)
pnpm build            # Build tous les packages TS
pnpm build:core       # Build @lokini/core uniquement
pnpm build:web        # Build @lokini/web uniquement
pnpm test             # Tous les tests TS
pnpm test:core        # Tests @lokini/core
pnpm test:web         # Tests @lokini/web
pnpm lint             # ESLint sur tous les packages
pnpm format           # Prettier sur tous les packages

# Serveur Java (depuis server/)
mvn compile           # Compilation
mvn test              # Tests unitaires
mvn verify            # Tests d'intégration
mvn quarkus:dev       # Serveur de dev Quarkus

# Docker
docker compose -f docker/docker-compose.dev.yml up   # PostgreSQL dev
docker compose -f docker/docker-compose.yml up        # Serveur + PostgreSQL
```

## Conventions

- **Langue du code** : anglais (noms de variables, fonctions, classes, commentaires techniques)
- **Langue de la documentation** : français
- **Commits** : messages en anglais, concis, descriptifs
- **Pas de secrets** dans le code — utiliser les variables d'environnement
- **Zero-knowledge** : le serveur ne doit JAMAIS avoir accès au contenu des documents, pseudonymes, ou toute donnée personnelle
- **Tests d'architecture** : les tests ArchUnit (Java) et Vitest (TS) valident automatiquement le respect des règles de dépendance. Ne jamais les désactiver.

## Seuils de couverture

- **Code critique** (CRDT, crypto, sync) : **90%** minimum
- **Reste du code** : **70%** minimum

## Sécurité

- Tout contenu est chiffré côté client avant envoi (E2E encryption)
- XChaCha20-Poly1305 pour le chiffrement symétrique
- Ed25519 pour les signatures
- Argon2id pour le chiffrement au repos
- Sender Keys avec ratchet symétrique (forward secrecy)
- Pas de compte utilisateur — identité par device/document (clé publique/privée)
