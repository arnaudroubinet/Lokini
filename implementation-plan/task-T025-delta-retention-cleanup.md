# T025 — Delta retention/cleanup use case

## Statut : `pending`

## Description

Implémenter le nettoyage automatique des deltas selon la rétention bornée : suppression après 90 jours ou au-delà de 5000 deltas par device.

## Références spécifications

- §7.1 — Rétention bornée des deltas
- §7.2 — Déconnexion d'un device

## Dépendances

- T018 (CleanupDeltasUseCase interface)
- T019 (DeltaRepository, DeviceRepository)

## Critères d'acceptation

- [ ] Suppression des deltas non récupérés après maxAge (défaut : 90 jours)
- [ ] Suppression des plus anciens quand maxDeltas dépassé (défaut : 5000)
- [ ] Détection des devices déconnectés (limites atteintes)
- [ ] Notification au premier device actif quand un device est déconnecté
- [ ] Paramètres de rétention configurables
- [ ] Tests unitaires

## Fichier cible

`server/src/main/java/dev/lokini/server/domain/usecase/`

## Étapes TDD

### Étape 1 — Analyse

- Modéliser la logique de rétention
- Définir le concept de « device déconnecté »
- **Commit** : `T025-step1: analyze delta retention cleanup`

### Étape 2 — Définition des interfaces

- Définir `CleanupResult` (nombre supprimé, devices déconnectés)
- **Commit** : `T025-step2: define delta retention cleanup interfaces`

### Étape 3 — Écriture des tests

- Tester la suppression par âge
- Tester la suppression par quantité
- Tester la détection de devices déconnectés
- Tester la notification
- Tester les paramètres configurables
- **Commit** : `T025-step3: write delta retention cleanup tests`

### Étape 4 — Implémentation

- Implémenter `CleanupDeltasUseCaseImpl`
- Faire passer les tests
- **Commit** : `T025-step4: implement delta retention cleanup`
