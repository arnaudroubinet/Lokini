# T024 — Device push registration use case

## Statut : `pending`

## Description

Implémenter le cas d'usage « enregistrer le push token d'un device ». Permet au serveur d'envoyer des notifications push quand des deltas arrivent et que le device n'a pas de WebSocket actif.

## Références spécifications

- §4.7 — Push notifications (FCM/APNs)
- §4.7 — Identification côté serveur

## Dépendances

- T018 (RegisterDeviceUseCase interface)
- T019 (DeviceRepository)

## Critères d'acceptation

- [ ] Enregistrement du push token pour un couple {deviceId, documentId}
- [ ] Mise à jour du token si déjà enregistré
- [ ] Suppression du token (désinscription)
- [ ] Validation du format du token
- [ ] Tests unitaires

## Fichier cible

`server/src/main/java/dev/lokini/server/domain/usecase/`

## Étapes TDD

### Étape 1 — Analyse

- Comprendre le flux d'enregistrement push (FCM/APNs)
- Identifier les données minimales nécessaires
- **Commit** : `T024-step1: analyze device push registration`

### Étape 2 — Définition des interfaces

- Définir `RegisterDeviceCommand` et `RegisterDeviceResult`
- **Commit** : `T024-step2: define device push registration interfaces`

### Étape 3 — Écriture des tests

- Tester l'enregistrement initial
- Tester la mise à jour du token
- Tester la suppression
- Tester la validation
- **Commit** : `T024-step3: write device push registration tests`

### Étape 4 — Implémentation

- Implémenter `RegisterDeviceUseCaseImpl`
- Faire passer les tests
- **Commit** : `T024-step4: implement device push registration`
