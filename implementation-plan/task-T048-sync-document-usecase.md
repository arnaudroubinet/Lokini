# T048 — Sync document use case

## Statut : `pending`

## Description

Implémenter le cas d'usage « synchroniser un document ». Orchestre le pull des deltas distants, leur application locale, et le push des deltas locaux. Gère la connexion WebSocket pour le temps réel.

## Références spécifications

- §4.7 — Synchronisation (pull → merge → push)
- §4.7 — Protocole de communication (REST + WebSocket)

## Dépendances

- T044 (Document store)
- T015 (Sync protocol)
- T039 (REST API client)
- T040 (WebSocket client)

## Critères d'acceptation

- [ ] Pull des deltas via REST
- [ ] Déchiffrement et vérification des deltas
- [ ] Application sur le document CRDT local (merge)
- [ ] Push des deltas locaux en attente
- [ ] Connexion WebSocket pour le temps réel quand le document est ouvert
- [ ] Déconnexion WebSocket quand le document est fermé
- [ ] Gestion des erreurs réseau
- [ ] Tests unitaires avec mocks

## Fichier cible

`packages/web/src/application/usecases/`

## Étapes TDD

### Étape 1 — Analyse

- Orchestration pull/push/realtime
- **Commit** : `T048-step1: analyze sync document use case`

### Étape 2 — Définition des interfaces

- Définir `SyncDocumentParams` et les callbacks
- **Commit** : `T048-step2: define sync document use case interfaces`

### Étape 3 — Écriture des tests

- Tester le flux pull → merge → push
- Tester la réception temps réel
- Tester les erreurs réseau
- **Commit** : `T048-step3: write sync document use case tests`

### Étape 4 — Implémentation

- Implémenter l'orchestration
- Faire passer les tests
- **Commit** : `T048-step4: implement sync document use case`
