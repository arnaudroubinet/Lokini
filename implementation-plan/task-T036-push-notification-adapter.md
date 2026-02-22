# T036 — Push notification adapter (stub)

## Statut : `pending`

## Description

Implémenter un adaptateur stub pour les push notifications (FCM/APNs). Pour le MVP, l'adaptateur réel peut être un stub loggant les notifications, avec l'interface prête pour l'implémentation FCM/APNs.

## Références spécifications

- §4.7 — Push notifications (FCM/APNs)

## Dépendances

- T019 (PushNotificationPort interface)

## Critères d'acceptation

- [ ] Implémente `PushNotificationPort`
- [ ] Stub qui logge les notifications (pour le MVP)
- [ ] Structure prête pour FCM et APNs
- [ ] Notification contient uniquement une référence opaque au document (zero-knowledge)
- [ ] Tests unitaires

## Fichier cible

`server/src/main/java/dev/lokini/server/adapter/out/push/`

## Étapes TDD

### Étape 1 — Analyse

- Étudier les APIs FCM/APNs (pour le design)
- Définir le format de notification (opaque)
- **Commit** : `T036-step1: analyze push notification adapter`

### Étape 2 — Définition des interfaces

- Définir le format de notification
- Définir la classe stub
- **Commit** : `T036-step2: define push notification adapter interfaces`

### Étape 3 — Écriture des tests

- Tester que le stub logge correctement
- Tester le format de notification
- **Commit** : `T036-step3: write push notification adapter tests`

### Étape 4 — Implémentation

- Implémenter le stub
- Faire passer les tests
- **Commit** : `T036-step4: implement push notification adapter stub`
