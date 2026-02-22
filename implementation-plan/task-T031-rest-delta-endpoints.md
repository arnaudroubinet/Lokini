# T031 — REST API — Delta endpoints

## Statut : `pending`

## Description

Implémenter les endpoints REST pour l'envoi et la récupération de deltas chiffrés.

## Références spécifications

- §4.7 — Protocole de communication (REST)
- §7.7 — Versioning du protocole

## Dépendances

- T020 (StoreDeltaUseCase)
- T021 (RetrieveDeltasUseCase)

## Critères d'acceptation

- [ ] `POST /api/v1/documents/{docId}/deltas` — envoyer un delta
- [ ] `GET /api/v1/documents/{docId}/deltas?deviceId={deviceId}` — récupérer les deltas en attente
- [ ] Header `X-Protocol-Version` pour le versioning
- [ ] Validation des entrées (format, taille max)
- [ ] Codes HTTP appropriés (201, 200, 400, 403, 404)
- [ ] Sérialisation/désérialisation JSON
- [ ] Tests d'intégration avec REST Assured

## Fichier cible

`server/src/main/java/dev/lokini/server/adapter/in/rest/`

## Étapes TDD

### Étape 1 — Analyse

- Définir le contrat de l'API REST (OpenAPI)
- Choisir les codes HTTP
- **Commit** : `T031-step1: analyze REST delta endpoints`

### Étape 2 — Définition des interfaces

- Définir les DTOs REST (request/response)
- Définir le mapper DTO ↔ commandes domaine
- **Commit** : `T031-step2: define REST delta endpoint interfaces`

### Étape 3 — Écriture des tests

- Tests d'intégration : envoi et récupération de deltas
- Tests : validation des entrées
- Tests : codes d'erreur
- **Commit** : `T031-step3: write REST delta endpoint tests`

### Étape 4 — Implémentation

- Implémenter le contrôleur REST
- Faire passer les tests
- **Commit** : `T031-step4: implement REST delta endpoints`
