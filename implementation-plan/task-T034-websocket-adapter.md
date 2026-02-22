# T034 — WebSocket adapter

## Statut : `pending`

## Description

Implémenter l'adaptateur WebSocket pour le push temps réel des deltas. La connexion est ouverte quand un document est affiché à l'écran et fermée quand l'utilisateur quitte le document.

## Références spécifications

- §4.7 — Protocole de communication (WebSocket)
- §7.3 — Haute disponibilité (pub/sub)

## Dépendances

- T020 (StoreDeltaUseCase)
- T021 (RetrieveDeltasUseCase)

## Critères d'acceptation

- [ ] Connexion WebSocket par document (`/ws/documents/{docId}?deviceId={deviceId}`)
- [ ] Push des deltas en temps réel aux devices connectés
- [ ] Réception et traitement des deltas envoyés via WebSocket
- [ ] Gestion de la déconnexion (cleanup)
- [ ] Reconnexion automatique non gérée côté serveur (responsabilité client)
- [ ] Intégration avec le pub/sub pour le mode cluster
- [ ] Tests d'intégration

## Fichier cible

`server/src/main/java/dev/lokini/server/adapter/in/ws/`

## Étapes TDD

### Étape 1 — Analyse

- Définir le protocole WebSocket (format des messages)
- Gérer le cycle de vie de la connexion
- **Commit** : `T034-step1: analyze WebSocket adapter`

### Étape 2 — Définition des interfaces

- Définir les messages WebSocket (JSON)
- Définir le gestionnaire de sessions
- **Commit** : `T034-step2: define WebSocket adapter interfaces`

### Étape 3 — Écriture des tests

- Tests d'intégration : connexion, envoi, réception, déconnexion
- **Commit** : `T034-step3: write WebSocket adapter tests`

### Étape 4 — Implémentation

- Implémenter avec Quarkus WebSockets Next
- Faire passer les tests
- **Commit** : `T034-step4: implement WebSocket adapter`
