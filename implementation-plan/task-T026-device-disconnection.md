# T026 — Device disconnection detection

## Statut : `pending`

## Description

Implémenter la détection et la gestion de la déconnexion d'un device. Quand les limites de rétention sont atteintes pour un device, le serveur le marque comme déconnecté et notifie les autres.

## Références spécifications

- §7.2 — Déconnexion d'un device
- §7.9 — Erreurs de synchronisation

## Dépendances

- T018, T019 (ports)
- T020 (StoreDelta, pour le contexte)

## Critères d'acceptation

- [ ] Détection automatique quand les limites sont atteintes
- [ ] Notification au premier device actif
- [ ] Le device actif propage l'information aux autres participants
- [ ] Le device déconnecté conserve ses clés (pas d'exclusion)
- [ ] Support de la resynchronisation au retour du device
- [ ] Tests unitaires

## Fichier cible

`server/src/main/java/dev/lokini/server/domain/usecase/`

## Étapes TDD

### Étape 1 — Analyse

- Détailler le flux de déconnexion et resynchronisation
- Identifier le rôle du « premier device actif »
- **Commit** : `T026-step1: analyze device disconnection detection`

### Étape 2 — Définition des interfaces

- Définir `DisconnectionEvent` et `ResyncRequest`
- **Commit** : `T026-step2: define device disconnection interfaces`

### Étape 3 — Écriture des tests

- Tester la détection de déconnexion
- Tester la notification
- Tester le flux de resynchronisation
- **Commit** : `T026-step3: write device disconnection tests`

### Étape 4 — Implémentation

- Implémenter la logique de détection et notification
- Faire passer les tests
- **Commit** : `T026-step4: implement device disconnection detection`
