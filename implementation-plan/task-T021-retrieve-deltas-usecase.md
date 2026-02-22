# T021 — Retrieve deltas use case

## Statut : `pending`

## Description

Implémenter le cas d'usage « récupérer les deltas en attente ». Un device demande les deltas qu'il n'a pas encore récupérés pour un document donné.

## Références spécifications

- §4.7 — Synchronisation (récupération de deltas en attente)
- §7.1 — Rétention bornée

## Dépendances

- T018 (RetrieveDeltasUseCase interface)
- T019 (DeltaRepository, DeviceRepository)

## Critères d'acceptation

- [ ] Validation : le device est bien participant du document
- [ ] Retour des deltas non encore récupérés, ordonnés chronologiquement
- [ ] Marquage des deltas comme récupérés par ce device
- [ ] Suppression des deltas récupérés par tous les devices
- [ ] Mise à jour de la dernière activité du device
- [ ] Tests unitaires avec mocks

## Fichier cible

`server/src/main/java/dev/lokini/server/domain/usecase/`

## Étapes TDD

### Étape 1 — Analyse

- Détailler le flux de récupération
- Gestion du marquage et de la suppression
- **Commit** : `T021-step1: analyze retrieve deltas use case`

### Étape 2 — Définition des interfaces

- Définir `RetrieveDeltasQuery` et `RetrieveDeltasResult`
- **Commit** : `T021-step2: define retrieve deltas use case interfaces`

### Étape 3 — Écriture des tests

- Tester la récupération avec deltas en attente
- Tester la récupération sans deltas (liste vide)
- Tester le marquage et la suppression
- Tester le rejet si device non participant
- **Commit** : `T021-step3: write retrieve deltas use case tests`

### Étape 4 — Implémentation

- Implémenter `RetrieveDeltasUseCaseImpl`
- Faire passer les tests
- **Commit** : `T021-step4: implement retrieve deltas use case`
