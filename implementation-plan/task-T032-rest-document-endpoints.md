# T032 — REST API — Document join/leave endpoints

## Statut : `pending`

## Description

Implémenter les endpoints REST pour rejoindre et quitter un document, et pour créer des tokens d'invitation.

## Références spécifications

- §4.3 — Création d'un document
- §4.4 — Rejoindre un document
- §4.5 — Quitter un document

## Dépendances

- T022 (JoinDocumentUseCase)
- T023 (LeaveDocumentUseCase)

## Critères d'acceptation

- [ ] `POST /api/v1/documents` — créer un document
- [ ] `POST /api/v1/documents/{docId}/join` — rejoindre via token
- [ ] `POST /api/v1/documents/{docId}/leave` — quitter
- [ ] `POST /api/v1/documents/{docId}/invitations` — créer un token d'invitation
- [ ] Validation des entrées
- [ ] Gestion des erreurs (token expiré, document plein, etc.)
- [ ] Tests d'intégration

## Fichier cible

`server/src/main/java/dev/lokini/server/adapter/in/rest/`

## Étapes TDD

### Étape 1 — Analyse

- Définir le contrat API
- **Commit** : `T032-step1: analyze REST document endpoints`

### Étape 2 — Définition des interfaces

- DTOs REST
- **Commit** : `T032-step2: define REST document endpoint interfaces`

### Étape 3 — Écriture des tests

- Tests d'intégration couvrant tous les endpoints
- **Commit** : `T032-step3: write REST document endpoint tests`

### Étape 4 — Implémentation

- Implémenter les contrôleurs
- Faire passer les tests
- **Commit** : `T032-step4: implement REST document endpoints`
