# T040 — WebSocket client

## Statut : `pending`

## Description

Implémenter le client WebSocket pour la réception temps réel des deltas. Implémente le port `RealtimePort`.

## Références spécifications

- §4.7 — Protocole de communication (WebSocket)
- §7.9 — WebSocket déconnecté (reconnexion avec backoff)

## Dépendances

- T038 (RealtimePort interface)

## Critères d'acceptation

- [ ] Implémente `RealtimePort`
- [ ] Connexion WebSocket par document
- [ ] Reconnexion automatique avec backoff exponentiel
- [ ] Émission d'événements : onDelta, onConnect, onDisconnect, onError
- [ ] Envoi de deltas via WebSocket
- [ ] Fermeture propre de la connexion
- [ ] Tests unitaires avec mock WebSocket

## Fichier cible

`packages/web/src/infrastructure/websocket/`

## Étapes TDD

### Étape 1 — Analyse

- Définir le protocole WebSocket client (format des messages)
- Stratégie de reconnexion
- **Commit** : `T040-step1: analyze WebSocket client`

### Étape 2 — Définition des interfaces

- Définir la classe WebSocket client
- Définir les événements
- **Commit** : `T040-step2: define WebSocket client interfaces`

### Étape 3 — Écriture des tests

- Tester connexion/déconnexion
- Tester réception de deltas
- Tester envoi de deltas
- Tester reconnexion avec backoff
- **Commit** : `T040-step3: write WebSocket client tests`

### Étape 4 — Implémentation

- Implémenter le client
- Faire passer les tests
- **Commit** : `T040-step4: implement WebSocket client`
