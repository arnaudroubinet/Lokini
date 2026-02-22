# T063 — Server linking support

## Statut : `pending`

## Description

Adapter le serveur pour supporter les documents système utilisés par le linking. Du point de vue du serveur, un canal de liaison est simplement un document comme un autre.

## Références spécifications

- §4.10 — Appairage (le serveur ne sait pas que les devices sont liés)

## Dépendances

- T022 (Join document use case)
- T034 (WebSocket adapter)

## Critères d'acceptation

- [ ] Aucune modification spécifique nécessaire (les canaux sont des documents normaux)
- [ ] Vérification que les documents système fonctionnent avec l'infrastructure existante
- [ ] Tests d'intégration validant le flux complet de linking via le serveur
- [ ] Documentation du fait que le serveur est agnostique au linking

## Fichier cible

`server/src/test/java/dev/lokini/server/integration/`

## Étapes TDD

### Étape 1 — Analyse

- Vérifier que l'architecture serveur supporte le linking sans modification
- **Commit** : `T063-step1: analyze server linking support`

### Étape 2 — Définition des interfaces

- Aucune nouvelle interface (validation de l'existant)
- **Commit** : `T063-step2: validate server linking compatibility`

### Étape 3 — Écriture des tests

- Tests d'intégration : création de canal, échange de messages, heartbeat
- **Commit** : `T063-step3: write server linking integration tests`

### Étape 4 — Implémentation

- Ajustements si nécessaire
- Faire passer les tests
- **Commit** : `T063-step4: implement server linking support`
