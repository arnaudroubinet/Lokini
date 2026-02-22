# T042 — Push notification registration (web)

## Statut : `pending`

## Description

Implémenter l'enregistrement aux push notifications web (Web Push API / Service Worker). Implémente le port `PushNotificationPort`.

## Références spécifications

- §4.7 — Push notifications
- §4.7 — Notification push contient une référence opaque

## Dépendances

- T038 (PushNotificationPort interface)

## Critères d'acceptation

- [ ] Implémente `PushNotificationPort`
- [ ] Enregistrement du Service Worker
- [ ] Demande de permission pour les notifications
- [ ] Obtention du push subscription (endpoint + keys)
- [ ] Envoi du token au serveur via REST
- [ ] Gestion du déchiffrement local du titre pour l'affichage de la notification
- [ ] Gestion du refus de permission (graceful degradation)
- [ ] Tests unitaires

## Fichier cible

`packages/web/src/infrastructure/push/`

## Étapes TDD

### Étape 1 — Analyse

- Étudier la Web Push API et le workflow Service Worker
- Définir le format de la notification
- **Commit** : `T042-step1: analyze push notification registration`

### Étape 2 — Définition des interfaces

- Définir la classe push adapter
- Définir le Service Worker stub
- **Commit** : `T042-step2: define push notification interfaces`

### Étape 3 — Écriture des tests

- Tester l'enregistrement (mock Service Worker)
- Tester la gestion du refus de permission
- Tester le format du token envoyé au serveur
- **Commit** : `T042-step3: write push notification registration tests`

### Étape 4 — Implémentation

- Implémenter l'adapter et le Service Worker
- Faire passer les tests
- **Commit** : `T042-step4: implement push notification registration`
