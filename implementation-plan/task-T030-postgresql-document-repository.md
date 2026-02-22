# T030 — PostgreSQL document & invitation token repository

## Statut : `pending`

## Description

Implémenter les adaptateurs PostgreSQL pour la gestion des documents et des tokens d'invitation.

## Références spécifications

- §4.4 — Rejoindre un document (tokens)
- §7.5 — Suppression de documents

## Dépendances

- T019 (InvitationTokenRepository interface)
- T027 (Schéma Liquibase)

## Critères d'acceptation

- [ ] Implémente `InvitationTokenRepository`
- [ ] Stockage d'un token d'invitation (hash, documentId, expiration)
- [ ] Recherche par hash
- [ ] Marquage comme utilisé
- [ ] Suppression des tokens expirés
- [ ] Gestion du cycle de vie des documents (création, suppression quand orphelin)
- [ ] Tests d'intégration avec Testcontainers

## Fichier cible

`server/src/main/java/dev/lokini/server/adapter/out/persistence/`

## Étapes TDD

### Étape 1 — Analyse

- Requêtes SQL pour tokens et documents
- **Commit** : `T030-step1: analyze PostgreSQL document repository`

### Étape 2 — Définition des interfaces

- Entités JPA et mappers
- **Commit** : `T030-step2: define PostgreSQL document repository mapping`

### Étape 3 — Écriture des tests

- Tests d'intégration
- **Commit** : `T030-step3: write PostgreSQL document repository tests`

### Étape 4 — Implémentation

- Implémenter les adapters
- Faire passer les tests
- **Commit** : `T030-step4: implement PostgreSQL document repository`
