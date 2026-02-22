# T020 — Store delta use case

## Statut : `pending`

## Description

Implémenter le cas d'usage « stocker un delta ». Quand un device envoie un delta chiffré, le serveur le stocke pour tous les autres devices participants du document.

## Références spécifications

- §4.7 — Synchronisation (envoi de deltas)
- §7.1 — Rétention bornée

## Dépendances

- T018 (StoreDeltaUseCase interface)
- T019 (DeltaRepository, DeviceRepository)

## Critères d'acceptation

- [ ] Validation : le device est bien participant du document
- [ ] Le delta est stocké pour chaque device destinataire (sauf l'émetteur)
- [ ] Les limites de rétention sont vérifiées (suppression des plus anciens si nécessaire)
- [ ] Notification aux devices connectés en WebSocket (via port)
- [ ] Notification push aux devices non connectés (via port)
- [ ] Aucune dépendance framework dans l'implémentation
- [ ] Tests unitaires avec mocks des ports sortants

## Fichier cible

`server/src/main/java/dev/lokini/server/domain/usecase/`

## Étapes TDD

### Étape 1 — Analyse

- Détailler le flux de stockage d'un delta
- Identifier les validations nécessaires
- **Commit** : `T020-step1: analyze store delta use case`

### Étape 2 — Définition des interfaces

- Définir `StoreDeltaCommand` (delta, deviceId, documentId)
- Définir `StoreDeltaResult` (success/failure + raison)
- **Commit** : `T020-step2: define store delta use case interfaces`

### Étape 3 — Écriture des tests

- Tester le stockage normal (delta distribué aux destinataires)
- Tester le rejet si le device n'est pas participant
- Tester l'application des limites de rétention
- Tester la notification des devices connectés et non connectés
- **Commit** : `T020-step3: write store delta use case tests`

### Étape 4 — Implémentation

- Implémenter `StoreDeltaUseCaseImpl`
- Faire passer les tests
- **Commit** : `T020-step4: implement store delta use case`
