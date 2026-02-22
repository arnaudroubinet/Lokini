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

- [ ] `POST /api/v1/devices/{deviceId}/push-token` — enregistrer le push token (201 Created ou 200 OK si mise à jour)
- [ ] `DELETE /api/v1/devices/{deviceId}/push-token` — supprimer le push token (204 No Content)
- [ ] Lecture et validation du header `X-Protocol-Version` (§7.7)
- [ ] Validation des entrées (format du deviceId, format du token push)
- [ ] Codes d'erreur HTTP appropriés : 400 (entrée invalide), 404 (device inconnu)
- [ ] Tests d'intégration

## Fichier cible

`server/src/main/java/dev/lokini/server/adapter/in/rest/`

## Étapes TDD

### Étape 1 — Analyse

- Définir le contrat API (request/response pour chaque endpoint)
- **Commit** : `T033-step1: analyze REST device endpoints`

### Étape 2 — Définition des interfaces

- Définir les DTOs REST (RegisterPushTokenRequest, etc.)
- Définir le mapper DTO ↔ commandes domaine
- **Commit** : `T033-step2: define REST device endpoint interfaces`

### Étape 3 — Écriture des tests

- Tests d'intégration : enregistrement du push token
- Tests d'intégration : suppression du push token
- Tests : validation des entrées (device inconnu, format invalide)
- **Commit** : `T033-step3: write REST device endpoint tests`

### Étape 4 — Implémentation

- Implémenter le contrôleur REST
- Faire passer les tests
- **Commit** : `T033-step4: implement REST device endpoints`
