# T032 — REST API — Document endpoints

## Statut : `pending`

## Description

Implémenter les endpoints REST pour la gestion des documents : création, jonction, départ, et création de tokens d'invitation.

## Références spécifications

- §4.3 — Création d'un document
- §4.4 — Rejoindre un document
- §4.5 — Quitter un document
- §7.7 — Versioning du protocole

## Dépendances

- T067 (CreateDocumentUseCase)
- T068 (CreateInvitationUseCase)
- T022 (JoinDocumentUseCase)
- T023 (LeaveDocumentUseCase)

## Critères d'acceptation

- [ ] `POST /api/v1/documents` — créer un document (201 Created)
- [ ] `POST /api/v1/documents/{docId}/join` — rejoindre via token (200 OK)
- [ ] `POST /api/v1/documents/{docId}/leave` — quitter (204 No Content)
- [ ] `POST /api/v1/documents/{docId}/invitations` — créer un token d'invitation (201 Created)
- [ ] Lecture et validation du header `X-Protocol-Version` (§7.7)
- [ ] Validation des entrées (format du token, deviceId non vide)
- [ ] Codes d'erreur HTTP appropriés : 400 (entrée invalide), 404 (document inconnu), 409 (token déjà utilisé), 410 (token expiré), 422 (document plein)
- [ ] Format de réponse d'erreur cohérent (JSON avec code et message)
- [ ] Tests d'intégration couvrant tous les endpoints et cas d'erreur

## Fichier cible

`server/src/main/java/dev/lokini/server/adapter/in/rest/`

## Étapes TDD

### Étape 1 — Analyse

- Définir le contrat API pour chaque endpoint (request/response)
- Définir les codes HTTP et le format des erreurs
- **Commit** : `T032-step1: analyze REST document endpoints`

### Étape 2 — Définition des interfaces

- Définir les DTOs REST (CreateDocumentRequest, JoinDocumentRequest, CreateInvitationRequest, etc.)
- Définir le mapper DTO ↔ commandes domaine
- **Commit** : `T032-step2: define REST document endpoint interfaces`

### Étape 3 — Écriture des tests

- Tests d'intégration : création de document
- Tests d'intégration : jonction (succès, token expiré, token utilisé, document plein)
- Tests d'intégration : départ
- Tests d'intégration : création d'invitation
- Tests : validation des entrées
- **Commit** : `T032-step3: write REST document endpoint tests`

### Étape 4 — Implémentation

- Implémenter les contrôleurs REST
- Faire passer les tests
- **Commit** : `T032-step4: implement REST document endpoints`
