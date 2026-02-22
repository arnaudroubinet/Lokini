# T019 — Driven ports (repository/push/pubsub interfaces)

## Statut : `pending`

## Description

Définir les ports sortants (driven ports) du serveur : les interfaces pour la persistance, les push notifications et le pub/sub inter-instances.

## Références spécifications

- §8.4 — Architecture hexagonale (ports sortants)
- §7.1 — Rétention bornée (persistance)
- §4.7 — Push notifications
- §7.3 — Haute disponibilité (pub/sub)

## Dépendances

- T017 (Server domain models)

## Critères d'acceptation

- [ ] Interface `DeltaRepository` (store, retrieve, delete, findExpired)
- [ ] Interface `DeviceRepository` (register, unregister, findByDocument, updateLastActivity)
- [ ] Interface `InvitationTokenRepository` (store, findByHash, markUsed, deleteExpired)
- [ ] Interface `PushNotificationPort` (sendNotification)
- [ ] Interface `PubSubPort` (publish, subscribe) pour le cluster
- [ ] Toutes les interfaces utilisent uniquement des types du domaine
- [ ] Aucune dépendance framework
- [ ] Validation par ArchUnit

## Fichier cible

`server/src/main/java/dev/lokini/server/domain/port/out/`

## Étapes TDD

### Étape 1 — Analyse

- Identifier toutes les dépendances externes du domaine
- Définir les contrats de chaque repository
- **Commit** : `T019-step1: analyze driven ports`

### Étape 2 — Définition des interfaces

- Définir les interfaces Java
- Utiliser les types du domaine pour les paramètres et retours
- **Commit** : `T019-step2: define driven port interfaces`

### Étape 3 — Écriture des tests

- Tester via ArchUnit que tous les ports sortants sont des interfaces
- Tester l'indépendance vis-à-vis des frameworks
- **Commit** : `T019-step3: write driven ports architecture tests`

### Étape 4 — Implémentation

- Finaliser les interfaces
- Vérifier les tests d'architecture
- **Commit** : `T019-step4: implement driven ports`
