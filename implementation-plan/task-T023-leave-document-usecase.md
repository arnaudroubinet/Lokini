# T023 — Leave document use case

## Statut : `pending`

## Description

Implémenter le cas d'usage « quitter un document ». Le device signale son départ, les deltas en attente pour lui sont supprimés, et les autres participants sont notifiés.

## Références spécifications

- §4.5 — Quitter un document
- §7.5 — Suppression de documents

## Dépendances

- T018 (LeaveDocumentUseCase interface)
- T019 (DeviceRepository, DeltaRepository)

## Critères d'acceptation

- [ ] Suppression du device de la liste des participants du document
- [ ] Suppression des deltas en attente pour ce device
- [ ] Suppression du push token associé
- [ ] Notification aux autres participants du départ
- [ ] Nettoyage complet quand le dernier device quitte
- [ ] Tests unitaires

## Fichier cible

`server/src/main/java/dev/lokini/server/domain/usecase/`

## Étapes TDD

### Étape 1 — Analyse

- Détailler le flux de départ
- Cas du dernier device (document orphelin)
- **Commit** : `T023-step1: analyze leave document use case`

### Étape 2 — Définition des interfaces

- Définir `LeaveDocumentCommand` et `LeaveDocumentResult`
- **Commit** : `T023-step2: define leave document use case interfaces`

### Étape 3 — Écriture des tests

- Tester le départ normal
- Tester le nettoyage des deltas et push token
- Tester la notification aux participants
- Tester le dernier device quittant
- **Commit** : `T023-step3: write leave document use case tests`

### Étape 4 — Implémentation

- Implémenter `LeaveDocumentUseCaseImpl`
- Faire passer les tests
- **Commit** : `T023-step4: implement leave document use case`
