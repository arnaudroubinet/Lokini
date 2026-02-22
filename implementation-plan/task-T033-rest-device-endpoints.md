# T033 — REST API — Device registration endpoints

## Statut : `pending`

## Description

Implémenter les endpoints REST pour l'enregistrement des devices et leurs push tokens.

## Références spécifications

- §4.7 — Push notifications
- §4.7 — Identification côté serveur

## Dépendances

- T024 (RegisterDeviceUseCase)

## Critères d'acceptation

- [ ] `POST /api/v1/devices/{deviceId}/push-token` — enregistrer le push token
- [ ] `DELETE /api/v1/devices/{deviceId}/push-token` — supprimer le push token
- [ ] Validation des entrées
- [ ] Tests d'intégration

## Fichier cible

`server/src/main/java/dev/lokini/server/adapter/in/rest/`

## Étapes TDD

### Étape 1 — Analyse

- Définir le contrat API
- **Commit** : `T033-step1: analyze REST device endpoints`

### Étape 2 — Définition des interfaces

- DTOs REST
- **Commit** : `T033-step2: define REST device endpoint interfaces`

### Étape 3 — Écriture des tests

- Tests d'intégration
- **Commit** : `T033-step3: write REST device endpoint tests`

### Étape 4 — Implémentation

- Implémenter le contrôleur
- Faire passer les tests
- **Commit** : `T033-step4: implement REST device endpoints`
