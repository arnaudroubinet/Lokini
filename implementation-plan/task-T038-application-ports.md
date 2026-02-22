# T038 — Application ports (interfaces for infrastructure)

## Statut : `pending`

## Description

Définir les ports (interfaces) de la couche Application du client web. Ces interfaces sont implémentées par la couche Infrastructure et consommées par les use cases. Elles découplent la logique métier des implémentations concrètes (REST, WebSocket, IndexedDB, push).

## Références spécifications

- §8.3 — Architecture client (Clean Architecture)
- §8.3 — Règle de dépendance

## Dépendances

- T002 (DocumentMetadata)
- T014 (SealedDelta)

## Critères d'acceptation

- [ ] Interface `DocumentApiPort` (createDocument, joinDocument, leaveDocument, createInvitation)
- [ ] Interface `DeltaApiPort` (sendDelta, retrieveDeltas)
- [ ] Interface `RealtimePort` (connect, disconnect, onDelta, sendDelta)
- [ ] Interface `LocalStoragePort` (saveDocument, loadDocument, deleteDocument, listDocuments)
- [ ] Interface `PushNotificationPort` (register, unregister)
- [ ] Les interfaces n'importent que depuis `@lokini/core`
- [ ] Validation par les tests d'architecture existants
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/application/ports/`

## Étapes TDD

### Étape 1 — Analyse

- Identifier toutes les interactions entre Application et Infrastructure
- Définir les contrats
- **Commit** : `T038-step1: analyze application ports`

### Étape 2 — Définition des interfaces

- Définir les interfaces TypeScript
- **Commit** : `T038-step2: define application port interfaces`

### Étape 3 — Écriture des tests

- Tester via les tests d'architecture que les ports respectent les règles de dépendance
- **Commit** : `T038-step3: write application ports architecture tests`

### Étape 4 — Implémentation

- Finaliser les interfaces
- Vérifier les tests
- **Commit** : `T038-step4: implement application ports`
